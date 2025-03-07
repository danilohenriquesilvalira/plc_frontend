import React from 'react';

interface NivelProps {
  // Valor de 0 a 100 para controlar o nível de preenchimento
  nivel: number;
  // Opcional: propriedades para ajuste de posição, caso necessário
  offsetX?: number;
  offsetY?: number;
}

const Nivel: React.FC<NivelProps> = ({ nivel, offsetX = 0, offsetY = 0 }) => {
  // Garantir que o nível esteja entre 0 e 100
  const nivelSeguro = Math.max(0, Math.min(100, nivel));
  
  // Altura total do SVG é 364
  const alturaSVG = 364;
  
  // Calculando a altura com base no nível (0% = nada, 100% = cheio)
  const alturaAgua = (nivelSeguro / 100) * alturaSVG;
  
  // A diferença entre a altura total e a altura da água
  const posicaoY = alturaSVG - alturaAgua;
  
  return (
    <div 
      className="nivel-container"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        position: 'relative',
        width: '1674px',
        height: '364px',
        overflow: 'hidden'
      }}
    >
      {/* Container fixo com a altura total */}
      <svg width="1674" height="364" viewBox="0 0 1674 364" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Clipping para mostrar apenas a parte de baixo baseada no nível da água */}
        <defs>
          <clipPath id="nivel-clip">
            <rect x="0" y={posicaoY} width="1670" height={alturaAgua} />
          </clipPath>
        </defs>
        
        {/* Usando o clipPath para mostrar apenas a parte inferior */}
        <g clipPath="url(#nivel-clip)">
          <path 
            d="M1 200H385.5V123H415.5V77.5L408.5 74V66H448.5V345L459.5 363H1673V205H1441V1H1V200Z" 
            fill="#0009FF" 
            stroke="black"
          />
        </g>
      </svg>
    </div>
  );
};

export default Nivel;