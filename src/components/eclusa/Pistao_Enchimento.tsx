import React from 'react';
import PistaoSVG from '../../assets/Eclusa/Pistao_Enchimento.svg';

interface Pistao_EnchimentoProps {
  nivel: number;
  width?: number;
  height?: number;
  className?: string;
}

const Pistao_Enchimento: React.FC<Pistao_EnchimentoProps> = ({ 
  nivel = 0, 
  width = 120,
  height = 200,
  className = '' 
}) => {
  const nivelSeguro = Math.max(0, Math.min(100, nivel));
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Container principal */}
      <div 
        className="absolute bottom-0 left-0 right-0 overflow-visible"
        style={{
          height: '100%',
        }}
      >
        {/* SVG do pistão - a transformação move para cima baseado no nível */}
        <img 
          src={PistaoSVG} 
          alt="Pistão de Enchimento" 
          style={{ 
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: `translateY(${-nivelSeguro}%)`, // Move para cima baseado no nível
            transition: 'transform 0.5s ease-in-out'
          }}
        />
      </div>
      
      {/* Indicador de nível */}
      <div className="absolute top-0 right-0 bg-slate-800/80 px-2 py-0.5 rounded text-white text-sm">
        {nivelSeguro}%
      </div>
    </div>
  );
};

export default Pistao_Enchimento;