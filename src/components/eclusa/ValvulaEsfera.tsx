import React from 'react';

interface ValvulaEsferaProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
  onClick?: () => void;
  className?: string;
}

const ValvulaEsfera: React.FC<ValvulaEsferaProps> = ({ 
  estado = false,
  onClick,
  className = ''
}) => {
  // Converter o estado para boolean caso seja número (0 = false, 1 = true)
  const estadoBoolean = typeof estado === 'number' ? Boolean(estado) : estado;
  
  // Define a cor de preenchimento com base no estado
  const fillColor = estadoBoolean ? "#FD6500" : "#753E00";
  
  return (
    <svg 
      width="18" 
      height="20" 
      viewBox="0 0 18 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <path 
        d="M14.4054 19V17.5L17 14.5V4L14.4054 1H3.59459L1 4V14.5L3.59459 17.5V19H14.4054Z" 
        fill={fillColor}
      />
      <path 
        d="M1 14.5L3.59459 17.5V19H14.4054V17.5L17 14.5M1 14.5H3.16216M1 14.5V4M1 4H3.16216M1 4L3.59459 1H14.4054L17 4M17 4H15.2703M17 4V14.5M17 14.5H15.2703" 
        stroke="black" 
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default ValvulaEsfera;

// Exemplo de uso:
// <ValvulaEsfera estado={0} /> -> Preenchimento marrom (#753E00)
// <ValvulaEsfera estado={1} /> -> Preenchimento laranja (#FD6500)
// <ValvulaEsfera estado={false} /> -> Preenchimento marrom (#753E00)
// <ValvulaEsfera estado={true} /> -> Preenchimento laranja (#FD6500)
// <ValvulaEsfera estado={1} onClick={() => console.log('Clicado!')} /> -> Com evento de clique