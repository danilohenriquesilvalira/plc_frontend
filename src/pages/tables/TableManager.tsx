import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { TableMetadata } from '../../services/api';
import {
  getAllTables,
  getPermanentTables,
  getTimeSeriesTables,
  createPermanentTable,
  createTimeSeriesTable,
  deletePermanentTable,
  deleteTimeSeriesTable
} from '../../services/api';
import { PlusOutlined } from '@ant-design/icons';
import { 
  SettingOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  DatabaseOutlined,
  SearchOutlined, 
  CloudServerOutlined, 
  FieldTimeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const TableManager: React.FC = () => {
  // Estados internos do TableManager
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [tableType, setTableType] = useState<'permanent' | 'timeseries'>('permanent');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    table_name: '',
    description: '',
    retention_days: undefined as number | undefined
  });
  const [formErrors, setFormErrors] = useState({
    table_name: ''
  });
  const navigate = useNavigate();

  // Estados para o layout padrão (Sidebar e Header)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const onLogout = () => {
    // Sua lógica de logout
    console.log('Logout acionado');
  };

  // Estatísticas para os cards do topo
  const totalTables = tables.length;
  const permanentTables = tables.filter(table => 
    table.storage_type === 'permanent'
  ).length;
  const timeseriesTables = tables.filter(table => 
    table.storage_type === 'timeseries'
  ).length;

  // Função para buscar tabelas conforme a aba ativa
  const fetchTables = async (tab: string = 'all') => {
    setLoading(true);
    try {
      let fetchedTables: TableMetadata[] = [];
      if (tab === 'all') {
        fetchedTables = await getAllTables();
      } else if (tab === 'permanent') {
        fetchedTables = await getPermanentTables();
      } else if (tab === 'timeseries') {
        fetchedTables = await getTimeSeriesTables();
      }
      setTables(fetchedTables);
    } catch (error) {
      console.error('Erro ao buscar tabelas:', error);
      message.error('Falha ao carregar tabelas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const showCreateTableModal = (type: 'permanent' | 'timeseries') => {
    setTableType(type);
    setFormData({
      table_name: '',
      description: '',
      retention_days: undefined
    });
    setFormErrors({
      table_name: ''
    });
    setTableModalVisible(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { table_name: '' };

    if (!formData.table_name.trim()) {
      errors.table_name = 'Por favor, informe o nome da tabela';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFormData({ ...formData, retention_days: value });
  };

  const handleTableCreate = async () => {
    if (!validateForm()) return;

    try {
      const tableData = {
        table_name: formData.table_name,
        description: formData.description,
        ...(tableType === 'timeseries' && formData.retention_days
          ? { retention_days: formData.retention_days }
          : {})
      };

      if (tableType === 'permanent') {
        await createPermanentTable(tableData);
      } else {
        await createTimeSeriesTable(tableData);
      }

      message.success(`Tabela ${formData.table_name} criada com sucesso!`);
      setTableModalVisible(false);
      fetchTables(activeTab);
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      message.error('Falha ao criar tabela. Por favor, tente novamente.');
    }
  };

  const handleTableDelete = async (table: TableMetadata) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tabela?')) return;

    try {
      if (table.storage_type === 'permanent') {
        await deletePermanentTable(table.id);
      } else {
        await deleteTimeSeriesTable(table.id);
      }
      message.success(`Tabela ${table.table_name} excluída com sucesso!`);
      fetchTables(activeTab);
    } catch (error) {
      console.error('Erro ao excluir tabela:', error);
      message.error('Falha ao excluir tabela. Por favor, tente novamente.');
    }
  };

  const navigateToColumns = (table: TableMetadata) => {
    navigate(`/tables/${table.id}/columns`, { state: { table } });
  };

  const navigateToTagMapping = (table: TableMetadata) => {
    navigate(`/tables/${table.id}/tag-mapping`, { state: { table } });
  };

  const filteredTables = tables.filter(table =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (table.description && table.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} title="Gerenciamento de Tabelas" />
        <main className="flex-1 p-6">
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total de Tabelas */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <DatabaseOutlined className="text-blue-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  Total
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de Tabelas</h3>
              <p className="text-2xl font-bold text-white">{totalTables}</p>
            </div>

            {/* Tabelas Permanentes */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <CloudServerOutlined className="text-purple-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                  {permanentTables} Tabelas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Tabelas Permanentes</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <CheckCircleOutlined className="mr-1" /> Armazenamento sem limite de tempo
              </p>
            </div>

            {/* Tabelas Temporais */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <FieldTimeOutlined className="text-green-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                  {timeseriesTables} Tabelas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Tabelas Temporais</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <FieldTimeOutlined className="mr-1" /> Dados com período de retenção
              </p>
            </div>
          </div>

          {/* Painel de tabelas */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg">
            <div className="p-4 border-b border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Tabelas do Sistema</h2>
                  <p className="text-gray-400 text-sm mt-1">Gerencie as tabelas para armazenar dados dos PLCs</p>
                </div>
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar tabelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Tabs de navegação */}
            <div className="border-b border-slate-700">
              <nav className="flex">
                <button
                  onClick={() => handleTabChange('all')}
                  className={`py-2 px-4 ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Todas as Tabelas
                </button>
                <button
                  onClick={() => handleTabChange('permanent')}
                  className={`py-2 px-4 ${activeTab === 'permanent' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Tabelas Permanentes
                </button>
                <button
                  onClick={() => handleTabChange('timeseries')}
                  className={`py-2 px-4 ${activeTab === 'timeseries' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Tabelas Temporais
                </button>
              </nav>
            </div>
            
            {/* Botões de ação */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex gap-3">
                {(activeTab === 'all' || activeTab === 'permanent') && (
                  <button
                    onClick={() => showCreateTableModal('permanent')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <PlusOutlined />
                    <span>Nova Tabela Permanente</span>
                  </button>
                )}
                {(activeTab === 'all' || activeTab === 'timeseries') && (
                  <button
                    onClick={() => showCreateTableModal('timeseries')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <PlusOutlined />
                    <span>Nova Tabela Temporal</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Tabela de dados com fundo escuro */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-400">Carregando tabelas...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Descrição</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Tipo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Retenção (dias)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Criado em</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Nenhuma tabela encontrada
                          </td>
                        </tr>
                      ) : (
                        filteredTables.map((table) => (
                          <tr key={table.id} className="border-t border-slate-700/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                  <DatabaseOutlined className="text-blue-400" />
                                </div>
                                <span className="ml-3 font-medium text-white">{table.table_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{table.description || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                table.storage_type === 'permanent' 
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                {table.storage_type === 'permanent' ? 'Permanente' : 'Série Temporal'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{table.retention_days || 'Sem limite'}</td>
                            <td className="px-4 py-3 text-gray-300">{new Date(table.created_at).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end items-center gap-2">
                                <button
                                  onClick={() => navigateToColumns(table)}
                                  className="flex items-center gap-1 p-1 text-blue-400 hover:bg-slate-700 rounded transition-colors"
                                  title="Gerenciar Colunas"
                                >
                                  <SettingOutlined />
                                </button>
                                <button
                                  onClick={() => navigateToTagMapping(table)}
                                  className="flex items-center gap-1 p-1 text-blue-400 hover:bg-slate-700 rounded transition-colors"
                                  title="Mapear Tags"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  onClick={() => handleTableDelete(table)}
                                  className="flex items-center gap-1 p-1 text-red-400 hover:bg-slate-700 rounded transition-colors"
                                  title="Excluir Tabela"
                                >
                                  <DeleteOutlined />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  
                  {/* Paginação */}
                  {filteredTables.length > 0 && (
                    <div className="py-2 px-4 border-t border-slate-700 flex justify-end mt-2">
                      <div className="text-sm text-gray-400">
                        <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded-md">1</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Modal para criar nova tabela */}
          {tableModalVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setTableModalVisible(false)}></div>
              <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {`Nova Tabela ${tableType === 'permanent' ? 'Permanente' : 'Temporal'}`}
                  </h3>
                  <button
                    onClick={() => setTableModalVisible(false)}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">&times;</span>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleTableCreate(); }} className="space-y-4">
                  <div>
                    <label htmlFor="table_name" className="block text-sm font-medium text-gray-400 mb-1">
                      Nome da Tabela
                    </label>
                    <input
                      type="text"
                      id="table_name"
                      name="table_name"
                      value={formData.table_name}
                      onChange={handleFormChange}
                      className={`w-full bg-slate-700 border ${
                        formErrors.table_name ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Nome da tabela"
                    />
                    {formErrors.table_name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.table_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Descrição da tabela"
                      rows={3}
                    ></textarea>
                  </div>

                  {tableType === 'timeseries' && (
                    <div>
                      <label htmlFor="retention_days" className="block text-sm font-medium text-gray-400 mb-1">
                        Período de Retenção (dias)
                      </label>
                      <input
                        type="number"
                        id="retention_days"
                        name="retention_days"
                        value={formData.retention_days || ''}
                        onChange={handleNumberChange}
                        min={1}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Ex: 30"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Deixe em branco para armazenamento sem limite de tempo
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setTableModalVisible(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Criar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TableManager;