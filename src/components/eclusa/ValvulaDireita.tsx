import React from 'react';

interface ValvulaDireitaProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
  onClick?: () => void; // Função opcional para lidar com cliques
}

const ValvulaDireita: React.FC<ValvulaDireitaProps> = ({ 
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
        x="12.5" 
        y="7.5" 
        width="43" 
        height="22" 
        fill={retanguloColor} 
        stroke="black"
      />
      
      {/* Tubo marrom - visível quando estado é false/0 */}
      {!estadoBoolean && (
        <path d="M29 8L29 30" stroke="#753E00" strokeWidth="10" />
      )}
      
      {/* Tubo laranja - visível quando estado é true/1 */}
      {estadoBoolean && (
        <path d="M29 30V24L49 12.5V8" stroke="#E95D00" strokeWidth="10" />
      )}
      
      {/* Linha - muda para verde quando estado é true/1, caso contrário, fica cinza */}
      <path 
        d="M12 25H0" 
        stroke={estadoBoolean ? "#00C000" : "#C0C0C0"} 
        strokeWidth="10" 
      />
      
      {/* Elementos fixos que sempre aparecem */}
      <path d="M34 30L23 30L23 37L34 37L34 30Z" fill="#900000" stroke="#900000"/>
      <path d="M35 1L24 1L24 8L35 8L35 1Z" fill="#900000" stroke="#900000"/>
      <path d="M55 1L43 1L43 8L55 8L55 1Z" fill="#900000" stroke="#900000"/>
    </svg>
  );
};

export default ValvulaDireita;

// Exemplo de uso:
// <ValvulaDireita estado={0} /> -> Retângulo branco, tubo marrom visível, linha cinza
// <ValvulaDireita estado={1} /> -> Retângulo verde, tubo laranja visível, linha verde