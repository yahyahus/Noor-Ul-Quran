import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './services/authService';

function LoginPage() {
  const [response, setResponse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await login(email, password, navigate);
    setResponse(result.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Noor-Ul-Quran</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            readOnly={readOnly}
            onFocus={() => setReadOnly(false)}
            onBlur={() => setReadOnly(true)}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            readOnly={readOnly}
            onFocus={() => setReadOnly(false)}
            onBlur={() => setReadOnly(true)}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Login
          </button>
          {response && <p className="text-center text-red-500">{response}</p>}
          {/* Link to Register page */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-700 hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
