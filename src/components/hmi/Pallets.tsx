// components/hmi/Pallets.tsx
import React from 'react';
import Palete from '../../assets/hmi/pallets/Palete.svg';

type PalletState = {
  id: number;
  position: number;
  state: "entering" | "atSensor1" | "movingToSensor2" | "atSensor2" | "exiting" | "exited";
  stateStartTime: number;
};

type PalletsProps = {
  pallets: PalletState[];
  palletWidth: number;
};

const Pallets: React.FC<PalletsProps> = ({ pallets, palletWidth }) => {
  return (
    <>
      {pallets.map(pallet => (
        <div
          key={pallet.id}
          className="absolute transition-all duration-75"
          style={{
            left: `${pallet.position}px`,
            top: '21%',
            width: `${palletWidth}px`,
            height: '200px',
            zIndex: 10
          }}
        >
          <img src={Palete} alt={`Palete ${pallet.id}`} className="w-full h-full" />
          <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
            {pallet.id}
          </div>
        </div>
      ))}
    </>
  );
};

export default Pallets;