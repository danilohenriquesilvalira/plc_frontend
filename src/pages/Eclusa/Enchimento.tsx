import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import Valvula from '../../components/eclusa/Valvula';
import ValvulaGaveta from '../../components/eclusa/ValvulaGaveta';
import Motor from '../../components/eclusa/Motor';
import Pistao_Enchimento from '../../components/eclusa/Pistao_Enchimento';
import PipeSystem from '../../components/eclusa/PipeSystem';

const Enchimento: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nivelPistao, setNivelPistao] = useState(0);
  const [motorStatus, setMotorStatus] = useState<0 | 1 | 2>(0);
  const [valvulaStatus, setValvulaStatus] = useState<0 | 1 | 2>(0);
  // Estado para ValvulaGaveta (true = aberta, false = fechada)
  const [valvulaGavetaAberta, setValvulaGavetaAberta] = useState(false);
  
  // Estado para os tubos (0 = inativo, 1 = ativo)
  const [pipeStates, setPipeStates] = useState<{[key: string]: 0 | 1}>({
    pipe1: 0, pipe2: 0, pipe3: 0, pipe4: 0, pipe5: 0, pipe6: 0,
    pipe7: 0, pipe8: 0, pipe9: 0, pipe10: 0, pipe11: 0, pipe12: 0,
    pipe13: 0, pipe14: 0, pipe15: 0, pipe16: 0, pipe17: 0, pipe18: 0,
    pipe19: 0, pipe20: 0, pipe21: 0, pipe22: 0, pipe23: 0, pipe24: 0
  });

  // Atualiza os tubos quando o nível do pistão muda
  useEffect(() => {
    if (nivelPistao > 0) {
      setPipeStates(prev => ({
        ...prev,
        pipe1: 1
      }));
    } else {
      setPipeStates(prev => ({
        ...prev,
        pipe1: 0
      }));
    }
    
    if (nivelPistao > 25) {
      setPipeStates(prev => ({
        ...prev,
        pipe2: 1,
        pipe3: 1
      }));
    } else {
      setPipeStates(prev => ({
        ...prev,
        pipe2: 0,
        pipe3: 0
      }));
    }
    
    if (nivelPistao > 50) {
      setPipeStates(prev => ({
        ...prev,
        pipe4: 1
      }));
    } else {
      setPipeStates(prev => ({
        ...prev,
        pipe4: 0
      }));
    }
    
    if (nivelPistao > 75) {
      setPipeStates(prev => ({
        ...prev,
        pipe5: 1
      }));
    } else {
      setPipeStates(prev => ({
        ...prev,
        pipe5: 0
      }));
    }
  }, [nivelPistao]);

  const handleNivelChange = (value: number) => {
    setNivelPistao(value);
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
          title="Sistema de Enchimento - Monitoramento"
        />
        <main className="flex-1 flex flex-col">
          {/* Layout principal - 3 seções */}
          <div className="flex-1 grid grid-cols-12 gap-4 p-4">
            {/* Área esquerda - Pistão na parte inferior */}
            <div className="col-span-3 flex flex-col">
              <h2 className="text-white font-medium mb-2">Pistão de Enchimento</h2>
              <div className="flex-1 relative flex justify-center items-end">
                {/* Pistão posicionado na parte inferior */}
                <Pistao_Enchimento 
                  nivel={nivelPistao} 
                  width={120} 
                  height={300}
                />
              </div>
            </div>
            
            {/* Área central - Sistema de tubulação */}
            <div className="col-span-6 flex flex-col gap-4">
              <div className="flex-1">
                <h2 className="text-white font-medium mb-2">Sistema de Tubulação</h2>
                <div className="w-full h-full bg-slate-700/30 rounded flex items-center justify-center">
                  <PipeSystem 
                    pipeStates={pipeStates}
                    width={800} 
                    height={300}
                  />
                </div>
              </div>
            </div>
            
            {/* Área direita - Motor e Válvulas */}
            <div className="col-span-3">
              <div className="mb-6">
                <h2 className="text-white font-medium mb-2">Motor</h2>
                <div className="bg-slate-700/30 rounded p-4 flex flex-col items-center">
                  <Motor status={motorStatus} width={120} height={100} />
                  <div className="grid grid-cols-3 gap-1 mt-4 w-full">
                    <button 
                      onClick={() => setMotorStatus(0)} 
                      className={`px-2 py-1 rounded text-xs ${motorStatus === 0 ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Inativo
                    </button>
                    <button 
                      onClick={() => setMotorStatus(1)} 
                      className={`px-2 py-1 rounded text-xs ${motorStatus === 1 ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Operando
                    </button>
                    <button 
                      onClick={() => setMotorStatus(2)} 
                      className={`px-2 py-1 rounded text-xs ${motorStatus === 2 ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Falha
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Válvula original */}
              <div className="mb-6">
                <h2 className="text-white font-medium mb-2">Válvula</h2>
                <div className="bg-slate-700/30 rounded p-4 flex flex-col items-center">
                  <Valvula status={valvulaStatus} width={60} height={60} />
                  <div className="grid grid-cols-3 gap-1 mt-4 w-full">
                    <button 
                      onClick={() => setValvulaStatus(0)} 
                      className={`px-2 py-1 rounded text-xs ${valvulaStatus === 0 ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Inativa
                    </button>
                    <button 
                      onClick={() => setValvulaStatus(1)} 
                      className={`px-2 py-1 rounded text-xs ${valvulaStatus === 1 ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Operando
                    </button>
                    <button 
                      onClick={() => setValvulaStatus(2)} 
                      className={`px-2 py-1 rounded text-xs ${valvulaStatus === 2 ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Falha
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Nova Válvula Gaveta */}
              <div>
                <h2 className="text-white font-medium mb-2">Válvula Gaveta</h2>
                <div className="bg-slate-700/30 rounded p-4 flex flex-col items-center">
                  <div className="transform scale-50 origin-center">
                    <ValvulaGaveta estado={valvulaGavetaAberta} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-4 w-full">
                    <button 
                      onClick={() => setValvulaGavetaAberta(false)} 
                      className={`px-2 py-1 rounded text-xs ${!valvulaGavetaAberta ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Fechada
                    </button>
                    <button 
                      onClick={() => setValvulaGavetaAberta(true)} 
                      className={`px-2 py-1 rounded text-xs ${valvulaGavetaAberta ? 'bg-orange-600 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      Aberta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controles na parte inferior */}
          <div className="p-4 bg-slate-800/40">
            {/* Controle do nível do pistão */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={nivelPistao}
                onChange={(e) => handleNivelChange(Number(e.target.value))}
                className="w-full h-2 rounded appearance-none bg-gray-700"
              />
            </div>
            
            {/* Botões para controle individual de tubos */}
            <div className="grid grid-cols-6 gap-2 mt-4">
              {Object.keys(pipeStates).map((pipeId) => (
                <button
                  key={pipeId}
                  className={`px-4 py-2 rounded text-xs ${pipeStates[pipeId] === 1 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-200'}`}
                  onClick={() => setPipeStates(prev => ({
                    ...prev,
                    [pipeId]: prev[pipeId] === 1 ? 0 : 1
                  }))}
                >
                  {pipeId}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Enchimento;