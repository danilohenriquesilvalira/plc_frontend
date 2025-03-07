import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
// Importando os componentes
import ContraPeso_Montante from '../../components/eclusa/ContraPeso_Montante';
import PortaMontanteRegua from '../../components/eclusa/PortaMontanteRegua';
// Importando o SVG da estrutura da porta
import EstruturaPortaMontanteReguaSVG from '../../assets/Eclusa/Estrutura_Porta_Montante_Regua.svg';

const PortaMontante: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [abertura, setAbertura] = useState(0); // Controle de abertura
  const [scale, setScale] = useState(1); // Fator de escala para responsividade
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Esta função será chamada quando a tela for redimensionada
  const handleResize = () => {
    if (containerRef.current) {
      // Base width do SVG original é 844px
      const baseWidth = 844;
      const containerWidth = containerRef.current.clientWidth;
      
      // Calculamos a escala com base na largura disponível
      // Limitamos a escala mínima para 0.5 e máxima para 1.2
      let newScale = Math.max(0.5, Math.min(1.2, containerWidth / baseWidth));
      
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
            {/* Porta Montante (SVG com movimento) - em posição fixa */}
            <div
              className="absolute"
              style={{
                left: '49.8%',
                top: '192px',
                transform: `translateX(-50%)`,
              }}
            >
              <PortaMontanteRegua />
            </div>
            {/* Contrapeso Montante Esquerdo */}
            <div
              className="absolute"
              style={{
                left: '53.8%',
                top: '170px',
                transform: `translateX(calc(-50% - 296px))`,
              }}
            >
              <ContraPeso_Montante />
            </div>
            {/* Contrapeso Montante Direito */}
            <div
              className="absolute"
              style={{
                left: '53.8%',
                top: '170px',
                transform: `translateX(calc(-50% + 437px))`,
              }}
            >
              <ContraPeso_Montante />
            </div>
          </div>

          {/* Controle deslizante de abertura - fora do container escalável */}

        </main>
      </div>
    </div>
  );
};

export default PortaMontante;