import React from 'react';

 function Input({ email, setEmail, password, setPassword, handleRegister, handleLogin, response }) {
  return (
    <>
      <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
          </div>
          <div>
 
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
            <button  onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <p>{response}</p>
      </div>
    </div>
    </>

  );
}

export default Input;