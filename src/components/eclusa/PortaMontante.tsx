import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
// Importando os componentes utilizados
import ContraPeso_Montante from '../../components/eclusa/ContraPeso_Montante';
import PortaMontanteRegua from '../../components/eclusa/PortaMontanteRegua';
import MotorMontante from '../../components/eclusa/Motor_Montante'; // Componente com o SVG customizado
// Importando o SVG da estrutura da porta
import EstruturaPortaMontanteReguaSVG from '../../assets/Eclusa/Estrutura_Porta_Montante_Regua.svg';

const PortaMontante: React.FC = () => {
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [abertura, setAbertura] = useState(0); // Controle de abertura (se necessário)
  const [scale, setScale] = useState(1); // Fator de escala para responsividade
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados para os motores (0 = inativo, 1 = operando, 2 = falha)
  const [motoresStatus, setMotoresStatus] = useState<{ motor1: 0 | 1 | 2; motor2: 0 | 1 | 2 }>({
    motor1: 1,
    motor2: 1
  });

  // Estados para os contrapesos (supondo a mesma escala de status dos motores)
  const [contraPesoEsquerda, setContraPesoEsquerda] = useState<0 | 1 | 2>(1);
  const [contraPesoDireita, setContraPesoDireita] = useState<0 | 1 | 2>(1);

  // Estado para o status da porta montante (por exemplo, 0 = fechada, 1 = aberta, 2 = em transição)
  const [portaMontanteStatus, setPortaMontanteStatus] = useState<0 | 1 | 2>(1);

  // Esta função ajusta a escala com base no tamanho do container
  const handleResize = () => {
    if (containerRef.current) {
      // Base width do SVG original é 844px
      const baseWidth = 844;
      const containerWidth = containerRef.current.clientWidth;
      // Calcula a escala com base na largura disponível, limitando entre 0.5 e 1.2
      let newScale = Math.max(0.5, Math.min(1.2, containerWidth / baseWidth));
      // Em telas menores, reduz ainda mais a escala se necessário
      if (containerWidth < 576) {
        newScale = Math.max(0.4, newScale * 0.8);
      }
      setScale(newScale);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Atualiza os estados a partir dos tags recebidos via WebSocket
  useEffect(() => {
    if (message && message.tags) {
      // Atualiza motores
      const motorEsquerdaTag = message.tags.find((tag: any) => tag.name === "Motor_Esquerda");
      const motorDireitaTag = message.tags.find((tag: any) => tag.name === "Motor_Direita");
      if (motorEsquerdaTag) {
        setMotoresStatus(prev => ({ ...prev, motor1: Number(motorEsquerdaTag.value) as 0 | 1 | 2 }));
      }
      if (motorDireitaTag) {
        setMotoresStatus(prev => ({ ...prev, motor2: Number(motorDireitaTag.value) as 0 | 1 | 2 }));
      }
      // Atualiza contrapesos
      const contraPesoEsquerdaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Esquerda");
      const contraPesoDireitaTag = message.tags.find((tag: any) => tag.name === "Contra_Peso_Direita");
      if (contraPesoEsquerdaTag) {
        setContraPesoEsquerda(Number(contraPesoEsquerdaTag.value) as 0 | 1 | 2);
      }
      if (contraPesoDireitaTag) {
        setContraPesoDireita(Number(contraPesoDireitaTag.value) as 0 | 1 | 2);
      }
      // Atualiza status da porta montante
      const portaMontanteTag = message.tags.find((tag: any) => tag.name === "Porta_Montante");
      if (portaMontanteTag) {
        setPortaMontanteStatus(Number(portaMontanteTag.value) as 0 | 1 | 2);
      }
    }
  }, [message]);

  const handleAberturaChange = (value: number) => {
    setAbertura(value);
  };

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
            {/* Porta Montante (SVG com movimento) – passando o status recebido */}
            <div
              className="absolute"
              style={{
                left: '49.8%',
                top: '192px',
                transform: `translateX(-50%)`,
              }}
            >
              <PortaMontanteRegua status={portaMontanteStatus} />
            </div>
            {/* ContraPeso Montante Esquerdo – passando o status via WebSocket */}
            <div
              className="absolute"
              style={{
                left: '53.8%',
                top: '170px',
                transform: `translateX(calc(-50% - 296px))`,
              }}
            >
              <ContraPeso_Montante status={contraPesoEsquerda} />
            </div>
            {/* ContraPeso Montante Direito – passando o status via WebSocket */}
            <div
              className="absolute"
              style={{
                left: '53.8%',
                top: '170px',
                transform: `translateX(calc(-50% + 437px))`,
              }}
            >
              <ContraPeso_Montante status={contraPesoDireita} />
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
          {/* Aqui você pode incluir um controle deslizante para alterar a abertura, se necessário */}
        </main>
      </div>
    </div>
  );
};

export default PortaMontante;
