import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Importando o componente do contrapeso montante
import ContraPeso_Montante from '../../components/eclusa/ContraPeso_Montante';

const PortaMontante: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [abertura, setAbertura] = useState(0);

  const handleAberturaChange = (value: number) => {
    setAbertura(value);
  };

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
          title="Porta Montante - Monitoramento"
        />
        <main className="flex-1 flex flex-col relative">
          <h2 className="text-white text-2xl mb-4 text-center font-bold">
            Monitoramento da Porta Montante
          </h2>
          
          {/* Container principal para a visualização */}
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="relative w-full max-w-4xl h-[600px]">
              {/* Área central para a porta montante (futura implementação) */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          border-2 border-gray-700 bg-gray-600/30 p-4 rounded-md"
                style={{ width: '400px', height: '300px' }}
              >
                <div className="text-white text-center">
                  <p className="text-xl mb-4">Porta Montante</p>
                  <p className="text-sm opacity-70">A visualização da porta será implementada em breve</p>
                </div>
              </div>
              
              {/* Contrapeso Esquerdo */}
              <div className="absolute left-0 top-10">
                <ContraPeso_Montante lado="esquerdo" />
              </div>
              
              {/* Contrapeso Direito */}
              <div className="absolute right-0 top-10">
                <ContraPeso_Montante lado="direito" />
              </div>
              
              {/* Slider global de abertura (opcional) */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                            bg-slate-800/90 px-6 py-3 rounded-lg flex items-center gap-4">
                <span className="text-white font-bold">Abertura Global</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={abertura}
                  onChange={(e) => handleAberturaChange(Number(e.target.value))}
                  className="cursor-pointer h-2 w-40 rounded-lg appearance-none bg-gray-700"
                />
                <span className="text-white font-bold">{abertura}%</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortaMontante;