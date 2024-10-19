import React from 'react';
import BluetoothTracker from '../components/BluetoothTracker';

const Bluetooth = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Bluetooth Tracker</h2>
      <BluetoothTracker />
    </div>
  );
};

export default Bluetooth;
