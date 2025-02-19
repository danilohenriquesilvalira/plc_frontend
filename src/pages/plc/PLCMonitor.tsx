import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';

interface TagData {
  id: number;
  name: string;
  value: any;
  timestamp: string;
  history: { value: any; timestamp: string; }[];
  min?: number;
  max?: number;
  unit?: string;
}

interface PLCData {
  plc_id: number;
  name?: string;
  status: string;
  last_update: string;
}

interface WebSocketMessage {
  plc: PLCData;
  tags: TagData[];
}

interface TagChartModalProps {
  tag: TagData;
  onClose: () => void;
}

const TagChartModal: React.FC<TagChartModalProps> = ({ tag, onClose }) => {
  const [tick, setTick] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(1000);
  const [analysisWindow, setAnalysisWindow] = useState(3600000);
  const [chartColor, setChartColor] = useState('#3b82f6');

  useEffect(() => {
    const interval = setInterval(() => setTick(prev => prev + 1), updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return tag.history.filter(item => now - new Date(item.timestamp).getTime() <= analysisWindow);
  }, [tag.history, analysisWindow, tick]);

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" 
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-slate-800 rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 shadow-xl relative" 
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl text-white font-bold">Histórico - {tag.name}</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">Fechar</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm">Atualizar a cada:</label>
            <select
              value={updateInterval}
              onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded p-1 text-white"
            >
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm">Janela de análise:</label>
            <select
              value={analysisWindow}
              onChange={(e) => setAnalysisWindow(parseInt(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded p-1 text-white"
            >
              <option value={3600000}>1h</option>
              <option value={1800000}>30m</option>
              <option value={600000}>10m</option>
              <option value={300000}>5m</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm">Cor do gráfico:</label>
            <select
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded p-1 text-white"
            >
              <option value="#3b82f6">Azul</option>
              <option value="#ef4444">Vermelho</option>
              <option value="#10b981">Verde</option>
              <option value="#f59e0b">Amarelo</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value: string) => new Date(value).toLocaleTimeString()}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '0.5rem'
                }}
                labelFormatter={(value: string) => new Date(value).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const PLCMonitor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'warning' | 'normal'>('all');
  const [selectedView, setSelectedView] = useState<'compact' | 'detailed'>('compact');
  const [plcData, setPLCData] = useState<{
    name: string;
    status: string;
    last_update: string;
    tags: TagData[];
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 20;

  useEffect(() => {
    if (
      message &&
      (message as WebSocketMessage).plc &&
      (message as WebSocketMessage).plc.plc_id === parseInt(id!)
    ) {
      const wsMessage = message as WebSocketMessage;
      setPLCData(prev => {
        const updatedTags = wsMessage.tags.map((tag: TagData) => {
          const existingTag = prev?.tags?.find(t => t.id === tag.id);
          const newHistory = [...(existingTag?.history || [])];
          if (existingTag?.value !== tag.value) {
            newHistory.push({ value: tag.value, timestamp: new Date().toISOString() });
            if (newHistory.length > 50) newHistory.shift();
          }
          return { ...tag, history: newHistory, timestamp: new Date().toISOString() };
        });
        return {
          name: wsMessage.plc.name || prev?.name || `PLC ${wsMessage.plc.plc_id}`,
          status: wsMessage.plc.status,
          last_update: wsMessage.plc.last_update,
          tags: updatedTags
        };
      });
    }
  }, [message, id]);

  const handleBack = () => navigate(-1);

  const getTagStatus = (tag: TagData) => {
    if (typeof tag.value === 'number' && (tag.min !== undefined || tag.max !== undefined)) {
      if (tag.min !== undefined && tag.value < tag.min) return 'warning';
      if (tag.max !== undefined && tag.value > tag.max) return 'warning';
    }
    return 'normal';
  };

  const filteredTags = useMemo(() => {
    if (!plcData?.tags) return [];
    return plcData.tags
      .filter(tag => {
        const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || getTagStatus(tag) === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [plcData?.tags, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const paginatedTags = filteredTags.slice((currentPage - 1) * tagsPerPage, currentPage * tagsPerPage);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [totalPages, currentPage]);
  const handlePageChange = (newPage: number) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };

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
          title={`Monitoramento - ${plcData?.name || 'Carregando...'}`}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          {/* Barra superior de navegação */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-bold">Voltar</span>
            </button>
          </div>

          {/* Controles de busca, filtro e visualização */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar tags por nome..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-14 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'}`}
                >
                  <Filter className="w-5 h-5 inline-block mr-1" />
                  Todos
                </button>
                <button
                  onClick={() => setFilterStatus('warning')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'warning' ? 'bg-yellow-500 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'}`}
                >
                  <AlertTriangle className="w-5 h-5 inline-block mr-1" />
                  Alertas
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedView('compact')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'compact' ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'}`}
                >
                  Compacto
                </button>
                <button
                  onClick={() => setSelectedView('detailed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'detailed' ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'}`}
                >
                  Detalhado
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Tags */}
          {selectedView === 'compact' ? (
            <div className="bg-slate-800/50 rounded-lg overflow-x-auto shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Nome</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {paginatedTags.map(tag => (
                    <tr 
                      key={tag.id}
                      onClick={() => setSelectedTag(tag)}
                      className="hover:bg-slate-700/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-white">{tag.name}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                        {typeof tag.value === 'number' ? tag.value.toFixed(2) : tag.value}
                        {tag.unit && <span className="text-white ml-1">{tag.unit}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTags.map(tag => (
                <div
                  key={tag.id}
                  onClick={() => setSelectedTag(tag)}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-600 cursor-pointer transition transform hover:scale-105 hover:border-blue-500 shadow-lg"
                >
                  <h3 className="text-white font-bold text-xl">{tag.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-white">
                      {typeof tag.value === 'number' ? tag.value.toFixed(2) : tag.value}
                      {tag.unit && <span className="text-white text-lg ml-1">{tag.unit}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-6">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-5 py-3 bg-slate-700 text-white rounded disabled:opacity-50 hover:bg-slate-600 transition-colors shadow"
              >
                <ArrowLeft className="w-6 h-6" />
                Anterior
              </button>
              <span className="text-white text-lg">
                Página {currentPage} de {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-5 py-3 bg-slate-700 text-white rounded disabled:opacity-50 hover:bg-slate-600 transition-colors shadow"
              >
                Próxima
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Exibição do Modal do Gráfico */}
          {selectedTag && plcData && (
            <TagChartModal 
              tag={plcData.tags.find(tag => tag.id === selectedTag.id)!} 
              onClose={() => setSelectedTag(null)} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default PLCMonitor;
