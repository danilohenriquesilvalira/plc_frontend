import React, { useState, useEffect } from 'react';
import { PLC, createPLC, updatePLC } from '../../services/api';
import { X } from 'lucide-react';

interface PLCFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPLC?: PLC;
}

const PLCForm: React.FC<PLCFormProps> = ({ isOpen, onClose, onSuccess, editingPLC }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip_address: '',
    rack: 0,
    slot: 0,
    active: true,
    status: 'offline'
  });

  useEffect(() => {
    if (editingPLC) {
      setFormData({
        name: editingPLC.name,
        ip_address: editingPLC.ip_address,
        rack: editingPLC.rack,
        slot: editingPLC.slot,
        active: editingPLC.active,
        status: editingPLC.status
      });
    }
  }, [editingPLC]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPLC) {
        await updatePLC(editingPLC.id, formData);
      } else {
        await createPLC(formData);
      }
      onSuccess();
      onClose();
      setFormData({
        name: '',
        ip_address: '',
        rack: 0,
        slot: 0,
        active: true,
        status: 'offline'
      });
    } catch (error) {
      console.error('Erro ao salvar PLC:', error);
      alert('Erro ao salvar PLC. Por favor, tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {editingPLC ? 'Editar PLC' : 'Novo PLC'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
              placeholder="Nome do PLC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Endereço IP
            </label>
            <input
              type="text"
              value={formData.ip_address}
              onChange={e => setFormData({...formData, ip_address: e.target.value})}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
              placeholder="Ex: 192.168.1.100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rack
              </label>
              <input
                type="number"
                value={formData.rack}
                onChange={e => setFormData({...formData, rack: parseInt(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Slot
              </label>
              <input
                type="number"
                value={formData.slot}
                onChange={e => setFormData({...formData, slot: parseInt(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="mr-2"
              id="active"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-400">
              Ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingPLC ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PLCForm;