// pages/Hmi/HMIPage.tsx 
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import TransportSystem from '../../components/hmi/TransportSystem';
import ParameterControls from '../../components/hmi/ParameterControls';

// Importando os SVGs de status
import Ciclo_Inicializado from '../../assets/hmi/status/Ciclo_Inicializado.svg';
import Sensor1_Detectado from '../../assets/hmi/status/Sensor1_Detectado.svg';
import Sensor2_Detectado from '../../assets/hmi/status/Sensor2_Detectado.svg';
import Sensor3_Detectado from '../../assets/hmi/status/Sensor1_Detectado.svg'; // Usando o mesmo SVG por enquanto

// Estados possíveis para um palete
type PalletState = {
  id: number;
  position: number; // Posição em pixels
  state: "entering" | "atSensor1" | "movingToSensor2" | "atSensor2" | "exiting" | "exited";
  stateStartTime: number; // Timestamp de quando entrou no estado atual
};

const HMIPage: React.FC = () => {
  const { logout } = useAuth();

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Parâmetros ajustáveis
  const [transportSpeed, setTransportSpeed] = useState(2);
  const [customMoveDuration, setCustomMoveDuration] = useState(5000);
  const [customWaitDuration, setCustomWaitDuration] = useState(3000);

  // Diálogo de parâmetros
  const [showDialog, setShowDialog] = useState(false);
  // Variável para armazenar o ID do motor clicado (caso você queira modificar parâmetros específicos)
  const [selectedMotorId, setSelectedMotorId] = useState<number | null>(null);

  // Controle do ciclo
  const [isCycleRunning, setIsCycleRunning] = useState(false);

  // Paletes no sistema
  const [pallets, setPallets] = useState<PalletState[]>([]);
  
  // Flags para controlar a sequência
  const [canReleasePallet2, setCanReleasePallet2] = useState(false);
  const [canReleasePallet3, setCanReleasePallet3] = useState(false);
  
  // Contador de paletes
  const nextPalletId = useRef(1);
  const totalPalletsCreated = useRef(0);
  const [palletCounter, setPalletCounter] = useState(0);

  // Posições fixas (em px) - Ajustadas para a direita
  const offsetX = 150; // Deslocamento geral para a direita
  const entryPoint = 0 + offsetX;
  const sensor1Pos = 400 + offsetX;
  const sensor2Pos = 800 + offsetX;
  const sensor3Pos = 1200 + offsetX; // Posição do novo sensor 3
  const exitPoint = 1600 + offsetX; // Ajustado para acomodar o terceiro transportador
  
  // Tamanho do palete (para garantir distância)
  const palletWidth = 200;

  // Função para iniciar o ciclo
  const startCycle = () => {
    setIsCycleRunning(true);
    const now = Date.now();
    
    // Adiciona o primeiro palete ao iniciar o ciclo
    if (pallets.length === 0) {
      const newPallet = {
        id: nextPalletId.current++,
        position: entryPoint,
        state: "entering" as const,
        stateStartTime: now
      };
      
      setPallets([newPallet]);
      totalPalletsCreated.current++;
      setPalletCounter(totalPalletsCreated.current);
    }
  };

  // Função para reiniciar o ciclo
  const restartCycle = () => {
    setIsCycleRunning(false);
    setPallets([]);
    setCanReleasePallet2(false);
    setCanReleasePallet3(false);
    nextPalletId.current = 1;
    totalPalletsCreated.current = 0;
    setPalletCounter(0);
    setTimeout(() => startCycle(), 100);
  };

  // Função para parar o ciclo
  const stopCycle = () => {
    setIsCycleRunning(false);
  };

  // Função para lidar com o clique no motor
  const handleMotorClick = (motorId: number) => {
    setSelectedMotorId(motorId);
    setShowDialog(true);
  };

  // Atualiza o ciclo a cada 50ms
  useEffect(() => {
    if (!isCycleRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      // Atualiza o estado de cada palete
      setPallets(prevPallets => {
        let updatedPallets = [...prevPallets];
        
        // Primeiro, atualiza a posição e o estado de cada palete existente
        updatedPallets = updatedPallets.map(pallet => {
          let { position, state, stateStartTime } = pallet;
          let newState = state;
          let newStateStartTime = stateStartTime;
          
          // Cálculo da nova posição com base no estado
          if (state === "entering") {
            // Calcula o progresso desde que começou a entrar
            const elapsed = now - stateStartTime;
            const progress = elapsed / customMoveDuration;
            
            // Atualiza a posição
            position = entryPoint + Math.min(progress, 1) * (sensor1Pos - entryPoint);
            
            // Se chegou ao sensor 1
            if (progress >= 1) {
              newState = "atSensor1";
              newStateStartTime = now;
              
              // Agora pode liberar o segundo palete
              setCanReleasePallet2(true);
            }
          } 
          else if (state === "atSensor1") {
            // No sensor 1, apenas verifica se o tempo de espera acabou
            const elapsed = now - stateStartTime;
            if (elapsed >= customWaitDuration) {
              newState = "movingToSensor2";
              newStateStartTime = now;
            }
          }
          else if (state === "movingToSensor2") {
            // Calcula o progresso desde que começou a mover para o sensor 2
            const elapsed = now - stateStartTime;
            const progress = elapsed / customMoveDuration;
            
            // Atualiza a posição
            position = sensor1Pos + Math.min(progress, 1) * (sensor2Pos - sensor1Pos);
            
            // Se chegou ao sensor 2
            if (progress >= 1) {
              newState = "atSensor2";
              newStateStartTime = now;
              
              // Agora pode liberar o terceiro palete
              setCanReleasePallet3(true);
            }
          }
          else if (state === "atSensor2") {
            // No sensor 2, apenas verifica se o tempo de espera acabou
            const elapsed = now - stateStartTime;
            if (elapsed >= customWaitDuration) {
              newState = "exiting";
              newStateStartTime = now;
            }
          }
          else if (state === "exiting") {
            // Calcula o progresso desde que começou a sair
            const elapsed = now - stateStartTime;
            const progress = elapsed / customMoveDuration;
            
            // Atualiza a posição, agora incluindo o caminho até o sensor 3
            position = sensor2Pos + Math.min(progress, 1) * (exitPoint - sensor2Pos);
            
            // Se saiu completamente
            if (progress >= 1) {
              newState = "exited";
            }
          }
          
          return {
            ...pallet,
            position,
            state: newState,
            stateStartTime: newStateStartTime
          };
        });
        
        // Remove paletes que já saíram completamente
        updatedPallets = updatedPallets.filter(p => p.state !== "exited");
        
        // Verifica se podemos adicionar novos paletes
        const hasSensor1Pallet = updatedPallets.some(p => p.state === "atSensor1" || p.state === "movingToSensor2");
        const hasSensor2Pallet = updatedPallets.some(p => p.state === "atSensor2");
        const hasEnteringPallet = updatedPallets.some(p => p.state === "entering");
        
        // Lógica para adicionar novo palete conforme a sequência explicada
        if (canReleasePallet2 && !hasEnteringPallet && !hasSensor1Pallet) {
          // Se palete 1 já saiu do sensor 1, podemos liberar o palete 2
          updatedPallets.push({
            id: nextPalletId.current++,
            position: entryPoint,
            state: "entering",
            stateStartTime: now
          });
          
          setCanReleasePallet2(false);
          totalPalletsCreated.current++;
          setPalletCounter(totalPalletsCreated.current);
        }
        else if (canReleasePallet3 && !hasEnteringPallet && !hasSensor1Pallet) {
          // Se palete 1 já saiu do sensor 2, podemos liberar o palete 3
          updatedPallets.push({
            id: nextPalletId.current++,
            position: entryPoint,
            state: "entering",
            stateStartTime: now
          });
          
          setCanReleasePallet3(false);
          totalPalletsCreated.current++;
          setPalletCounter(totalPalletsCreated.current);
        }
        
        return updatedPallets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isCycleRunning, customMoveDuration, customWaitDuration, canReleasePallet2, canReleasePallet3]);

  // Define os estados dos motores com base nas fases dos paletes
  const motor1Ligado = pallets.some(p => 
    p.state === "entering" || p.state === "movingToSensor2"
  );
  
  const motor2Ligado = pallets.some(p => 
    p.state === "movingToSensor2" || p.state === "exiting"
  );
  
  // Motor 3 ligado quando os paletes estão saindo (passando pelo sensor 3)
  const motor3Ligado = pallets.some(p => 
    p.state === "exiting" && p.position > sensor2Pos + 100
  );
  
  // Usando 'as const' para garantir que os tipos são específicos
  const motor1Cor = motor1Ligado ? 'verde' as const : 'cinza' as const;
  const motor2Cor = motor2Ligado ? 'verde' as const : 'cinza' as const;
  const motor3Cor = motor3Ligado ? 'verde' as const : 'cinza' as const;

  // Status dos sensores
  const sensor1Ativo = pallets.some(p => p.state === "atSensor1");
  const sensor2Ativo = pallets.some(p => p.state === "atSensor2");
  // Sensor 3 ativo quando um palete está próximo a ele durante a saída
  const sensor3Ativo = pallets.some(p => 
    p.state === "exiting" && 
    Math.abs(p.position - sensor3Pos) < 20
  );

  // Seleciona o status para exibição via SVG
  let statusSvg: string | null = null;
  if (sensor1Ativo) {
    statusSvg = Sensor1_Detectado;
  } else if (sensor2Ativo) {
    statusSvg = Sensor2_Detectado;
  } else if (sensor3Ativo) {
    statusSvg = Sensor3_Detectado;
  } else if (isCycleRunning) {
    statusSvg = Ciclo_Inicializado;
  } else {
    statusSvg = null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 to-slate-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} title="HMI - TR-09" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-2xl mb-6 text-center font-bold">Sistema de Transporte de Paletes</h2>
            
            {/* Dashboard redesenhado com cards modernos */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card de Status do Sistema */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 px-4 py-2 text-white font-medium">
                  Status do Sistema
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ciclo:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isCycleRunning ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'}`}>
                      {isCycleRunning ? 'Em execução' : 'Parado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total de Paletes:</span>
                    <span className="font-mono bg-slate-900 px-3 py-1 rounded text-white">{palletCounter}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Paletes Ativos:</span>
                    <span className="font-mono bg-slate-900 px-3 py-1 rounded text-white">{pallets.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Card de Status dos Transportadores */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl overflow-hidden md:col-span-2">
                <div className="bg-blue-600 px-4 py-2 text-white font-medium">
                  Status dos Transportadores
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${motor1Ligado ? 'bg-green-500' : 'bg-gray-700'} mb-2`}>
                      <span className="text-white font-bold">M1</span>
                    </div>
                    <span className={`text-xs ${motor1Ligado ? 'text-green-400' : 'text-gray-400'}`}>
                      {motor1Ligado ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${motor2Ligado ? 'bg-green-500' : 'bg-gray-700'} mb-2`}>
                      <span className="text-white font-bold">M2</span>
                    </div>
                    <span className={`text-xs ${motor2Ligado ? 'text-green-400' : 'text-gray-400'}`}>
                      {motor2Ligado ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${motor3Ligado ? 'bg-green-500' : 'bg-gray-700'} mb-2`}>
                      <span className="text-white font-bold">M3</span>
                    </div>
                    <span className={`text-xs ${motor3Ligado ? 'text-green-400' : 'text-gray-400'}`}>
                      {motor3Ligado ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Card de Status dos Sensores */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl overflow-hidden">
                <div className="bg-cyan-600 px-4 py-2 text-white font-medium">
                  Status dos Sensores
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">S1:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sensor1Ativo ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'}`}>
                      {sensor1Ativo ? 'Detectado' : 'Livre'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">S2:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sensor2Ativo ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'}`}>
                      {sensor2Ativo ? 'Detectado' : 'Livre'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">S3:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sensor3Ativo ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'}`}>
                      {sensor3Ativo ? 'Detectado' : 'Livre'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Indicator e Botão de Parâmetros */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex-1 flex justify-center mb-4 md:mb-0">
                {statusSvg && (
                  <img src={statusSvg} alt="Status" style={{ width: '320px', height: '53px' }} />
                )}
                {!statusSvg && (
                  <div className="bg-slate-700 rounded-lg px-6 py-3 text-gray-400">
                    Sistema em espera
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowDialog(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-md transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Ajustar Parâmetros
                </button>
              </div>
            </div>
            
            {/* Área de Transporte - Usando o componente TransportSystem */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-1 rounded-xl shadow-xl mb-8">
              <TransportSystem
                offsetX={offsetX}
                entryPoint={entryPoint}
                sensor1Pos={sensor1Pos}
                sensor2Pos={sensor2Pos}
                sensor3Pos={sensor3Pos}
                exitPoint={exitPoint}
                palletWidth={palletWidth}
                pallets={pallets}
                sensor1Ativo={sensor1Ativo}
                sensor2Ativo={sensor2Ativo}
                sensor3Ativo={sensor3Ativo}
                motor1Cor={motor1Cor}
                motor2Cor={motor2Cor}
                motor3Cor={motor3Cor}
                onMotorClick={handleMotorClick}
              />
            </div>
            
            {/* Botões de controle modernizados */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={startCycle}
                disabled={isCycleRunning}
                className={`w-40 py-3 rounded-lg text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isCycleRunning 
                    ? 'bg-blue-800 opacity-50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Iniciar Ciclo
              </button>
              <button
                onClick={restartCycle}
                className="w-40 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reiniciar Ciclo
              </button>
              <button
                onClick={stopCycle}
                disabled={!isCycleRunning}
                className={`w-40 py-3 rounded-lg text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  !isCycleRunning 
                    ? 'bg-red-800 opacity-50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Parar Ciclo
              </button>
            </div>
          </div>
          
          {/* Diálogo de Parâmetros - Usando o componente ParameterControls */}
          <ParameterControls
            open={showDialog}
            onClose={() => setShowDialog(false)}
            transportSpeed={transportSpeed}
            customMoveDuration={customMoveDuration}
            customWaitDuration={customWaitDuration}
            setTransportSpeed={setTransportSpeed}
            setCustomMoveDuration={setCustomMoveDuration}
            setCustomWaitDuration={setCustomWaitDuration}
          />
        </main>
      </div>
    </div>
  );
};

export default HMIPage;