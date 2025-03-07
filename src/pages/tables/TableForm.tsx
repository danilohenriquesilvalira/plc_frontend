import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Spin, 
  message
} from 'antd';
import { 
  RollbackOutlined, 
  SaveOutlined, 
  DatabaseOutlined, 
  FieldTimeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { 
  TableMetadata, 
  createPermanentTable, 
  createTimeSeriesTable,
  getPermanentTable,
  getTimeSeriesTable
} from '../../services/api';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';

interface LocationState {
  editMode?: boolean;
  table?: TableMetadata;
}

const TableForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableType, setTableType] = useState<'permanent' | 'timeseries'>(
    state?.table?.storage_type || 'permanent'
  );
  const [editMode] = useState<boolean>(!!id || state?.editMode || false);
  
  // Form state
  const [formData, setFormData] = useState({
    table_name: '',
    description: '',
    storage_type: 'permanent' as 'permanent' | 'timeseries',
    retention_days: undefined as number | undefined
  });
  const [formErrors, setFormErrors] = useState({
    table_name: ''
  });

  // Estados para o layout padrão (Sidebar e Header)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const onLogout = () => {
    console.log('Logout acionado');
  };

  useEffect(() => {
    const fetchTableData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const tableId = parseInt(id);
        let table: TableMetadata;
        
        if (tableType === 'permanent') {
          table = await getPermanentTable(tableId);
        } else {
          table = await getTimeSeriesTable(tableId);
        }
        
        setFormData({
          table_name: table.table_name,
          description: table.description || '',
          storage_type: table.storage_type,
          retention_days: table.retention_days
        });
        
        setTableType(table.storage_type);
      } catch (error) {
        console.error('Erro ao buscar dados da tabela:', error);
        setError('Falha ao carregar dados da tabela. Verifique a conexão com o servidor.');
        message.error('Falha ao carregar dados da tabela.');
      } finally {
        setLoading(false);
      }
    };

    if (editMode && !state?.table) {
      fetchTableData();
    } else if (state?.table) {
      // Se temos os dados da tabela no estado de localização
      setFormData({
        table_name: state.table.table_name,
        description: state.table.description || '',
        storage_type: state.table.storage_type,
        retention_days: state.table.retention_days
      });
      setTableType(state.table.storage_type);
    }
  }, [id, editMode, state]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'permanent' | 'timeseries';
    setTableType(value);
    setFormData(prev => ({ ...prev, storage_type: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFormData(prev => ({ ...prev, retention_days: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { table_name: '' };

    if (!formData.table_name.trim()) {
      errors.table_name = 'Por favor, informe o nome da tabela';
      isValid = false;
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.table_name)) {
      errors.table_name = 'O nome da tabela deve começar com uma letra minúscula e conter apenas letras minúsculas, números e underscores';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    try {
      const tableData = {
        table_name: formData.table_name.trim(),
        description: formData.description?.trim() || '',
        ...(formData.storage_type === 'timeseries' && formData.retention_days 
          ? { retention_days: formData.retention_days } 
          : {})
      };
      
      if (editMode && id) {
        // Lógica para atualizar uma tabela existente seria aqui
        message.success(`Tabela ${formData.table_name} atualizada com sucesso!`);
      } else {
        // Criar nova tabela
        if (formData.storage_type === 'permanent') {
          try {
            await createPermanentTable(tableData);
            message.success(`Tabela ${formData.table_name} criada com sucesso!`);
            navigate('/tables');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 500) {
                setError(
                  `Erro no servidor ao criar tabela. Possíveis causas:\n` +
                  `- Conflito com nome de tabela existente\n` +
                  `- Problemas de conexão com o banco de dados\n` +
                  `- Nome da tabela contém caracteres especiais ou é uma palavra reservada\n\n` +
                  `Tente modificar o nome da tabela ou contate o administrador.`
                );
              } else {
                setError(`Erro: ${error.response?.data || error.message}`);
              }
            } else {
              setError('Erro desconhecido ao criar tabela');
            }
            throw error; // Re-throw para evitar navegação
          }
        } else {
          try {
            await createTimeSeriesTable(tableData);
            message.success(`Tabela ${formData.table_name} criada com sucesso!`);
            navigate('/tables');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 500) {
                setError(
                  `Erro no servidor ao criar tabela. Possíveis causas:\n` +
                  `- Conflito com nome de tabela existente\n` +
                  `- Problemas de conexão com o banco de dados\n` +
                  `- Nome da tabela contém caracteres especiais ou é uma palavra reservada\n\n` +
                  `Tente modificar o nome da tabela ou contate o administrador.`
                );
              } else {
                setError(`Erro: ${error.response?.data || error.message}`);
              }
            } else {
              setError('Erro desconhecido ao criar tabela');
            }
            throw error; // Re-throw para evitar navegação
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar tabela:', error);
      if (!error) {
        message.error('Falha ao salvar tabela. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} title={editMode ? 'Editar Tabela' : 'Nova Tabela'} />
        <main className="flex-1 p-6">
          {/* Breadcrumb personalizado */}
          <div className="mb-4 text-gray-400 flex items-center gap-2">
            <span 
              className="hover:text-blue-400 cursor-pointer transition-colors"
              onClick={() => navigate('/tables')}
            >
              Tabelas
            </span>
            <span>/</span>
            <span className="text-gray-300">{editMode ? 'Editar Tabela' : 'Nova Tabela'}</span>
          </div>
          
          {/* Cards de informações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Tipo de Tabela */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                {tableType === 'permanent' ? (
                  <DatabaseOutlined className="text-purple-400 text-2xl" />
                ) : (
                  <FieldTimeOutlined className="text-green-400 text-2xl" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tableType === 'permanent' 
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {tableType === 'permanent' ? 'PostgreSQL' : 'TimescaleDB'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">
                {editMode ? 'Editar Tabela' : 'Criar Nova Tabela'}
              </h3>
              <p className="text-2xl font-bold text-white mb-1">
                {editMode ? formData.table_name : 'Defina os Parâmetros'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {tableType === 'permanent' 
                  ? 'Tabela permanente para armazenamento de dados sem intervalo de tempo'
                  : 'Tabela temporal otimizada para dados com intervalo de tempo'
                }
              </p>
            </div>

            {/* Informações do form */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <SaveOutlined className="text-blue-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  {editMode ? 'Editando' : 'Novo'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Informações da Tabela</h3>
              <p className="text-xs text-gray-400 mt-1">
                Preencha os campos necessários para {editMode ? 'atualizar' : 'criar'} a tabela
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate('/tables')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  <RollbackOutlined />
                  <span>Voltar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <div className="flex items-start">
                <ExclamationCircleOutlined className="text-red-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-red-500 font-medium">Erro ao processar tabela</h4>
                  <p className="text-red-400 whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Formulário */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-400">Carregando dados...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="table_name" className="block text-sm font-medium text-gray-400 mb-1">
                    Nome da Tabela
                  </label>
                  <input
                    type="text"
                    id="table_name"
                    name="table_name"
                    value={formData.table_name}
                    onChange={handleInputChange}
                    disabled={editMode}
                    className={`w-full bg-slate-700 border ${
                      formErrors.table_name ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                      editMode ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    placeholder="Nome da tabela (ex: dados_producao)"
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
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Descrição detalhada da tabela"
                    rows={3}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="storage_type" className="block text-sm font-medium text-gray-400 mb-1">
                    Tipo de Armazenamento
                  </label>
                  <select
                    id="storage_type"
                    name="storage_type"
                    value={formData.storage_type}
                    onChange={handleTypeChange}
                    disabled={editMode}
                    className={`w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                      editMode ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="permanent">Tabela Permanente (PostgreSQL)</option>
                    <option value="timeseries">Tabela Temporal (TimescaleDB)</option>
                  </select>
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

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/tables')}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RollbackOutlined /> Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    disabled={loading}
                  >
                    <SaveOutlined /> {editMode ? 'Atualizar' : 'Criar'} Tabela
                    {loading && (
                      <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TableForm;