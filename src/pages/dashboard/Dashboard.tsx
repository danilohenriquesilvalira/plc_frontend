import React, { useEffect, useState } from 'react';
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
  BarChart3 
} from 'lucide-react';

export interface Tag {
  id: number;
  name: string;
  value: any;
}

export interface PLC {
  id: number;
  name: string;
  status: string;
  last_update: string;
  ip_address: string;
  tags?: Tag[];
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [plcs, setPLCs] = useState<PLC[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (message) {
      setPLCs((prev) => {
        const exists = prev.some(plc => plc.id === message.plc.plc_id);
        if (exists) {
          return prev.map(plc =>
            plc.id === message.plc.plc_id
              ? {
                  ...plc,
                  status: message.plc.status,
                  last_update: message.plc.last_update,
                  tags: message.tags,
                }
              : plc
          );
        } else {
          const newPLC: PLC = {
            id: message.plc.plc_id,
            name: `PLC ${message.plc.plc_id}`,
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

  // Cálculo de estatísticas
  const totalPlcs = plcs.length;
  const onlinePlcs = plcs.filter(plc => plc.status.toLowerCase() === 'online').length;
  const offlinePlcs = totalPlcs - onlinePlcs;
  const totalTags = plcs.reduce((sum, plc) => sum + (plc.tags?.length || 0), 0);
  const availabilityPercentage = totalPlcs > 0 ? (onlinePlcs / totalPlcs) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLogout={logout} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title="Dashboard" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Card Status do Sistema */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Status do Sistema</p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">
                    {availabilityPercentage.toFixed(1)}% Online
                  </p>
                </div>
                <div className="bg-slate-700/50 p-2 sm:p-3 rounded-lg">
                  <Signal className={`w-5 h-5 sm:w-6 sm:h-6 ${availabilityPercentage > 80 ? 'text-green-400' : 'text-yellow-400'}`} />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Sistema Operacional
              </div>
            </div>

            {/* Card Total de PLCs */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total de PLCs</p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">{totalPlcs}</p>
                </div>
                <div className="bg-slate-700/50 p-2 sm:p-3 rounded-lg">
                  <Server className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="flex items-center text-green-400">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mr-2"></div>
                  {onlinePlcs} Online
                </span>
                <span className="flex items-center text-red-400">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 mr-2"></div>
                  {offlinePlcs} Offline
                </span>
              </div>
            </div>

            {/* Card Total de Tags */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total de Tags</p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">{totalTags}</p>
                </div>
                <div className="bg-slate-700/50 p-2 sm:p-3 rounded-lg">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {(totalTags / totalPlcs).toFixed(1)} tags/PLC
              </div>
            </div>

            {/* Card Alertas */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Alertas</p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">{offlinePlcs}</p>
                </div>
                <div className="bg-slate-700/50 p-2 sm:p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                PLCs necessitam atenção
              </div>
            </div>
          </div>

          {/* Lista de PLCs */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-600">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">PLCs Conectados</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Monitoramento em tempo real</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center text-xs sm:text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mr-2"></div>
                  Online
                </span>
                <span className="flex items-center text-xs sm:text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 mr-2"></div>
                  Offline
                </span>
              </div>
            </div>

            {plcs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {plcs.map(plc => {
                  const isOnline = plc.status.toLowerCase() === 'online';
                  const lastUpdateTime = new Date(plc.last_update);
                  const timeDiff = Math.floor((new Date().getTime() - lastUpdateTime.getTime()) / 1000);
                  
                  return (
                    <div
                      key={plc.id}
                      className={`relative bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600 
                        hover:border-blue-400 transition-all duration-300 group cursor-pointer
                        ${isOnline ? 'hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}
                    >
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex h-1.5 sm:h-2 w-1.5 sm:w-2">
                        {isOnline && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-full w-full 
                          ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      </div>
                      
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center">
                          <Server className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{plc.name}</h3>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs sm:text-sm text-gray-400">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {timeDiff < 60 ? `${timeDiff}s atrás` : 
                               timeDiff < 3600 ? `${Math.floor(timeDiff/60)}min atrás` :
                               `${Math.floor(timeDiff/3600)}h atrás`}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-400">
                            <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{plc.tags ? plc.tags.length : 0} tags monitoradas</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                        <div className="text-xs sm:text-sm font-medium">
                          <span className={`${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                            {isOnline ? 'Conectado' : 'Desconectado'}
                          </span>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium 
                          transition-colors bg-slate-600/0 hover:bg-slate-600/50 px-2 sm:px-3 py-1 rounded-lg">
                          Ver Tags
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Database className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-400">Aguardando conexão com PLCs...</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Nenhum dispositivo detectado</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;