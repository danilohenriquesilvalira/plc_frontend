import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Importando o SVG da estrutura da porta jusante
import EstruturaPortaJusanteSVG from '../../assets/eclusa/Estrutura_Porta_Jusante.svg';

// Importando o componente da porta jusante régua
import PortaJusanteRegua from '../../components/eclusa/PortaJusanteRegua';

// Importando o componente do contrapeso
import ContraPeso from '../../components/eclusa/ContraPeso';

const PortaJusante: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950">
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
        <main className="flex-1 flex flex-col relative">
          <h2 className="text-white text-2xl mb-4 text-center font-bold">
            Monitoramento da Porta Jusante
          </h2>
          
          {/* Container principal para a visualização */}
          <div className="flex justify-center items-center flex-1">
            <div
              style={{
                width: '789px',
                height: '830px',
                position: 'relative',
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
                  left: 0,
                  zIndex: 1
                }}
              />
              
              {/* Posicionando a Porta Jusante Régua na posição correta sobre a estrutura */}
              <div
                style={{
                  position: 'absolute',
                  top: '450px',  // Ajustado para posicionar melhor baseado na sua screenshot
                  left: '177px', // Ajuste conforme necessário para centralizar na estrutura
                  zIndex: 2
                }}
              >
                <PortaJusanteRegua />
              </div>
              
              {/* Contrapeso Esquerdo - Apenas com tamanho aumentado */}
              <div
                style={{
                  position: 'absolute',
                  top: '431px',
                  left: '18px',
                  zIndex: 2,
                  transform: 'scale(1.3)' // Apenas aumentando o tamanho do contrapeso
                }}
              >
                <ContraPeso />
              </div>
              
              {/* Contrapeso Direito - Apenas com tamanho aumentado */}
              <div
                style={{
                  position: 'absolute',
                  top: '431px',
                  right: '-176px',
                  zIndex: 3,
                  transform: 'scale(1.3)' // Apenas aumentando o tamanho do contrapeso
                }}
              >
                <ContraPeso />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaJusante;