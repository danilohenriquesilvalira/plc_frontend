import React, { useState } from 'react';

interface PipeSystemProps {
  pipeStates: {[key: string]: 0 | 1}; // 0 = inativo, 1 = ativo
  onPipeClick?: (pipeId: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

const PipeSystem: React.FC<PipeSystemProps> = ({ 
  pipeStates, 
  onPipeClick, 
  width = 545, 
  height = 447, 
  className = '' 
}) => {
  // Cores baseadas no estado
  const getColor = (pipeId: string) => {
    const state = pipeStates[pipeId] || 0;
    return state === 1 ? '#ff9500' : '#753E00'; // Laranja se ativo, marrom se inativo
  };

  // Manipulador de clique para os pipes
  const handlePipeClick = (pipeId: string) => {
    if (onPipeClick) onPipeClick(pipeId);
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 545 447" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g 
        id="pipe1" 
        onClick={() => handlePipeClick('pipe1')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M539.5 106V167" stroke={getColor('pipe1')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe2" 
        onClick={() => handlePipeClick('pipe2')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M539.5 42.5V90" stroke={getColor('pipe2')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe3" 
        onClick={() => handlePipeClick('pipe3')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M386 115H460C461.105 115 462 114.105 462 113V7.5C462 6.39543 462.895 5.5 464 5.5H537.5C538.605 5.5 539.5 6.39543 539.5 7.5V26.5" stroke={getColor('pipe3')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe4" 
        onClick={() => handlePipeClick('pipe4')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M62.5 280.5V34C62.5 32.8954 63.3954 32 64.5 32H116.5" stroke={getColor('pipe4')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe5" 
        onClick={() => handlePipeClick('pipe5')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M73.5 297.5H118.5" stroke={getColor('pipe5')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe6" 
        onClick={() => handlePipeClick('pipe6')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M365 136.5L303.5 136.5C302.395 136.5 301.5 137.395 301.5 138.5V347.5C301.5 348.605 300.605 349.5 299.5 349.5H36C34.8954 349.5 34 348.605 34 347.5V298C34 296.895 34.8954 296 36 296H51.5" stroke={getColor('pipe6')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe7" 
        onClick={() => handlePipeClick('pipe7')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M204.5 32.5H261C262.105 32.5 263 31.6046 263 30.5V8.5C263 7.39543 262.105 6.5 261 6.5H7.49999C6.39542 6.5 5.5 7.39543 5.5 8.5V370.5C5.5 371.605 6.39543 372.5 7.5 372.5H331.5C332.605 372.5 333.5 371.605 333.5 370.5V277C333.5 275.895 334.395 275 335.5 275H364.5" stroke={getColor('pipe7')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe8" 
        onClick={() => handlePipeClick('pipe8')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M386 275H430M430 275V447M430 275H461C462.105 275 463 274.105 463 273V138C463 136.895 462.105 136 461 136H386" stroke={getColor('pipe8')} strokeWidth="10"/>
      </g>
      
      <g 
        id="pipe9" 
        onClick={() => handlePipeClick('pipe9')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      >
        <path d="M539.5 183.5V442" stroke={getColor('pipe9')} strokeWidth="10"/>
      </g>
    </svg>
  );
};

export default PipeSystem;