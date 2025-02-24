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
  Clock
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

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          </div>
          <span className={`${statusColors[status]} text-xs px-2 py-1 rounded-full bg-opacity-10 bg-current`}>
            {status === "normal" ? "Normal" : status === "warning" ? "Atenção" : status === "critical" ? "Crítico" : status === "error" ? "Erro" : "Offline"}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 mt-1">Métricas em tempo real de todos os componentes</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
                <Activity className="w-3 h-3 mr-1" />
                {connected ? 'Coletando dados' : 'Desconectado'}
              </span>
              {lastUpdate && (
                <span className="text-slate-300 text-sm">
                  <Clock className="inline-block w-4 h-4 mr-1" />
                  Atualizado há {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)}s
                </span>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="servidor" className="data-[state=active]:bg-blue-600">
                <Server className="w-4 h-4 mr-2" />
                Servidor
              </TabsTrigger>
              <TabsTrigger value="postgresql" className="data-[state=active]:bg-blue-600">
                <Database className="w-4 h-4 mr-2" />
                PostgreSQL
              </TabsTrigger>
              <TabsTrigger value="timescaledb" className="data-[state=active]:bg-blue-600">
                <Clock className="w-4 h-4 mr-2" />
                TimescaleDB
              </TabsTrigger>
              <TabsTrigger value="redis" className="data-[state=active]:bg-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                Redis
              </TabsTrigger>
              <TabsTrigger value="mariadb" className="data-[state=active]:bg-blue-600">
                <Database className="w-4 h-4 mr-2" />
                MariaDB
              </TabsTrigger>
            </TabsList>

            {/* Aba do Servidor */}
            <TabsContent value="servidor" className="mt-4">
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
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Informações do Sistema</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Hostname</span>
                            <span className="text-white">{serverMetrics.system.hostname}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Sistema</span>
                            <span className="text-white">{serverMetrics.system.platform}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Uptime</span>
                            <span className="text-white">{formatUptime(serverMetrics.system.uptime)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Memória Total</span>
                            <span className="text-white">{formatBytes(serverMetrics.memory.total)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Memória Usada</span>
                            <span className="text-white">{formatBytes(serverMetrics.memory.used)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Processos</span>
                            <span className="text-white">{serverMetrics.system.processes}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Rede</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Dados Enviados</span>
                            <span className="text-white">{formatBytes(serverMetrics.network.bytesSent)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Dados Recebidos</span>
                            <span className="text-white">{formatBytes(serverMetrics.network.bytesReceived)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={`${serverMetrics.network.status === 'normal' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {serverMetrics.network.status === 'normal' ? 'Normal' : 'Atenção'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="text-slate-400">Carregando métricas do servidor...</div>
                </div>
              )}
            </TabsContent>

            {/* Aba do PostgreSQL */}
            <TabsContent value="postgresql" className="mt-4">
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
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Detalhes do PostgreSQL</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Tamanho do Banco</span>
                            <span className="text-white">{formatBytes(databaseMetrics.postgresql.size)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.postgresql.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                              {databaseMetrics.postgresql.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="text-slate-400">Carregando métricas do PostgreSQL...</div>
                </div>
              )}
            </TabsContent>

            {/* Aba do TimescaleDB */}
            <TabsContent value="timescaledb" className="mt-4">
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
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Detalhes do TimescaleDB</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Tamanho do Banco</span>
                            <span className="text-white">{formatBytes(databaseMetrics.timescaledb.size)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.timescaledb.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                              {databaseMetrics.timescaledb.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="text-slate-400">Carregando métricas do TimescaleDB...</div>
                </div>
              )}
            </TabsContent>

            {/* Aba do Redis */}
            <TabsContent value="redis" className="mt-4">
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
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Detalhes do Redis</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Memória Alocada</span>
                            <span className="text-white">{formatBytes(databaseMetrics.redis.memory)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Total de Chaves</span>
                            <span className="text-white">{databaseMetrics.redis.keyCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.redis.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                              {databaseMetrics.redis.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="text-slate-400">Carregando métricas do Redis...</div>
                </div>
              )}
            </TabsContent>

            {/* Aba do MariaDB */}
            <TabsContent value="mariadb" className="mt-4">
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
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-slate-100">Detalhes do MariaDB</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Tamanho do Banco</span>
                            <span className="text-white">{formatBytes(databaseMetrics.mariadb.size)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Queries por Segundo</span>
                            <span className="text-white">{databaseMetrics.mariadb.queriesPerSec.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Status</span>
                            <span className={`${databaseMetrics.mariadb.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                              {databaseMetrics.mariadb.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="text-slate-400">Carregando métricas do MariaDB...</div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Monitoramento;
