import React from 'react';

interface ValvulaProps {
  // Status: 0 = gray (sem operação), 1 = green (true/operando), 2 = red (falha)
  status: 0 | 1 | 2;
  width?: number;
  height?: number;
  className?: string;
}

const Valvula: React.FC<ValvulaProps> = ({ 
  status = 0, 
  width = 74, 
  height = 74, 
  className = '' 
}) => {
  // Define colors based on status
  const getColor = () => {
    switch (status) {
      case 1: return "#00FF09"; // Verde para operacional
      case 2: return "#FF0000"; // Vermelho para falha
      default: return "#95a5a6"; // Cinza para inativo
    }
  };

  const color = getColor();

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 74 74" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Triângulo esquerdo */}
      <path 
        d="M10 39.4115L37 55L10 70.5885L10 39.4115Z" 
        fill={color} 
        stroke="black"
      />
      
      {/* Triângulo direito */}
      <path 
        d="M64 70.5885L37 55L64 39.4115L64 70.5885Z" 
        fill={color} 
        stroke="black"
      />
      
      {/* Linha vertical */}
      <path 
        d="M37 55V27" 
        stroke="black"
      />
      
      {/* Semicírculo superior */}
      <path 
        d="M63 27H10C10 27 12.4091 1 36.5 1C60.5909 1 63 27 63 27Z" 
        fill={color}
        stroke="black"
      />
    </svg>
  );
};

export default Valvula;