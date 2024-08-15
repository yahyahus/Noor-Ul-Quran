import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline'; // Importing from Heroicons v2

const Portal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4 text-gray-800 fixed top-4 right-4 z-10 pr-8"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <nav
        className={`bg-gray-800 text-white min-h-screen p-4 fixed md:static top-0 left-0 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-1/4 md:block`}
      >
        <h1 className="text-2xl font-bold mb-6">Portal</h1>
        <ul className="space-y-4">
          <li>
            <Link to="/profile" className="hover:bg-gray-700 p-2 rounded block">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/announcements" className="hover:bg-gray-700 p-2 rounded block">
              Announcements
            </Link>
          </li>
          <li>
            <Link to="/calendar" className="hover:bg-gray-700 p-2 rounded block">
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:bg-gray-700 p-2 rounded block">
              Settings
            </Link>
          </li>
          <li>
            <Link to="/support" className="hover:bg-gray-700 p-2 rounded block">
              Support
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-0' : 'md:ml-1/4'
        }`}
      >
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Welcome to the Portal</h1>
        {/* Add content here */}
      </main>
    </div>
  );
};

export default Portal;
