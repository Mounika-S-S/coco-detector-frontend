// src/ImageUploader.jsx

import React, { useState } from 'react';
import axios from 'axios';

// 🚨 FOR LOCAL TEST: Use 'https://yolo-detector-backend.onrender.com'
// 🚨 FOR DEPLOYMENT: This must be your live Render URL (Vercel ENV variable will replace this)
const BACKEND_URL = 'https://yolo-detector-backend.onrender.com';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Upload an image to detect objects.');
  // Renamed state to better reflect the DECODED data we receive
  const [decodedResults, setDecodedResults] = useState(null); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('Ready to detect.');
    setDecodedResults(null);
    
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setMessage('Detecting objects with YOLO...');

    const formData = new FormData();
    formData.append('image', file); 

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${BACKEND_URL}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });

      // --- Success: Display the DECODED output ---
      setMessage(`Detection Complete! Top object: ${response.data.top_class_name}`); 
      setDecodedResults({
          name: response.data.top_class_name,
          confidence: response.data.confidence,
          dims: response.data.raw_output_dims
      });

    } catch (error) {
      console.error("API Error:", error);
      setMessage(error.response?.data?.message || 'Detection failed. Check browser console.');
      setDecodedResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" disabled={isLoading} style={{ marginLeft: '10px' }}>
          {isLoading ? 'Processing...' : 'Upload & Detect'}
        </button>
      </form>

      <p style={{ fontWeight: 'bold' }}>Status: {message}</p>
      
      {decodedResults && (
          <div style={{ 
              padding: '15px', 
              border: `2px solid ${decodedResults.name.includes('No Clear Object') ? '#ff9800' : '#00c853'}`, 
              backgroundColor: decodedResults.name.includes('No Clear Object') ? '#fff3e0' : '#e8f5e9', 
              maxWidth: '450px', 
              margin: '15px auto', 
              color: '#333', 
              textAlign: 'left' 
          }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '1.2em', fontWeight: 'bold' }}>
                  🎯 Detected Object: {decodedResults.name}
              </p>
              <p style={{ margin: '0 0 5px 0' }}>Confidence: {decodedResults.confidence}</p>
              <small>Raw Tensor Dimensions: [{decodedResults.dims.join(', ')}]</small>
          </div>
      )}
      
      {preview && 
        <img 
          src={preview} 
          alt="Upload Preview" 
          style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '20px', border: '1px solid #ddd' }} 
        />}
    </div>
  );
}

export default ImageUploader;