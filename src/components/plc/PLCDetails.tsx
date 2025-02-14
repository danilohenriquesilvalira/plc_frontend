import React from 'react';
import { PLC } from '../../services/api';

interface PLCDetailsProps {
  plc: PLC;
}

const PLCDetails: React.FC<PLCDetailsProps> = ({ plc }) => {
  return (
    <div>
      <h2>{plc.name}</h2>
      <p>IP: {plc.ip_address}</p>
      <p>Status: {plc.status}</p>
      <p>Última Atualização: {plc.last_update}</p>
    </div>
  );
};

export default PLCDetails;
