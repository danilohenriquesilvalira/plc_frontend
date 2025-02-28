
import React from 'react';

interface MotorProps {
  // Status: 0 = inativo (cinza), 1 = operando (verde), 2 = falha (vermelho)
  status: 0 | 1 | 2;
  width?: number;
  height?: number;
  className?: string;
}

const Motor: React.FC<MotorProps> = ({ 
  status = 0, 
  width = 296, 
  height = 207, 
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
      viewBox="0 0 296 207" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M295.6 46.7998H278.5V137.6H295.6V46.7998Z" fill="url(#paint0_linear_1761_183)" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Corpo principal do motor - Muda de cor com o status */}
      <path d="M250.2 1.2998H45.7998V183.1H250.2V1.2998Z" fill={mainColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M248.7 20.0996H46.8999V50.9996H248.7V20.0996Z" fill="url(#paint2_linear_1761_183)"/>
      <path d="M46.9997 1.7998H46.1997V182.7H46.9997V1.7998Z" fill="url(#paint3_linear_1761_183)"/>
      
      {/* Parte lateral do motor - Também muda de cor */}
      <path d="M250.2 165.4L278.5 148.2V36.3L250.2 19V165.4Z" fill={secondaryColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M277.9 66.7L250.8 59V34L277.9 47.6V66.7Z" fill="url(#paint5_linear_1761_183)"/>
      
      {/* Outra parte lateral do motor - Também muda de cor */}
      <path d="M0.399902 171.9L45.7999 183.1V1.2998L0.399902 12.4998V171.9Z" fill={secondaryColor} stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M44.6001 50.9996L1.1001 56.1996V29.0996L44.6001 20.0996V50.9996Z" fill="url(#paint7_linear_1761_183)"/>
      <path d="M244.3 11.9998L245.7 13.1998V20.3998H238.6V23.7998H68.3998V18.0998H244.4V11.9998H244.3ZM244.3 41.2998H68.2998V49.7998H238.5V43.5998H245.6V36.3998L244.2 35.1998V41.2998H244.3ZM244.3 1.2998V7.1998H68.2998V12.2998H238.5V9.7998H245.6V2.5998L244.3 1.2998ZM244.3 23.4998V29.7998H68.2998V35.4998H238.5V31.9998H245.6V24.7998L244.3 23.4998ZM244.3 49.4998V55.6998H68.2998V66.9998H238.5V57.9998H245.6V50.7998L244.3 49.4998ZM244.3 66.5998V72.7998H68.2998V84.0998H238.5V75.0998H245.6V67.8998L244.3 66.5998ZM244.3 83.7998V89.9998H68.2998V101.3H238.5V92.2998H245.6V84.9998L244.3 83.7998Z" fill="url(#paint8_linear_1761_183)"/>
      <path d="M68.3999 7.1998H244.4V1.2998H68.3999V7.1998ZM68.3999 18.1998H244.4V12.2998H68.3999V18.1998ZM68.3999 29.7998H244.4V23.8998H68.3999V29.7998ZM68.3999 41.2998H244.4V35.3998H68.3999V41.2998ZM68.3999 55.6998H244.4V49.7998H68.3999V55.6998ZM68.3999 72.7998H244.4V66.9998H68.3999V72.7998ZM68.3999 89.9998H244.4V84.0998H68.3999V89.9998Z" fill="url(#paint9_linear_1761_183)" stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Base do motor - Permanece com cor original */}
      <path d="M227.3 183.1H64.5V205.6H227.3V183.1Z" fill="url(#paint10_linear_1761_183)" stroke="#8C8C91" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M227.3 183.1H64.5V190.2H227.3V183.1Z" fill="#646567" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M159.3 205.6V114.7C159.3 114.7 160.5 120.2 166.6 130.8C166.6 130.8 167.5 170.6 174.5 183.1V205.6H159.3Z" fill="#646567" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Painel frontal do motor - Também muda de cor */}
      <path d="M159.3 114.8H79.7002V205.7H159.3V114.8Z" fill={mainColor} stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      <path d="M87.7003 120.1C87.7003 121.6 86.5003 122.8 85.0003 122.8C83.5003 122.8 82.3003 121.6 82.3003 120.1C82.3003 118.6 83.5003 117.4 85.0003 117.4C86.5003 117.4 87.7003 118.6 87.7003 120.1ZM153.9 117.4C152.4 117.4 151.2 118.6 151.2 120.1C151.2 121.6 152.4 122.8 153.9 122.8C155.4 122.8 156.6 121.6 156.6 120.1C156.6 118.6 155.4 117.4 153.9 117.4ZM85.0003 197.5C83.5003 197.5 82.3003 198.7 82.3003 200.2C82.3003 201.7 83.5003 202.9 85.0003 202.9C86.5003 202.9 87.7003 201.7 87.7003 200.2C87.7003 198.7 86.5003 197.5 85.0003 197.5ZM153.9 197.5C152.4 197.5 151.2 198.7 151.2 200.2C151.2 201.7 152.4 202.9 153.9 202.9C155.4 202.9 156.6 201.7 156.6 200.2C156.6 198.7 155.4 197.5 153.9 197.5Z" fill="url(#paint12_linear_1761_183)" stroke="#575756" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M89.5 196.5V123.8H149.4" stroke="white" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M149.4 123.8V196.5H89.5" stroke="#646567" strokeWidth="0.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Definições dos gradientes originais mantidos para elementos que não mudam de cor */}
      <defs>
        <linearGradient id="paint0_linear_1761_183" x1="287.057" y1="43.9261" x2="287.057" y2="109.954" gradientUnits="userSpaceOnUse">
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
        <linearGradient id="paint2_linear_1761_183" x1="147.794" y1="22.8531" x2="147.794" y2="35.6035" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint3_linear_1761_183" x1="46.5998" y1="104.012" x2="46.5998" y2="178.051" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECECEC"/>
          <stop offset="0.1504" stopColor="#E8E8E8"/>
          <stop offset="0.3032" stopColor="#DCDCDC"/>
          <stop offset="0.4572" stopColor="#C7C7C7"/>
          <stop offset="0.612" stopColor="#ABABAB"/>
          <stop offset="0.7675" stopColor="#868686"/>
          <stop offset="0.9214" stopColor="#5A5A5A"/>
          <stop offset="1" stopColor="#404040"/>
        </linearGradient>
        <linearGradient id="paint5_linear_1761_183" x1="266.657" y1="35.7192" x2="263.753" y2="54.3039" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint7_linear_1761_183" x1="20.5987" y1="23.6187" x2="22.6961" y2="37.0756" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" stopOpacity="0.4"/>
          <stop offset="1" stopColor="#F7F7F7" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="paint8_linear_1761_183" x1="157.068" y1="19.2498" x2="157.068" y2="241.257" gradientUnits="userSpaceOnUse">
          <stop stopColor="#666666"/>
          <stop offset="1" stopColor="#1A1A1A"/>
        </linearGradient>
        <linearGradient id="paint9_linear_1761_183" x1="156.369" y1="2.4602" x2="156.368" y2="183.399" gradientUnits="userSpaceOnUse">
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
        <linearGradient id="paint10_linear_1761_183" x1="-70.043" y1="111.311" x2="308.624" y2="256.977" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="#7C7C7B"/>
        </linearGradient>
        <linearGradient id="paint12_linear_1761_183" x1="115.882" y1="155.796" x2="182.971" y2="237.759" gradientUnits="userSpaceOnUse">
          <stop stopColor="#666666"/>
          <stop offset="1" stopColor="#1A1A1A"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Motor;