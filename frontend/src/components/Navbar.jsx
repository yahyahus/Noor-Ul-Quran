import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  MegaphoneIcon,
  CogIcon,
  LifebuoyIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
    return (
      <>
        {/* Sidebar for Mobile & Normal Navbar for Desktop */}
        <nav
          className={`bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:transform-none md:static md:w-64 md:block md:min-h-screen`}
        >
      <ul className="space-y-4">
        <li>
          <Link to="/portal" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Progress
          </Link>
        </li>
        <li>
          <Link to="/announcements" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <MegaphoneIcon className="h-5 w-5 mr-3" />
            Announcements
          </Link>
        </li>
        <li>
          <Link to="/settings" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <CogIcon className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/support" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <LifebuoyIcon className="h-5 w-5 mr-3" />
            Support
          </Link>
        </li>
        <li>
          <Link to="/" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </Link>
        </li>
      </ul>
    </nav>
    </>
  );
};

export default Navbar;
