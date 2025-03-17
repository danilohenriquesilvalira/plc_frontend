import React, { useState, useEffect } from 'react';
import PortaJusanteReguaSVG from '../../assets/Eclusa/Porta_Jusante_Regua.svg';

interface PortaJusanteReguaProps {
  className?: string;
  nivel?: number;
  abertura?: number; // Adicionando esta prop como alternativa
}

const PortaJusanteRegua: React.FC<PortaJusanteReguaProps> = ({
  className = '',
  nivel,
  abertura: aberturaExterna
}) => {
  const [aberturaInterna, setAberturaInterna] = useState(0);
  
  // Usa o valor externo se fornecido (seja via nivel ou abertura), senão usa o interno
  const valorAbertura = aberturaExterna !== undefined 
    ? aberturaExterna 
    : nivel !== undefined 
      ? nivel 
      : aberturaInterna;
  
  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAberturaInterna(Number(event.target.value));
  };

  // Atualiza o estado interno quando o valor externo muda
  useEffect(() => {
    if (nivel !== undefined) {
      setAberturaInterna(nivel);
    } else if (aberturaExterna !== undefined) {
      setAberturaInterna(aberturaExterna);
    }
  }, [nivel, aberturaExterna]);

  const maxDeslocamento = 300;
  const deslocamentoVertical = (valorAbertura / 100) * maxDeslocamento;

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
      
      {/* Controle de abertura posicionado acima da porta e centralizado - só mostrar se não receber valor externo */}
      {nivel === undefined && aberturaExterna === undefined && (
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
            <span className="text-white font-bold min-w-10">{valorAbertura}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortaJusanteRegua;