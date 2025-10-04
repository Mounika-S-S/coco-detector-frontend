// src/AuthComponent.jsx

import React, { useState } from 'react';
import axios from 'axios';

// 🚨 IMPORTANT: Use your local backend URL for testing. 
// Change to your live Render URL before final deployment!
const BACKEND_URL = 'http://localhost:5000'; 

function AuthComponent({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('Processing...');

    const endpoint = isRegistering ? `${BACKEND_URL}/api/auth/register` : `${BACKEND_URL}/api/auth/login`;

    try {
      const response = await axios.post(endpoint, { username, password });
      
      // Store the token and update message
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);
      
      // Trigger login success in parent (App.jsx)
      onLoginSuccess(); 
    } catch (error) {
      // Access the error message from the backend response
      setMessage(error.response?.data?.message || 'Authentication failed. Server error.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', maxWidth: '400px', margin: '20px auto' }}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      
      <p style={{ marginTop: '10px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>
      
      <button 
        onClick={() => setIsRegistering(!isRegistering)}
        style={{ marginTop: '15px', background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        Switch to {isRegistering ? 'Login' : 'Register'}
      </button>
    </div>
  );
}

export default AuthComponent;