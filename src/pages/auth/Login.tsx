import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, User, Cpu, Database, Server, 
  Wifi, Network, Code, Globe 
} from 'lucide-react';

const Login: React.FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await loginUser({ username, password });
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Background Icons Animation - Agora responsivo
  const BackgroundIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute animate-float1 top-1/4 left-1/4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-blue-500/20">
        <Database className="w-full h-full animate-pulse" />
      </div>
      <div className="absolute animate-float2 top-1/3 right-1/4 w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 text-purple-500/20">
        <Network className="w-full h-full animate-pulse" />
      </div>
      <div className="absolute animate-float3 bottom-1/4 left-1/3 w-12 sm:w-20 md:w-24 h-12 sm:h-20 md:h-24 text-cyan-500/20">
        <Cpu className="w-full h-full animate-pulse" />
      </div>
      {/* Ícones adicionais só aparecem em telas maiores */}
      <div className="hidden md:block absolute animate-float4 top-1/4 right-1/3 w-16 h-16 text-indigo-500/20">
        <Server className="w-full h-full animate-pulse" />
      </div>
      <div className="hidden md:block absolute animate-float5 bottom-1/3 right-1/4 w-20 h-20 text-blue-500/20">
        <Wifi className="w-full h-full animate-pulse" />
      </div>
      <div className="hidden md:block absolute animate-float6 top-1/2 left-1/4 w-16 h-16 text-purple-500/20">
        <Globe className="w-full h-full animate-spin-slow" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <BackgroundIcons />
      
      {/* Efeitos de luz - Responsivos */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Container do Card - Responsivo */}
      <div className="w-full max-w-[90%] sm:max-w-md relative group">
        {/* Efeito de borda brilhante */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        {/* Card Principal */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
          {/* Linhas decorativas */}
          <div className="absolute top-0 left-8 sm:left-16 right-8 sm:right-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="absolute bottom-0 left-8 sm:left-16 right-8 sm:right-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="flex flex-col items-center mb-6 sm:mb-8">
            {/* Logo com animação - Responsivo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 relative group/logo">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover/logo:opacity-20 blur-xl transition-all duration-500"></div>
              <Cpu className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white relative z-10 transform group-hover/logo:rotate-180 transition-transform duration-500" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sistema de Coleta
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 text-center">
              Sistema de Monitoramento Industrial
            </p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border-l-4 border-red-500 text-red-100 rounded-r-lg">
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-200">Usuário</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 sm:py-3 text-sm sm:text-base
                    bg-gray-800/80 text-white placeholder-gray-400 
                    border border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    hover:border-gray-600 transition-all duration-200"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-200">Senha</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 sm:py-3 text-sm sm:text-base
                    bg-gray-800/80 text-white placeholder-gray-400 
                    border border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    hover:border-gray-600 transition-all duration-200"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 sm:py-3 px-4 rounded-lg 
                text-sm sm:text-base font-medium text-white
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 transition-all duration-300 
                relative group/button overflow-hidden"
            >
              {isLoading ? (
                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="relative z-10">Entrar no Sistema</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/button:opacity-100 transition-all duration-300"></div>
            </button>
          </form>

          {/* Footer - Responsivo */}
          <div className="mt-6 sm:mt-8 text-center space-y-2">
            <p className="text-xs sm:text-sm text-gray-300">
              Indústria 4.0 • IoT • Big Data
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-300">
              <Code className="w-3 h-3 sm:w-4 sm:h-4" />
              <p className="text-xs sm:text-sm">Desenvolvido por Danilo Lira</p>
            </div>
            <p className="text-xs text-gray-400">Portugal • 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;