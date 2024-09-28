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

const navItems = {
  student: [
  { name: 'Dashboard', path: '/portal/dashboard', icon: ChartBarIcon },
  { name: 'Sabak/Manzil', path: '/portal/sabak', icon: ArrowLeftOnRectangleIcon },
  { name: 'Profile', path: '/portal/profile', icon: CogIcon },
  { name: 'Notifications', path: '/portal/notifications', icon: MegaphoneIcon },
  {name: 'Settings', path: '/portal/settings', icon: CogIcon },
  ],
  teacher: [
    { name: 'Dashboard', path: '/portal/dashboard', icon: ChartBarIcon },
    { name: 'Students', path: '/portal/teacher-students', icon: ArrowLeftOnRectangleIcon },
    { name: 'Assign Sabak/Manzil', path: '/portal/assign', icon: CogIcon },
    { name: 'Class Progress', path: '/portal/progress', icon: ChartBarIcon },
    { name: 'Notifications', path: '/portal/notifications', icon: MegaphoneIcon },
  ],
  admin: [
    { name: 'Dashboard', path: '/portal/dashboard', icon: ChartBarIcon },
    { name: 'Unassigned Students', path: '/portal/unassigned-students', icon: ArrowLeftOnRectangleIcon },
    { name: 'Content Management', path: '/portal/content', icon: CogIcon },
    { name: 'Role Management', path: '/portal/roles', icon: ChartBarIcon },
    { name: 'Reports & Analytics', path: '/portal/reports', icon: MegaphoneIcon },


  ],

};

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const role = useSelector((state) => state.role);
  const items = navItems[role] || []; // Get nav items based on role

  return (
    <nav className={`bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:transform-none md:static md:w-64 md:block md:min-h-screen`}>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.name}>
            <Link to={item.path} className="hover:bg-gray-700 p-2 rounded flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <Logout />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
