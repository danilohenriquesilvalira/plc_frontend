import React from 'react';

interface ValvulaEsquerdaProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
  onClick?: () => void; // Função opcional para lidar com cliques
}

const ValvulaEsquerda: React.FC<ValvulaEsquerdaProps> = ({ 
  estado = false,
  onClick
}) => {
  // Converter o estado para boolean caso seja número (0 = false, 1 = true)
  const estadoBoolean = typeof estado === 'number' ? Boolean(estado) : estado;
  
  // Cor do retângulo: verde quando estado é true/1, branco quando é false/0
  const retanguloColor = estadoBoolean ? "#00C000" : "#D9D9D9";
  
  return (
    <svg 
      width="56" 
      height="38" 
      viewBox="0 0 56 38" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <rect 
        x="-0.5" 
        y="0.5" 
        width="43" 
        height="22" 
        transform="matrix(-1 8.74228e-08 8.74228e-08 1 43 7)" 
        fill={retanguloColor} 
        stroke="black"
      />
      
      {/* Tubo marrom - visível quando estado é false/0 */}
      {!estadoBoolean && (
        <path d="M27 8L27 30" stroke="#753E00" strokeWidth="10" />
      )}
      
      {/* Tubo laranja - visível quando estado é true/1 */}
      {estadoBoolean && (
        <path d="M27 30L27 24L7 12.5L7 8" stroke="#E95D00" strokeWidth="10" />
      )}
      
      {/* Linha - muda para verde quando estado é true/1, caso contrário, fica cinza */}
      <path 
        d="M44 25L56 25" 
        stroke={estadoBoolean ? "#00C000" : "#C0C0C0"} 
        strokeWidth="10" 
      />
      
      {/* Elementos fixos que sempre aparecem */}
      <path d="M20 30.5L33 30.5L33 37.5L20 37.5L20 30.5Z" fill="#900000" stroke="#900000"/>
      <path d="M21 1.5L33 1.5L33 8.5L21 8.5L21 1.5Z" fill="#900000" stroke="#900000"/>
      <path d="M1 1L12 1L12 8L1 8L1 1Z" fill="#900000" stroke="#900000"/>
    </svg>
  );
};

export default ValvulaEsquerda;

// Exemplo de uso:
// <ValvulaEsquerda estado={0} /> -> Retângulo branco, tubo marrom visível, linha cinza
// <ValvulaEsquerda estado={1} /> -> Retângulo verde, tubo laranja visível, linha verde