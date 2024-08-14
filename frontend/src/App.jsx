// import React, { useState, useEffect } from 'react';
// import { Input } from './components/Input';

// function App() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [response, setResponse] = useState('');
//   const [showPortal, setShowPortal] = useState(false);

//   // useEffect to check for authentication on component mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/portal', {
//           method: 'GET',
//           credentials: 'include',
//         });
//         if (response.ok) {
//           setShowPortal(true);  // If the response is ok, set showPortal to true
//         }
//         if (response.status === 403) {
//           setResponse('Login to continue');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     checkAuth();
//   }, []);

  

//   const handleLogin = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username: email, password: password }), 
//         credentials: 'include'
//       });
//       const data = await response.json();
//       setResponse(data.message);
//       // if (response.ok) {
//       //   setShowPortal(true);  
//       // }
//       console.log(data);
//     } catch (error) {
//       setResponse('An error occurred');
//       console.error('Error:', error); 
//     }
//   };

//   const handleRegister = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username: email, password: password }), 
//         credentials: 'include'

//       });
//       const data = await response.json();
//       setResponse(data.message);
      

//       console.log(data);
//     } catch (error) {
//       setResponse('An error occurred');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <>
//       <Input
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleRegister={handleRegister}
//         handleLogin={handleLogin}
//         response={response} 
//       />
//       {showPortal && <div>Welcome to the portal</div>} 
//     </>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Input } from './components/Input';
import PortalPage from './components/Portal'; // Import PortalPage component

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  // useEffect to check for authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/portal', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          navigate('/portal');
        } else if (response.status === 403) {
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
        navigate('/portal');}
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
        credentials: 'include'

      });
      const data = await response.json();
      setResponse(data.message);
      if (response.ok) {
        navigate('/portal');}

      console.log(data);
    } catch (error) {
      setResponse('An error occurred');
      console.error('Error:', error);
    }
  };
    return (
        <Routes>
          <Route path="/" element={<Input email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleRegister={handleRegister} handleLogin={handleLogin} response={response} />} />
          <Route path="/portal" element={<PortalPage />} />
        </Routes>
    );
  
}

export default App;




