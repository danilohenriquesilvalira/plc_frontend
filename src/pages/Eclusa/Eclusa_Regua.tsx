import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Importando os componentes animados
import Nivel from '../../components/eclusa/Nivel';
import Semafaro from '../../components/eclusa/Semafaro';
import PortaJusante from '../../components/eclusa/PortaJusante';
import PortaMontante from '../../components/eclusa/PortaMontante';

// Importando os SVGs estáticos diretamente
import CaldeiraSVG from '../../assets/Eclusa/Caldeira.svg';
import Caldeira1SVG from '../../assets/Eclusa/Caldeira1.svg';

const Eclusa_Regua: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Estado para o nível da água (0-100%)
  const [nivelAgua, setNivelAgua] = useState(30);
  
  // Estado para controlar a abertura da porta jusante nova
  const [portaJusanteAberta, setPortaJusanteAberta] = useState(false);

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
          
          {/* Botão para controlar a porta jusante nova */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setPortaJusanteAberta(!portaJusanteAberta)}
              className="px-5 py-2.5 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: portaJusanteAberta 
                  ? 'linear-gradient(to right, #16a34a, #15803d)' 
                  : 'linear-gradient(to right, #dc2626, #b91c1c)',
                boxShadow: portaJusanteAberta 
                  ? '0 4px 6px -1px rgba(22, 163, 74, 0.4)' 
                  : '0 4px 6px -1px rgba(220, 38, 38, 0.4)',
                border: portaJusanteAberta 
                  ? '1px solid rgba(22, 163, 74, 0.6)' 
                  : '1px solid rgba(220, 38, 38, 0.6)'
              }}
            >
              {portaJusanteAberta ? 'Fechar Porta Jusante' : 'Abrir Porta Jusante'}
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
              {/* Caldeira1 - Parte superior - AGORA COMO IMAGEM DIRETA */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <img
                  src={Caldeira1SVG}
                  alt="Caldeira Superior"
                  style={{
                    width: '1672px',
                    height: '429px',
                  }}
                  loading="eager" // Prioriza carregamento
                />
              </div>
              
              {/* Caldeira - Parte inferior - AGORA COMO IMAGEM DIRETA */}
              <div style={{ position: 'relative', marginTop: '-299px', zIndex: 1 }}>
                <img
                  src={CaldeiraSVG}
                  alt="Caldeira Inferior"
                  style={{
                    width: '1676px',
                    height: '420px',
                  }}
                  loading="eager" // Prioriza carregamento
                />
              </div>
              
              {/* Componente Nivel */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '39.2%', 
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
            style={{ top: '20%', left: '15%', zIndex: 3 }}
          >
            <Semafaro />
          </div>
          <div 
            className="absolute"
            style={{ top: '20%', left: '35%', zIndex: 3 }}
          >
            <Semafaro />
          </div>
          <div 
            className="absolute"
            style={{ top: '20%', left: '55%', zIndex: 3 }}
          >
            <Semafaro />
          </div>

          {/* Porta Jusante */}
          <div 
            className="absolute"
            style={{ 
              top: '55%', 
              left: '65%', 
              zIndex: 10
            }}
          >
            <PortaJusante />
          </div>

          {/* Porta Montante */}
          <div 
            className="absolute"
            style={{ 
              top: '34.5%', 
              left: '31%', 
              zIndex: 10
            }}
          >
            <PortaMontante />
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default Eclusa_Regua;