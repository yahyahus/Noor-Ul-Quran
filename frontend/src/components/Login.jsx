import React from 'react';
import LoginForm from './LoginForm';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const { login } = useAuth();
  const [response, setResponse] = React.useState('');

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    setResponse(result.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <LoginForm onSubmit={handleLogin} response={response} />
      </div>
    </div>
  );
}

export default LoginPage;
