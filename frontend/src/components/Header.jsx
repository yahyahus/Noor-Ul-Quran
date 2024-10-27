import React from 'react';
import { Bars3Icon, BellIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import Logout from './Logout';
import { useSelector } from 'react-redux';

const Header = ({ toggleSidebar }) => {
  const role = useSelector((state) => state.role);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center w-full">
        <div className="text-lg font-bold">Logo</div>
        <button onClick={toggleSidebar} className="text-white">
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex md:justify-between md:w-full items-center">
        <div className="text-lg font-bold">Logo</div>

        {/* Search Bar */}
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              <circle cx={11} cy={11} r={6} stroke="currentColor" strokeWidth={2} />
            </svg>
          </span>
        </div>

        {/* Icons and Role Badge */}
        <div className="flex items-center space-x-6">
          {role === 'student' && (
            <button className="relative group">
              <BellIcon className="h-6 w-6 text-white hover:text-blue-400 transition" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
              <span className="absolute bottom-0 hidden group-hover:block bg-gray-900 text-xs p-1 rounded-md">
                Notifications
              </span>
            </button>
          )}

          {/* Subtle Role Badge */}
          <div className="px-3 py-1 rounded-full border border-gray-500 text-md text-gray-300">
            {role}
          </div>

          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
