import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import {
  Activity,
  Database,
  Clock,
  Tag,
  Signal,
  AlertTriangle,
  Server,
  Search,
  ChevronRight,
} from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  value: any;
}

interface PLC {
  id: number;
  name: string;
  status: string;
  last_update: string;
  ip_address: string;
  tags?: Tag[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [plcs, setPLCs] = useState<PLC[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estatísticas
  const totalPlcs = plcs.length;
  const onlinePlcs = plcs.filter(plc => plc.status.toLowerCase() === 'online').length;
  const offlinePlcs = totalPlcs - onlinePlcs;
  const totalTags = plcs.reduce((sum, plc) => sum + (plc.tags?.length || 0), 0);
  const availabilityPercentage = totalPlcs > 0 ? (onlinePlcs / totalPlcs) * 100 : 0;

  useEffect(() => {
    if (message) {
      setPLCs(prev => {
        const plcName = ((message.plc as any).name as string) || `PLC ${message.plc.plc_id}`;
        const exists = prev.some(plc => plc.id === message.plc.plc_id);
        if (exists) {
          return prev.map(plc =>
            plc.id === message.plc.plc_id
              ? {
                  ...plc,
                  name: plcName,
                  status: message.plc.status,
                  last_update: message.plc.last_update,
                  tags: message.tags,
                }
              : plc
          );
        } else {
          const newPLC: PLC = {
            id: message.plc.plc_id,
            name: plcName,
            status: message.plc.status,
            last_update: message.plc.last_update,
            ip_address: '',
            tags: message.tags,
          };
          return [...prev, newPLC];
        }
      });
    }
  }, [message]);

  const filteredPLCs = plcs.filter(plc =>
    plc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewTags = (plcId: number) => {
    navigate(`/plcs/${plcId}/monitor`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 to-slate-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title="Dashboard" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Status do Sistema */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Signal className="w-5 h-5 text-blue-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 backdrop-blur-sm border border-green-500/20">
                  {availabilityPercentage.toFixed(1)}% Online
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-blue-400 transition-colors">Status do Sistema</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" /> Sistema Operacional
              </p>
              <div className="mt-2 w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${availabilityPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Total de PLCs */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Server className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 backdrop-blur-sm border border-green-500/20">
                    {onlinePlcs} Online
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 backdrop-blur-sm border border-red-500/20">
                    {offlinePlcs} Offline
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-purple-400 transition-colors">Total de PLCs</h3>
              <p className="text-xl font-bold text-white mt-1">{totalPlcs}</p>
            </div>

            {/* Total de Tags */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Tag className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
                  {(totalTags / totalPlcs || 0).toFixed(1)} tags/PLC
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-emerald-400 transition-colors">Total de Tags</h3>
              <p className="text-xl font-bold text-white mt-1">{totalTags}</p>
              <div className="mt-2 flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                    <Tag className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 backdrop-blur-sm border border-amber-500/20">
                  {offlinePlcs} Alertas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-amber-400 transition-colors">PLCs Offline</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Necessitam atenção
              </p>
              {offlinePlcs > 0 && (
                <div className="mt-2 relative w-5 h-5">
                  <span className="absolute w-full h-full rounded-full bg-amber-400 opacity-30 animate-ping"></span>
                  <span className="absolute w-full h-full rounded-full bg-amber-500/20 border border-amber-500/50"></span>
                </div>
              )}
            </div>
          </div>

          {/* Seção de PLCs */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-400" />
                    PLCs Conectados
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Monitoramento em tempo real</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar PLCs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              {filteredPLCs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPLCs.map(plc => {
                    const isOnline = plc.status.toLowerCase() === 'online';
                    const lastUpdateTime = new Date(plc.last_update);
                    const timeDiff = Math.floor((Date.now() - lastUpdateTime.getTime()) / 1000);
                    return (
                      <div
                        key={plc.id}
                        className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5"
                        onClick={() => handleViewTags(plc.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-500/10' : 'bg-red-500/10'} mr-2 border ${isOnline ? 'border-green-500/20' : 'border-red-500/20'}`}>
                              <Server className={`w-4 h-4 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                            </div>
                            <h3 className="text-base font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{plc.name}</h3>
                          </div>
                          <div className="relative">
                            <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                            {isOnline && (
                              <div className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping"></div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            <span>
                              {timeDiff < 60
                                ? `${timeDiff}s atrás`
                                : timeDiff < 3600
                                ? `${Math.floor(timeDiff / 60)}min atrás`
                                : `${Math.floor(timeDiff / 3600)}h atrás`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-3.5 h-3.5 mr-1.5" />
                            <span>{plc.tags ? plc.tags.length : 0} tags monitoradas</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                          <span className={`text-xs font-medium flex items-center ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} mr-1.5 ${isOnline ? 'animate-pulse' : ''}`}></span>
                            {isOnline ? 'Conectado' : 'Desconectado'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTags(plc.id);
                            }}
                            className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 flex items-center"
                          >
                            Ver Tags
                            <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-full w-20 h-20 flex items-center justify-center border border-slate-700/60 shadow-lg">
                      <Database className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg font-medium">Aguardando conexão com PLCs...</p>
                  <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                    Nenhum dispositivo detectado no momento. Verifique as conexões ou adicione novos PLCs ao sistema.
                  </p>
                  <button className="mt-6 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-medium border border-blue-500/20 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 flex items-center mx-auto">
                    Verificar novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;