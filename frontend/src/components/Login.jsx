import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const { login } = useAuth();
  const [response, setResponse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readOnly, setReadOnly] = useState(true);

  const handleLogin = async () => {
    const result = await login(email, password);
    setResponse(result.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            readOnly={readOnly}
            onFocus={() => setReadOnly(false)}
            onBlur={() => setReadOnly(true)}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            readOnly={readOnly}
            onFocus={() => setReadOnly(false)}
            onBlur={() => setReadOnly(true)}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          {response && <p className="text-center text-red-500">{response}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
