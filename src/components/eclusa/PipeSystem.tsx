import React from 'react';

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
  width = 1278, 
  height = 424, 
  className = '' 
}) => {
  // Cores baseadas no estado - cores exatas conforme solicitado
  const getColor = (pipeId: string) => {
    const state = pipeStates[pipeId] || 0;
    return state === 1 ? '#FC6500' : '#753E00'; // Laranja se ativo, marrom se inativo
  };

  // Manipulador de clique para os pipes
  const handlePipeClick = (pipeId: string) => {
    if (onPipeClick) onPipeClick(pipeId);
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 1278 424" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pipe 1 */}
      <path 
        d="M417 285.5L417 422.5" 
        stroke={getColor('pipe1')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe1')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 2 */}
      <path 
        d="M392.5 200H440.512C441.612 200 442.506 200.888 442.512 201.988L442.988 278.488C442.994 279.597 442.097 280.5 440.988 280.5H398.5" 
        stroke={getColor('pipe2')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe2')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 3 */}
      <path 
        d="M202.5 319H217M443 15H290C288.895 15 288 15.8954 288 17V317C288 318.105 287.105 319 286 319H249M443 15V178C443 179.105 442.105 180 441 180H394M443 15H487.5C488.605 15 489.5 15.8954 489.5 17V32.5M489.5 50V56V61.5" 
        stroke={getColor('pipe3')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe3')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 4 */}
      <path 
        d="M203 30.5H237.5C238.605 30.5 239.5 29.6046 239.5 28.5V7C239.5 5.89543 238.605 5 237.5 5H7.5C6.39543 5 5.5 5.89543 5.5 7V366.5C5.5 367.605 6.39543 368.5 7.5 368.5H351.5C352.605 368.5 353.5 367.605 353.5 366.5V282.5C353.5 281.395 354.395 280.5 355.5 280.5H369.211" 
        stroke={getColor('pipe4')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe4')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 5 */}
      <path 
        d="M96.5 31.5H49.5C48.3954 31.5 47.5 32.3954 47.5 33.5L47.5 286.5M66.5 318.5H96.5" 
        stroke={getColor('pipe5')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe5')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 6 - Parte 1 */}
      <path 
        d="M23 319.5V348M320.5 348V182C320.5 180.895 321.395 180 322.5 180H358" 
        stroke={getColor('pipe6')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe6')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 6 - Parte 2 */}
      <path 
        d="M32.5 318.5H25C23.8954 318.5 23 319.395 23 320.5V347.5C23 348.605 23.8954 349.5 25 349.5H260M358 180H322.5C321.395 180 320.5 180.895 320.5 182V347.5C320.5 348.605 319.605 349.5 318.5 349.5H291.5" 
        stroke={getColor('pipe6')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe6')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 7 */}
      <path 
        d="M489 85.5L489 142" 
        stroke={getColor('pipe7')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe7')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 8 */}
      <path 
        d="M489.5 163.071V198.997" 
        stroke={getColor('pipe8')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe8')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 9 */}
      <path 
        d="M489 230.5V399" 
        stroke={getColor('pipe9')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe9')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 10 */}
      <path 
        d="M488 15H538C539.105 15 540 15.8954 540 17V32.5M540 50V61.5" 
        stroke={getColor('pipe10')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe10')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 11 */}
      <path 
        d="M538 15H588C589.105 15 590 15.8954 590 17V32M509.5 199V180C509.5 178.895 510.395 178 511.5 178H588C589.105 178 590 177.105 590 176V86M590 61.5V49.5" 
        stroke={getColor('pipe11')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe11')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 12 */}
      <path 
        d="M539 86V110C539 111.105 538.105 112 537 112H511C509.895 112 509 112.895 509 114L509 133" 
        stroke={getColor('pipe12')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe12')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 13 */}
      <path 
        d="M861.5 286.536V423.036" 
        stroke={getColor('pipe13')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe13')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 14 */}
      <path 
        d="M883 201.5L838 201.5C836.895 201.5 836 202.395 836 203.5V279.536C836 280.641 836.895 281.536 838 281.536H886" 
        stroke={getColor('pipe14')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe14')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 15 */}
      <path 
        d="M835.5 15.5361H988.5C989.605 15.5361 990.5 16.4316 990.5 17.5361V318.036C990.5 319.14 991.395 320.036 992.5 320.036H1030.5M835.5 15.5361V179.036C835.5 180.141 836.395 181.036 837.5 181.036H882.5M835.5 15.5361H791C789.895 15.5361 789 16.4316 789 17.5361V33.0361M1057.5 320.036H1075.5M789 61.5V49.5" 
        stroke={getColor('pipe15')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe15')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 16 */}
      <path 
        d="M1075.5 31.0361H1041C1039.9 31.0361 1039 30.1407 1039 29.0361V7.53613C1039 6.43156 1039.9 5.53613 1041 5.53613H1271C1272.1 5.53613 1273 6.43156 1273 7.53613V367.036C1273 368.14 1272.1 369.036 1271 369.036H927C925.895 369.036 925 368.14 925 367.036V283.036C925 281.931 924.105 281.036 923 281.036H909.289" 
        stroke={getColor('pipe16')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe16')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 17 */}
      <path 
        d="M1181.5 31H1225C1226.1 31 1227 31.8954 1227 33V288.036M1209.5 319.036H1182" 
        stroke={getColor('pipe17')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe17')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 18 */}
      <path 
        d="M1246.5 320.036H1253.5C1254.6 320.036 1255.5 320.931 1255.5 322.036V347.5C1255.5 348.605 1254.6 349.5 1253.5 349.5H1019M918.5 181H956C957.105 181 958 181.895 958 183V347.5C958 348.605 958.895 349.5 960 349.5H987" 
        stroke={getColor('pipe18')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe18')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 19 */}
      <path 
        d="M789.5 86V126.536" 
        stroke={getColor('pipe19')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe19')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 20 */}
      <path 
        d="M789 163V199.533" 
        stroke={getColor('pipe20')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe20')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 21 */}
      <path 
        d="M789.5 236V399.536" 
        stroke={getColor('pipe21')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe21')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 22 */}
      <path 
        d="M790.5 15.5361H740.5C739.395 15.5361 738.5 16.4316 738.5 17.5361V32M738.5 62V50" 
        stroke={getColor('pipe22')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe22')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 23 */}
      <path 
        d="M740.5 15.5361H690.5C689.395 15.5361 688.5 16.4316 688.5 17.5361V32M769 199.536V180.536C769 179.431 768.105 178.536 767 178.536H690.5C689.395 178.536 688.5 177.641 688.5 176.536V86M688.5 61.5V49.5" 
        stroke={getColor('pipe23')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe23')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 24 */}
      <path 
        d="M739.5 85.5V106.5C739.5 107.605 740.395 108.5 741.5 108.5H767.5C768.605 108.5 769.5 109.395 769.5 110.5V126.536" 
        stroke={getColor('pipe24')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe24')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
    </svg>
  );
};

export default PipeSystem;