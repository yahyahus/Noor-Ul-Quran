import React, { useState } from 'react';

function LoginForm({ onSubmit, response }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [error, setError] = useState('');
  const handleSubmit = () => {
    onSubmit(email, password);
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        //temporary fix for email field
                      readOnly={readOnly}
                      onFocus={ () => setReadOnly(false) }
                      onBlur={ () => setReadOnly(true) }
    onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        //temporary fix for password field
                      readOnly={readOnly}
                      onFocus={ () => setReadOnly(false) }
                      onBlur={ () => setReadOnly(true) }
        onChange={(e) => setPassword(e.target.value)}

        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSubmit}
        className="w-full py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
      {response && <p className="text-center text-red-500">{response}</p>}
    </div>
  );
}

export default LoginForm;
