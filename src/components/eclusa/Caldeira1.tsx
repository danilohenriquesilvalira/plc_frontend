import React from 'react';
import Caldeira1SVG from '../../assets/Eclusa/Caldeira1.svg';

interface Caldeira1Props {
  // Opcional: propriedades para ajuste de posição, caso necessário
  offsetX?: number;
  offsetY?: number;
}

const Caldeira1: React.FC<Caldeira1Props> = ({ offsetX = 0, offsetY = 0 }) => {
  return (
    <div className="caldeira1-container">
      <img 
        src={Caldeira1SVG}
        alt="Caldeira1"
        style={{
          width: '1672px',
          height: '429px',
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      />
    </div>
  );
};

export default Caldeira1;