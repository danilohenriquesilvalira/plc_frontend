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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Server, 
  Tag, 
  AlertTriangle, 
  RefreshCw,
  Search,
  CheckCircle,
  X,
  Activity
} from 'lucide-react';
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
  const [deleteConfirmPlc, setDeleteConfirmPlc] = useState<PLC | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const totalPLCs = plcs.length;
  const onlinePLCs = plcs.filter(plc => 
    plc.status?.toLowerCase() === 'online'
  ).length;
  const offlinePLCs = totalPLCs - onlinePLCs;
  const totalTags = plcs.reduce((sum, plc) => 
    sum + (plc.tag_count !== undefined ? plc.tag_count : (plc.tags?.length || 0)), 0
  );

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
    try {
      setError(null);
      await deletePLC(id);
      setPLCs(plcs.filter(plc => plc.id !== id));
      setDeleteConfirmPlc(null);
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

  // Filtra PLCs por nome
  const filteredPLCs = plcs.filter(plc =>
    plc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="mt-4 flex items-center gap-2 justify-center">
        <button
          onClick={() => handleRestart(plc)}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          title="Reiniciar PLC"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
        </button>
        <button
          onClick={() => handleViewTags(plc)}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          title="Ver Tags"
        >
          <Tag className="w-4 h-4 text-blue-400" />
        </button>
        <button
          onClick={() => handleEdit(plc)}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          title="Editar"
        >
          <Edit className="w-4 h-4 text-blue-400" />
        </button>
        <button
          onClick={() => setDeleteConfirmPlc(plc)}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
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

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total de PLCs */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-blue-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  Total
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de PLCs</h3>
              <p className="text-lg font-bold text-white">{totalPLCs}</p>
            </div>

            {/* PLCs Online */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-green-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                  {onlinePLCs} Online
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">PLCs Online</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Dispositivos ativos
              </p>
            </div>

            {/* PLCs Offline */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-red-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                  {offlinePLCs} Offline
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">PLCs Offline</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Dispositivos inativos
              </p>
            </div>

            {/* Total de Tags */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-purple-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                  {totalTags} Tags
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de Tags</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Pontos monitorados
              </p>
            </div>
          </div>

          {/* Lista de PLCs */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600 shadow overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">PLCs do Sistema</h2>
                  <p className="text-gray-400 text-sm mt-1">Gerencie os controladores lógicos programáveis</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar PLCs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo PLC</span>
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-4 text-sm sm:text-base">Carregando PLCs...</p>
              </div>
            ) : filteredPLCs.length > 0 ? (
              <>
                {/* Versão Mobile */}
                <div className="grid grid-cols-1 gap-4 p-4 sm:hidden">
                  {filteredPLCs.map((plc) => (
                    <PLCCard key={plc.id} plc={plc} />
                  ))}
                </div>

                {/* Versão Desktop */}
                <div className="hidden sm:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Nome</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Endereço IP</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Rack/Slot</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Tags</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400">Ativo</th>
                          <th className="px-4 py-3 text-sm font-semibold text-gray-400 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPLCs.map((plc) => (
                          <tr key={plc.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                                <span className="text-white text-sm">{plc.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{plc.ip_address}</td>
                            <td className="px-4 py-3 text-sm text-gray-300">{plc.rack}/{plc.slot}</td>
                            <td className="px-4 py-3">
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
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {plc.tag_count !== undefined ? plc.tag_count : (plc.tags?.length || 0)} tags
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                plc.active
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-gray-500/20 text-gray-500'
                              }`}>
                                {plc.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 justify-center">
                                <button
                                  onClick={() => handleRestart(plc)}
                                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Reiniciar PLC"
                                >
                                  <RefreshCw className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => handleViewTags(plc)}
                                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Ver Tags"
                                >
                                  <Tag className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => handleEdit(plc)}
                                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmPlc(plc)}
                                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
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
              <div className="text-center py-8 sm:py-12">
                <Server className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">Nenhum PLC cadastrado</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Clique no botão "Novo PLC" para começar</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Adicionar/Editar PLC */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPLC ? 'Editar PLC' : 'Novo PLC'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="ip_address" className="block text-sm font-medium text-gray-400 mb-1">
                  Endereço IP
                </label>
                <input
                  type="text"
                  id="ip_address"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rack" className="block text-sm font-medium text-gray-400 mb-1">
                    Rack
                  </label>
                  <input
                    type="number"
                    id="rack"
                    value={formData.rack}
                    onChange={(e) => setFormData({ ...formData, rack: parseInt(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slot" className="block text-sm font-medium text-gray-400 mb-1">
                    Slot
                  </label>
                  <input
                    type="number"
                    id="slot"
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: parseInt(e.target.value) })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={!!formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 mr-2"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-400">Ativo</label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {editingPLC ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmPlc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="bg-red-500/10 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
              <p className="text-gray-400 mt-2">
                Você tem certeza que deseja excluir o PLC <span className="text-white font-medium">{deleteConfirmPlc.name}</span>?
                <br />Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmPlc(null)}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmPlc.id)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

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