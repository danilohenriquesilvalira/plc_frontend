import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import Valvula from '../../components/eclusa/Valvula';
import Motor from '../../components/eclusa/motor';
import Pistao_Enchimento from '../../components/eclusa/Pistao_Enchimento';
import PipeSystem from '../../components/eclusa/PipeSystem';
import ValvulaDirecional from '../../components/eclusa/ValvulaDirecional';

const Enchimento: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nivelPistao, setNivelPistao] = useState(0);
  const [motorStatus, setMotorStatus] = useState<0 | 1 | 2>(0);
  const [valvulaStatus, setValvulaStatus] = useState<0 | 1 | 2>(0);
  
  // Estado para válvula direcional
  const [valvulaPosition, setValvulaPosition] = useState<0 | 1 | 2>(0);
  const [solenoidStatus, setSolenoidStatus] = useState<0 | 1 | 2>(0);

  // Estado para os tubos (0 = inativo, 1 = ativo)
  const [pipeStates, setPipeStates] = useState<{[key: string]: 0 | 1}>({
    pipe1: 0,
    pipe2: 0,
    pipe3: 0,
    pipe4: 0,
    pipe5: 0
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

  // Controle da válvula direcional
  const handleValvulaDirecional = (solenoid: 0 | 1 | 2) => {
    setSolenoidStatus(solenoid);
    
    setTimeout(() => {
      setValvulaPosition(solenoid);
      
      // Ajustar o nível do pistão baseado na posição da válvula
      if (solenoid === 1) {
        // Posição A - encher
        if (motorStatus === 1) {
          setNivelPistao(prev => Math.min(100, prev + 10));
        }
      } else if (solenoid === 2) {
        // Posição B - esvaziar
        if (motorStatus === 1) {
          setNivelPistao(prev => Math.max(0, prev - 10));
        }
      }
    }, 300);
  };

  const handleNivelChange = (value: number) => {
    setNivelPistao(value);
  };

  // Definição dos segmentos de tubulação
  const pipeSegments = [
    {
      id: "pipe1",
      path: "M 50 150 L 150 150",
      status: pipeStates.pipe1,
      strokeWidth: 8
    },
    {
      id: "pipe2",
      path: "M 150 150 L 150 100 L 250 100",
      status: pipeStates.pipe2,
      strokeWidth: 8
    },
    {
      id: "pipe3",
      path: "M 150 150 L 150 200 L 250 200",
      status: pipeStates.pipe3,
      strokeWidth: 8
    },
    {
      id: "pipe4",
      path: "M 250 100 L 350 100 L 350 150",
      status: pipeStates.pipe4,
      strokeWidth: 8
    },
    {
      id: "pipe5",
      path: "M 250 200 L 350 200 L 350 150",
      status: pipeStates.pipe5,
      strokeWidth: 8
    }
  ];

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
            
            {/* Área central - Sistema de tubulação e válvula direcional */}
            <div className="col-span-6 flex flex-col gap-4">
              <div>
                <h2 className="text-white font-medium mb-2">Válvula Direcional</h2>
                <div className="w-full bg-slate-700/30 rounded flex items-center justify-center p-2">
                  <ValvulaDirecional 
                    position={valvulaPosition}
                    solenoidStatus={solenoidStatus}
                    width={300}
                    height={120}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-white font-medium mb-2">Sistema de Tubulação</h2>
                <div className="w-full h-full bg-slate-700/30 rounded flex items-center justify-center">
                  <PipeSystem 
                    pipeStates={pipeStates}
                    segments={pipeSegments}
                    width={400} 
                    height={200}
                  />
                </div>
              </div>
            </div>
            
            {/* Área direita - Motor e Válvula */}
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
              
              <div>
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
            </div>
          </div>
          
          {/* Controles simples na parte inferior */}
          <div className="p-4 bg-slate-800/40 grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleValvulaDirecional(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
            >
              Encher
            </button>
            
            <button 
              onClick={() => handleValvulaDirecional(0)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded"
            >
              Parar
            </button>
            
            <button 
              onClick={() => handleValvulaDirecional(2)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
            >
              Esvaziar
            </button>
            
            <input
              type="range"
              min="0"
              max="100"
              value={nivelPistao}
              onChange={(e) => handleNivelChange(Number(e.target.value))}
              className="col-span-4 h-2 rounded appearance-none bg-gray-700"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Enchimento;