import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Importando os componentes SVG
import Caldeira from '../../components/eclusa/Caldeira';
import Caldeira1 from '../../components/eclusa/Caldeira1';
import Nivel from '../../components/eclusa/Nivel';
import Semafaro from '../../components/eclusa/semafaro';
import PortaJusante from '../../components/eclusa/PortaJusante';
import PortaMontante from '../../components/eclusa/PortaMontante'; // ✅ Nova porta adicionada

const Eclusa_Regua: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Estado para o nível da água (0-100%)
  const [nivelAgua, setNivelAgua] = useState(30);

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
          title="Eclusa - Monitoramento"
        />
        <main className="flex-1 flex flex-col relative">
          <h2 className="text-white text-2xl mb-4 text-center font-bold">
            Monitoramento da Eclusa
          </h2>
          
          {/* Botões de controle de nível */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setNivelAgua(prev => Math.min(prev + 10, 100))}
              className="px-5 py-2.5 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(to right, #3b82f6, #2563eb)', 
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                border: '1px solid rgba(59, 130, 246, 0.6)'
              }}
            >
              Aumentar Nível
            </button>
            <button
              onClick={() => setNivelAgua(prev => Math.max(prev - 10, 0))}
              className="px-5 py-2.5 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(to right, #0ea5e9, #0284c7)',
                boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.4)',
                border: '1px solid rgba(14, 165, 233, 0.6)'
              }}
            >
              Diminuir Nível
            </button>
          </div>
          
          {/* Container dos SVGs da Eclusa */}
          <div className="relative w-full flex justify-center flex-1">
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              {/* Componente Caldeira1 - Parte superior */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Caldeira1 />
              </div>
              
              {/* Componente Caldeira - Parte inferior */}
              <div style={{ position: 'relative', marginTop: '-299px', zIndex: 1 }}>
                <Caldeira />
              </div>
              
              {/* Componente Nivel */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '43%', 
                  left: '50%', 
                  transform: 'translate(-50%, -35%)', 
                  zIndex: 2 
                }}
              >
                <Nivel nivel={nivelAgua} />
              </div>
            </div>
          </div>

          {/* Exemplo de múltiplos Semáfaros com posicionamento individual */}
          <div 
            className="absolute"
            style={{ top: '20%', left: '15%' }} // Semafaro 1
          >
            <Semafaro />
          </div>
          <div 
            className="absolute"
            style={{ top: '20%', left: '35%' }} // Semafaro 2
          >
            <Semafaro />
          </div>
          <div 
            className="absolute"
            style={{ top: '20%', left: '55%' }} // Semafaro 3
          >
            <Semafaro />
          </div>

          {/* Chamando o componente da Porta Jusante */}
          <div 
            className="absolute"
            style={{ top: '10%', left: '80%' }} // Ajuste conforme necessário
          >
            <PortaJusante />
          </div>

          {/* Chamando o componente da Porta Montante */}
          <div 
            className="absolute"
            style={{ top: '10%', left: '70%' }} // Ajuste conforme necessário
          >
            <PortaMontante />
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default Eclusa_Regua;