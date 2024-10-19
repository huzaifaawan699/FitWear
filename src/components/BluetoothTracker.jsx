import React, { useState, useEffect } from 'react';

const BluetoothTracker = () => {
  const [deviceName, setDeviceName] = useState('');
  const [heartRate, setHeartRate] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRateHistory, setHeartRateHistory] = useState([]);

  // Connect to a Bluetooth device
  const connectToDevice = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // Request a Bluetooth device with heart_rate and battery_service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate', 'battery_service'] }],
        optionalServices: ['device_information'],
      });

      setDeviceName(device.name || 'Unnamed Device');
      const server = await device.gatt.connect();
      setConnectedDevice(device);

      // Access heart rate and battery services
      await getHeartRateData(server);
      await getBatteryLevel(server);

      // Add disconnect event listener
      device.addEventListener('gattserverdisconnected', handleDisconnect);
      setLoading(false);
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      setErrorMessage('Failed to connect to the Bluetooth device.');
      setLoading(false);
    }
  };

  // Get heart rate data from the connected device
  const getHeartRateData = async (server) => {
    try {
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const heartRateValue = value.getUint8(1); // Getting heart rate value from characteristic
        setHeartRate(heartRateValue);
        setHeartRateHistory((prev) => [...prev, heartRateValue]); // Store heart rate history
      });

      // Start notifications for heart rate changes
      await characteristic.startNotifications();
    } catch (error) {
      console.error('Error accessing heart rate data:', error);
      setErrorMessage('Failed to access heart rate data.');
    }
  };

  // Get battery level from the connected device
  const getBatteryLevel = async (server) => {
    try {
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');

      const batteryValue = await characteristic.readValue();
      setBatteryLevel(batteryValue.getUint8(0));
    } catch (error) {
      console.error('Error accessing battery data:', error);
      setErrorMessage('Failed to access battery data.');
    }
  };

  // Handle device disconnection
  const handleDisconnect = () => {
    setConnectedDevice(null);
    setDeviceName('');
    setHeartRate(null);
    setBatteryLevel(null);
    setHeartRateHistory([]); // Clear heart rate history
    setErrorMessage('Disconnected from the Bluetooth device.');
  };

  // Disconnect from the device
  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.gatt.disconnect();
        handleDisconnect();
      } catch (error) {
        console.error('Error disconnecting from device:', error);
        setErrorMessage('Failed to disconnect from the Bluetooth device.');
      }
    }
  };

  return (
    <section id="bluetooth" className="p-6 bg-white rounded-lg shadow-lg mb-4 transition-transform duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bluetooth Health Tracker</h2>
      
      {/* Connect Button */}
      {!connectedDevice ? (
        <button
          onClick={connectToDevice}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect to Smartwatch'}
        </button>
      ) : (
        <button
          onClick={disconnectDevice}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Disconnect from {deviceName}
        </button>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

      {/* Device Info and Data */}
      {connectedDevice && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="text-gray-700">Connected to: <strong>{deviceName}</strong></p>
          <p className="text-gray-700">Heart Rate: <strong>{heartRate ? `${heartRate} bpm` : 'N/A'}</strong></p>
          <p className="text-gray-700">Battery Level: <strong>{batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}</strong></p>

          {/* Heart Rate History */}
          {heartRateHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Heart Rate History</h3>
              <ul className="list-disc list-inside text-gray-700">
                {heartRateHistory.map((rate, index) => (
                  <li key={index}>{rate} bpm</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BluetoothTracker;
