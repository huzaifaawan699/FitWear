import React, { useEffect, useState } from 'react';

const products = [
  {
    id: 1,
    title: 'Health Tracker',
    description: 'Monitor your vital health metrics with ease.',
    icon: '💓',
    path: '/health', // Path for navigation
  },
  {
    id: 2,
    title: 'AI Suggestions',
    description: 'Get personalized fitness suggestions powered by AI.',
    icon: '🤖',
    path: '/ai', // Path for navigation
  },
  {
    id: 3,
    title: 'Food Analyzer',
    description: 'Analyze your meals for better nutrition.',
    icon: '🍽️',
    path: '/food', // Path for navigation
  },
  {
    id: 4,
    title: 'Bluetooth Tracking',
    description: 'Seamlessly connect to your devices for health tracking.',
    icon: '📱',
    path: '/bluetooth', // Path for navigation
  },
];

const Home = () => {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // Function to display cards one by one
    const showCards = () => {
      products.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index + 1]);
        }, index * 1000); // Adjust timing as needed (1000ms = 1 second)
      });
    };

    showCards(); // Start showing cards

    // Cleanup: clear the timeout when the component unmounts
    return () => {
      setVisibleCards([]);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
      <h2 className="text-4xl font-semibold text-center mb-8 text-yellow-400">Welcome to FitWear!</h2>
      <p className="text-lg text-center mb-12">FitWear is designed to help you monitor your health and improve your fitness journey.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <a 
            key={product.id} 
            href={product.path} 
            className={`bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg transition-transform transform duration-500 ease-in-out 
              ${visibleCards.includes(index + 1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              hover:scale-105 hover:shadow-xl`} // Animation classes and hover effects
          >
            <div className="text-5xl mb-4 text-center text-yellow-400">{product.icon}</div>
            <h3 className="text-xl font-semibold text-center mb-2 text-yellow-300">{product.title}</h3>
            <p className="text-center text-gray-200">{product.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;
