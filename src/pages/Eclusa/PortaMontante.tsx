import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
// Importando os componentes utilizados
import ContraPeso_Montante from '../../components/eclusa/ContraPeso_Montante';
import PortaMontanteRegua from '../../components/eclusa/PortaMontanteRegua';
import MotorMontante from '../../components/eclusa/Motor_Montante'; // Import do Motor_Montante
// Importando o SVG da estrutura da porta
import EstruturaPortaMontanteReguaSVG from '../../assets/Eclusa/Estrutura_Porta_Montante_Regua.svg';

const PortaMontante: React.FC = () => {
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scale, setScale] = useState(1); // Fator de escala para responsividade
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado para os motores (0 = inativo, 1 = operando, 2 = falha)
  const [motoresStatus, setMotoresStatus] = useState<{ motor1: 0 | 1 | 2; motor2: 0 | 1 | 2 }>({
    motor1: 1,
    motor2: 1
  });
  
  // Estados para WebSocket
  const [contraPesoEsquerda, setContraPesoEsquerda] = useState<number>(50);
  const [contraPesoDireita, setContraPesoDireita] = useState<number>(50);
  const [portaMontanteAbertura, setPortaMontanteAbertura] = useState<number>(0);

  // Esta função será chamada quando a tela for redimensionada
  const handleResize = () => {
    if (containerRef.current) {
      // Base width do SVG original é 844px
      const baseWidth = 844;
      const containerWidth = containerRef.current.clientWidth;
      
      // Calcula a escala com base na largura disponível,
      // limitando a escala mínima para 0.5 e máxima para 1.2
      let newScale = Math.max(0.5, Math.min(1.2, containerWidth / baseWidth));
      
      // Em telas menores, reduz ainda mais a escala se necessário
      if (containerWidth < 576) {
        newScale = Math.max(0.4, newScale * 0.8);
      }
      
      setScale(newScale);
    }
  };

  useEffect(() => {
    // Inicializa a escala quando o componente é montado
    handleResize();
    // Adiciona event listener para redimensionamento
    window.addEventListener('resize', handleResize);
    // Remove o event listener quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // WebSocket
  useEffect(() => {
    if (message && message.tags) {
      // Motores
      const motorEsquerdaTag = message.tags.find((tag: any) => tag.name === "Motor_Esquerda_Montante");
      const motorDireitaTag = message.tags.find((tag: any) => tag.name === "Motor_Direita_Montante");
      
      if (motorEsquerdaTag !== undefined) {
        console.log('Motor Esquerda Montante:', motorEsquerdaTag.value);
        setMotoresStatus(prev => ({ 
          ...prev, 
          motor1: Number(motorEsquerdaTag.value) as 0 | 1 | 2 
        }));
      }
      
      if (motorDireitaTag !== undefined) {
        console.log('Motor Direita Montante:', motorDireitaTag.value);
        setMotoresStatus(prev => ({ 
          ...prev, 
          motor2: Number(motorDireitaTag.value) as 0 | 1 | 2 
        }));
      }
      
      // Contrapesos
      const contraPesoEsquerdaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Esquerda");
      const contraPesoDireitaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Direita");
      
      if (contraPesoEsquerdaTag !== undefined) {
        console.log('Contrapeso Esquerda:', contraPesoEsquerdaTag.value);
        setContraPesoEsquerda(Number(contraPesoEsquerdaTag.value));
      }
      
      if (contraPesoDireitaTag !== undefined) {
        console.log('Contrapeso Direita:', contraPesoDireitaTag.value);
        setContraPesoDireita(Number(contraPesoDireitaTag.value));
      }
      
      // Porta
      const portaMontanteTag = message.tags.find((tag: any) => tag.name === "Porta_Montante");
      
      if (portaMontanteTag !== undefined) {
        console.log('Porta Montante:', portaMontanteTag.value);
        setPortaMontanteAbertura(Number(portaMontanteTag.value));
      }
    }
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#3B3838' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Porta Montante - Monitoramento"
        />
        <main 
          ref={containerRef}
          className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-2"
        >
          {/* Container para SVGs com escala aplicada */}
          <div 
            className="relative" 
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              width: '844px',
              height: '739px',
              maxWidth: '100%'
            }}
          >
            {/* SVG da Estrutura da Porta */}
            <div className="absolute inset-0 flex justify-center items-center">
              <img
                src={EstruturaPortaMontanteReguaSVG}
                alt="Estrutura da Porta Montante Régua"
                style={{ width: '844px', height: '739px' }}
                className="max-w-full"
              />
            </div>
            {/* Porta Montante (SVG com movimento) */}
            <div
              className="absolute"
              style={{
                left: '49.8%',
                top: '192px',
                transform: `translateX(-50%)`,
              }}
            >
              <PortaMontanteRegua abertura={portaMontanteAbertura} />
            </div>
            {/* ContraPeso Montante Esquerdo */}
            <div
              className="absolute"
              style={{
                left: '41.5%',
                top: '170px',
                transform: `translateX(calc(-50% - 296px))`,
              }}
            >
              <ContraPeso_Montante nivel={contraPesoEsquerda} />
            </div>
            {/* ContraPeso Montante Direito */}
            <div
              className="absolute"
              style={{
                left: '41.5%',
                top: '170px',
                transform: `translateX(calc(-50% + 437px))`,
              }}
            >
              <ContraPeso_Montante nivel={contraPesoDireita} />
            </div>
            {/* Motor Montante Esquerdo */}
            <div 
              className="absolute" 
              style={{ left: '3px', top: '50px', transform: 'scale(1.5) scaleX(-1)' }}
            >
              <MotorMontante status={motoresStatus.motor1} />
            </div>
            {/* Motor Montante Direito */}
            <div 
              className="absolute" 
              style={{ right: '0px', top: '50px', transform: 'scale(1.5)' }}
            >
              <MotorMontante status={motoresStatus.motor2} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaMontante;