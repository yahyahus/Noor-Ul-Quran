import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../store/slices/roleSlice';
import { register } from './services/authService';

function RegisterPage() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role);

  const [response, setResponse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const result = await register(email, password, firstname, lastname, navigate);
    setResponse(result.message);
    if (!result.success) {
      setResponse(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <select
            value={role}
            onChange={(e) => dispatch(setRole(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleRegister}
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Register
          </button>
          {response && <p className="text-center text-red-500">{response}</p>}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
