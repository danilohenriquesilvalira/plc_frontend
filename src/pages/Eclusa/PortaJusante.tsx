import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
// Importando o SVG da estrutura da porta jusante
import EstruturaPortaJusanteSVG from '../../assets/Eclusa/Estrutura_Porta_Jusante.svg';
// Importando o componente da porta jusante régua
import PortaJusanteRegua from '../../components/eclusa/PortaJusanteRegua';
// Importando o componente do contrapeso
import ContraPeso from '../../components/eclusa/ContraPeso';

const PortaJusante: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

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
          {/* Removido o título duplicado "Monitoramento da Porta Jusante" */}
          
          {/* Container principal para a visualização com escala responsiva */}
          <div
            className="relative mt-0"
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: 'center top', // Alterado para 'top' para que o conteúdo suba
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
              <PortaJusanteRegua />
            </div>
            
            {/* Contrapeso Esquerdo */}
            <div
              style={{
                position: 'absolute',
                top: '431px',
                left: '28px',
                zIndex: 2,
                transform: 'scale(1.3)'
              }}
            >
              <ContraPeso />
            </div>
            
            {/* Contrapeso Direito */}
            <div
              style={{
                position: 'absolute',
                top: '431px',
                right: '-246px',
                zIndex: 3,
                transform: 'scale(1.3)'
              }}
            >
              <ContraPeso />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaJusante;