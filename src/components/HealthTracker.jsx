import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HealthTracker = () => {
  const [heartRate, setHeartRate] = useState(0);
  const [steps, setSteps] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  useEffect(() => {
    // Connect to smartwatch on component mount
    connectToWatch();

    // Example: Update real-time data with dummy values
    const updateData = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 10));
      setCaloriesBurned(prev => prev + Math.floor(Math.random() * 2));
      setActiveMinutes(prev => prev + 1);
    }, 1000); // Simulating updates every second

    return () => clearInterval(updateData);
  }, []);

  const connectToWatch = async () => {
    try {
      // Bluetooth connection code, as described above
    } catch (error) {
      console.error('Failed to connect to the smartwatch', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"> {/* Added margin-top of 8 */}
      <motion.div className="p-3 bg-blue-100 rounded-lg shadow-md text-center"> {/* Reduced padding */}
        <h3 className="text-lg font-semibold">Heart Rate</h3> {/* Reduced font size */}
        <p className="text-3xl font-bold">{heartRate} bpm</p> {/* Reduced font size */}
        <p className="text-xs text-gray-600">Normal range: 60-100 bpm</p> {/* Reduced font size */}
      </motion.div>

      <motion.div className="p-3 bg-yellow-100 rounded-lg shadow-md text-center"> {/* Reduced padding */}
        <h3 className="text-lg font-semibold">Steps</h3> {/* Reduced font size */}
        <p className="text-3xl font-bold">{steps}</p> {/* Reduced font size */}
        <p className="text-xs text-gray-600">Today's Goal: 10,000 steps</p> {/* Reduced font size */}
      </motion.div>

      <motion.div className="p-3 bg-red-100 rounded-lg shadow-md text-center"> {/* Reduced padding */}
        <h3 className="text-lg font-semibold">Calories Burned</h3> {/* Reduced font size */}
        <p className="text-3xl font-bold">{caloriesBurned} kcal</p> {/* Reduced font size */}
        <p className="text-xs text-gray-600">Goal: 500 kcal/day</p> {/* Reduced font size */}
      </motion.div>

      <motion.div className="p-3 bg-purple-100 rounded-lg shadow-md text-center"> {/* Reduced padding */}
        <h3 className="text-lg font-semibold">Active Minutes</h3> {/* Reduced font size */}
        <p className="text-3xl font-bold">{activeMinutes} mins</p> {/* Reduced font size */}
        <p className="text-xs text-gray-600">Goal: 30 minutes/day</p> {/* Reduced font size */}
      </motion.div>
    </div>
  );
};

export default HealthTracker;
