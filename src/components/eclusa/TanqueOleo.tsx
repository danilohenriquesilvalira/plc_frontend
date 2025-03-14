import React from 'react';

interface TanqueOleoProps {
  // Nível de óleo no tanque (0 a 100)
  nivel: number;
  width?: number;
  height?: number;
  className?: string;
}

const TanqueOleo: React.FC<TanqueOleoProps> = ({
  nivel = 0,
  width = 511,
  height = 137,
  className = ''
}) => {
  // Garantir que o nível esteja entre 0 e 100
  const nivelValidado = Math.max(0, Math.min(100, nivel));

  // Calcular a altura do nível de óleo com base na porcentagem
  // Subtraímos 16 (10 do topo + 5 da borda superior + 1 da borda inferior) para compensar a borda e o topo
  const alturaDisponivel = height - 16;
  const alturaOleo = (nivelValidado / 100) * alturaDisponivel;

  // Ajustado: o óleo sempre começa de baixo
  const yOleo = height - 6 - alturaOleo;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 511 137"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo do tanque (cinza) */}
      <rect x="0.5" y="5.5" width="510" height="131" fill="#989898" stroke="black"/>
      {/* Borda superior */}
      <path d="M5 5L506 5" stroke="#A3A3A2" strokeWidth="10" strokeLinecap="round"/>
      
      {/* Nível de óleo (laranja) - sempre começa de baixo */}
      {nivelValidado > 0 && (
        <rect
          x="1"
          y={yOleo}
          width="509"
          height={alturaOleo}
          fill="#FC6500"
        />
      )}
      
      {/* Texto do percentual */}
      <text
        x="255"
        y="75"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontWeight="bold"
        fontSize="24"
      >
        {nivelValidado}%
      </text>
    </svg>
  );
};

export default TanqueOleo;