import React, { useState } from 'react';
import PortaJusanteSVG from '../../assets/Eclusa/Porta_jusante.svg'; // Caminho correto do SVG

const PortaJusante: React.FC = () => {
  const [abertura, setAbertura] = useState(100); // Estado inicial: 100% ABERTA

  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAbertura(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center">
      {/* SVG da Porta Jusante com transformação correta */}
      <div
        style={{
          width: '85px', // Largura original
          height: '181px',
          transform: `scaleX(${abertura / 100}) translateX(${(100 - abertura) * 0.85}px)`, 
          transformOrigin: 'right center', // O movimento parte da DIREITA para ESQUERDA ao abrir
          transition: 'transform 0.5s linear', // Suaviza o movimento
        }}
      >
        <img src={PortaJusanteSVG} alt="Porta Jusante" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Controle deslizante para abertura */}
      <div className="flex items-center gap-4 mt-4">
        <span className="text-white font-bold">Fechada</span>
        <input
          type="range"
          min="0"
          max="100"
          value={abertura}
          onChange={handleAberturaChange}
          className="cursor-pointer"
        />
        <span className="text-white font-bold">Aberta</span>
      </div>

      {/* Exibir valor da abertura */}
      <span className="text-white mt-2 font-bold">Abertura: {abertura}%</span>
    </div>
  );
};

export default PortaJusante;
