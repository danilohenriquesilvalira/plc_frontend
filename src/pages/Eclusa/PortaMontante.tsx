import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Importando os componentes
import ContraPeso_Montante from '../../components/eclusa/ContraPeso_Montante';
import PortaMontanteRegua from '../../components/eclusa/PortaMontanteRegua';

// Importando o SVG da estrutura da porta
import EstruturaPortaMontanteReguaSVG from '../../assets/eclusa/Estrutura_Porta_Montante_Regua.svg';

const PortaMontante: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [abertura, setAbertura] = useState(0); // Controle de abertura

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
        <main className="flex-1 flex flex-col justify-center items-center relative">
          {/* SVG da Estrutura da Porta */}
          <div className="absolute">
            <img 
              src={EstruturaPortaMontanteReguaSVG} 
              alt="Estrutura da Porta Montante Régua" 
              style={{ width: '844px', height: '739px' }} 
            />
          </div>

          {/* Porta Montante (SVG com movimento) - em posição fixa */}
          <div 
            className="absolute" 
            style={{ 
              transform: `translate(-2px, 108px)`,
            }}
          >
            <PortaMontanteRegua />
          </div>

          {/* Contrapeso Montante Esquerdo */}
          <div 
            className="absolute" 
            style={{ 
              transform: `translate(-296px, 60px)`,
            }}
          >
            <ContraPeso_Montante />
          </div>

          {/* Contrapeso Montante Direito */}
          <div 
            className="absolute" 
            style={{ 
              transform: `translate(437px, 60px)`,
            }}
          >
            <ContraPeso_Montante />
          </div>

          {/* Controle deslizante de abertura */}
          <div className="absolute bottom-2 bg-slate-800/90 px-6 py-3 rounded-lg flex items-center gap-4">
            <span className="text-white font-bold">Fechada</span>
            <input
              type="range"
              min="0"
              max="100"
              value={abertura}
              onChange={(e) => handleAberturaChange(Number(e.target.value))}
              className="cursor-pointer h-2 w-40 rounded-lg appearance-none bg-gray-700"
            />
            <span className="text-white font-bold">Aberta</span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaMontante;