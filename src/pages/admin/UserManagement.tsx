import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import axios from 'axios';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  User,
  Shield,
  Clock,
  CheckCircle,
  X,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

interface UpdateUserRequest {
  username?: string;
  password?: string;
  role?: string;
}

const API_URL = 'http://localhost:8080/api/auth';

const UserManagement: React.FC = () => {
  const { logout, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    role: 'operator'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estatísticas
  const totalUsers = users.length;
  const adminUsers = users.filter(user => 
    ['superadmin', 'administrator'].includes(user.role.toLowerCase())
  ).length;
  const techUsers = users.filter(user => 
    ['technician', 'maintenance'].includes(user.role.toLowerCase())
  ).length;
  const operatorUsers = users.filter(user => 
    ['operator', 'supervisor'].includes(user.role.toLowerCase())
  ).length;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
      setError('');
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      setError(error.response?.data || 'Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Quando selecionar um usuário para edição
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        password: '', // Senha vazia para edição
        role: selectedUser.role
      });
    }
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (selectedUser) {
        // Atualizar usuário
        const updateData: UpdateUserRequest = {
          username: formData.username,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        await axios.put(`${API_URL}/update/${selectedUser.id}`, updateData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Criar novo usuário
        await axios.post(`${API_URL}/register`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      await fetchUsers();
      setIsAddUserModalOpen(false);
      setSelectedUser(null);
      setFormData({ username: '', password: '', role: 'operator' });
      setError('');
    } catch (error: any) {
      console.error('Erro na operação:', error);
      setError(error.response?.data || 'Erro ao processar operação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${API_URL}/delete/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchUsers();
      setDeleteConfirmUser(null);
      setError('');
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      setError(error.response?.data || 'Erro ao excluir usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title="Gerenciamento de Usuários" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total de Usuários */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-blue-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                  Total
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de Usuários</h3>
              <p className="text-lg font-bold text-white">{totalUsers}</p>
            </div>

            {/* Administradores */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-purple-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                  {adminUsers} Admin
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Administradores</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <User className="w-4 h-4 mr-1" /> Usuários privilegiados
              </p>
            </div>

            {/* Técnicos */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-green-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                  {techUsers} Técnicos
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Equipe Técnica</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" /> Manutenção e Suporte
              </p>
            </div>

            {/* Operadores */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-amber-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400">
                  {operatorUsers} Operadores
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Operadores</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Supervisão e Operação
              </p>
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600 shadow overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Usuários do Sistema</h2>
                  <p className="text-gray-400 text-sm mt-1">Gerencie os usuários e suas permissões</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setFormData({ username: '', password: '', role: 'operator' });
                      setIsAddUserModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Adicionar Usuário</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-gray-400">Usuário</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-400">Função</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-400">Criado em</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-400">Última Atualização</th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-400 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-t border-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role.toLowerCase().includes('admin') 
                              ? 'bg-purple-400/10 text-purple-400'
                              : user.role.toLowerCase().includes('tech') 
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-blue-400/10 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAddUserModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmUser(user)}
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
          </div>
        </main>
      </div>

      {/* Modal de Adicionar/Editar Usuário */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setSelectedUser(null);
                  setFormData({ username: '', password: '', role: 'operator' });
                  setError('');
                }}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {!selectedUser && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required={!selectedUser}
                  />
                </div>
              )}

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
                  Função
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="operator">Operador</option>
                  <option value="technician">Técnico</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="administrator">Administrador</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserModalOpen(false);
                    setSelectedUser(null);
                    setFormData({ username: '', password: '', role: 'operator' });
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processando...' : selectedUser ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="bg-red-500/10 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
              <p className="text-gray-400 mt-2">
                Você tem certeza que deseja excluir o usuário <span className="text-white font-medium">{deleteConfirmUser.username}</span>?
                <br />Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;