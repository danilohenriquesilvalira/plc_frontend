import React from 'react';
import CaldeiraSVG from '../../assets/Eclusa/Caldeira.svg';

interface CaldeiraPorps {
  // Opcional: propriedades para ajuste de posição, caso necessário
  offsetX?: number;
  offsetY?: number;
}

const Caldeira: React.FC<CaldeiraPorps> = ({ offsetX = 0, offsetY = 0 }) => {
  return (
    <div className="caldeira-container">
      <img 
        src={CaldeiraSVG}
        alt="Caldeira"
        style={{
          width: '1676px',
          height: '420px',
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      />
    </div>
  );
};

export default Caldeira;