import React, { useState } from 'react';
import axios from 'axios';
import './LandingPage.css';

const LandingPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    about: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, payload);
      
      if (response.data.token) {
        onLogin(response.data.user, response.data.token);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <img src="/logo192.png" alt="SocialeX" width="40" height="40" className="me-2" />
            <span className="fw-bold text-primary fs-3">SocialeX</span>
          </div>
          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="#home">Home</a>
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link btn btn-primary text-white ms-2 px-3" href="#join">Join now</a>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Section - Welcome Content */}
          <div className="col-lg-8 d-flex align-items-center bg-gradient-primary">
            <div className="container text-white">
              <div className="row">
                <div className="col-md-10 col-lg-8">
                  <h1 className="display-4 fw-bold mb-4">
                    Step into SocialeX, the playground for the wildly imaginative, where vibrant communities thrive and accomplices are celebrated.
                  </h1>
                  
                  {!isLogin && (
                    <div className="hero-section mt-5">
                      <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Community" 
                        className="img-fluid rounded shadow-lg mb-4" 
                        style={{maxHeight: '300px', width: '100%', objectFit: 'cover'}}
                      />
                      
                      <div className="feature-section mt-5">
                        <h2 className="h3 mb-4">Amplify Your Voice</h2>
                        <p className="lead mb-4">
                          SocialeX gives you the power to amplify your voice and share your unique perspective with a global audience. Whether you're passionate about art, technology, social change, or any other topic, SocialeX provides you with the stage to showcase your talent and gain recognition.
                        </p>
                        <button className="btn btn-light btn-lg">
                          Get Started
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login/Register Form */}
          <div className="col-lg-4 d-flex align-items-center justify-content-center bg-light">
            <div className="card border-0 shadow-lg" style={{width: '100%', maxWidth: '400px'}}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title fw-bold">{isLogin ? 'Login' : 'Register'}</h2>
                  <p className="text-muted">
                    {isLogin ? 'Welcome back to SocialeX!' : 'Join the SocialeX community'}
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your username"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="about" className="form-label">About (Optional)</label>
                      <textarea
                        className="form-control"
                        id="about"
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    {isLogin ? "Not registered? " : "Already have an account? "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({ username: '', email: '', password: '', about: '' });
                        setError('');
                      }}
                    >
                      {isLogin ? 'Register' : 'Login'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;