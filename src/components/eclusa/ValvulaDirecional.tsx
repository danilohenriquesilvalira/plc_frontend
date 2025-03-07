import React from 'react';

interface ValvulaDirecionalProps {
  // Status: 0 = centrada/neutra, 1 = posição A (esquerda), 2 = posição B (direita)
  position: 0 | 1 | 2;
  // Status do solenoide: 0 = ambos desligados, 1 = solenoide A ativo, 2 = solenoide B ativo
  solenoidStatus: 0 | 1 | 2;
  width?: number;
  height?: number;
  className?: string;
}

const ValvulaDirecional: React.FC<ValvulaDirecionalProps> = ({
  position = 0,
  solenoidStatus = 0,
  width = 200,
  height = 120,
  className = ''
}) => {
  // Cores para diferentes elementos
  const colors = {
    body: '#333',
    bodyStroke: '#000',
    flow: '#2196F3', // Azul para fluxo de fluido
    solenoidOff: '#666',
    solenoidOn: '#FF5722', // Laranja para solenoide ativo
    spring: '#AAA',
    valveCenter: '#555',
    centerPosition: '#444',
    leftPosition: '#3A3A3A',
    rightPosition: '#3A3A3A',
    connection: '#777',
    portStroke: '#000',
    background: 'transparent',
    text: '#FFF'
  };

  // Calcular a posição do êmbolo baseado no estado da válvula
  const valveOffset = position === 0 ? 0 : (position === 1 ? -30 : 30);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo transparente */}
      <rect width="200" height="120" fill={colors.background} />
      
      {/* Corpo da válvula */}
      <rect x="40" y="40" width="120" height="40" rx="2" fill={colors.body} stroke={colors.bodyStroke} strokeWidth="1.5" />
      
      {/* Portas (conexões) */}
      {/* A, B, P, T são as portas padrão em válvulas direcionais */}
      <rect x="60" y="25" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      <rect x="90" y="25" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      <rect x="130" y="25" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      
      <rect x="60" y="80" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      <rect x="90" y="80" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      <rect x="130" y="80" width="10" height="15" fill={colors.connection} stroke={colors.portStroke} />
      
      {/* Rótulos das portas */}
      <text x="63" y="22" fontSize="8" fill={colors.text}>P</text>
      <text x="93" y="22" fontSize="8" fill={colors.text}>A</text>
      <text x="133" y="22" fontSize="8" fill={colors.text}>B</text>
      
      <text x="63" y="102" fontSize="8" fill={colors.text}>T</text>
      <text x="93" y="102" fontSize="8" fill={colors.text}>T</text>
      <text x="133" y="102" fontSize="8" fill={colors.text}>T</text>
      
      {/* Solenoide Esquerdo */}
      <g transform="translate(15, 50)">
        <rect x="0" y="-10" width="20" height="20" rx="2" fill={solenoidStatus === 1 ? colors.solenoidOn : colors.solenoidOff} stroke={colors.bodyStroke} />
        <circle cx="10" cy="0" r="6" fill={colors.body} stroke={colors.bodyStroke} />
        <line x1="20" y1="0" x2="25" y2="0" stroke={colors.bodyStroke} strokeWidth="2" />
      </g>
      
      {/* Solenoide Direito */}
      <g transform="translate(165, 50)">
        <rect x="0" y="-10" width="20" height="20" rx="2" fill={solenoidStatus === 2 ? colors.solenoidOn : colors.solenoidOff} stroke={colors.bodyStroke} />
        <circle cx="10" cy="0" r="6" fill={colors.body} stroke={colors.bodyStroke} />
        <line x1="0" y1="0" x2="5" y2="0" stroke={colors.bodyStroke} strokeWidth="2" />
      </g>
      
      {/* Molas de retorno */}
      <g transform="translate(25, 50)">
        <path d="M0,0 L2,-3 L4,3 L6,-3 L8,3 L10,-3 L12,3 L14,-3 L15,0" stroke={colors.spring} strokeWidth="1.5" fill="none" />
      </g>
      
      <g transform="translate(160, 50)">
        <path d="M0,0 L1,-3 L3,3 L5,-3 L7,3 L9,-3 L11,3 L13,-3 L15,0" stroke={colors.spring} strokeWidth="1.5" fill="none" />
      </g>
      
      {/* Êmbolo da válvula (se move baseado na posição) */}
      <g transform={`translate(${100 + valveOffset}, 50)`}>
        {/* Posição central (neutra) */}
        <g opacity={position === 0 ? 1 : 0.3}>
          <rect x="-30" y="-8" width="60" height="16" fill={colors.centerPosition} stroke={colors.bodyStroke} strokeWidth="0.5" rx="1" />
          
          {/* Caminhos de fluxo na posição central */}
          <path d="M-20,-8 L-20,-15 M-20,8 L-20,15" stroke={colors.flow} strokeWidth="1.5" />
          <path d="M0,-8 L0,-15 M0,8 L0,15" stroke={colors.flow} strokeWidth="1.5" />
          <path d="M20,-8 L20,-15 M20,8 L20,15" stroke={colors.flow} strokeWidth="1.5" />
        </g>
        
        {/* Posição A (esquerda) */}
        <g opacity={position === 1 ? 1 : 0.3} transform="translate(-30, 0)">
          <rect x="-30" y="-8" width="60" height="16" fill={colors.leftPosition} stroke={colors.bodyStroke} strokeWidth="0.5" rx="1" />
          
          {/* Caminhos de fluxo na posição A */}
          <path d="M-20,-8 L-20,-15 L0,-15 L0,-8" stroke={colors.flow} strokeWidth="1.5" fill="none" />
          <path d="M20,-8 L20,-15 M20,8 L20,15" stroke={colors.flow} strokeWidth="1.5" />
          <path d="M0,8 L0,15 L-20,15 L-20,8" stroke={colors.flow} strokeWidth="1.5" fill="none" />
        </g>
        
        {/* Posição B (direita) */}
        <g opacity={position === 2 ? 1 : 0.3} transform="translate(30, 0)">
          <rect x="-30" y="-8" width="60" height="16" fill={colors.rightPosition} stroke={colors.bodyStroke} strokeWidth="0.5" rx="1" />
          
          {/* Caminhos de fluxo na posição B */}
          <path d="M-20,-8 L-20,-15 M-20,8 L-20,15" stroke={colors.flow} strokeWidth="1.5" />
          <path d="M0,-8 L0,-15 L20,-15 L20,-8" stroke={colors.flow} strokeWidth="1.5" fill="none" />
          <path d="M0,8 L0,15 L20,15 L20,8" stroke={colors.flow} strokeWidth="1.5" fill="none" />
        </g>
      </g>
    </svg>
  );
};

export default ValvulaDirecional;