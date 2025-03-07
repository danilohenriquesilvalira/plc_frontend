import React, { useState, useEffect } from 'react';
import { Ship, Clock, Video, CheckCircle, AlertTriangle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';

// Interface para o estado da eclusa
interface EstadoEclusa {
  titulo: string;
  mensagem: string;
  cor: string;
}

// Interface para o objeto de estados
interface EstadosEclusa {
  [key: number]: EstadoEclusa;
}

// Mapeamento dos estados com cores definidas conforme criticidade
const ESTADOS_ECLUSA: EstadosEclusa = {
  0: {
    titulo: "AGUARDANDO EMBARCAÇÃO",
    mensagem: "Sistema pronto para receber embarcação",
    cor: "text-white"
  },
  1: {
    titulo: "EMBARCAÇÃO EM APROXIMAÇÃO",
    mensagem: "Mantenha velocidade reduzida - MAX 2m/s",
    cor: "text-white"
  },
  2: {
    titulo: "ENTRADA AUTORIZADA",
    mensagem: "Prossiga com cautela - Siga as sinalizações",
    cor: "text-green-500"
  },
  3: {
    titulo: "REALIZE A AMARRAÇÃO",
    mensagem: "Amarre a embarcação nos pontos indicados",
    cor: "text-yellow-500"
  },
  4: {
    titulo: "ECLUSA EM OPERAÇÃO",
    mensagem: "Mantenha-se amarrado - Aguarde instruções",
    cor: "text-blue-400"
  },
  5: {
    titulo: "PREPARANDO LIBERAÇÃO",
    mensagem: "Aguarde - Comportas em operação",
    cor: "text-yellow-500"
  },
  6: {
    titulo: "SAÍDA AUTORIZADA",
    mensagem: "Prossiga com cautela - Boa viagem",
    cor: "text-green-500"
  }
};

const videos = [
  "/videos/edp-chamada.mp4",
  "/videos/nova-energia.mp4"
];

// Interface para as mensagens do WebSocket
interface Tag {
  name: string;
  value: any;
}

interface WebSocketMessage {
  tags?: Tag[];
  plc?: {
    plc_id: number;
    status: string;
    last_update: string;
  };
}

// Semáforo – mantém as cores padrão para sinalização
const Semaforo: React.FC<{ status: number }> = ({ status }) => (
  <div className="flex flex-col gap-2">
    <div className={`w-8 h-8 rounded-full ${status === 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-700'}`} />
    <div className={`w-8 h-8 rounded-full ${status === 1 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`} />
    <div className={`w-8 h-8 rounded-full ${status === 2 ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
  </div>
);

// Função para definir a cor do nível de água
const getNivelColor = (nivel: number) => {
  if (nivel < 30) return "text-yellow-500";  // abaixo do desejado
  if (nivel > 70) return "text-red-500";       // acima do desejado
  return "text-green-500";                     // dentro do intervalo
};

const PainelEclusa: React.FC = () => {
  const { message } = useWebSocket();
  const [estado, setEstado] = useState<number>(0);
  const [nivelAgua, setNivelAgua] = useState<number>(0);
  const [velocidade, setVelocidade] = useState<number>(0);
  const [videoAtual, setVideoAtual] = useState<number>(0);
  const [mostrarVideo, setMostrarVideo] = useState<boolean>(false);

  const [comportaMontante, setComportaMontante] = useState<number>(0);
  const [comportaJusante, setComportaJusante] = useState<number>(0);
  const [semaforoMontante, setSemaforoMontante] = useState<number>(0);
  const [semaforoJusante, setSemaforoJusante] = useState<number>(0);

  const [direcaoFluxo, setDirecaoFluxo] = useState<'subida' | 'descida'>('subida');
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    if (message && message.tags) {
      const tags = message.tags;
      const estadoTag = tags.find(tag => tag.name === "Eclusa_Estado");
      const nivelTag = tags.find(tag => tag.name === "Eclusa_NivelAgua");
      const velocidadeTag = tags.find(tag => tag.name === "Eclusa_VelocidadeBarco");
      const publicidadeTag = tags.find(tag => tag.name === "Eclusa_PublicidadeAtiva");
      const comportaMTag = tags.find(tag => tag.name === "Eclusa_ComportaMontante");
      const comportaJTag = tags.find(tag => tag.name === "Eclusa_ComportaJusante");
      const semaforoMTag = tags.find(tag => tag.name === "Eclusa_SemaforoMontante");
      const semaforoJTag = tags.find(tag => tag.name === "Eclusa_SemaforoJusante");

      if (estadoTag) setEstado(Number(estadoTag.value));
      if (nivelTag) setNivelAgua(Number(nivelTag.value));
      if (velocidadeTag) setVelocidade(Number(velocidadeTag.value));
      if (comportaMTag) setComportaMontante(Number(comportaMTag.value));
      if (comportaJTag) setComportaJusante(Number(comportaJTag.value));
      if (semaforoMTag) setSemaforoMontante(Number(semaforoMTag.value));
      if (semaforoJTag) setSemaforoJusante(Number(semaforoJTag.value));

      if (estadoTag && estadoTag.value === 0 && publicidadeTag?.value > 0) {
        setMostrarVideo(true);
      } else {
        setMostrarVideo(false);
      }
      
      if (message.plc && message.plc.last_update) {
        setLastUpdate(message.plc.last_update);
      }
    }
  }, [message]);

  useEffect(() => {
    if (mostrarVideo) {
      const timer = setInterval(() => {
        setVideoAtual(prev => (prev + 1) % videos.length);
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [mostrarVideo]);

  const estadoAtual = ESTADOS_ECLUSA[estado] || ESTADOS_ECLUSA[0];

  return (
    <div className="min-h-screen bg-black">
      {/* Cabeçalho */}
      <div className="bg-blue-900 border-b border-blue-800 p-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-6">
            <Ship className="w-16 h-16 text-white" />
            <span className="text-6xl font-bold text-white tracking-wide">
              ECLUSA POCINHO
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white text-xl">
              <ArrowUpCircle className={`w-8 h-8 ${direcaoFluxo === 'subida' ? 'block' : 'hidden'}`} />
              <ArrowDownCircle className={`w-8 h-8 ${direcaoFluxo === 'descida' ? 'block' : 'hidden'}`} />
              <span>FLUXO: {direcaoFluxo.toUpperCase()}</span>
            </div>
            <div className="text-6xl font-bold text-white tracking-wide flex items-center gap-4">
              <Clock className="w-10 h-10" />
              {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={() => setMostrarVideo(!mostrarVideo)}
              className={`px-4 py-2 rounded-lg font-bold text-lg transition-colors ${
                mostrarVideo 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {mostrarVideo ? 'Parar Publicidade' : 'Exibir Publicidade'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        {mostrarVideo ? (
          // Área de Vídeo
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
            <video
              key={videos[videoAtual]}
              className="w-full h-full object-cover"
              autoPlay
              muted
              onEnded={() => setVideoAtual((prev) => (prev + 1) % videos.length)}
            >
              <source src={videos[videoAtual]} type="video/mp4" />
            </video>
            <div className="absolute top-4 right-4 bg-black/60 px-4 py-2 rounded-full">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          // Painel de Status
          <div className="space-y-8">
            {/* Status Principal */}
            <div className="bg-gray-800 p-10 rounded-lg border border-gray-700 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left">
                  {/* O título utiliza a cor definida para o estado */}
                  <h2 className={`text-7xl font-bold mb-4 tracking-wide ${estadoAtual.cor}`}>
                    {estadoAtual.titulo}
                  </h2>
                  <p className="text-5xl tracking-wide text-white/90">
                    {estadoAtual.mensagem}
                  </p>
                </div>
                <div className="flex gap-8 mt-6 md:mt-0">
                  <div className="text-center">
                    <p className="text-xl text-white mb-2 tracking-wide">MONTANTE</p>
                    <Semaforo status={semaforoMontante} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-white mb-2 tracking-wide">JUSANTE</p>
                    <Semaforo status={semaforoJusante} />
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md text-center">
                <h3 className="text-4xl mb-4 tracking-wide text-white">NÍVEL DA ÁGUA</h3>
                <div className={`text-7xl font-bold tracking-wide ${getNivelColor(nivelAgua)}`}>
                  {nivelAgua.toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md text-center">
                <h3 className="text-4xl mb-4 tracking-wide text-white">VELOCIDADE</h3>
                <div className="text-7xl font-bold tracking-wide text-white">
                  {velocidade.toFixed(1)} M/S
                </div>
                {velocidade > 2.0 && (
                  <div className="mt-4 text-2xl text-red-500 font-bold animate-pulse flex items-center justify-center gap-2">
                    <AlertTriangle className="w-8 h-8" />
                    VELOCIDADE EXCESSIVA
                  </div>
                )}
              </div>

              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md text-center">
                <h3 className="text-4xl mb-4 tracking-wide text-white">STATUS</h3>
                <div className="flex items-center justify-center gap-4">
                  {/* Reduzimos um pouco a fonte para garantir que o texto caiba */}
                  <div className="text-6xl font-bold tracking-wide text-white">
                    OPERACIONAL
                  </div>
                  <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Comportas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md text-center">
                <h3 className="text-4xl mb-4 tracking-wide text-white">COMPORTA MONTANTE</h3>
                <div className="text-7xl font-bold tracking-wide text-white">
                  {comportaMontante.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md text-center">
                <h3 className="text-4xl mb-4 tracking-wide text-white">COMPORTA JUSANTE</h3>
                <div className="text-7xl font-bold tracking-wide text-white">
                  {comportaJusante.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Mensagem de Segurança */}
            <div className="bg-red-900/60 p-8 rounded-lg border border-gray-700 shadow-lg">
              <div className="flex items-center justify-center text-center">
                <span className="text-5xl font-bold tracking-widest text-white">
                  ⚠️ MANTENHA DISTÂNCIA SEGURA DAS PAREDES • UTILIZE EQUIPAMENTOS DE SEGURANÇA • SIGA AS INSTRUÇÕES DA EQUIPE • VELOCIDADE MÁXIMA: 2 M/S
                </span>
              </div>
            </div>

            {/* Rodapé */}
            {lastUpdate && (
              <div className="text-center text-xl text-gray-400 mt-8">
                Última atualização: {new Date(lastUpdate).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelEclusa;
