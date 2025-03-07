import React, { useState, useEffect } from 'react';
import PortaJusanteReguaSVG from '../../assets/Eclusa/Porta_Jusante_Regua.svg';

interface PortaJusanteReguaProps {
  className?: string;
  nivel?: number;
}

const PortaJusanteRegua: React.FC<PortaJusanteReguaProps> = ({ 
  className = '',
  nivel
}) => {
  const [aberturaInterna, setAberturaInterna] = useState(0);
  const abertura = nivel !== undefined ? nivel : aberturaInterna;
  
  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAberturaInterna(Number(event.target.value));
  };
  
  useEffect(() => {
    if (nivel !== undefined) {
      setAberturaInterna(nivel);
    }
  }, [nivel]);

  const maxDeslocamento = 300;
  const deslocamentoVertical = (abertura / 100) * maxDeslocamento;

  return (
    <div className={`relative ${className}`} style={{ width: '435px', height: '438px' }}>
      {/* SVG da porta jusante régua */}
      <img
        src={PortaJusanteReguaSVG}
        alt="Porta Jusante Régua"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          bottom: `${deslocamentoVertical}px`,
          transition: 'bottom 0.3s ease-in-out'
        }}
      />
      
      {/* Controle de abertura posicionado acima da porta e centralizado */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          top: '-60px', // Posicionado acima da porta, fora da área de movimento
          zIndex: 10 // Garantir que fique acima de tudo
        }}
      >
        <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
          <span className="text-white font-bold min-w-16">Abertura</span>
          <input
            type="range"
            min="0"
            max="100"
            value={aberturaInterna}
            onChange={handleAberturaChange}
            className="cursor-pointer h-2 w-32 rounded-lg appearance-none bg-gray-700"
          />
          <span className="text-white font-bold min-w-10">{abertura}%</span>
        </div>
      </div>
    </div>
  );
};

export default PortaJusanteRegua;