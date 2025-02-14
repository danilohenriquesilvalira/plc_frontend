import React, { useEffect, useState } from 'react';
import { getTags, createTag, updateTag, deleteTag, Tag } from '../../services/api';
import { X, Plus, Edit, Trash2, Tag as TagIcon, AlertTriangle, Search } from 'lucide-react';

interface TagDialogProps {
  plcId: number;
  plcName: string;
  onClose: () => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md relative z-10 border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h2>
        <p className="text-gray-400 mb-6">
          Tem certeza que deseja excluir esta tag? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Excluir
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
  const [formData, setFormData] = useState<Partial<Tag>>({
    name: '',
    db_number: 0,
    byte_offset: 0,
    data_type: '',
    can_write: false,
    scan_rate: 0,
    monitor_changes: false,
    active: true,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTags(plcId);
      setTags(Array.isArray(data) ? data : []);
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
      setFormData({
        name: '',
        db_number: 0,
        byte_offset: 0,
        data_type: '',
        can_write: false,
        scan_rate: 0,
        monitor_changes: false,
        active: true,
      });
      fetchTags();
    } catch (err: any) {
      setError('Erro ao salvar tag.');
      console.error('Erro no handleSubmit:', err);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData(tag);
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

  // Filtra as tags com base no nome
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginação: calcula as tags exibidas na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);

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

        {/* Barra de busca */}
        <div className="mb-6 flex items-center">
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
                setCurrentPage(1); // reseta para a primeira página ao filtrar
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isFormOpen ? 'Fechar' : 'Nova Tag'}
          </button>
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
                  <tr className="border-b border-slate-600">
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
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => handleEdit(tag)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded hover:bg-slate-600"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(tag.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-slate-600"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-end items-center space-x-3">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Próxima
                </button>
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
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Dado</label>
                  <input 
                    type="text"
                    value={formData.data_type || ''}
                    onChange={(e) => setFormData({ ...formData, data_type: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
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

              <div className="grid grid-cols-2 gap-6">
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
                  <input 
                    type="number"
                    value={formData.scan_rate || 0}
                    onChange={(e) => setFormData({ ...formData, scan_rate: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-lg bg-slate-600 border border-slate-500 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={formData.can_write || false}
                    onChange={(e) => setFormData({ ...formData, can_write: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Permite Escrita</span>
                </label>

                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={formData.monitor_changes || false}
                    onChange={(e) => setFormData({ ...formData, monitor_changes: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Monitorar Mudanças</span>
                </label>

                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={formData.active || false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Ativo</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingTag(null);
                    setFormData({
                      name: '',
                      db_number: 0,
                      byte_offset: 0,
                      data_type: '',
                      can_write: false,
                      scan_rate: 0,
                      monitor_changes: false,
                      active: true,
                    });
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors text-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
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
      </div>
    </div>
  );
};

export default TagDialog;
