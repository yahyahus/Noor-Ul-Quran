import React from 'react';

export function Input({ email, setEmail, password, setPassword, handleRegister, handleLogin, response, setIsAuthenticated }) {
  return (
    <div>
      <input
        style={{ margin: 5, padding: 5 }}
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        style={{ margin: 5, padding: 5 }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button style={{ marginLeft: 5, padding: 5 }} onClick={() => {
        handleLogin();
        setIsAuthenticated(true); // Set isAuthenticated to true on successful login
      }}>Login</button>
      <button style={{ margin:5, padding: 5 }} onClick={handleRegister}>Register</button>
      <p>{response}</p>

    </div>
  );
}
