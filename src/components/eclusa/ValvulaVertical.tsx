import React from 'react';

interface ValvulaVerticalProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
  onClick?: () => void; // Função opcional para lidar com cliques
}

const ValvulaVertical: React.FC<ValvulaVerticalProps> = ({ 
  estado = false,
  onClick
}) => {
  // Converter o estado para boolean caso seja número (0 = false, 1 = true)
  const estadoBoolean = typeof estado === 'number' ? Boolean(estado) : estado;
  
  return (
    <svg 
      width="39" 
      height="43" 
      viewBox="0 0 39 43" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <path d="M8 39V27H1V39H8Z" fill="#900000" stroke="#900000"/>
      <path d="M38 39V27H31V39H38Z" fill="#900000" stroke="#900000"/>
      <path d="M11 8L23 8L23 1L11 0.999999L11 8Z" fill="#900000" stroke="#900000"/>
      <rect x="7.5" y="8.5" width="23" height="34" fill="#D9D9D9" stroke="black"/>
      
      {/* Tubo marrom - visível quando estado é false/0 */}
      {!estadoBoolean && (
        <path d="M8 33H30" stroke="#753E00" strokeWidth="10" />
      )}
      
      {/* Tubo laranja - visível quando estado é true/1 */}
      {estadoBoolean && (
        <path d="M17.5 9V31C17.5 32.1046 18.3954 33 19.5 33H30" stroke="#FC6500" strokeWidth="10" />
      )}
    </svg>
  );
};

export default ValvulaVertical;

// Exemplo de uso:
// <ValvulaVertical estado={0} /> -> Tubo marrom horizontal
// <ValvulaVertical estado={1} /> -> Tubo laranja em formato de L
// <ValvulaVertical estado={false} /> -> Tubo marrom horizontal
// <ValvulaVertical estado={true} /> -> Tubo laranja em formato de L