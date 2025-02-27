import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Spin,
  message,
  Breadcrumb
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  RollbackOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import {
  TableMetadata,
  ColumnMetadata,
  getPermanentTable,
  getTimeSeriesTable,
  addPermanentColumn,
  addTimeSeriesColumn,
  deletePermanentColumn,
  deleteTimeSeriesColumn
} from '../../services/api';

// Tipos de dados disponíveis e suas descrições
const DATA_TYPES = [
  { value: 'text', label: 'Texto', description: 'Para dados textuais de qualquer tamanho', color: 'green' },
  { value: 'varchar', label: 'VARCHAR', description: 'Texto com tamanho limitado', color: 'green' },
  { value: 'char', label: 'CHAR', description: 'Texto com tamanho fixo', color: 'green' },
  { value: 'integer', label: 'Inteiro', description: 'Números inteiros (-2147483648 a +2147483647)', color: 'blue' },
  { value: 'bigint', label: 'BigInt', description: 'Números inteiros grandes', color: 'blue' },
  { value: 'smallint', label: 'SmallInt', description: 'Números inteiros pequenos (-32768 a +32767)', color: 'blue' },
  { value: 'float', label: 'Float', description: 'Números com ponto flutuante de precisão simples', color: 'purple' },
  { value: 'real', label: 'Real', description: 'Números com ponto flutuante de precisão simples', color: 'purple' },
  { value: 'double precision', label: 'Double', description: 'Números com ponto flutuante de precisão dupla', color: 'purple' },
  { value: 'numeric', label: 'Numérico', description: 'Números decimais com precisão exata', color: 'purple' },
  { value: 'boolean', label: 'Booleano', description: 'Valores verdadeiro/falso', color: 'yellow' },
  { value: 'timestamp', label: 'Timestamp', description: 'Data e hora com precisão de microssegundos', color: 'red' },
  { value: 'date', label: 'Data', description: 'Apenas data (sem hora)', color: 'red' },
  { value: 'time', label: 'Hora', description: 'Apenas hora (sem data)', color: 'red' },
  { value: 'json', label: 'JSON', description: 'Dados em formato JSON com validação', color: 'gray' },
  { value: 'jsonb', label: 'JSONB', description: 'JSON binário para melhor performance', color: 'gray' }
];

interface LocationState {
  table?: TableMetadata;
}

interface DeleteModalProps {
  column: ColumnMetadata;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// Componente para o Modal de Confirmação de Exclusão
const DeleteModal: React.FC<DeleteModalProps> = ({ column, visible, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="bg-slate-800 rounded-xl border border-red-500/20 p-6 w-full max-w-md z-10">
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined className="text-2xl text-red-500" />
          <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
        </div>
        
        <p className="text-gray-300 mb-2">
          Tem certeza que deseja excluir a coluna <span className="text-red-400 font-semibold">{column.column_name}</span>?
        </p>
        <p className="text-gray-400 text-sm">
          Esta ação não pode ser desfeita e todos os dados desta coluna serão perdidos.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <DeleteOutlined />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

const ColumnManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [table, setTable] = useState<TableMetadata | null>(state?.table || null);
  const [columns, setColumns] = useState<ColumnMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<ColumnMetadata | null>(null);
  const [formData, setFormData] = useState({
    column_name: '',
    data_type: 'text',
    description: '',
    is_timestamp: false
  });
  const [formErrors, setFormErrors] = useState({
    column_name: '',
    data_type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const onLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const fetchTable = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const tableId = parseInt(id);
      let fetchedTable: TableMetadata;
      if (table?.storage_type === 'permanent' || state?.table?.storage_type === 'permanent') {
        fetchedTable = await getPermanentTable(tableId);
      } else {
        fetchedTable = await getTimeSeriesTable(tableId);
      }
      setTable(fetchedTable);
      setColumns(fetchedTable.columns || []);
    } catch (error) {
      console.error('Erro ao buscar tabela:', error);
      message.error('Falha ao carregar informações da tabela.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [id]);

  const showAddColumnModal = () => {
    setFormData({
      column_name: '',
      data_type: 'text',
      description: '',
      is_timestamp: false
    });
    setFormErrors({
      column_name: '',
      data_type: ''
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { column_name: '', data_type: '' };

    // Validação do nome da coluna
    if (!formData.column_name.trim()) {
      errors.column_name = 'Por favor, informe o nome da coluna';
      isValid = false;
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.column_name)) {
      errors.column_name = 'Nome deve começar com letra e conter apenas letras minúsculas, números e underscore';
      isValid = false;
    } else if (columns.some(col => col.column_name === formData.column_name)) {
      errors.column_name = 'Já existe uma coluna com este nome';
      isValid = false;
    }

    // Validação do tipo de dados
    if (!formData.data_type) {
      errors.data_type = 'Por favor, selecione o tipo de dados';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_timestamp: checked });
  };

  const handleAddColumn = async () => {
    if (!validateForm()) return;

    try {
      if (!table || !id) return;
      
      const columnData: Partial<ColumnMetadata> = {
        column_name: formData.column_name,
        data_type: formData.data_type,
        description: formData.description,
        is_timestamp: formData.is_timestamp
      };
      
      if (table.storage_type === 'permanent') {
        await addPermanentColumn(parseInt(id), columnData);
      } else {
        await addTimeSeriesColumn(parseInt(id), columnData);
      }
      
      message.success(`Coluna ${formData.column_name} adicionada com sucesso!`);
      setModalVisible(false);
      fetchTable();
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
      message.error('Falha ao adicionar coluna. Por favor, tente novamente.');
    }
  };

  const showDeleteConfirmation = (column: ColumnMetadata) => {
    setColumnToDelete(column);
    setDeleteModalVisible(true);
  };

  const handleDeleteColumn = async (column: ColumnMetadata) => {
    try {
      if (!table) return;
      if (table.storage_type === 'permanent') {
        await deletePermanentColumn(column.id);
      } else {
        await deleteTimeSeriesColumn(column.id);
      }
      message.success(`Coluna ${column.column_name} excluída com sucesso!`);
      setDeleteModalVisible(false);
      setColumnToDelete(null);
      fetchTable();
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
      message.error('Falha ao excluir coluna. Por favor, tente novamente.');
    }
  };

  const filteredColumns = columns.filter(column => 
    column.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (column.description && column.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDataTypeColor = (dataType: string) => {
    const type = DATA_TYPES.find(t => t.value === dataType);
    return type ? type.color : 'gray';
  };

  const getDataTypeLabel = (dataType: string) => {
    const type = DATA_TYPES.find(t => t.value === dataType);
    return type ? type.label : dataType;
  };

  if (!table) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} title={`${table.table_name} - Colunas`} />
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
            <span className="text-gray-300">{table.table_name}</span>
          </div>
          
          {/* Cards de estatísticas - Cabeçalho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Informações da Tabela */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                {table.storage_type === 'permanent' ? (
                  <DatabaseOutlined className="text-purple-400 text-2xl" />
                ) : (
                  <FieldTimeOutlined className="text-green-400 text-2xl" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.storage_type === 'permanent' 
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {table.storage_type === 'permanent' ? 'Permanente' : 'Série Temporal'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Informações da Tabela</h3>
              <p className="text-2xl font-bold text-white mb-1">{table.table_name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {table.description || 'Sem descrição'}
              </p>
              {table.retention_days && (
                <p className="text-xs text-gray-400 mt-1">
                  <span className="font-medium">Retenção:</span> {table.retention_days} dias
                </p>
              )}
            </div>

            {/* Informações das Colunas */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <DatabaseOutlined className="text-blue-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  {columns.length} Colunas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Gerenciamento de Colunas</h3>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={showAddColumnModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <PlusOutlined className="text-lg" />
                  <span className="font-medium">Adicionar Coluna</span>
                  <span className="text-blue-200 text-xs ml-1">({columns.length})</span>
                </button>
                <button
                  onClick={() => navigate('/tables')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 ease-in-out"
                >
                  <RollbackOutlined />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={fetchTable}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 ease-in-out"
                  title="Atualizar lista"
                >
                  <ReloadOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* Painel de Colunas */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg">
            <div className="p-4 border-b border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Colunas da Tabela</h2>
                  <p className="text-gray-400 text-sm mt-1">Gerencie as colunas e seus tipos de dados</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar colunas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-slate-700 border border-slate-600 rounded-lg pl-4 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Tabela de Colunas */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-400">Carregando colunas...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Tipo de Dados</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Descrição</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Tag Vinculada</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">É Timestamp</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredColumns.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Nenhuma coluna encontrada
                          </td>
                        </tr>
                      ) : (
                        filteredColumns.map((column) => (
                          <tr key={column.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                            <td className="px-4 py-3 text-white">{column.column_name}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getDataTypeColor(column.data_type)}-500/20 text-${getDataTypeColor(column.data_type)}-400`}>
                                {getDataTypeLabel(column.data_type)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{column.description || '-'}</td>
                            <td className="px-4 py-3 text-gray-300">
                              {column.tag_id ? (
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                  Tag ID: {column.tag_id}
                                </span>
                              ) : (
                                <span className="text-gray-500">Nenhuma</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {column.is_timestamp ? (
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Sim</span>
                              ) : (
                                <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">Não</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <button
                                  onClick={() => showDeleteConfirmation(column)}
                                  className="flex items-center gap-1 p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  title="Excluir Coluna"
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
                </div>
              )}
              
              {/* Paginação */}
              {filteredColumns.length > 0 && (
                <div className="py-2 px-4 border-t border-slate-700 flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-400">
                    Total: {filteredColumns.length} coluna(s)
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded-md">1</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal para adicionar nova coluna */}
          {modalVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setModalVisible(false)}></div>
              <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Adicionar Nova Coluna
                  </h3>
                  <button
                    onClick={() => setModalVisible(false)}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">&times;</span>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddColumn(); }} className="space-y-4">
                  <div>
                    <label htmlFor="column_name" className="block text-sm font-medium text-gray-400 mb-1">
                      Nome da Coluna
                    </label>
                    <input
                      type="text"
                      id="column_name"
                      name="column_name"
                      value={formData.column_name}
                      onChange={handleFormChange}
                      className={`w-full bg-slate-700 border ${
                        formErrors.column_name ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Nome da coluna"
                    />
                    {formErrors.column_name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.column_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="data_type" className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                      Tipo de Dados
                      <div className="group relative">
                        <InfoCircleOutlined className="text-gray-500 cursor-help" />
                        <div className="absolute hidden group-hover:block top-full left-0 mt-2 w-64 p-3 bg-slate-900 rounded-lg shadow-xl z-50 border border-slate-700">
                          <h4 className="font-semibold mb-2 text-white">Tipos de Dados:</h4>
                          <div className="space-y-2">
                            {DATA_TYPES.map(type => (
                              <div key={type.value} className="text-xs">
                                <span className={`text-${type.color}-400 font-medium`}>{type.label}:</span>
                                <span className="text-gray-400 ml-1">{type.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </label>
                    <select
                      id="data_type"
                      name="data_type"
                      value={formData.data_type}
                      onChange={handleFormChange}
                      className={`w-full bg-slate-700 border ${
                        formErrors.data_type ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                    >
                      {DATA_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.data_type && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.data_type}</p>
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
                      placeholder="Descrição da coluna"
                      rows={3}
                    ></textarea>
                  </div>

                  {table.storage_type === 'timeseries' && (
                    <div className="flex items-center">
                      <label htmlFor="is_timestamp" className="text-sm font-medium text-gray-400 mr-3">
                        É uma coluna de timestamp?
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          id="is_timestamp"
                          checked={formData.is_timestamp}
                          onChange={(e) => handleSwitchChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  )}

                  {/* Preview da coluna */}
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Preview da Coluna:</h4>
                    <div className="bg-slate-800 p-3 rounded border border-slate-600">
                      <code className="text-sm">
                        <span className="text-blue-400">{formData.column_name || 'nome_coluna'}</span>
                        <span className="text-gray-400"> </span>
                        <span className="text-green-400">{formData.data_type}</span>
                        {formData.description && (
                          <>
                            <span className="text-gray-400"> -- </span>
                            <span className="text-gray-500">{formData.description}</span>
                          </>
                        )}
                      </code>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalVisible(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 ease-in-out"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <PlusOutlined />
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de confirmação de exclusão */}
          {deleteModalVisible && columnToDelete && (
            <DeleteModal
              column={columnToDelete}
              visible={deleteModalVisible}
              onCancel={() => {
                setDeleteModalVisible(false);
                setColumnToDelete(null);
              }}
              onConfirm={() => handleDeleteColumn(columnToDelete)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ColumnManager;