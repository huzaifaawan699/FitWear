import React from 'react';
import ChallengeComponent from '../components/ChallengeComponent'; // Adjust the path as needed

const ChallengePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Fitness Challenge</h1>
        <p className="text-center mb-4">
          Choose a path to achieve your fitness goals. 
          The AI will generate a personalized 30-day plan for you!
        </p>
        <ChallengeComponent />
      </div>
    </div>
  );
};

export default ChallengePage;
