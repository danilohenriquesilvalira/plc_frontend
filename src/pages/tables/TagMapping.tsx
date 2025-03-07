import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Spin,
  message
} from 'antd';
import {
  LinkOutlined,
  RollbackOutlined,
  ReloadOutlined,
  DisconnectOutlined,
  DatabaseOutlined,
  FieldTimeOutlined,
  TagOutlined
} from '@ant-design/icons';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { 
  TableMetadata, 
  ColumnMetadata, 
  PLC, 
  Tag as TagInterface, 
  TagMapping,
  getPermanentTable, 
  getTimeSeriesTable, 
  getPLCs, 
  getTags, 
  getTagMappings,
  mapTagToColumn
} from '../../services/api';

interface LocationState {
  table?: TableMetadata;
}

const TagMappingComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [tableData, setTableData] = useState<TableMetadata | null>(state?.table || null);
  const [columns, setColumns] = useState<ColumnMetadata[]>([]);
  const [plcs, setPlcs] = useState<PLC[]>([]);
  const [tags, setTags] = useState<TagInterface[]>([]);
  const [mappings, setMappings] = useState<TagMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnMetadata | null>(null);
  const [selectedPlc, setSelectedPlc] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    plc_id: '',
    tag_id: ''
  });
  const [formErrors, setFormErrors] = useState({
    plc_id: '',
    tag_id: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para o layout padrão (Sidebar e Header)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const onLogout = () => {
    console.log("Logout acionado");
  };

  // 2. Melhore a função fetchData para depuração
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    
    try {
      const tableId = parseInt(id);
      
      // Busca detalhes da tabela
      let table: TableMetadata;
      try {
        console.log("Buscando tabela com ID:", tableId);
        if (state?.table?.storage_type === 'permanent') {
          table = await getPermanentTable(tableId);
        } else {
          table = await getTimeSeriesTable(tableId);
        }
        console.log("Tabela carregada:", table);
        setTableData(table);
        setColumns(table.columns || []);
      } catch (error) {
        console.error('Erro ao buscar detalhes da tabela:', error);
        message.error('Falha ao carregar detalhes da tabela');
        setLoading(false);
        return;
      }
      
      // Buscar PLCs
      try {
        console.log("Buscando PLCs...");
        const plcData = await getPLCs();
        console.log(`${plcData.length} PLCs carregados`);
        setPlcs(plcData);
      } catch (error) {
        console.error('Erro ao buscar PLCs:', error);
        message.error('Falha ao carregar PLCs');
      }
      
      // Buscar mapeamentos existentes
      try {
        console.log("Buscando mapeamentos de tags...");
        const mappingData = await getTagMappings();
        console.log("Mapeamentos recebidos:", mappingData);
        
        // Filtra apenas os mapeamentos para esta tabela
        const tableMappings = mappingData.filter(m => m.table_id === tableId);
        console.log(`${tableMappings.length} mapeamentos para esta tabela:`, tableMappings);
        
        setMappings(tableMappings);
      } catch (error) {
        console.error('Erro ao buscar mapeamentos:', error);
        message.error('Falha ao carregar mapeamentos de tags');
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados:', error);
      message.error('Falha ao carregar informações. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePlcChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plcId = parseInt(e.target.value);
    setSelectedPlc(plcId);
    setFormData({...formData, plc_id: e.target.value, tag_id: ''});
    
    try {
      const tagData = await getTags(plcId);
      setTags(tagData);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      message.error('Falha ao carregar tags do PLC.');
      setTags([]);
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData, tag_id: e.target.value});
  };

  const openMappingModal = (column: ColumnMetadata) => {
    setSelectedColumn(column);
    const existingMapping = mappings.find(m => m.column_id === column.id);
    
    if (existingMapping) {
      setSelectedPlc(existingMapping.plc_id);
      setFormData({
        plc_id: existingMapping.plc_id.toString(),
        tag_id: existingMapping.tag_id.toString()
      });
      handlePlcChange({target: {value: existingMapping.plc_id.toString()}} as React.ChangeEvent<HTMLSelectElement>);
    } else {
      setSelectedPlc(null);
      setFormData({
        plc_id: '',
        tag_id: ''
      });
      setTags([]);
    }
    
    setFormErrors({
      plc_id: '',
      tag_id: ''
    });
    
    setModalVisible(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { plc_id: '', tag_id: '' };

    if (!formData.plc_id) {
      errors.plc_id = 'Por favor, selecione um PLC';
      isValid = false;
    }

    if (!formData.tag_id) {
      errors.tag_id = 'Por favor, selecione uma tag';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 3. Melhore a função handleMapping para lidar melhor com erros
  const handleMapping = async () => {
    if (!validateForm() || !selectedColumn || !tableData) return;
    
    try {
      console.log("Enviando mapeamento:", {
        tagId: parseInt(formData.tag_id),
        tableId: tableData.id,
        columnId: selectedColumn.id,
        plcId: parseInt(formData.plc_id),
        storageType: tableData.storage_type
      });
      
      // Adicione verificações de validação extras
      if (!formData.tag_id || !formData.plc_id) {
        message.error('Tag e PLC são obrigatórios para o mapeamento');
        return;
      }
      
      const tagId = parseInt(formData.tag_id);
      const plcId = parseInt(formData.plc_id);
      
      if (isNaN(tagId) || isNaN(plcId) || tagId <= 0 || plcId <= 0) {
        message.error('ID de Tag e PLC devem ser números positivos');
        return;
      }
      
      const newMapping = await mapTagToColumn(
        tagId,
        tableData.id,
        selectedColumn.id,
        plcId,
        tableData.storage_type
      );
      
      console.log("Mapeamento retornado:", newMapping);
      
      message.success('Tag mapeada com sucesso!');
      setModalVisible(false);
      
      // Pequena pausa antes de atualizar os dados para garantir que a API concluiu o processamento
      setTimeout(() => {
        fetchData();
      }, 300);
    } catch (error) {
      console.error('Erro ao mapear tag:', error);
      message.error('Falha ao mapear tag para coluna. Verifique o console para mais detalhes.');
    }
  };

  // 1. Atualize a função handleRemoveMapping para remover corretamente os mapeamentos
  const handleRemoveMapping = async () => {
    if (!selectedColumn || !tableData) return;
    
    try {
      console.log("Removendo mapeamento da coluna:", selectedColumn.column_name);
      
      // Chama a API com tagId=0 para indicar remoção do mapeamento
      await mapTagToColumn(
        0, // tagId 0 é um sinalizador para remover o mapeamento
        tableData.id,
        selectedColumn.id,
        0, // plcId 0 também é um sinalizador para remover
        tableData.storage_type
      );
      
      message.success('Mapeamento removido com sucesso!');
      setModalVisible(false);
      
      // Atualiza os dados para refletir a mudança
      await fetchData();
    } catch (error) {
      console.error('Erro ao remover mapeamento:', error);
      message.error('Falha ao remover mapeamento. Verifique o console para mais detalhes.');
    }
  };

  const filteredColumns = columns.filter(column => 
    column.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (column.description && column.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!tableData) {
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
        <Header onToggleSidebar={toggleSidebar} title={`${tableData.table_name} - Mapeamento de Tags`} />
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
            <span className="hover:text-blue-400 cursor-pointer transition-colors">{tableData.table_name}</span>
            <span>/</span>
            <span className="text-gray-300">Mapeamento de Tags</span>
          </div>
          
          {/* Cards de estatísticas - Cabeçalho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Informações da Tabela */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                {tableData.storage_type === 'permanent' ? (
                  <DatabaseOutlined className="text-purple-400 text-2xl" />
                ) : (
                  <FieldTimeOutlined className="text-green-400 text-2xl" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tableData.storage_type === 'permanent' 
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {tableData.storage_type === 'permanent' ? 'Permanente' : 'Série Temporal'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Informações da Tabela</h3>
              <p className="text-2xl font-bold text-white mb-1">{tableData.table_name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {tableData.description || 'Sem descrição'}
              </p>
              {tableData.retention_days && (
                <p className="text-xs text-gray-400 mt-1">
                  <span className="font-medium">Retenção:</span> {tableData.retention_days} dias
                </p>
              )}
            </div>

            {/* Informações de Mapeamento */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <TagOutlined className="text-blue-400 text-2xl" />
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  {mappings.length}/{columns.length} Mapeadas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Mapeamento de Tags</h3>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={fetchData}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <ReloadOutlined />
                  <span>Atualizar</span>
                </button>
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

          {/* Painel de Mapeamento */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg">
            <div className="p-4 border-b border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Mapeamento de Tags para Colunas</h2>
                  <p className="text-gray-400 text-sm mt-1">Vincule tags de PLCs às colunas desta tabela</p>
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

            {/* Tabela de Mapeamento */}
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-400">Carregando dados...</p>
                </div>
              ) : columns.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Esta tabela não possui colunas. Adicione colunas para mapear tags.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Nome da Coluna</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Tipo de Dados</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Tag Mapeada</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredColumns.map((column) => {
                        const mapping = mappings.find(m => m.column_id === column.id);
                        return (
                          <tr key={column.id} className="border-t border-slate-700/50">
                            <td className="px-4 py-3 text-white">{column.column_name}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                column.data_type === 'text' ? 'bg-green-500/20 text-green-400' :
                                column.data_type === 'integer' ? 'bg-blue-500/20 text-blue-400' :
                                column.data_type === 'float' ? 'bg-purple-500/20 text-purple-400' :
                                column.data_type === 'boolean' ? 'bg-yellow-500/20 text-yellow-400' :
                                column.data_type === 'timestamp' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {column.data_type === 'text' ? 'Texto' :
                                column.data_type === 'integer' ? 'Inteiro' :
                                column.data_type === 'float' ? 'Decimal' :
                                column.data_type === 'boolean' ? 'Booleano' :
                                column.data_type === 'timestamp' ? 'Timestamp' :
                                column.data_type === 'json' ? 'JSON' :
                                column.data_type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {mapping ? (
                                <span className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md text-sm">
                                  <TagOutlined /> {mapping.tag_name} ({mapping.plc_name})
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm">
                                  <DisconnectOutlined /> Não mapeada
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <button
                                  onClick={() => openMappingModal(column)}
                                  className="flex items-center gap-2 px-3 py-1 text-blue-400 border border-blue-400 rounded hover:bg-blue-500/10 transition-colors"
                                >
                                  <LinkOutlined />
                                  <span>Mapear Tag</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Paginação */}
              {filteredColumns.length > 0 && (
                <div className="py-2 px-4 border-t border-slate-700 flex justify-end mt-2">
                  <div className="text-sm text-gray-400">
                    <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded-md">1</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal para mapear tag */}
          {modalVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setModalVisible(false)}></div>
              <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Mapear Tag para {selectedColumn?.column_name}
                  </h3>
                  <button
                    onClick={() => setModalVisible(false)}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">&times;</span>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleMapping(); }} className="space-y-4">
                  <div>
                    <label htmlFor="plc_id" className="block text-sm font-medium text-gray-400 mb-1">
                      Selecione o PLC
                    </label>
                    <select
                      id="plc_id"
                      name="plc_id"
                      value={formData.plc_id}
                      onChange={handlePlcChange}
                      className={`w-full bg-slate-700 border ${
                        formErrors.plc_id ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                    >
                      <option value="">Selecione um PLC</option>
                      {plcs.map(plc => (
                        <option key={plc.id} value={plc.id}>
                          {plc.name} ({plc.ip_address})
                        </option>
                      ))}
                    </select>
                    {formErrors.plc_id && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.plc_id}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tag_id" className="block text-sm font-medium text-gray-400 mb-1">
                      Selecione a Tag
                    </label>
                    <select
                      id="tag_id"
                      name="tag_id"
                      value={formData.tag_id}
                      onChange={handleTagChange}
                      disabled={!selectedPlc}
                      className={`w-full bg-slate-700 border ${
                        formErrors.tag_id ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                        !selectedPlc ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">Selecione uma tag</option>
                      {tags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name} ({tag.data_type})
                        </option>
                      ))}
                    </select>
                    {formErrors.tag_id && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.tag_id}</p>
                    )}
                  </div>

                  {/* 5. Adicione esta função no botão de remover mapeamento */}
                  {selectedColumn && mappings.find(m => m.column_id === selectedColumn.id) && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleRemoveMapping}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                      >
                        <DisconnectOutlined />
                        <span>Remover Mapeamento</span>
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalVisible(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Salvar Mapeamento
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

export default TagMappingComponent;