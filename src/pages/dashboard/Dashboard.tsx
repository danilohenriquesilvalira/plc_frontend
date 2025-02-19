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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Status do Sistema */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-blue-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Signal className="w-5 h-5 text-blue-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                  {availabilityPercentage.toFixed(1)}% Online
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Status do Sistema</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" /> Sistema Operacional
              </p>
            </div>

            {/* Total de PLCs */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-purple-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Server className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                    {onlinePlcs} Online
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                    {offlinePlcs} Offline
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de PLCs</h3>
              <p className="text-lg font-bold text-white">{totalPlcs}</p>
            </div>

            {/* Total de Tags */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-emerald-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Tag className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400">
                  {(totalTags / totalPlcs || 0).toFixed(1)} tags/PLC
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">Total de Tags</h3>
              <p className="text-lg font-bold text-white">{totalTags}</p>
            </div>

            {/* Alertas */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur rounded-xl p-4 border border-slate-600 hover:border-amber-500 transition-all duration-300 shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400">
                  {offlinePlcs} Alertas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">PLCs Offline</h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" /> Necessitam atenção
              </p>
            </div>
          </div>

          {/* Seção de PLCs */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600 shadow overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">PLCs Conectados</h2>
                  <p className="text-gray-400 text-sm mt-1">Monitoramento em tempo real</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar PLCs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
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
                        className="group bg-slate-800 rounded-xl p-4 border border-slate-600 cursor-pointer transition shadow"
                        onClick={() => handleViewTags(plc.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Server className={`w-5 h-5 mr-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                            <h3 className="text-lg font-semibold text-white truncate">{plc.name}</h3>
                          </div>
                          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {timeDiff < 60
                                ? `${timeDiff}s atrás`
                                : timeDiff < 3600
                                ? `${Math.floor(timeDiff / 60)}min atrás`
                                : `${Math.floor(timeDiff / 3600)}h atrás`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            <span>{plc.tags ? plc.tags.length : 0} tags monitoradas</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                          <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                            {isOnline ? 'Conectado' : 'Desconectado'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTags(plc.id);
                            }}
                            className="px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                          >
                            Ver Tags
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Aguardando conexão com PLCs...</p>
                  <p className="text-gray-500 text-sm mt-2">Nenhum dispositivo detectado</p>
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
