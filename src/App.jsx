// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios'; // We'll install this soon

// A custom component for handling login/registration
function AuthComponent({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage('Processing...');

    // 🚨 We need to define the backend URL here!
    const endpoint = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';

    try {
      // Send data to the backend
      const response = await axios.post(endpoint, { username, password });
      
      // If successful, store the token
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(); // Tell the parent component login was successful
    } catch (error) {
      setMessage(error.response.data.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} // Update state on change
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
      <p>{message}</p>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        Switch to {isRegistering ? 'Login' : 'Register'}
      </button>
    </div>
  );
}

// The main application component
function App() {
  // Check if a token exists in localStorage on load
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Logic to switch view after successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  // Logic to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>COCO Object Detector</h1>
      {isLoggedIn ? (
        <div>
          <p>Welcome! Now you can upload an image.</p>
          <button onClick={handleLogout}>Logout</button>
          {/* We will add the Image Uploader component here next */}
        </div>
      ) : (
        <AuthComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;