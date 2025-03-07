import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  connectMonitoringWebSocket, 
  ServerMetrics, 
  DatabaseMetrics 
} from '../../services/monitoringWebsocket';
import axios from 'axios';

// Define o tipo para status das métricas
type StatusType = "normal" | "warning" | "critical" | "error" | "offline";

// Props do MetricCard
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  status?: StatusType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, status = "normal" }) => {
  const statusColors: Record<StatusType, string> = {
    normal: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
    error: "text-red-500",
    offline: "text-gray-500"
  };

  const statusBackgrounds: Record<StatusType, string> = {
    normal: "bg-green-500/10",
    warning: "bg-yellow-500/10",
    critical: "bg-red-500/10",
    error: "bg-red-500/10",
    offline: "bg-gray-500/10"
  };

  const statusLabels: Record<StatusType, string> = {
    normal: "Normal",
    warning: "Atenção",
    critical: "Crítico",
    error: "Erro",
    offline: "Offline"
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          </div>
          <span className={`${statusColors[status]} ${statusBackgrounds[status]} text-xs px-2 py-1 rounded-full font-medium`}>
            {statusLabels[status]}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center">
            <span className={`mr-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span>últimos 5 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Função para formatar bytes para exibição legível
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Função para formatar uptime
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  return parts.join(', ');
};

const Monitoramento: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("servidor");
  const [serverMetrics, setServerMetrics] = useState<ServerMetrics | null>(null);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const wsRef = useRef<any>(null);

  // Carrega dados iniciais via API REST e conecta ao WebSocket
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await axios.get('/api/monitoring/all');
        if (response.data) {
          if (response.data.server) setServerMetrics(response.data.server);
          if (response.data.databases) setDatabaseMetrics(response.data.databases);
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    loadInitialData();

    wsRef.current = connectMonitoringWebSocket({
      onServerMetrics: (data: ServerMetrics) => {
        setServerMetrics(data);
        setLastUpdate(new Date());
      },
      onDatabaseMetrics: (data: DatabaseMetrics) => {
        setDatabaseMetrics(data);
        setLastUpdate(new Date());
      },
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onError: (err: any) => {
        console.error('Erro na conexão:', err);
        setConnected(false);
      }
    });

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Função para renderizar informações do sistema
  const renderSystemInfo = (title: string, value: string, last = false) => (
    <div className={`flex justify-between ${!last ? 'border-b border-slate-700/50 pb-3 mb-3' : ''}`}>
      <span className="text-slate-400">{title}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          title="Monitoramento do Sistema" 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          {/* Nova barra de navegação com botões maiores que ocupam toda a largura */}
          <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-slate-700">
            <div className="grid grid-cols-5">
              <button 
                onClick={() => setActiveTab("servidor")}
                className={`flex items-center justify-center py-5 ${activeTab === "servidor" ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'} transition-colors duration-200`}
              >
                <Server className="w-6 h-6 mr-2" />
                <span className="font-medium">Servidor</span>
              </button>
              <button 
                onClick={() => setActiveTab("postgresql")}
                className={`flex items-center justify-center py-5 ${activeTab === "postgresql" ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'} transition-colors duration-200`}
              >
                <Database className="w-6 h-6 mr-2" />
                <span className="font-medium">PostgreSQL</span>
              </button>
              <button 
                onClick={() => setActiveTab("timescaledb")}
                className={`flex items-center justify-center py-5 ${activeTab === "timescaledb" ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'} transition-colors duration-200`}
              >
                <Clock className="w-6 h-6 mr-2" />
                <span className="font-medium">TimescaleDB</span>
              </button>
              <button 
                onClick={() => setActiveTab("redis")}
                className={`flex items-center justify-center py-5 ${activeTab === "redis" ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'} transition-colors duration-200`}
              >
                <Activity className="w-6 h-6 mr-2" />
                <span className="font-medium">Redis</span>
              </button>
              <button 
                onClick={() => setActiveTab("mariadb")}
                className={`flex items-center justify-center py-5 ${activeTab === "mariadb" ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'} transition-colors duration-200`}
              >
                <Database className="w-6 h-6 mr-2" />
                <span className="font-medium">MariaDB</span>
              </button>
            </div>
          </div>

          {/* Aba do Servidor */}
          {activeTab === "servidor" && (
            <>
              {serverMetrics ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                      title="CPU Utilização" 
                      value={`${serverMetrics.cpu.usage.toFixed(1)}%`} 
                      icon={<Cpu className="w-4 h-4 text-blue-500" />} 
                      status={serverMetrics.cpu.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Memória" 
                      value={`${serverMetrics.memory.usedPercent.toFixed(1)}%`} 
                      icon={<TrendingUp className="w-4 h-4 text-purple-500" />} 
                      status={serverMetrics.memory.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Disco" 
                      value={`${serverMetrics.disk.usedPercent.toFixed(1)}%`} 
                      icon={<HardDrive className="w-4 h-4 text-green-500" />} 
                      status={serverMetrics.disk.status as StatusType}
                      trend={0}
                    />
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Server className="w-5 h-5 mr-2 text-blue-500" />
                          Informações do Sistema
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Hostname", serverMetrics.system.hostname)}
                          {renderSystemInfo("Sistema", serverMetrics.system.platform)}
                          {renderSystemInfo("Uptime", formatUptime(serverMetrics.system.uptime))}
                          {renderSystemInfo("Memória Total", formatBytes(serverMetrics.memory.total))}
                          {renderSystemInfo("Memória Usada", formatBytes(serverMetrics.memory.used))}
                          {renderSystemInfo("Processos", serverMetrics.system.processes.toString(), true)}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Activity className="w-5 h-5 mr-2 text-purple-500" />
                          Rede
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Dados Enviados", formatBytes(serverMetrics.network.bytesSent))}
                          {renderSystemInfo("Dados Recebidos", formatBytes(serverMetrics.network.bytesReceived))}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${serverMetrics.network.status === 'normal' ? 'text-green-400' : 'text-yellow-400'} font-medium`}>
                              {serverMetrics.network.status === 'normal' ? 'Normal' : 'Atenção'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 flex flex-col items-center">
                    <Activity className="w-10 h-10 mb-3 text-blue-400 animate-pulse" />
                    <span>Carregando métricas do servidor...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aba do PostgreSQL */}
          {activeTab === "postgresql" && (
            <>
              {databaseMetrics?.postgresql ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                      title="Conexões Ativas" 
                      value={databaseMetrics.postgresql.connections.toString()} 
                      icon={<Database className="w-4 h-4 text-blue-500" />}
                      status={databaseMetrics.postgresql.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Queries por Segundo" 
                      value={databaseMetrics.postgresql.queriesPerSec.toFixed(1)} 
                      icon={<Activity className="w-4 h-4 text-purple-500" />}
                      status={databaseMetrics.postgresql.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Lag de Replicação" 
                      value={`${databaseMetrics.postgresql.replicationLag} seg`} 
                      icon={<Clock className="w-4 h-4 text-green-500" />}
                      status={databaseMetrics.postgresql.replicationLag > 3 ? "warning" as StatusType : "normal" as StatusType}
                      trend={0}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-blue-500" />
                          Detalhes do PostgreSQL
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Tamanho do Banco", formatBytes(databaseMetrics.postgresql.size))}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.postgresql.status === 'online' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                              {databaseMetrics.postgresql.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 flex flex-col items-center">
                    <Database className="w-10 h-10 mb-3 text-blue-400 animate-pulse" />
                    <span>Carregando métricas do PostgreSQL...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aba do TimescaleDB */}
          {activeTab === "timescaledb" && (
            <>
              {databaseMetrics?.timescaledb ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                      title="Chunks Ativos" 
                      value={databaseMetrics.timescaledb.chunks.toString()} 
                      icon={<Database className="w-4 h-4 text-blue-500" />}
                      status={databaseMetrics.timescaledb.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Compressão" 
                      value={`${databaseMetrics.timescaledb.compressionRatio.toFixed(1)}x`} 
                      icon={<Activity className="w-4 h-4 text-purple-500" />}
                      status={databaseMetrics.timescaledb.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Política de Retenção" 
                      value={databaseMetrics.timescaledb.retentionPolicy} 
                      icon={<Clock className="w-4 h-4 text-green-500" />}
                      status={databaseMetrics.timescaledb.status as StatusType}
                      trend={0}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-500" />
                          Detalhes do TimescaleDB
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Tamanho do Banco", formatBytes(databaseMetrics.timescaledb.size))}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.timescaledb.status === 'online' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                              {databaseMetrics.timescaledb.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 flex flex-col items-center">
                    <Clock className="w-10 h-10 mb-3 text-blue-400 animate-pulse" />
                    <span>Carregando métricas do TimescaleDB...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aba do Redis */}
          {activeTab === "redis" && (
            <>
              {databaseMetrics?.redis ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                      title="Conexões" 
                      value={databaseMetrics.redis.connections.toString()} 
                      icon={<Database className="w-4 h-4 text-blue-500" />}
                      status={databaseMetrics.redis.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Memória Utilizada" 
                      value={`${databaseMetrics.redis.memoryUsage.toFixed(1)}%`} 
                      icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
                      status={databaseMetrics.redis.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Hit Rate" 
                      value={`${databaseMetrics.redis.hitRate.toFixed(1)}%`} 
                      icon={<Activity className="w-4 h-4 text-green-500" />}
                      status={databaseMetrics.redis.hitRate < 70 ? "warning" as StatusType : "normal" as StatusType}
                      trend={0}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Activity className="w-5 h-5 mr-2 text-red-400" />
                          Detalhes do Redis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Memória Alocada", formatBytes(databaseMetrics.redis.memory))}
                          {renderSystemInfo("Total de Chaves", databaseMetrics.redis.keyCount.toLocaleString())}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.redis.status === 'online' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                              {databaseMetrics.redis.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 flex flex-col items-center">
                    <Activity className="w-10 h-10 mb-3 text-red-400 animate-pulse" />
                    <span>Carregando métricas do Redis...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aba do MariaDB */}
          {activeTab === "mariadb" && (
            <>
              {databaseMetrics?.mariadb ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard 
                      title="Conexões" 
                      value={databaseMetrics.mariadb.connections.toString()} 
                      icon={<Database className="w-4 h-4 text-blue-500" />}
                      status={databaseMetrics.mariadb.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Queries por Segundo" 
                      value={databaseMetrics.mariadb.queriesPerSec.toFixed(1)} 
                      icon={<Activity className="w-4 h-4 text-purple-500" />}
                      status={databaseMetrics.mariadb.status as StatusType}
                      trend={0}
                    />
                    <MetricCard 
                      title="Queries Lentas" 
                      value={databaseMetrics.mariadb.slowQueries.toString()} 
                      icon={<AlertCircle className="w-4 h-4 text-yellow-500" />}
                      status={databaseMetrics.mariadb.slowQueries > 5 ? "warning" as StatusType : "normal" as StatusType}
                      trend={0}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700/90 border-slate-600 hover:border-blue-500/50 shadow-lg transition-all duration-300">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-blue-500" />
                          Detalhes do MariaDB
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {renderSystemInfo("Tamanho do Banco", formatBytes(databaseMetrics.mariadb.size))}
                          {renderSystemInfo("Queries por Segundo", databaseMetrics.mariadb.queriesPerSec.toFixed(1))}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.mariadb.status === 'online' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                              {databaseMetrics.mariadb.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-slate-400 flex flex-col items-center">
                    <Database className="w-10 h-10 mb-3 text-blue-400 animate-pulse" />
                    <span>Carregando métricas do MariaDB...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Monitoramento;