import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Button to toggle sidebar */}
      <button 
        className="md:hidden bg-blue-600 text-white p-2 rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 transform bg-gray-200 transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block md:w-64`}
      >
        <ul className="p-4">
          <li className="mb-4">
            <Link to="/health" className="text-lg font-semibold hover:text-blue-600 transition-colors">Health Tracker</Link>
          </li>
          <li className="mb-4">
            <Link to="/ai" className="text-lg font-semibold hover:text-blue-600 transition-colors">AI Suggestions</Link>
          </li>
          <li className="mb-4">
            <Link to="/food" className="text-lg font-semibold hover:text-blue-600 transition-colors">Food Analyzer</Link>
          </li>
          <li className="mb-4">
            <Link to="/bluetooth" className="text-lg font-semibold hover:text-blue-600 transition-colors">Bluetooth Tracking</Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
