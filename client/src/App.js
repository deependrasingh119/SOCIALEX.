import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    // Test connection to your backend
    const testConnection = async () => {
      try {
        // This will proxy to http://localhost:6001 because of the proxy setting
        const response = await axios.get('/api/test');
        setServerStatus('Connected to server!');
        setMessage(response.data.message || 'Connected successfully');
      } catch (error) {
        setServerStatus('Server not running');
        setMessage('Make sure to start your server with: npm run server');
        console.error('Connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="App">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2>SOCIALEX - React + Node.js Setup</h2>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <h4>🎉 Your Create React App is working!</h4>
                  <p>This React app is now properly configured with:</p>
                  <ul>
                    <li>✅ React development server (port 3000)</li>
                    <li>✅ Proxy configuration to backend (port 6001)</li>
                    <li>✅ Bootstrap styling</li>
                    <li>✅ Axios for API calls</li>
                    <li>✅ Socket.io client ready</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h5>Backend Connection Status:</h5>
                  <div className={`alert ${serverStatus.includes('Connected') ? 'alert-success' : 'alert-warning'}`}>
                    <strong>{serverStatus}</strong>
                    <p className="mb-0">{message}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h5>Available Scripts:</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Development</h6>
                          <code>npm run dev</code>
                          <p className="small mt-2">Runs both client & server</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Production Build</h6>
                          <code>npm run build</code>
                          <p className="small mt-2">Creates optimized build</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
