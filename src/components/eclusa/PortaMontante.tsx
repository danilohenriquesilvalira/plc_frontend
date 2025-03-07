import React, { useState } from 'react';
import PortaMontanteSVG from '../../assets/Eclusa/Porta_Montante.svg'; // Caminho correto do SVG

const PortaMontante: React.FC = () => {
  const [abertura, setAbertura] = useState(0); // Estado inicial: 0% (fechada)

  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAbertura(Number(event.target.value));
  };

  return (
    <div className="flex items-center gap-4"> 
      {/* SVG da Porta Montante com transformação de movimento vertical */}
      <div
        style={{
          width: '85px', // Ajuste conforme necessário
          height: '181px',
          transform: `translateY(${(100 - abertura) * 1.5}px)`, // Move para cima ao abrir
          transition: 'transform 0.5s linear', // Suaviza a animação
        }}
      >
        <img src={PortaMontanteSVG} alt="Porta Montante" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Controle deslizante ao lado da porta */}
      <div className="flex flex-col items-center">
        <span className="text-white font-bold mb-1">Abertura</span>
        <input
          type="range"
          min="0"
          max="100"
          value={abertura}
          onChange={handleAberturaChange}
          className="cursor-pointer"
        />
        <span className="text-white mt-2 font-bold">{abertura}%</span>
      </div>
    </div>
  );
};

export default PortaMontante;
