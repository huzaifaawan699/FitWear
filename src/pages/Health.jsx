import React from 'react';
import HealthTracker from '../components/HealthTracker';

const Health = () => {
  // Dummy data for testing; in real implementation, fetch real-time data
  const heartRate = 72;
  const sugarLevel = 110;
  const steps = 8500; // Steps taken today
  const caloriesBurned = 350; // Calories burned today
  const activeMinutes = 25; // Active minutes today

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Your Health Overview</h2>
      <p className="text-lg text-center text-gray-600 mb-8">
        Track your vitals and activities to stay on top of your health.
      </p>
      
      {/* Pass real-time data as props to HealthTracker */}
      <HealthTracker 
        heartRate={heartRate} 
        sugarLevel={sugarLevel} 
        steps={steps} 
        caloriesBurned={caloriesBurned} 
        activeMinutes={activeMinutes} 
      />
    </div>
  );
};

export default Health;
