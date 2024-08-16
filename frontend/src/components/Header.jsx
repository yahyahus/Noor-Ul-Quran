import React from 'react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Updated for v2

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Mobile View: Logo on the left and Hamburger Icon on the right */}
      <div className="md:hidden flex justify-between items-center w-full m-2">
        <div className="text-lg font-bold">Logo</div>
        <button onClick={toggleSidebar} className="text-white mr-2">
          <Bars3Icon className="h-8 w-8" />
        </button>
      </div>

      {/* Desktop View: Logo, Search Bar, Notifications, and Logout */}
      <div className="hidden md:flex md:justify-between md:w-full md:m-2">
        <div className="text-lg font-bold">Logo</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 px-4 py-2 rounded-lg bg-gray-700 text-white"
        />
        <div className="flex items-center space-x-4">
          <button>
            <BellIcon className="h-6 w-6 mr-5 text-white" />
          </button>
          <button>
            <XMarkIcon className="h-6 w-6  text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
