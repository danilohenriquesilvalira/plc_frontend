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
    return state === 1 ? 'rgb(219, 88, 0)' : 'rgb(117, 62, 0)'; // Laranja se ativo, marrom se inativo
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
        d="M417 286V422.5" 
        stroke={getColor('pipe1')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe1')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 2 */}
      <path 
        d="M395.5 200H440.5C441.605 200 442.5 200.895 442.5 202V279C442.5 280.105 441.605 281 440.5 281H392.5" 
        stroke={getColor('pipe2')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe2')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 3 */}
      <path 
        d="M202 319.5H286C287.105 319.5 288 318.605 288 317.5V17C288 15.8954 288.895 15 290 15H443M443 15V178.5C443 179.605 442.105 180.5 441 180.5H396M443 15H487.5C488.605 15 489.5 15.8954 489.5 17V32.5" 
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
        d="M96.5 31.5H53.5C52.3954 31.5 51.5 32.3954 51.5 33.5V287.5V316.5C51.5 317.605 52.3954 318.5 53.5 318.5H96.5" 
        stroke={getColor('pipe5')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe5')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 6 */}
      <path 
        d="M32 319.5H25C23.8954 319.5 23 320.395 23 321.5V346C23 347.105 23.8954 348 25 348H318.5C319.605 348 320.5 347.105 320.5 346V182C320.5 180.895 321.395 180 322.5 180H358" 
        stroke={getColor('pipe6')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe6')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 7 */}
      <path 
        d="M489 50V126" 
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
        d="M489 236.5V399" 
        stroke={getColor('pipe9')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe9')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 10 */}
      <path 
        d="M488 15H538C539.105 15 540 15.8954 540 17V32.5" 
        stroke={getColor('pipe10')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe10')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 11 */}
      <path 
        d="M538 15H588C589.105 15 590 15.8954 590 17V33V176C590 177.105 589.105 178 588 178H511.5C510.395 178 509.5 178.895 509.5 180V199" 
        stroke={getColor('pipe11')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe11')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 12 */}
      <path 
        d="M539 50V110C539 111.105 538.105 112 537 112H511C509.895 112 509 112.895 509 114V126" 
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
        d="M883 200.536H838C836.895 200.536 836 201.432 836 202.536V279.536C836 280.641 836.895 281.536 838 281.536H886" 
        stroke={getColor('pipe14')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe14')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 15 */}
      <path 
        d="M1076.5 320.036H992.5C991.395 320.036 990.5 319.14 990.5 318.036V17.5361C990.5 16.4316 989.605 15.5361 988.5 15.5361H835.5M835.5 15.5361V179.036C835.5 180.141 836.395 181.036 837.5 181.036H882.5M835.5 15.5361H791C789.895 15.5361 789 16.4316 789 17.5361V33.0361" 
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
        d="M1182 32.0361H1225C1226.1 32.0361 1227 32.9316 1227 34.0361V288.036V317.036C1227 318.14 1226.1 319.036 1225 319.036H1182" 
        stroke={getColor('pipe17')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe17')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 18 */}
      <path 
        d="M1246.5 320.036H1253.5C1254.6 320.036 1255.5 320.931 1255.5 322.036V346.536C1255.5 347.641 1254.6 348.536 1253.5 348.536H960C958.895 348.536 958 347.641 958 346.536V182.536C958 181.432 957.105 180.536 956 180.536H920.5" 
        stroke={getColor('pipe18')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe18')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 19 */}
      <path 
        d="M789.5 50.5361V126.536" 
        stroke={getColor('pipe19')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe19')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 20 */}
      <path 
        d="M789 163.608V199.533" 
        stroke={getColor('pipe20')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe20')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 21 */}
      <path 
        d="M789.5 237.036V399.536" 
        stroke={getColor('pipe21')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe21')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 22 */}
      <path 
        d="M790.5 15.5361H740.5C739.395 15.5361 738.5 16.4316 738.5 17.5361V33.0361" 
        stroke={getColor('pipe22')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe22')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 23 */}
      <path 
        d="M740.5 15.5361H690.5C689.395 15.5361 688.5 16.4316 688.5 17.5361V33.5361V176.536C688.5 177.641 689.395 178.536 690.5 178.536H767C768.105 178.536 769 179.431 769 180.536V199.536" 
        stroke={getColor('pipe23')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe23')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
      
      {/* Pipe 24 */}
      <path 
        d="M739.5 50.5361V110.536C739.5 111.641 740.395 112.536 741.5 112.536H767.5C768.605 112.536 769.5 113.431 769.5 114.536V126.536" 
        stroke={getColor('pipe24')} 
        strokeWidth="10"
        onClick={() => handlePipeClick('pipe24')}
        style={{ cursor: onPipeClick ? 'pointer' : 'default' }}
      />
    </svg>
  );
};

export default PipeSystem;