import React from 'react';

interface MotorMontanteProps {
  // Status: 0 = inativo (cinza), 1 = operando (verde), 2 = falha (vermelho)
  status: 0 | 1 | 2;
  width?: number;
  height?: number;
  className?: string;
}

const MotorMontante: React.FC<MotorMontanteProps> = ({ 
  status = 0, 
  width = 63, 
  height = 40, 
  className = '' 
}) => {
  // Define colors based on status
  const getMainColor = () => {
    switch (status) {
      case 1: return "#2ecc71"; // Verde para operacional
      case 2: return "#e74c3c"; // Vermelho para falha
      default: return "#95a5a6"; // Cinza para inativo
    }
  };

  // Cor principal do motor baseada no status
  const mainColor = getMainColor();
  
  // Cores secundárias que também mudam com o status
  const secondaryColor = status === 1 ? "#27ae60" : (status === 2 ? "#c0392b" : "#7f8c8d");
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 63 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0.999917 9.45996H4.53345V26.3437H0.999917V9.45996Z" fill="url(#paint0_linear_1866_88)" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Corpo principal do motor - Muda de cor com o status */}
      <path d="M10.3816 1H52.6187V34.8046H10.3816V1Z" fill={mainColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M10.6913 4.49609H52.3911V10.2418H10.6913V4.49609Z" fill="url(#paint2_linear_1866_88)"/>
      <path d="M52.3706 1.09375H52.5359V34.731H52.3706V1.09375Z" fill="url(#paint3_linear_1866_88)"/>
      
      {/* Parte lateral do motor - Também muda de cor */}
      <path d="M10.3816 31.5142L4.5337 28.3159V7.50882L10.3816 4.29199V31.5142Z" fill={secondaryColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M4.65741 13.1614L10.2573 11.7297V7.08105L4.65741 9.60989V13.1614Z" fill="url(#paint5_linear_1866_88)"/>
      
      {/* Outra parte lateral do motor - Também muda de cor */}
      <path d="M62 32.722L52.6186 34.8046V1L62 3.08257V32.722Z" fill={secondaryColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M52.8667 10.2418L61.8555 11.2087V6.16959L52.8667 4.49609V10.2418Z" fill="url(#paint7_linear_1866_88)"/>
      <path d="M11.6008 2.9896L11.3115 3.21273V4.55153H12.7786V5.18374H47.9486V4.12386H11.5801V2.9896H11.6008ZM11.6008 8.43776H47.9692V10.0183H12.7993V8.86543H11.3321V7.52663L11.6214 7.3035V8.43776H11.6008ZM11.6008 1V2.09707H47.9692V3.04538H12.7993V2.58052H11.3321V1.24173L11.6008 1ZM11.6008 5.12795V6.2994H47.9692V7.35928H12.7993V6.70848H11.3321V5.36968L11.6008 5.12795ZM11.6008 9.9625V11.1153H47.9692V13.2165H12.7993V11.543H11.3321V10.2042L11.6008 9.9625ZM11.6008 13.1421V14.295H47.9692V16.3962H12.7993V14.7227H11.3321V13.3839L11.6008 13.1421ZM11.6008 16.3404V17.4932H47.9692V19.5944H12.7993V17.9209H11.3321V16.5635L11.6008 16.3404Z" fill="url(#paint8_linear_1866_88)"/>
      <path d="M47.9487 2.09707H11.5802V1H47.9487V2.09707ZM47.9487 4.14245H11.5802V3.04538H47.9487V4.14245ZM47.9487 6.2994H11.5802V5.20233H47.9487V6.2994ZM47.9487 8.43776H11.5802V7.34069H47.9487V8.43776ZM47.9487 11.1153H11.5802V10.0183H47.9487V11.1153ZM47.9487 14.295H11.5802V13.2165H47.9487V14.295ZM47.9487 17.4932H11.5802V16.3962H47.9487V17.4932Z" fill="url(#paint9_linear_1866_88)" stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Base do motor - Permanece com cor original */}
      <path d="M15.1135 34.8057H48.7544V38.9894H15.1135V34.8057Z" fill="url(#paint10_linear_1866_88)" stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.1135 34.8057H48.7544V36.1259H15.1135V34.8057Z" fill="#646567" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29.1648 38.9882V22.0859C29.1648 22.0859 28.9168 23.1086 27.6563 25.0796C27.6563 25.0796 27.4704 32.4802 26.0239 34.8045V38.9882H29.1648Z" fill="#646567" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Painel frontal do motor - Também muda de cor */}
      <path d="M29.165 22.1055H45.6135V39.0078H29.165V22.1055Z" fill={mainColor} stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M43.9603 23.0909C43.9603 23.3698 44.2083 23.593 44.5182 23.593C44.8282 23.593 45.0762 23.3698 45.0762 23.0909C45.0762 22.812 44.8282 22.5889 44.5182 22.5889C44.2083 22.5889 43.9603 22.812 43.9603 23.0909ZM30.2808 22.5889C30.5908 22.5889 30.8387 22.812 30.8387 23.0909C30.8387 23.3698 30.5908 23.593 30.2808 23.593C29.9709 23.593 29.7229 23.3698 29.7229 23.0909C29.7229 22.812 29.9709 22.5889 30.2808 22.5889ZM44.5182 37.483C44.8282 37.483 45.0762 37.7061 45.0762 37.985C45.0762 38.2639 44.8282 38.4871 44.5182 38.4871C44.2083 38.4871 43.9603 38.2639 43.9603 37.985C43.9603 37.7061 44.2083 37.483 44.5182 37.483ZM30.2808 37.483C30.5908 37.483 30.8387 37.7061 30.8387 37.985C30.8387 38.2639 30.5908 38.4871 30.2808 38.4871C29.9709 38.4871 29.7229 38.2639 29.7229 37.985C29.7229 37.7061 29.9709 37.483 30.2808 37.483Z" fill="url(#paint12_linear_1866_88)" stroke="#575756" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43.5886 37.2964V23.7783H31.2109" stroke="white" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M31.2109 23.7783V37.2964H43.5886" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <defs>
        <linearGradient id="paint0_linear_1866_88" x1="2.76532" y1="8.92561" x2="2.76532" y2="21.2031" gradientUnits="userSpaceOnUse">
          <stop stopColor="#575756"/>
          <stop offset="0.0158648" stopColor="#5D5C5C"/>
          <stop offset="0.1171" stopColor="#797878"/>
          <stop offset="0.2183" stopColor="#8D8D8C"/>
          <stop offset="0.3189" stopColor="#999998"/>
          <stop offset="0.4178" stopColor="#9D9D9C"/>
          <stop offset="0.5402" stopColor="#979696"/>
          <stop offset="0.7122" stopColor="#848484"/>
          <stop offset="0.9127" stopColor="#676666"/>
          <stop offset="1" stopColor="#575756"/>
        </linearGradient>
        <linearGradient id="paint2_linear_1866_88" x1="31.5425" y1="5.00809" x2="31.5425" y2="7.37895" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint3_linear_1866_88" x1="52.4532" y1="20.0994" x2="52.4532" y2="33.8665" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECECEC"/>
          <stop offset="0.1504" stopColor="#E8E8E8"/>
          <stop offset="0.3032" stopColor="#DCDCDC"/>
          <stop offset="0.4572" stopColor="#C7C7C7"/>
          <stop offset="0.612" stopColor="#ABABAB"/>
          <stop offset="0.7675" stopColor="#868686"/>
          <stop offset="0.9214" stopColor="#5A5A5A"/>
          <stop offset="1" stopColor="#404040"/>
        </linearGradient>
        <linearGradient id="paint5_linear_1866_88" x1="6.98061" y1="7.40073" x2="7.46865" y2="10.8722" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint7_linear_1866_88" x1="57.8263" y1="5.15045" x2="57.4738" y2="7.66402" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint8_linear_1866_88" x1="29.6263" y1="4.33769" x2="29.6263" y2="45.6186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#666666"/>
          <stop offset="1" stopColor="#1A1A1A"/>
        </linearGradient>
        <linearGradient id="paint9_linear_1866_88" x1="29.771" y1="1.21577" x2="29.771" y2="34.8602" gradientUnits="userSpaceOnUse">
          <stop/>
          <stop offset="0.0475815"/>
          <stop offset="0.1509"/>
          <stop offset="0.2395"/>
          <stop offset="0.3025"/>
          <stop offset="0.4074"/>
          <stop offset="0.514"/>
          <stop offset="0.6214"/>
          <stop offset="0.7294"/>
          <stop offset="0.8378"/>
          <stop offset="0.9452"/>
          <stop offset="1"/>
        </linearGradient>
        <linearGradient id="paint10_linear_1866_88" x1="76.5562" y1="21.4568" x2="0.60938" y2="53.924" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="#7C7C7B"/>
        </linearGradient>
        <linearGradient id="paint12_linear_1866_88" x1="38.137" y1="29.7283" x2="25.9837" y2="46.2284" gradientUnits="userSpaceOnUse">
          <stop stopColor="#666666"/>
          <stop offset="1" stopColor="#1A1A1A"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MotorMontante;