import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import PipeSystem from '../../components/eclusa/PipeSystem';
import CilindroEnchimento from '../../components/eclusa/CilindroEnchimento';
import ValvulaEsquerda from '../../components/eclusa/ValvulaEsquerda';
import ValvulaDireita from '../../components/eclusa/ValvulaDireita';
import Valvula from '../../components/eclusa/Valvula';
import ValvulaEsfera from '../../components/eclusa/ValvulaEsfera';
import ValvulaGaveta from '../../components/eclusa/ValvulaGaveta';
import ValvulaVertical from '../../components/eclusa/ValvulaVertical';
import Motor from '../../components/eclusa/Motor';
import TanqueOleo from '../../components/eclusa/TanqueOleo';
import Pistao_Enchimento from '../../components/eclusa/Pistao_Enchimento';

const Enchimento: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Estado para os tubos (0 = inativo, 1 = ativo)
  const [pipeStates, setPipeStates] = useState<{ [key: string]: 0 | 1 }>({
    pipe1: 0, pipe2: 0, pipe3: 0, pipe4: 0, pipe5: 0, pipe6: 0,
    pipe7: 0, pipe8: 0, pipe9: 0, pipe10: 0, pipe11: 0, pipe12: 0,
    pipe13: 0, pipe14: 0, pipe15: 0, pipe16: 0, pipe17: 0, pipe18: 0,
    pipe19: 0, pipe20: 0, pipe21: 0, pipe22: 0, pipe23: 0, pipe24: 0
  });

  // Estados para os cilindros
  const [cilindroEsquerdoEstado, setCilindroEsquerdoEstado] = useState<0 | 1>(0);
  const [cilindroDireitoEstado, setCilindroDireitoEstado] = useState<0 | 1>(0);

  // Estados para as válvulas esquerdas
  const [valvulasEsquerda, setValvulasEsquerda] = useState<{ [key: string]: 0 | 1 }>({
    valvulaEsquerda1: 0,
    valvulaEsquerda2: 0,
    valvulaEsquerda3: 0
  });

  // Estados para as válvulas direitas
  const [valvulasDireita, setValvulasDireita] = useState<{ [key: string]: 0 | 1 }>({
    valvulaDireita1: 0,
    valvulaDireita2: 0,
    valvulaDireita3: 0
  });

  // Estados para as válvulas triangulares
  const [valvulasStatus, setValvulasStatus] = useState<{ [key: string]: 0 | 1 | 2 }>({
    valvula1: 0,
    valvula2: 0,
    valvula3: 0,
    valvula4: 0,
    valvula5: 0,
    valvula6: 0
  });

  // Estados para as válvulas esfera
  const [valvulasEsfera, setValvulasEsfera] = useState<{ [key: string]: 0 | 1 }>({
    esfera1: 0,
    esfera2: 0,
    esfera3: 0,
    esfera4: 0,
    esfera5: 0,
    esfera6: 0
  });

  // Estados para as válvulas gaveta
  const [valvulasGaveta, setValvulasGaveta] = useState<{ [key: string]: boolean }>({
    gaveta1: false,
    gaveta2: false,
    gaveta3: false,
    gaveta4: false,
    gaveta5: false,
    gaveta6: false
  });

  // Estados para as válvulas verticais
  const [valvulasVerticais, setValvulasVerticais] = useState<{ [key: string]: 0 | 1 }>({
    vertical1: 0,
    vertical2: 0
  });

  // Estados para os motores (0 = inativo, 1 = operando, 2 = falha)
  const [motoresStatus, setMotoresStatus] = useState<{ [key: string]: 0 | 1 | 2 }>({
    motor1: 0,
    motor2: 0
  });

  // Estado para o nível do tanque de óleo (0-100)
  const [nivelTanqueOleo, setNivelTanqueOleo] = useState<number>(50);

  // Estados para a posição dos pistões (em pixels)
  const [pistao1Pos, setPistao1Pos] = useState<number>(1000);
  const [pistao2Pos, setPistao2Pos] = useState<number>(1000);

  // Funções para alternar os estados
  const toggleValvulaEsquerda = (id: string) => {
    setValvulasEsquerda(prev => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1
    }));
  };

  const toggleValvulaDireita = (id: string) => {
    setValvulasDireita(prev => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1
    }));
  };

  const toggleValvulaStatus = (id: string) => {
    setValvulasStatus(prev => {
      const currentStatus = prev[id];
      const newStatus = currentStatus === 0 ? 1 : currentStatus === 1 ? 2 : 0;
      return { ...prev, [id]: newStatus as 0 | 1 | 2 };
    });
  };

  const toggleValvulaEsfera = (id: string) => {
    setValvulasEsfera(prev => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1
    }));
  };

  const toggleValvulaGaveta = (id: string) => {
    setValvulasGaveta(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleValvulaVertical = (id: string) => {
    setValvulasVerticais(prev => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1
    }));
  };

  const setMotorStatus = (id: string, status: 0 | 1 | 2) => {
    setMotoresStatus(prev => ({
      ...prev,
      [id]: status
    }));
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
        <main className="flex-1 flex items-center justify-center p-4 pt-12">
          <div className="relative w-full max-w-7xl" style={{ marginTop: '-900px' }}>
            {/* Container de Fundo: Tanque de Óleo e PipeSystem */}
            <div style={{ position: 'relative', zIndex: 0 }}>
              {/* Tanque de Óleo */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '380px', top: '310px', transform: 'scale(1.0)', zIndex: 1 }}
                onClick={() => setNivelTanqueOleo((prev) => (prev + 10) % 110)}
              >
                <TanqueOleo nivel={nivelTanqueOleo} />
              </div>
              {/* PipeSystem */}
              <div 
                className="absolute"
                style={{ left: 0, top: 0, width: '100%', height: '100%', zIndex: 2 }}
              >
                <div className="flex justify-center relative">
                  <PipeSystem 
                    pipeStates={pipeStates}
                    width={1267.5} 
                    height={418.04}
                  />
                </div>
              </div>
            </div>
            {/* Container de Primeiro Plano: Demais componentes e Pistões */}
            <div style={{ position: 'relative', zIndex: 3 }}>
              {/* Pistão 1 com zIndex maior para ficar por cima do CilindroEnchimento */}
              <div
                className="absolute"
                style={{
                  left: '94px',
                  top: `${pistao1Pos}px`,
                  width: '100px',
                  height: '100px',
                  zIndex: 10
                }}
              >
                <Pistao_Enchimento nivel={pistao1Pos} />
              </div>
              {/* Pistão 2 com zIndex maior para ficar por cima */}
              <div
                className="absolute"
                style={{
                  right: '118px',
                  top: `${pistao2Pos}px`,
                  width: '100px',
                  height: '100px',
                  zIndex: 10
                }}
              >
                <Pistao_Enchimento nivel={pistao2Pos} />
              </div>
              {/* Cilindro Esquerdo */}
              <div className="absolute" style={{ left: '100px', top: '16px' }}>
                <div 
                  className="cursor-pointer" 
                  onClick={() => setCilindroEsquerdoEstado(prev => (prev === 0 ? 1 : 0))}
                >
                  <CilindroEnchimento estado={cilindroEsquerdoEstado} />
                </div>
              </div>
              {/* Cilindro Direito */}
              <div className="absolute" style={{ right: '104px', top: '16px' }}>
                <div 
                  className="cursor-pointer" 
                  onClick={() => setCilindroDireitoEstado(prev => (prev === 0 ? 1 : 0))}
                >
                  <CilindroEnchimento estado={cilindroDireitoEstado} />
                </div>
              </div>
              {/* Motor Esquerdo */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '480px', top: '270px', transform: 'scale(1)' }}
                onClick={() => setMotorStatus('motor1', (motoresStatus.motor1 + 1) % 3 as 0 | 1 | 2)}
              >
                <Motor status={motoresStatus.motor1} />
              </div>
              {/* Motor Direito */}
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '480px', top: '270px', transform: 'scale(1.0) scaleX(-1)' }}
                onClick={() => setMotorStatus('motor2', (motoresStatus.motor2 + 1) % 3 as 0 | 1 | 2)}
              >
                <Motor status={motoresStatus.motor2} />
              </div>
              {/* Válvulas – Lado Esquerdo (usando ValvulaDireita) */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '463px', top: '130px' }}
                onClick={() => toggleValvulaEsquerda('valvulaEsquerda1')}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '463px', top: '196px' }}
                onClick={() => toggleValvulaEsquerda('valvulaEsquerda2')}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda2} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '352px', top: '158px', transform: 'rotate(90deg)' }}
                onClick={() => toggleValvulaEsquerda('valvulaEsquerda3')}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda3} />
              </div>
              {/* Válvulas – Lado Direito (usando ValvulaEsquerda) */}
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '463px', top: '122px' }}
                onClick={() => toggleValvulaDireita('valvulaDireita1')}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '463px', top: '196px' }}
                onClick={() => toggleValvulaDireita('valvulaDireita2')}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita2} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '354px', top: '158px', transform: 'rotate(-90deg)' }}
                onClick={() => toggleValvulaDireita('valvulaDireita3')}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita3} />
              </div>
              {/* Válvulas Triangulares */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '464px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula1')}
              >
                <Valvula status={valvulasStatus.valvula1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '514px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula2')}
              >
                <Valvula status={valvulasStatus.valvula2} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '563px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula3')}
              >
                <Valvula status={valvulasStatus.valvula3} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '546px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula4')}
              >
                <Valvula status={valvulasStatus.valvula4} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '496px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula5')}
              >
                <Valvula status={valvulasStatus.valvula5} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '446px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
                onClick={() => toggleValvulaStatus('valvula6')}
              >
                <Valvula status={valvulasStatus.valvula6} />
              </div>
              {/* Válvulas Esfera */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '483px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera1')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '532px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera2')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera2} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '582px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera3')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera3} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '582px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera4')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera4} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '533px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera5')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera5} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '483px', top: '28px', transform: 'scale(1.3)' }}
                onClick={() => toggleValvulaEsfera('esfera6')}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera6} />
              </div>
              {/* Válvulas Gaveta */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '50px', top: '132px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta1')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '92px', top: '163px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta2')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta2} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '200px', top: '95px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta3')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta3} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '200px', top: '95px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta4')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta4} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '92px', top: '163px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta5')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta5} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '50px', top: '134px', transform: 'scale(0.08)' }}
                onClick={() => toggleValvulaGaveta('gaveta6')}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta6} />
              </div>
              {/* Válvulas Verticais */}
              <div 
                className="absolute cursor-pointer" 
                style={{ left: '39px', top: '280px', transform: 'scale(1.1)' }}
                onClick={() => toggleValvulaVertical('vertical1')}
              >
                <ValvulaVertical estado={valvulasVerticais.vertical1} />
              </div>
              <div 
                className="absolute cursor-pointer" 
                style={{ right: '39px', top: '280px', transform: 'scale(1.1)' }}
                onClick={() => toggleValvulaVertical('vertical2')}
              >
                <ValvulaVertical estado={valvulasVerticais.vertical2} />
              </div>
            </div>
          </div>
        </main>
        {/* Área de Controles */}
        <div className="p-4 bg-slate-800/40">
          {/* Controles dos Cilindros */}
          <div className="flex justify-center flex-wrap gap-4 mb-4">
            <div>
              <span className="text-white mr-2">Cilindro Esquerdo:</span>
              <button 
                onClick={() => setCilindroEsquerdoEstado(0)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  cilindroEsquerdoEstado === 0 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Marrom
              </button>
              <button 
                onClick={() => setCilindroEsquerdoEstado(1)} 
                className={`px-2 py-1 rounded text-xs ${
                  cilindroEsquerdoEstado === 1 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Laranja
              </button>
            </div>
            <div>
              <span className="text-white mr-2">Cilindro Direito:</span>
              <button 
                onClick={() => setCilindroDireitoEstado(0)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  cilindroDireitoEstado === 0 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Marrom
              </button>
              <button 
                onClick={() => setCilindroDireitoEstado(1)} 
                className={`px-2 py-1 rounded text-xs ${
                  cilindroDireitoEstado === 1 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Laranja
              </button>
            </div>
          </div>
          {/* Controles dos Motores */}
          <div className="flex justify-center flex-wrap gap-4 mb-4">
            <div>
              <span className="text-white mr-2">Motor Esquerdo:</span>
              <button 
                onClick={() => setMotorStatus('motor1', 0)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  motoresStatus.motor1 === 0 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Inativo
              </button>
              <button 
                onClick={() => setMotorStatus('motor1', 1)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  motoresStatus.motor1 === 1 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Operando
              </button>
              <button 
                onClick={() => setMotorStatus('motor1', 2)} 
                className={`px-2 py-1 rounded text-xs ${
                  motoresStatus.motor1 === 2 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Falha
              </button>
            </div>
            <div>
              <span className="text-white mr-2">Motor Direito:</span>
              <button 
                onClick={() => setMotorStatus('motor2', 0)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  motoresStatus.motor2 === 0 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Inativo
              </button>
              <button 
                onClick={() => setMotorStatus('motor2', 1)} 
                className={`px-2 py-1 rounded text-xs mr-2 ${
                  motoresStatus.motor2 === 1 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Operando
              </button>
              <button 
                onClick={() => setMotorStatus('motor2', 2)} 
                className={`px-2 py-1 rounded text-xs ${
                  motoresStatus.motor2 === 2 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                Falha
              </button>
            </div>
          </div>
          {/* Controle do Tanque de Óleo */}
          <div className="flex justify-center flex-wrap gap-4 mb-4">
            <div>
              <span className="text-white mr-2">Nível do Tanque de Óleo:</span>
              <button 
                onClick={() => setNivelTanqueOleo(Math.max(0, nivelTanqueOleo - 10))} 
                className="px-2 py-1 rounded text-xs mr-2 bg-slate-700 text-white"
              >
                -10%
              </button>
              <span className="text-white mx-2">{nivelTanqueOleo}%</span>
              <button 
                onClick={() => setNivelTanqueOleo(Math.min(100, nivelTanqueOleo + 10))} 
                className="px-2 py-1 rounded text-xs ml-2 bg-slate-700 text-white"
              >
                +10%
              </button>
              <button 
                onClick={() => setNivelTanqueOleo(0)} 
                className="px-2 py-1 rounded text-xs ml-4 bg-gray-600 text-white"
              >
                Vazio
              </button>
              <button 
                onClick={() => setNivelTanqueOleo(100)} 
                className="px-2 py-1 rounded text-xs ml-2 bg-orange-600 text-white"
              >
                Cheio
              </button>
            </div>
          </div>
          {/* Controles dos Pistões */}
          <div className="flex justify-center flex-wrap gap-4 mb-4">
            <div>
              <label className="text-white mr-2">Posição do Pistão 1:</label>
              <input 
                type="range" 
                min="886" 
                max="1200" 
                value={pistao1Pos} 
                onChange={(e) => setPistao1Pos(Number(e.target.value))} 
                className="mr-2"
              />
              <span className="text-white">{pistao1Pos}px</span>
            </div>
            <div>
              <label className="text-white mr-2">Posição do Pistão 2:</label>
              <input 
                type="range" 
                min="886" 
                max="1200" 
                value={pistao2Pos} 
                onChange={(e) => setPistao2Pos(Number(e.target.value))} 
                className="mr-2"
              />
              <span className="text-white">{pistao2Pos}px</span>
            </div>
          </div>
          {/* Controles das Válvulas */}
          <div className="grid grid-cols-6 gap-2">
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Esquerdas</h3>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(valvulasEsquerda).map(([id, estado]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaEsquerda(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        estado === 1 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {id.replace('valvulaEsquerda', 'E')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Direitas</h3>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(valvulasDireita).map(([id, estado]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaDireita(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        estado === 1 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {id.replace('valvulaDireita', 'D')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Triangulares</h3>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(valvulasStatus).map(([id, status]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaStatus(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        status === 0 
                          ? 'bg-gray-600 text-gray-200' 
                          : status === 1 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                      }`}
                    >
                      {id.replace('valvula', 'V')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Esfera</h3>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(valvulasEsfera).map(([id, estado]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaEsfera(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        estado === 1 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {id.replace('esfera', 'E')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Gaveta</h3>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(valvulasGaveta).map(([id, estado]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaGaveta(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        estado 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {id.replace('gaveta', 'G')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Válvulas Verticais</h3>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(valvulasVerticais).map(([id, estado]) => (
                  <div key={id} className="flex items-center">
                    <button 
                      onClick={() => toggleValvulaVertical(id)} 
                      className={`px-2 py-1 rounded text-xs mr-1 ${
                        estado === 1 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {id.replace('vertical', 'VT')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enchimento;
