import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div className="flex flex-col h-screen bg-gray-50">
    <Header />
    <div className="flex flex-1">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <Loader2 className="h-12 w-12 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading students data...</p>
        </div>
      </main>
    </div>
  </div>
);

const ActionLoader = ({ message }) => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
        <Loader2 className="h-8 w-8 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

export { PageLoader, ActionLoader };