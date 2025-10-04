// src/App.jsx

import React, { useState } from 'react';
import AuthComponent from './AuthComponent'; // Import the Auth component
import ImageUploader from './ImageUploader'; // Import the Uploader component
import './App.css'; // Assuming you have a basic CSS file or style the components inline

// The main application component
function App() {
  // Check localStorage for token on load to determine if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div style={{ 
        padding: '20px', 
        minHeight: '100vh', 
        backgroundColor: '#282c34', 
        color: 'white', 
        textAlign: 'center' 
    }}>
      <h1 style={{ color: '#61dafb', margin: '0 0 40px 0' }}>YOLO Object Detector</h1>
      
      {isLoggedIn ? (
        // If logged in, show the uploader and logout button
        <> 
          <button onClick={handleLogout} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px' }}>
            Logout
          </button>
          <p style={{ fontSize: '1.2em' }}>Welcome! You are ready to analyze images.</p>
          <ImageUploader /> 
        </>
      ) : (
        // If not logged in, show the Auth component
        <AuthComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;