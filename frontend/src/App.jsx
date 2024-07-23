import React, { useState, useEffect } from 'react';
import { Input } from './components/Input';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [showPortal, setShowPortal] = useState(false);

  // useEffect to check for authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/portal', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          setShowPortal(true);  // If the response is ok, set showPortal to true
        }
        if (response.status === 403) {
          setResponse('Login to continue');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }), 
        credentials: 'include'
      });
      const data = await response.json();
      setResponse(data.message);
      if (response.ok) {
        setShowPortal(true);  // If the login is successful, set showPortal to true
      }
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
      <Input
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleRegister={handleRegister}
        handleLogin={handleLogin}
        response={response}
      />
      {showPortal && <div>Welcome to the portal</div>} 
    </>
  );
}

export default App;
