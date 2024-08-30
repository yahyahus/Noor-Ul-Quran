import React from 'react';
import RegisterForm from './RegisterForm';
import useAuth from '../hooks/useAuth';

function RegisterPage() {
  const { register } = useAuth();
  const [response, setResponse] = React.useState('');

  const handleRegister = async (email, password,firstname,lastname, role) => {
    const result = await register(email, password,firstname,lastname, role);
    setResponse(result.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <RegisterForm onSubmit={handleRegister} response={response} />
      </div>
    </div>
  );
}

export default RegisterPage;
