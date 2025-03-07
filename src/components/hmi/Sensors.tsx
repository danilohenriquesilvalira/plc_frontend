// components/hmi/Sensors.tsx
import React from 'react';
import Sensor_Verde from '../../assets/hmi/sensors/Sensor_Verde.svg';
import Sensor_Cinza from '../../assets/hmi/sensors/Sensor_Cinza.svg';

type Sensor = {
  id: number;
  position: { left: number; top: string };
  active: boolean;
  label?: string;
};

type SensorsProps = {
  sensors: Sensor[];
};

const Sensors: React.FC<SensorsProps> = ({ sensors }) => {
  return (
    <>
      {sensors.map((sensor) => (
        <div 
          key={sensor.id}
          className="absolute"
          style={{ 
            top: sensor.position.top, 
            left: `${sensor.position.left}px` 
          }}
        >
          <img
            src={sensor.active ? Sensor_Verde : Sensor_Cinza}
            alt={`Sensor ${sensor.id}`}
            style={{ width: '320px', height: '53px' }}
          />
          {/* Label simplificado e mais moderno */}
          <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 
                           ${sensor.active ? 'bg-green-600' : 'bg-slate-700'} 
                           text-white px-3 py-1 text-xs rounded-lg shadow-md 
                           transition-colors duration-300 border ${sensor.active ? 'border-green-400' : 'border-slate-600'}`}>
            S{sensor.id}
          </div>
          
          {/* Indicador de status abaixo do sensor */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
            <span className={`inline-flex items-center ${sensor.active ? 'text-green-400' : 'text-gray-500'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${sensor.active ? 'bg-green-400' : 'bg-gray-500'}`}></span>
              {sensor.active ? 'Detectado' : 'Livre'}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Sensors;