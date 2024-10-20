import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Home from './pages/Home';
import Health from './pages/Health';
import AI from './pages/AI';
import Food from './pages/Food';
import Bluetooth from './pages/Bluetooth';
import ChallengePage from './pages/ChallengePage';
import ToDoListPage from './pages/ToDoListPage';
import FoodDetectionPage from './pages/FoodDetectionPage'; // Import the FoodDetectionPage component

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate a loading delay of 500ms

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="App">
      <Navbar />

      {/* HeroSection only on the home page */}
      {location.pathname === '/' && <HeroSection />}

      <main className="p-6 min-h-screen">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-4xl font-bold text-gray-700 animate-fadeIn mt-4">FitWear</h1> {/* Animated loading title */}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/health" element={<Health />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/food" element={<Food />} />
            <Route path="/bluetooth" element={<Bluetooth />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/todo" element={<ToDoListPage />} />
            <Route path="/food-detection" element={<FoodDetectionPage />} /> {/* New route for the Food Detection Page */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any invalid routes */}
          </Routes>
        )}
      </main>
    </div>
  );
}

// AppWrapper for routing
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
