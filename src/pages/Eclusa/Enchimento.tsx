import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
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
import BasePistaoEnchimentoSVG from '../../assets/Eclusa/BasePistaoEnchimento.svg';

interface Tag {
  id: number;
  name: string;
  value: any;
}

const Enchimento: React.FC = () => {
  const { logout } = useAuth();
  const { message } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

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

  // Recebe mensagens do WebSocket e atualiza tags
  useEffect(() => {
    if (message && message.tags) {
      setTags(message.tags);
      console.log("Recebendo tags do WebSocket:", message.tags);
    }
  }, [message]);

  // Processa os tags recebidos e atualiza os estados
  useEffect(() => {
    if (tags.length > 0) {
      // Atualiza pipes
      const newPipeStates = { ...pipeStates };
      for (let i = 1; i <= 24; i++) {
        const pipeTag = tags.find(tag => tag.name === `pipe_${i}`);
        if (pipeTag !== undefined) {
          newPipeStates[`pipe${i}`] = Number(pipeTag.value) as 0 | 1;
        }
      }
      setPipeStates(newPipeStates);

      // Atualiza cilindros
      const cilindroEsquerdoTag = tags.find(tag => tag.name === "Cilindro_Esquerdo");
      if (cilindroEsquerdoTag !== undefined) {
        setCilindroEsquerdoEstado(Number(cilindroEsquerdoTag.value) as 0 | 1);
      }
      const cilindroDireitoTag = tags.find(tag => tag.name === "Cilindro_Direito");
      if (cilindroDireitoTag !== undefined) {
        setCilindroDireitoEstado(Number(cilindroDireitoTag.value) as 0 | 1);
      }

      // Atualiza válvulas esquerdas
      const valvulaEsquerda1Tag = tags.find(tag => tag.name === "Valvula_Esquerda_E1");
      const valvulaEsquerda2Tag = tags.find(tag => tag.name === "Valvula_Esquerda_E2");
      const valvulaEsquerda3Tag = tags.find(tag => tag.name === "Valvula_Esquerda_E3");
      const newValvulasEsquerda = { ...valvulasEsquerda };
      if (valvulaEsquerda1Tag !== undefined) {
        newValvulasEsquerda.valvulaEsquerda1 = Number(valvulaEsquerda1Tag.value) as 0 | 1;
      }
      if (valvulaEsquerda2Tag !== undefined) {
        newValvulasEsquerda.valvulaEsquerda2 = Number(valvulaEsquerda2Tag.value) as 0 | 1;
      }
      if (valvulaEsquerda3Tag !== undefined) {
        newValvulasEsquerda.valvulaEsquerda3 = Number(valvulaEsquerda3Tag.value) as 0 | 1;
      }
      setValvulasEsquerda(newValvulasEsquerda);

      // Atualiza válvulas direitas
      const valvulaDireita1Tag = tags.find(tag => tag.name === "Valvula_Direita_E1");
      const valvulaDireita2Tag = tags.find(tag => tag.name === "Valvula_Direita_E2");
      const valvulaDireita3Tag = tags.find(tag => tag.name === "Valvula_Direita_E3");
      const newValvulasDireita = { ...valvulasDireita };
      if (valvulaDireita1Tag !== undefined) {
        newValvulasDireita.valvulaDireita1 = Number(valvulaDireita1Tag.value) as 0 | 1;
      }
      if (valvulaDireita2Tag !== undefined) {
        newValvulasDireita.valvulaDireita2 = Number(valvulaDireita2Tag.value) as 0 | 1;
      }
      if (valvulaDireita3Tag !== undefined) {
        newValvulasDireita.valvulaDireita3 = Number(valvulaDireita3Tag.value) as 0 | 1;
      }
      setValvulasDireita(newValvulasDireita);

      // Atualiza válvulas gaveta
      const newValvulasGaveta = { ...valvulasGaveta };
      for (let i = 1; i <= 6; i++) {
        const gavetaTag = tags.find(tag => tag.name === `Valvula_Gaveta_G${i}`);
        if (gavetaTag !== undefined) {
          newValvulasGaveta[`gaveta${i}`] = Boolean(Number(gavetaTag.value));
        }
      }
      setValvulasGaveta(newValvulasGaveta);

      // Atualiza válvulas triangulares (usando tags: Valvula_1 até Valvula_6)
      const newValvulasTriangulares = { ...valvulasStatus };
      for (let i = 1; i <= 6; i++) {
        const valvulaTag = tags.find(tag => tag.name === `Valvula_${i}`);
        if (valvulaTag !== undefined) {
          newValvulasTriangulares[`valvula${i}`] = Number(valvulaTag.value) as 0 | 1 | 2;
        }
      }
      setValvulasStatus(newValvulasTriangulares);

      // Atualiza válvulas esfera (usando tags: Valvula_Esfera_1 até Valvula_Esfera_6)
      const newValvulasEsfera = { ...valvulasEsfera };
      for (let i = 1; i <= 6; i++) {
        const esferaTag = tags.find(tag => tag.name === `Valvula_Esfera_${i}`);
        if (esferaTag !== undefined) {
          newValvulasEsfera[`esfera${i}`] = Number(esferaTag.value) as 0 | 1;
        }
      }
      setValvulasEsfera(newValvulasEsfera);

      // Atualiza válvulas verticais
      const vertical1Tag = tags.find(tag => tag.name === "Valvula_Verticais_VT1");
      const vertical2Tag = tags.find(tag => tag.name === "Valvula_Verticais_VT2");
      const newValvulasVerticais = { ...valvulasVerticais };
      if (vertical1Tag !== undefined) {
        newValvulasVerticais.vertical1 = Number(vertical1Tag.value) as 0 | 1;
      }
      if (vertical2Tag !== undefined) {
        newValvulasVerticais.vertical2 = Number(vertical2Tag.value) as 0 | 1;
      }
      setValvulasVerticais(newValvulasVerticais);

      // Atualiza motores
      const motorEsquerdoTag = tags.find(tag => tag.name === "Motor_Esquerdo");
      const motorDireitoTag = tags.find(tag => tag.name === "Motor_Direito");
      const newMotoresStatus = { ...motoresStatus };
      if (motorEsquerdoTag !== undefined) {
        newMotoresStatus.motor1 = Number(motorEsquerdoTag.value) as 0 | 1 | 2;
      }
      if (motorDireitoTag !== undefined) {
        newMotoresStatus.motor2 = Number(motorDireitoTag.value) as 0 | 1 | 2;
      }
      setMotoresStatus(newMotoresStatus);

      // Atualiza nível do tanque
      const nivelTanqueTag = tags.find(tag => tag.name === "Nivel_Tanque");
      if (nivelTanqueTag !== undefined) {
        setNivelTanqueOleo(Number(nivelTanqueTag.value));
      }

      // Atualiza posição dos pistões (inverte a lógica: 0% -> 1124, 100% -> 886)
      const pistao1Tag = tags.find(tag => tag.name === "Posicao_Pistao_1");
      if (pistao1Tag !== undefined) {
        const min = 886;
        const max = 1124;
        const range = max - min;
        const position = max - (Number(pistao1Tag.value) / 100 * range);
        setPistao1Pos(position);
      }
      const pistao2Tag = tags.find(tag => tag.name === "Posicao_Pistao_2");
      if (pistao2Tag !== undefined) {
        const min = 886;
        const max = 1124;
        const range = max - min;
        const position = max - (Number(pistao2Tag.value) / 100 * range);
        setPistao2Pos(position);
      }
    }
  }, [tags]);

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
                className="absolute" 
                style={{ left: '380px', top: '310px', transform: 'scale(1.0)', zIndex: 1 }}
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
              {/* Base dos Pistões */}
              <div 
                className="absolute"
                style={{ left: '58px', top: '446px', width: '200px', height: '200px', zIndex: 50 }}
              >
                <img src={BasePistaoEnchimentoSVG} alt="Base do Pistão Esquerdo" />
              </div>
              <div 
                className="absolute"
                style={{ right: '58px', top: '446px', width: '200px', height: '200px', zIndex: 50 }}
              >
                <img src={BasePistaoEnchimentoSVG} alt="Base do Pistão Direito" />
              </div>
              {/* Pistão 1 */}
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
              {/* Pistão 2 */}
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
                <div className="cursor-pointer">
                  <CilindroEnchimento estado={cilindroEsquerdoEstado} />
                </div>
              </div>
              {/* Cilindro Direito */}
              <div className="absolute" style={{ right: '104px', top: '16px' }}>
                <div className="cursor-pointer">
                  <CilindroEnchimento estado={cilindroDireitoEstado} />
                </div>
              </div>
              {/* Motor Esquerdo */}
              <div 
                className="absolute" 
                style={{ left: '480px', top: '270px', transform: 'scale(1)' }}
              >
                <Motor status={motoresStatus.motor1} />
              </div>
              {/* Motor Direito */}
              <div 
                className="absolute" 
                style={{ right: '480px', top: '270px', transform: 'scale(1.0) scaleX(-1)' }}
              >
                <Motor status={motoresStatus.motor2} />
              </div>
              {/* Válvulas – Lado Esquerdo (usando ValvulaDireita) */}
              <div 
                className="absolute" 
                style={{ left: '463px', top: '130px' }}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda1} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '463px', top: '196px' }}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda2} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '352px', top: '158px', transform: 'rotate(90deg)' }}
              >
                <ValvulaDireita estado={valvulasEsquerda.valvulaEsquerda3} />
              </div>
              {/* Válvulas – Lado Direito (usando ValvulaEsquerda) */}
              <div 
                className="absolute" 
                style={{ right: '463px', top: '122px' }}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita1} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '463px', top: '196px' }}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita2} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '354px', top: '158px', transform: 'rotate(-90deg)' }}
              >
                <ValvulaEsquerda estado={valvulasDireita.valvulaDireita3} />
              </div>
              {/* Válvulas Triangulares */}
              <div 
                className="absolute" 
                style={{ left: '464px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula1} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '514px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula2} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '563px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula3} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '546px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula4} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '496px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula5} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '446px', top: '40px', transform: 'rotate(90deg) scale(0.5)' }}
              >
                <Valvula status={valvulasStatus.valvula6} />
              </div>
              {/* Válvulas Esfera */}
              <div 
                className="absolute" 
                style={{ left: '483px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera1} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '532px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera2} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '582px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera3} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '582px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera4} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '533px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera5} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '483px', top: '28px', transform: 'scale(1.3)' }}
              >
                <ValvulaEsfera estado={valvulasEsfera.esfera6} />
              </div>
              {/* Válvulas Gaveta */}
              <div 
                className="absolute" 
                style={{ left: '50px', top: '132px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta1} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '92px', top: '163px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta2} />
              </div>
              <div 
                className="absolute" 
                style={{ left: '200px', top: '95px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta3} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '200px', top: '95px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta4} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '92px', top: '163px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta5} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '50px', top: '134px', transform: 'scale(0.08)' }}
              >
                <ValvulaGaveta estado={valvulasGaveta.gaveta6} />
              </div>
              {/* Válvulas Verticais */}
              <div 
                className="absolute" 
                style={{ left: '39px', top: '280px', transform: 'scale(1.1)' }}
              >
                <ValvulaVertical estado={valvulasVerticais.vertical1} />
              </div>
              <div 
                className="absolute" 
                style={{ right: '39px', top: '280px', transform: 'scale(1.1)' }}
              >
                <ValvulaVertical estado={valvulasVerticais.vertical2} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Enchimento;
