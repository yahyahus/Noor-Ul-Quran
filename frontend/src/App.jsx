  import React, { useState } from 'react';
  import { Input } from './components/Input';
  import { set } from 'mongoose';

  
  function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    const handleLogin = async () => {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password: password }), 
        });
        const data = await response.json();
        setResponse(data.message);
        console.log(data);
      } catch (error) {
        setResponse('An error occurred');
        console.error('Error:', error);
      }
    };

    const handleRegister = async () => {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password: password }), 
        });
        const data = await response.json();
        setResponse(data.message);
        console.log(data);
      } catch (error) {
        setResponse('An error occurred');
        console.error('Error:', error);
      }
    };

    return (
      <>
        <Input email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleRegister={handleRegister } handleLogin={handleLogin} response={response}  />
      </>
    );
  }

  export default App;
