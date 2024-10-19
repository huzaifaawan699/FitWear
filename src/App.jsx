import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Home from './pages/Home';
import Health from './pages/Health';
import AI from './pages/AI';
import Food from './pages/Food';
import Bluetooth from './pages/Bluetooth';
import ChallengePage from './pages/ChallengePage'; // Import the ChallengePage component
import ToDoListPage from './pages/ToDoListPage'; // Import the ToDoListPage component

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Set loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate a loading time (500ms)

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [location.pathname]); // Runs on route change

  return (
    <div className="App">
      <Navbar />
      {/* Only show HeroSection on the home page */}
      {location.pathname === '/' && <HeroSection />}
      <main className="p-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="loader mb-4">Loading...</div> {/* Loading indicator */}
            <h1 className="text-4xl font-bold text-white animate-fadeIn">FitWear</h1> {/* Loading name with animation */}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/health" element={<Health />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/food" element={<Food />} />
            <Route path="/bluetooth" element={<Bluetooth />} />
            <Route path="/challenge" element={<ChallengePage />} /> {/* New route for the Challenge Page */}
            <Route path="/todo" element={<ToDoListPage />} /> {/* New route for the To-Do List Page */}
            {/* Redirect all other routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
