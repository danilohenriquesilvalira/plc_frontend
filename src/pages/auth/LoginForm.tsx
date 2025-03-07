// src/pages/auth/LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
      />
      <input 
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px' }}
      />
      <button type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px' }}>
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
