import React, { useEffect, useState } from 'react';
import { getTags, createTag, updateTag, deleteTag, Tag } from '../../services/api';
import { X, Plus, Edit, Trash2, Tag as TagIcon, AlertTriangle, Search, Upload, Download, Copy } from 'lucide-react';

interface TagDialogProps {
  plcId: number;
  plcName: string;
  onClose: () => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

interface MultipleTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: Partial<Tag>[]) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar Exclusão', 
  message = 'Tem certeza que deseja excluir esta tag? Esta ação não pode ser desfeita.' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md relative z-10 border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para adicionar múltiplas tags de uma vez
const MultipleTagsModal: React.FC<MultipleTagsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [tagsText, setTagsText] = useState<string>('');
  const [previewTags, setPreviewTags] = useState<Partial<Tag>[]>([]);
  const [errorLines, setErrorLines] = useState<number[]>([]);

  const parseTagsText = () => {
    try {
      const lines = tagsText.split('\n').filter(line => line.trim() !== '');
      const parsedTags: Partial<Tag>[] = [];
      const errors: number[] = [];

      lines.forEach((line, index) => {
        try {
          // Formato esperado: Nome,TipoDeDado,DBNumber,ByteOffset,ScanRate,PermiteEscrita,MonitorarMudanças,Ativo
          const parts = line.split(',').map(part => part.trim());
          
          if (parts.length < 5) {
            errors.push(index);
            return;
          }

          const tag: Partial<Tag> = {
            name: parts[0],
            data_type: parts[1].toLowerCase(), // converte para minúsculo
            db_number: parseInt(parts[2]),
            byte_offset: parseInt(parts[3]),
            scan_rate: parseInt(parts[4]),
            can_write: parts[5]?.toLowerCase() === 'sim' || parts[5]?.toLowerCase() === 'true',
            monitor_changes: parts[6]?.toLowerCase() === 'sim' || parts[6]?.toLowerCase() === 'true',
            active: parts[7] === undefined || parts[7]?.toLowerCase() === 'sim' || parts[7]?.toLowerCase() === 'true',
          };

          if (isNaN(tag.db_number as number) || isNaN(tag.byte_offset as number) || isNaN(tag.scan_rate as number)) {
            errors.push(index);
            return;
          }

          parsedTags.push(tag);
        } catch (e) {
          errors.push(index);
        }
      });

      setPreviewTags(parsedTags);
      setErrorLines(errors);
      return { tags: parsedTags, hasErrors: errors.length > 0 };
    } catch (e) {
      setErrorLines([]);
      setPreviewTags([]);
      return { tags: [], hasErrors: true };
    }
  };

  const handleSave = () => {
    const { tags, hasErrors } = parseTagsText();
    if (hasErrors || tags.length === 0) {
      return;
    }
    onSave(tags);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl relative z-10 border border-slate-700 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Adicionar Múltiplas Tags</h2>
        
        <div className="mb-6">
          <p className="text-gray-400 mb-2">
            Cole suas tags usando o formato: <span className="text-blue-400">Nome,TipoDeDado,DBNumber,ByteOffset,ScanRate,PermiteEscrita,MonitorarMudanças,Ativo</span>
          </p>
          <p className="text-gray-400 mb-4">
            Exemplo: <span className="text-green-400">Temperatura,real,5,10,1000,Sim,Sim,Sim</span>
          </p>
          
          <textarea
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            onBlur={parseTagsText}
            placeholder="Cole suas tags aqui, uma por linha..."
            className="w-full h-64 p-3 rounded-lg bg-slate-700 border border-slate-600 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {errorLines.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Erros encontrados nas linhas:</span>
            </div>
            <p>{errorLines.map(i => i + 1).join(', ')}</p>
          </div>
        )}
        
        {previewTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">Preview ({previewTags.length} tags)</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm text-white">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">DB</th>
                    <th className="px-4 py-2 text-left">Offset</th>
                    <th className="px-4 py-2 text-left">Scan Rate</th>
                    <th className="px-4 py-2 text-left">Escrita</th>
                    <th className="px-4 py-2 text-left">Monitor</th>
                    <th className="px-4 py-2 text-left">Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  {previewTags.map((tag, index) => (
                    <tr key={index} className="border-t border-slate-700">
                      <td className="px-4 py-2">{tag.name}</td>
                      <td className="px-4 py-2">{tag.data_type}</td>
                      <td className="px-4 py-2">{tag.db_number}</td>
                      <td className="px-4 py-2">{tag.byte_offset}</td>
                      <td className="px-4 py-2">{tag.scan_rate}ms</td>
                      <td className="px-4 py-2">{tag.can_write ? 'Sim' : 'Não'}</td>
                      <td className="px-4 py-2">{tag.monitor_changes ? 'Sim' : 'Não'}</td>
                      <td className="px-4 py-2">{tag.active ? 'Sim' : 'Não'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-full"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={previewTags.length === 0 || errorLines.length > 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Adicionar {previewTags.length} Tag{previewTags.length !== 1 && 's'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TagDialog: React.FC<TagDialogProps> = ({ plcId, plcName, onClose }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [multipleTagsModalOpen, setMultipleTagsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Estado para seleção múltipla
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  // 'selected' para excluir os marcados ou 'all' para excluir todas
  const [bulkDeleteMode, setBulkDeleteMode] = useState<'selected' | 'all' | null>(null);
  
  // Opções predefinidas para os campos (em minúsculo)
  const dataTypeOptions = [
    'bool', 'int', 'real', 'word', 'dword', 'byte', 'string', 'char'
  ];
  
  const scanRateOptions = [
    100, 500, 1000, 2000, 5000, 10000
  ];
  
  const [formData, setFormData] = useState<Partial<Tag>>({
    name: '',
    db_number: 0,
    byte_offset: 0,
    data_type: dataTypeOptions[0],
    can_write: false,
    scan_rate: scanRateOptions[2], // 1000ms por padrão
    monitor_changes: false,
    active: true,
  });

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTags(plcId);
      setTags(Array.isArray(data) ? data : []);
      // Limpa seleção ao recarregar
      setSelectedTagIds([]);
    } catch (err: any) {
      setError('Erro ao carregar tags.');
      console.error('Erro no fetchTags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [plcId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingTag) {
        await updateTag(editingTag.id, formData);
      } else {
        await createTag(plcId, formData);
      }
      setIsFormOpen(false);
      setEditingTag(null);
      resetForm();
      fetchTags();
    } catch (err: any) {
      setError('Erro ao salvar tag.');
      console.error('Erro no handleSubmit:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      db_number: 0,
      byte_offset: 0,
      data_type: dataTypeOptions[0],
      can_write: false,
      scan_rate: scanRateOptions[2],
      monitor_changes: false,
      active: true,
    });
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData(tag);
    setIsFormOpen(true);
  };

  const handleCopyTag = (tag: Tag) => {
    const newTag = { ...tag };
    delete (newTag as any).id;
    newTag.name = `${newTag.name}_copy`;
    setFormData(newTag);
    setEditingTag(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (tagId: number) => {
    setTagToDelete(tagId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;
    try {
      await deleteTag(tagToDelete);
      fetchTags();
    } catch (err: any) {
      setError('Erro ao deletar tag.');
      console.error('Erro no handleDelete:', err);
    }
  };

  const handleMultipleTagsSubmit = async (newTags: Partial<Tag>[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Cria todas as tags em paralelo
      await Promise.all(newTags.map(tag => createTag(plcId, tag)));
      
      fetchTags();
    } catch (err: any) {
      setError('Erro ao adicionar múltiplas tags.');
      console.error('Erro no handleMultipleTagsSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportTagsToCSV = () => {
    const header = 'Nome,TipoDeDado,DBNumber,ByteOffset,ScanRate,PermiteEscrita,MonitorarMudanças,Ativo';
    const rows = tags.map(tag => 
      `${tag.name},${tag.data_type},${tag.db_number},${tag.byte_offset},${tag.scan_rate},${tag.can_write ? 'Sim' : 'Não'},${tag.monitor_changes ? 'Sim' : 'Não'},${tag.active ? 'Sim' : 'Não'}`
    );
    const csvContent = [header, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tags_plc_${plcId}_${plcName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funções para seleção múltipla
  const handleSelectTag = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedTagIds(prev => [...prev, id]);
    } else {
      setSelectedTagIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAllCurrent = (checked: boolean) => {
    const currentIds = currentTags.map(tag => tag.id);
    if (checked) {
      setSelectedTagIds(prev => Array.from(new Set([...prev, ...currentIds])));
    } else {
      setSelectedTagIds(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  // Filtra as tags pelo nome
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);

  // Exclusão em massa (selecionados ou todos)
  const handleBulkDelete = async () => {
    try {
      if (bulkDeleteMode === 'selected') {
        await Promise.all(selectedTagIds.map(id => deleteTag(id)));
        setSelectedTagIds([]);
      } else if (bulkDeleteMode === 'all') {
        await Promise.all(tags.map(tag => deleteTag(tag.id)));
      }
      fetchTags();
    } catch (err: any) {
      setError('Erro ao deletar tags.');
      console.error('Erro no handleBulkDelete:', err);
    } finally {
      setBulkDeleteConfirmOpen(false);
      setBulkDeleteMode(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-800 rounded-lg w-11/12 max-w-5xl p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          Tags do PLC: {plcName}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Barra de ações */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text"
              placeholder="Filtrar por nome..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)} 
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm shadow-md"
            >
              <Plus className="w-4 h-4 mr-1" />
              {isFormOpen ? 'Fechar' : 'Nova Tag'}
            </button>
            
            <button 
              onClick={() => setMultipleTagsModalOpen(true)} 
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm shadow-md"
            >
              <Upload className="w-4 h-4 mr-1" />
              Múltiplas Tags
            </button>
            
            <button 
              onClick={exportTagsToCSV} 
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-sm shadow-md"
              disabled={tags.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar CSV
            </button>

            {/* Botões para exclusão em massa */}
            <button 
              onClick={() => {
                setBulkDeleteMode('selected');
                setBulkDeleteConfirmOpen(true);
              }}
              disabled={selectedTagIds.length === 0}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm shadow-md"
              title="Excluir tags selecionadas"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir Selecionados
            </button>
            <button 
              onClick={() => {
                setBulkDeleteMode('all');
                setBulkDeleteConfirmOpen(true);
              }}
              disabled={tags.length === 0}
              className="flex items-center px-3 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors text-sm shadow-md"
              title="Excluir todas as tags"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir Todos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-16 bg-slate-700/50 rounded-lg border border-slate-600">
            <TagIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">Nenhuma tag encontrada</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajuste o filtro ou adicione uma nova tag.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-slate-600 bg-slate-700">
                    <th className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleSelectAllCurrent(e.target.checked)}
                        checked={currentTags.every(tag => selectedTagIds.includes(tag.id))}
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Nome</th>
                    <th className="px-6 py-4 text-left">Tipo</th>
                    <th className="px-6 py-4 text-left">DB</th>
                    <th className="px-6 py-4 text-left">Offset</th>
                    <th className="px-6 py-4 text-left">Escreve</th>
                    <th className="px-6 py-4 text-left">Scan Rate</th>
                    <th className="px-6 py-4 text-left">Monitor</th>
                    <th className="px-6 py-4 text-left">Ativo</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTags.map((tag) => (
                    <tr key={tag.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox"
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={(e) => handleSelectTag(tag.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-6 py-4">{tag.name}</td>
                      <td className="px-6 py-4">{tag.data_type}</td>
                      <td className="px-6 py-4">{tag.db_number}</td>
                      <td className="px-6 py-4">{tag.byte_offset}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          tag.can_write 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {tag.can_write ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{tag.scan_rate}ms</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          tag.monitor_changes 
                            ? 'bg-blue-500/20 text-blue-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {tag.monitor_changes ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          tag.active 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {tag.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleCopyTag(tag)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-slate-600"
                            title="Duplicar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(tag)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-600"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(tag.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-600"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTags.length)} de {filteredTags.length} tags
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    &laquo;
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    &lsaquo;
                  </button>
                  
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    {currentPage}
                  </span>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    &rsaquo;
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mt-8 bg-slate-700 p-8 rounded-lg border border-slate-600">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingTag ? 'Editar Tag' : 'Nova Tag'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input 
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Dado</label>
                  <select
                    value={formData.data_type || ''}
                    onChange={(e) => setFormData({ ...formData, data_type: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    {dataTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">DB Number</label>
                  <input 
                    type="number"
                    value={formData.db_number || 0}
                    onChange={(e) => setFormData({ ...formData, db_number: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Byte Offset</label>
                  <input 
                    type="number"
                    value={formData.byte_offset || 0}
                    onChange={(e) => setFormData({ ...formData, byte_offset: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scan Rate (ms)</label>
                  <select
                    value={formData.scan_rate || 1000}
                    onChange={(e) => setFormData({ ...formData, scan_rate: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    {scanRateOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center p-3 rounded-lg bg-slate-600 border border-slate-500 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.can_write || false}
                    onChange={(e) => setFormData({ ...formData, can_write: e.target.checked })}
                    className="mr-3 w-5 h-5 accent-blue-500"
                  />
                  <span className="text-white">Permite Escrita</span>
                </label>

                <label className="flex items-center p-3 rounded-lg bg-slate-600 border border-slate-500 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.monitor_changes || false}
                    onChange={(e) => setFormData({ ...formData, monitor_changes: e.target.checked })}
                    className="mr-3 w-5 h-5 accent-blue-500"
                  />
                  <span className="text-white">Monitorar Mudanças</span>
                </label>

                <label className="flex items-center p-3 rounded-lg bg-slate-600 border border-slate-500 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.active || false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-3 w-5 h-5 accent-blue-500"
                  />
                  <span className="text-white">Ativo</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTag(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors text-lg rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg"
                >
                  {editingTag ? 'Atualizar Tag' : 'Criar Tag'}
                </button>
              </div>
            </div>
          </form>
        )}

        <DeleteConfirmationModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        <DeleteConfirmationModal
          isOpen={bulkDeleteConfirmOpen}
          onClose={() => {
            setBulkDeleteConfirmOpen(false);
            setBulkDeleteMode(null);
          }}
          onConfirm={handleBulkDelete}
          title="Confirmar Exclusão"
          message={
            bulkDeleteMode === 'selected'
              ? `Tem certeza que deseja excluir as ${selectedTagIds.length} tag(s) selecionadas? Esta ação não pode ser desfeita.`
              : `Tem certeza que deseja excluir TODAS as tags? Esta ação não pode ser desfeita.`
          }
        />

        <MultipleTagsModal
          isOpen={multipleTagsModalOpen}
          onClose={() => setMultipleTagsModalOpen(false)}
          onSave={handleMultipleTagsSubmit}
        />
      </div>
    </div>
  );
};

export default TagDialog;
