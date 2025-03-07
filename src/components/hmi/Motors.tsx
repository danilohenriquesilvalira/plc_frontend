// components/hmi/Motors.tsx
import React from 'react';

// Importando os SVGs dos motores
import Motor_Cinza from '../../assets/hmi/motors/Motor_Cinza.svg';
import Motor_Vermelho from '../../assets/hmi/motors/Motor_Vermelho.svg';
import Motor_Verde from '../../assets/hmi/motors/Motor_Verde.svg';
import Motor_Azul from '../../assets/hmi/motors/Motor_Azul.svg';

type MotorType = 'cinza' | 'vermelho' | 'verde' | 'azul';

type Motor = {
  id: number;
  position: { left: number; top: string };
  state: MotorType;
  onClick?: () => void;
};

type MotorsProps = {
  motors: Motor[];
};

const Motors: React.FC<MotorsProps> = ({ motors }) => {
  // Mapeamento dos SVGs dos motores
  const motorSvgMap = {
    cinza: Motor_Cinza,
    vermelho: Motor_Vermelho,
    verde: Motor_Verde,
    azul: Motor_Azul,
  };

  // Mapeamento de cores para estilização
  const getColorClass = (state: MotorType) => {
    switch(state) {
      case 'cinza': return 'border-gray-600';
      case 'vermelho': return 'border-red-500';
      case 'verde': return 'border-green-500';
      case 'azul': return 'border-blue-500';
      default: return 'border-gray-600';
    }
  };

  return (
    <>
      {motors.map((motor) => (
        <div
          key={motor.id}
          className="absolute w-24 h-24 cursor-pointer transition-opacity hover:scale-105 group"
          onClick={motor.onClick}
          style={{
            top: motor.position.top,
            left: `${motor.position.left}px`,
          }}
        >
          <img src={motorSvgMap[motor.state]} alt={`Motor ${motor.id} ${motor.state}`} className="w-full h-full" />
          
          {/* Motor label - agora no lado esquerdo com design aprimorado */}
          <div className={`absolute -left-10 top-1/2 transform -translate-y-1/2 bg-slate-800 ${getColorClass(motor.state)} border px-2 py-1 rounded-lg shadow-md flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">M{motor.id}</span>
          </div>
          
          {/* Tooltip que aparece ao passar o mouse */}
          <div className="absolute left-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded pointer-events-none">
            Motor {motor.id} - {motor.state === 'verde' ? 'Ativo' : motor.state === 'vermelho' ? 'Erro' : motor.state === 'azul' ? 'Espera' : 'Inativo'}
          </div>
        </div>
      ))}
    </>
  );
};

export default Motors;