import React from 'react';

interface CilindroEnchimentoProps {
  estado?: boolean | number; // Aceita boolean ou número (0/1)
}

const CilindroEnchimento: React.FC<CilindroEnchimentoProps> = ({ 
  estado = false
}) => {
  // Converter o estado para boolean caso seja número (0 = false, 1 = true)
  const estadoBoolean = typeof estado === 'number' ? Boolean(estado) : estado;
  
  // Define a cor do retângulo de acordo com o estado
  const corRetangulo = estadoBoolean ? "#FC6500" : "#753E00";
  
  return (
    <svg width="108" height="378" viewBox="0 0 108 378" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Retângulo central - muda de cor conforme o estado */}
      <rect 
        x="16" 
        y="25" 
        width="76" 
        height="263" 
        fill={corRetangulo} 
        stroke="black" 
        strokeWidth="2"
      />
      
      {/* Elementos fixos que sempre aparecem com as mesmas cores */}
      <path d="M96 24.5V20.5H99.5V5H96V1H12V5H8.5V20.5H12.5L12.5 24.5H90.0001H96Z" fill="black" stroke="black"/>
      <path d="M8 20.5V5H1V20.5H8Z" fill="#900000" stroke="#900000"/>
      <path d="M107 20.5V5H100V20.5H107Z" fill="#900000" stroke="#900000"/>
      <path d="M12.5 377.5V313H96L96.5 377.5H12.5Z" fill="black" stroke="#737373"/>
      <path d="M96 312.5V308.5H99.5V293H96V289H12V293H8.5V308.5H12.5L12.5 312.5H90.0001H96Z" fill="black" stroke="black"/>
      <path d="M8 308.5V293H1V308.5H8Z" fill="#900000" stroke="#900000"/>
      <path d="M107 308.5V293H100V308.5H107Z" fill="#900000" stroke="#900000"/>
    </svg>
  );
};

export default CilindroEnchimento;

// Exemplo de uso:
// <CilindroEnchimento estado={0} /> -> Retângulo marrom (#753E00)
// <CilindroEnchimento estado={1} /> -> Retângulo laranja (#FC6500)
// <CilindroEnchimento estado={false} /> -> Retângulo marrom (#753E00)
// <CilindroEnchimento estado={true} /> -> Retângulo laranja (#FC6500)