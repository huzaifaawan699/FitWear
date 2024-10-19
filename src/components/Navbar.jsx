import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle link clicks and close the menu
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="text-2xl font-bold">
        <a href="/" className="transition-colors duration-300 text-white">
          FitWear
        </a>
      </div>
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="focus:outline-none text-white"
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
      <div className={`md:flex ${isOpen ? 'block' : 'hidden'} absolute md:static bg-gray-900 w-full md:w-auto top-16 left-0 md:top-0 transition-all duration-300 ease-in-out`}>
        <ul className="flex flex-col md:flex-row md:items-center">
          <li className="p-4 hover:bg-yellow-500 rounded transition duration-300">
            <a 
              href="/health" 
              className="transition-colors duration-300 text-white"
              onClick={handleLinkClick}
            >
              Health Tracker
            </a>
          </li>
          <li className="p-4 hover:bg-yellow-500 rounded transition duration-300">
            <a 
              href="/ai" 
              className="transition-colors duration-300 text-white"
              onClick={handleLinkClick}
            >
              AI Suggestions
            </a>
          </li>
          <li className="p-4 hover:bg-yellow-500 rounded transition duration-300">
            <a 
              href="/food" 
              className="transition-colors duration-300 text-white"
              onClick={handleLinkClick}
            >
              Food Analyzer
            </a>
          </li>
          <li className="p-4 hover:bg-yellow-500 rounded transition duration-300">
            <a 
              href="/bluetooth" 
              className="transition-colors duration-300 text-white"
              onClick={handleLinkClick}
            >
              Bluetooth Tracking
            </a>
          </li>
          <li className="p-4 hover:bg-yellow-500 rounded transition duration-300">
            <a 
              href="/todo" // New link for the To-Do List page
              className="transition-colors duration-300 text-white"
              onClick={handleLinkClick}
            >
              To-Do List
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
