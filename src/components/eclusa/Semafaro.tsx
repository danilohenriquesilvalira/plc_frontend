import React, { useState } from 'react';

const Semafaro: React.FC = () => {
  // Estados para controlar cada luz
  const [isRedOn, setIsRedOn] = useState(false);
  const [isGreenOn, setIsGreenOn] = useState(false);

  const toggleRed = () => setIsRedOn((prev) => !prev);
  const toggleGreen = () => setIsGreenOn((prev) => !prev);

  return (
    <div className="flex flex-col items-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="100"
        viewBox="0 0 22 100"
      >
        <path
          d="M18.0714 45.8129H4.92857C2.688 45.8129 1 44.1249 1 41.8843V5.74144C1 3.50087 2.688 1.81287 4.92857 1.81287H18.0714C20.312 1.81287 22 3.50087 22 5.74144V41.8843C22 44.1249 20.312 45.8129 18.0714 45.8129ZM19.0714 13.9557C19.0714 9.78915 15.6666 6.38429 11.5 6.38429C7.33343 6.38429 3.92857 9.78915 3.92857 13.9557C3.92857 18.1223 7.33343 21.5272 11.5 21.5272C15.6666 21.5272 19.0714 18.1223 19.0714 13.9557ZM19.0714 33.67C19.0714 29.5034 15.6666 26.0986 11.5 26.0986C7.33343 26.0986 3.92857 29.5034 3.92857 33.67C3.92857 37.8366 7.33343 41.2414 11.5 41.2414C15.6666 41.2414 19.0714 37.8366 19.0714 33.67Z"
          fill="black"
          stroke="#A3A3A3"
          strokeWidth="2"
        />

        {/* Círculo do semáforo vermelho */}
        <circle
          cx="11.5001"
          cy="13.834"
          r="7.56931"
          fill={isRedOn ? "#FF0000" : "#D9D9D9"}
        />

        {/* Círculo do semáforo verde */}
        <circle
          cx="11.5001"
          cy="33.6456"
          r="7.56931"
          fill={isGreenOn ? "#00FF47" : "#D9D9D9"}
        />

        <path
          d="M13.6938 46.7155H9.34424V54.1189H13.6938V46.7155Z"
          fill="url(#paint0_linear_1012_26)"
        />
        <path
          d="M6.21541 56.868C6.8744 55.2261 8.90562 53.933 11.457 53.933H11.5038C14.0042 53.933 16.0383 55.2202 16.7322 56.868H6.21541Z"
          fill="url(#paint1_linear_1012_26)"
          stroke="black"
        />
        <path
          d="M17.4215 57.3445H5.57593V91.1688H17.4215V57.3445Z"
          fill="url(#paint2_linear_1012_26)"
          stroke="black"
          strokeWidth="0.812799"
          strokeMiterlimit="22.9256"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.6427 94.7318H21.3081V96.9991H1.6427V94.7318Z"
          fill="#231F20"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.44729 94.1765H19.3184L21.3081 94.7318H1.6427L3.44729 94.1765Z"
          fill="#B3B3B3"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.44751 91.7703H19.3187V94.1764H3.44751V91.7703Z"
          fill="#231F20"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.44729 94.1765H19.3184C20.5678 94.1765 20.614 94.4079 21.3081 94.7318H1.6427C2.19796 94.4541 2.38305 94.1765 3.44729 94.1765Z"
          fill="url(#paint3_linear_1012_26)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.57587 91.1688H17.4214C18.0692 91.2151 18.1155 91.03 19.3648 91.8166H3.49365C4.18773 91.5853 4.37281 91.0763 5.62215 91.1688H5.57587Z"
          fill="url(#paint4_linear_1012_26)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1012_26"
            x1="9.34424"
            y1="50.4172"
            x2="13.6475"
            y2="50.4172"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="0.58" stopColor="#232121" />
            <stop offset="0.74" stopColor="#949494" />
            <stop offset="1" stopColor="#474343" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1012_26"
            x1="5.45604"
            y1="56.0405"
            x2="17.3641"
            y2="56.0405"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="0.58" stopColor="#232121" />
            <stop offset="0.74" stopColor="#949494" />
            <stop offset="1" stopColor="#474343" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1012_26"
            x1="5.57593"
            y1="74.2335"
            x2="17.4215"
            y2="74.2335"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="0.576471" stopColor="#232121" />
            <stop offset="0.741176" stopColor="#949494" />
            <stop offset="1" stopColor="#474343" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1012_26"
            x1="1.6427"
            y1="94.4541"
            x2="21.3081"
            y2="94.4541"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#58595B" />
            <stop offset="0.509804" stopColor="#9E969A" />
            <stop offset="1" stopColor="#787373" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1012_26"
            x1="3.44738"
            y1="91.4465"
            x2="19.3185"
            y2="91.4465"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#58595B" />
            <stop offset="0.45098" stopColor="#333031" />
            <stop offset="1" stopColor="#706969" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mt-4 flex gap-4">
        <button
          onClick={toggleRed}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:shadow-lg transition-all duration-200"
        >
          Toggle Vermelho
        </button>
        <button
          onClick={toggleGreen}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:shadow-lg transition-all duration-200"
        >
          Toggle Verde
        </button>
      </div>
    </div>
  );
};

export default Semafaro;
