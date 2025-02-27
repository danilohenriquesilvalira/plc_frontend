import React from 'react';

type ParameterControlsProps = {
  open: boolean;
  onClose: () => void;
  transportSpeed: number;
  customMoveDuration: number;
  customWaitDuration: number;
  setTransportSpeed: (val: number) => void;
  setCustomMoveDuration: (val: number) => void;
  setCustomWaitDuration: (val: number) => void;
};

const ParameterControls: React.FC<ParameterControlsProps> = ({
  open,
  onClose,
  transportSpeed,
  customMoveDuration,
  customWaitDuration,
  setTransportSpeed,
  setCustomMoveDuration,
  setCustomWaitDuration,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Parâmetros de Simulação</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Velocidade (px/50ms):</label>
            <input
              type="range"
              min="1"
              max="10"
              value={transportSpeed}
              onChange={(e) => setTransportSpeed(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-gray-600 text-sm">{transportSpeed} px/50ms</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tempo de Movimento (ms):</label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={customMoveDuration}
              onChange={(e) => setCustomMoveDuration(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-gray-600 text-sm">{customMoveDuration} ms</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tempo de Espera (ms):</label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={customWaitDuration}
              onChange={(e) => setCustomWaitDuration(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-gray-600 text-sm">{customWaitDuration} ms</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;