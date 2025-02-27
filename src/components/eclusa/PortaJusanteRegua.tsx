import React, { useState } from 'react';
import PortaJusanteReguaSVG from '../../assets/eclusa/Porta_Jusante_Regua.svg';

interface PortaJusanteReguaProps {
  className?: string;
}

const PortaJusanteRegua: React.FC<PortaJusanteReguaProps> = ({ className = '' }) => {
  const [abertura, setAbertura] = useState(0); // Estado inicial: 0% (fechada)
  
  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAbertura(Number(event.target.value));
  };
  
  // A porta deve começar na posição mais baixa (0%) e subir até a posição mais alta (100%)
  // Inverti a lógica: quando abertura=0, deslocamento=0; quando abertura=100, deslocamento é máximo
  const maxDeslocamento = 300; // Valor máximo de deslocamento em pixels
  const deslocamentoVertical = (abertura / 100) * maxDeslocamento;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Container para conter o SVG e garantir visibilidade completa */}
      <div style={{ position: 'relative', width: '435px', height: '438px' }}>
        {/* SVG da porta jusante régua com movimento vertical */}
        <img 
          src={PortaJusanteReguaSVG} 
          alt="Porta Jusante Régua" 
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            bottom: `${deslocamentoVertical}px`, // A porta sobe a partir da posição original
            transition: 'bottom 0.5s ease-in-out' // Animação suave
          }} 
        />
      </div>
      
      {/* Controles de abertura */}
      <div className="flex items-center gap-4 mt-4">
        <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
          <span className="text-white font-bold min-w-16">Abertura</span>
          <input
            type="range"
            min="0"
            max="100"
            value={abertura}
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