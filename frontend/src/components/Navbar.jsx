import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="mt-8 md:hidden">
          <button className="text-white">Logout</button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
