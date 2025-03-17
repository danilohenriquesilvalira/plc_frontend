import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
// Importando o SVG da estrutura da porta jusante
import EstruturaPortaJusanteSVG from '../../assets/Eclusa/Estrutura_Porta_Jusante.svg';
// Importando o componente da porta jusante régua
import PortaJusanteRegua from '../../components/eclusa/PortaJusanteRegua';
// Importando o componente do contrapeso
import ContraPeso from '../../components/eclusa/ContraPeso';
// Importando o componente do motor
import MotorMontante from '../../components/eclusa/Motor_Montante';

const PortaJusante: React.FC = () => {
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado para os motores (0 = inativo, 1 = operando, 2 = falha)
  const [motoresStatus, setMotoresStatus] = useState<{ motor1: 0 | 1 | 2; motor2: 0 | 1 | 2 }>({
    motor1: 1,
    motor2: 1
  });
  
  // Estados para WebSocket
  const [contraPesoEsquerda, setContraPesoEsquerda] = useState<number>(50);
  const [contraPesoDireita, setContraPesoDireita] = useState<number>(50);
  const [portaJusanteAbertura, setPortaJusanteAbertura] = useState<number>(0);

  // Esta função será chamada quando a tela for redimensionada
  const handleResize = () => {
    if (containerRef.current) {
      // Base width do SVG original é 789px
      const baseWidth = 789;
      const containerWidth = containerRef.current.clientWidth;
      
      // Calculamos a escala com base na largura disponível
      let newScale = Math.max(0.5, Math.min(0.95, containerWidth / baseWidth));
      
      // Em telas menores, reduzimos ainda mais a escala se necessário
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
    
    // Limpeza do event listener quando o componente é desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // WebSocket
  useEffect(() => {
    if (message && message.tags) {
      // Motores
      const motorEsquerdaTag = message.tags.find((tag: any) => tag.name === "Motor_Esquerda_Jusante");
      const motorDireitaTag = message.tags.find((tag: any) => tag.name === "Motor_Direita_Jusante");
      
      if (motorEsquerdaTag !== undefined) {
        console.log('Motor Esquerda Jusante:', motorEsquerdaTag.value);
        setMotoresStatus(prev => ({ 
          ...prev, 
          motor1: Number(motorEsquerdaTag.value) as 0 | 1 | 2 
        }));
      }
      
      if (motorDireitaTag !== undefined) {
        console.log('Motor Direita Jusante:', motorDireitaTag.value);
        setMotoresStatus(prev => ({ 
          ...prev, 
          motor2: Number(motorDireitaTag.value) as 0 | 1 | 2 
        }));
      }
      
      // Contrapesos
      const contraPesoEsquerdaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Esquerda_Jusante");
      const contraPesoDireitaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Direita_Jusante");
      
      if (contraPesoEsquerdaTag !== undefined) {
        console.log('Contrapeso Esquerda Jusante:', contraPesoEsquerdaTag.value);
        setContraPesoEsquerda(Number(contraPesoEsquerdaTag.value));
      }
      
      if (contraPesoDireitaTag !== undefined) {
        console.log('Contrapeso Direita Jusante:', contraPesoDireitaTag.value);
        setContraPesoDireita(Number(contraPesoDireitaTag.value));
      }
      
      // Porta
      const portaJusanteTag = message.tags.find((tag: any) => tag.name === "Porta_Jusante");
      
      if (portaJusanteTag !== undefined) {
        console.log('Porta Jusante:', portaJusanteTag.value);
        setPortaJusanteAbertura(Number(portaJusanteTag.value));
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
          title="Porta Jusante - Monitoramento"
        />
        <main 
          ref={containerRef}
          className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-2 pt-0"
        >
          {/* Container principal para a visualização com escala responsiva */}
          <div
            className="relative mt-0"
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: 'center top',
              width: '789px',
              height: '830px',
              maxWidth: '100%'
            }}
          >
            {/* SVG da estrutura da porta jusante como fundo */}
            <img
              src={EstruturaPortaJusanteSVG}
              alt="Estrutura da Porta Jusante"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: -1,
                zIndex: 1
              }}
            />
            
            {/* Posicionando a Porta Jusante Régua na posição correta sobre a estrutura */}
            <div
              style={{
                position: 'absolute',
                top: '450px',
                left: '177px',
                zIndex: 2
              }}
            >
              <PortaJusanteRegua abertura={portaJusanteAbertura} />
            </div>
            
            {/* Contrapeso Esquerdo */}
            <div
              style={{
                position: 'absolute',
                top: '431px',
                left: '-3px',
                zIndex: 2,
                transform: 'scale(1.3)'
              }}
            >
              <ContraPeso nivel={contraPesoEsquerda} />
            </div>
            
            {/* Contrapeso Direito */}
            <div
              style={{
                position: 'absolute',
                top: '431px',
                right: '-8px',
                zIndex: 3,
                transform: 'scale(1.3)'
              }}
            >
              <ContraPeso nivel={contraPesoDireita} />
            </div>
            
            {/* Motor Montante Esquerdo */}
            <div 
              className="absolute" 
              style={{ left: '5px', top: '25px', transform: 'scale(1.5) scaleX(-1)', zIndex: 3 }}
            >
              <MotorMontante status={motoresStatus.motor1} />
            </div>
            
            {/* Motor Montante Direito */}
            <div 
              className="absolute" 
              style={{ right: '5px', top: '25px', transform: 'scale(1.5)', zIndex: 3 }}
            >
              <MotorMontante status={motoresStatus.motor2} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaJusante;