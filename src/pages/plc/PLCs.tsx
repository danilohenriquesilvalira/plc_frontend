import React, { useEffect, useState } from 'react';
import {
  getPLCs,
  createPLC,
  updatePLC,
  deletePLC,
  restartPLC,
  PLC
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, Edit, Trash2, Server, Tag, AlertTriangle, RefreshCw } from 'lucide-react';
import TagDialog from '../../components/plc/TagDialog';

const PLCs: React.FC = () => {
  const { token, logout } = useAuth();
  const { message } = useWebSocket();
  const [plcs, setPLCs] = useState<PLC[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPLC, setEditingPLC] = useState<PLC | null>(null);
  const [formData, setFormData] = useState<Partial<PLC>>({
    name: '',
    ip_address: '',
    rack: 0,
    slot: 0,
    active: true,
  });
  const [selectedPLC, setSelectedPLC] = useState<PLC | null>(null);

  // Carrega os PLCs ao obter o token
  useEffect(() => {
    if (token) {
      fetchPLCs();
    }
  }, [token]);

  // Atualiza os dados do PLC com as mensagens do WebSocket
  useEffect(() => {
    if (message && message.plc) {
      setPLCs(currentPLCs =>
        currentPLCs.map(plc =>
          plc.id === message.plc.plc_id
            ? { ...plc, status: message.plc.status, last_update: message.plc.last_update }
            : plc
        )
      );
    }
  }, [message]);

  const fetchPLCs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPLCs();
      // Normaliza o campo "active" convertendo 0/1 para false/true
      const normalizedData = data.map((plc: PLC) => ({
        ...plc,
        active: Boolean(plc.active)
      }));
      setPLCs(normalizedData);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        logout();
      } else {
        setError('Erro ao carregar PLCs. Tente novamente mais tarde.');
        console.error('Erro ao buscar PLCs:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingPLC) {
        await updatePLC(editingPLC.id, formData);
      } else {
        await createPLC(formData);
      }
      setIsModalOpen(false);
      setEditingPLC(null);
      setFormData({
        name: '',
        ip_address: '',
        rack: 0,
        slot: 0,
        active: true,
      });
      fetchPLCs();
    } catch (error) {
      console.error('Erro ao salvar PLC:', error);
      setError('Erro ao salvar PLC. Verifique os dados e tente novamente.');
    }
  };

  const handleEdit = (plc: PLC) => {
    setEditingPLC(plc);
    setFormData({
      name: plc.name,
      ip_address: plc.ip_address,
      rack: plc.rack,
      slot: plc.slot,
      active: Boolean(plc.active) // Garante que seja booleano
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este PLC?')) return;
    try {
      setError(null);
      await deletePLC(id);
      setPLCs(plcs.filter(plc => plc.id !== id));
    } catch (error) {
      console.error('Erro ao deletar PLC:', error);
      setError('Erro ao deletar PLC. Tente novamente mais tarde.');
    }
  };

  const handleRestart = async (plc: PLC) => {
    try {
      await restartPLC(plc.id);
      alert(`PLC ${plc.name} reiniciado com sucesso!`);
      fetchPLCs();
    } catch (error) {
      console.error('Erro ao reiniciar PLC:', error);
      setError('Erro ao reiniciar PLC. Tente novamente mais tarde.');
    }
  };

  const handleViewTags = (plc: PLC) => {
    setSelectedPLC(plc);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPLC(null);
    setFormData({
      name: '',
      ip_address: '',
      rack: 0,
      slot: 0,
      active: true,
    });
    setError(null);
  };

  // Card de PLC para visualização mobile
  const PLCCard = ({ plc }: { plc: PLC }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
          <span className="text-white text-sm sm:text-base font-medium">{plc.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          {plc.status?.toLowerCase() === 'online' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">IP:</span>
          <span className="text-gray-300">{plc.ip_address}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Rack/Slot:</span>
          <span className="text-gray-300">{plc.rack}/{plc.slot}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            plc.status?.toLowerCase() === 'online'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          }`}>
            {plc.status || 'Offline'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Tags:</span>
          <span className="text-gray-300">
            {plc.tag_count !== undefined ? plc.tag_count : (plc.tags?.length || 0)} tags
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Ativo:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            plc.active
              ? 'bg-green-500/20 text-green-500'
              : 'bg-gray-500/20 text-gray-500'
          }`}>
            {plc.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => handleRestart(plc)}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Reiniciar PLC"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => handleViewTags(plc)}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Ver Tags"
        >
          <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => handleEdit(plc)}
          className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
          title="Editar"
        >
          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => handleDelete(plc.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title="PLCs" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center text-red-500 text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-6 flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Novo PLC
            </button>
          </div>

          {/* Modal Responsivo */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6 z-10 w-full max-w-lg mx-auto">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {editingPLC ? 'Editar PLC' : 'Novo PLC'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Endereço IP</label>
                      <input
                        type="text"
                        value={formData.ip_address}
                        onChange={e => setFormData({ ...formData, ip_address: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Rack</label>
                      <input
                        type="number"
                        value={formData.rack}
                        onChange={e => setFormData({ ...formData, rack: parseInt(e.target.value) })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Slot</label>
                      <input
                        type="number"
                        value={formData.slot}
                        onChange={e => setFormData({ ...formData, slot: parseInt(e.target.value) })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 mr-2"
                    />
                    <label className="text-sm font-medium text-gray-400">Ativo</label>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full sm:w-auto px-4 py-2 text-gray-400 hover:text-white transition-colors order-2 sm:order-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
                    >
                      {editingPLC ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4 text-sm sm:text-base">Carregando PLCs...</p>
            </div>
          ) : plcs.length > 0 ? (
            <>
              {/* Versão Mobile */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {plcs.map((plc) => (
                  <PLCCard key={plc.id} plc={plc} />
                ))}
              </div>

              {/* Versão Desktop */}
              <div className="hidden sm:block bg-slate-800 rounded-lg border border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Nome</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Endereço IP</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Rack/Slot</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Tags</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400">Ativo</th>
                        <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plcs.map((plc) => (
                        <tr key={plc.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="px-4 lg:px-6 py-3">
                            <div className="flex items-center">
                              <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                              <span className="text-white text-sm">{plc.name}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 text-sm text-gray-300">{plc.ip_address}</td>
                          <td className="px-4 lg:px-6 py-3 text-sm text-gray-300">{plc.rack}/{plc.slot}</td>
                          <td className="px-4 lg:px-6 py-3">
                            <div className="flex items-center space-x-2">
                              {plc.status?.toLowerCase() === 'online' && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                plc.status?.toLowerCase() === 'online'
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-red-500/20 text-red-500'
                              }`}>
                                {plc.status || 'Offline'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 text-sm text-gray-300">
                            {plc.tag_count !== undefined ? plc.tag_count : (plc.tags?.length || 0)} tags
                          </td>
                          <td className="px-4 lg:px-6 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plc.active
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-gray-500/20 text-gray-500'
                            }`}>
                              {plc.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleRestart(plc)}
                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Reiniciar PLC"
                              >
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => handleViewTags(plc)}
                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Ver Tags"
                              >
                                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(plc)}
                                className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(plc.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-slate-800 rounded-lg border border-slate-700">
              <Server className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">Nenhum PLC cadastrado</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Clique no botão "Novo PLC" para começar</p>
            </div>
          )}
        </main>
      </div>

      {selectedPLC && (
        <TagDialog 
          plcId={selectedPLC.id}
          plcName={selectedPLC.name}
          onClose={() => setSelectedPLC(null)}
        />
      )}
    </div>
  );
};

export default PLCs;
