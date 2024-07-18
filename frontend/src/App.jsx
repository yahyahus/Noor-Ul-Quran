import React, { useState } from 'react';
import { Input } from './components/Input';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Input email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
    </>
  );
}

export default App;