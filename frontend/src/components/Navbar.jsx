import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  MegaphoneIcon,
  CogIcon,
  LifebuoyIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import Logout from './Logout';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const role = useSelector((state) => state.role);

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
        {role === 'student' && (<Link to="/portal" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Progress
          </Link> )}
        </li>
        <li>
        {role === 'student' && (<Link to="/portal/announcements" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <MegaphoneIcon className="h-5 w-5 mr-3" />
            Announcements
          </Link> )}
        </li> 
        <li>
        {role === 'student' && (<Link to="/portal/settings" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <CogIcon className="h-5 w-5 mr-3" />
            Settings
          </Link> )}
        </li>
        <li>
        {role === 'student' && (<Link to="/portal/support" className="hover:bg-gray-700 p-2 rounded flex items-center">
            <LifebuoyIcon className="h-5 w-5 mr-3" />
            Support
          </Link> )}
        </li>
        <li>
          <Link>
          <Logout/>
          </Link>
        </li>
      </ul>
    </nav> 
    </>
  );
};

export default Navbar;
