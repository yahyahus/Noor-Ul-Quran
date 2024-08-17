import React, { useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';

const Support = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Welcome to the Support</h1>
        </main>
      </div>
    </div>
  );
};

export default Support;
