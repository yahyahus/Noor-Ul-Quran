import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';

const Portal = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Welcome to the Portal</h1>
          {/* Main content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Portal;
