import React from 'react';

function Input({ email, setEmail, password, setPassword, handleRegister, handleLogin, response }) {
  return (
  <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {'Login / Register'}
          </h2>        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
        />
        <div className="flex justify-between">
          <button
            onClick={handleLogin}
            className="px-4 py-2 font-semibold text-white bg-gray-400 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 font-semibold text-white bg-teal-700 rounded hover:bg-teal-900 focus:outline-none focus:ring focus:ring-green-300"
          >
            Register
          </button>
        </div>
        {response && <p className="mt-4 text-center text-red-500">{response}</p>}
      </div>
    </div>
  </>
  );
}

export default Input;
