import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ currentUser, activeView, setActiveView, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Home' },
    { id: 'chat', icon: 'fas fa-comment-dots', label: 'Chat' },
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Brand */}
        <div className="navbar-brand d-flex align-items-center">
          <img src="/logo192.png" alt="SocialeX" width="35" height="35" className="me-2" />
          <span className="fw-bold text-primary fs-4">SocialeX</span>
        </div>

        {/* Search Bar */}
        <div className="search-container mx-auto">
          <form onSubmit={handleSearch} className="d-flex">
            <div className="input-group">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search SocialeX..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-search" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Navigation Icons */}
        <div className="navbar-nav d-flex flex-row align-items-center">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-icon-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={item.label}
            >
              <i className={item.icon}></i>
            </button>
          ))}

          {/* User Profile Dropdown */}
          <div className="dropdown ms-3">
            <button
              className="btn btn-link dropdown-toggle d-flex align-items-center p-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={currentUser?.profilePic || 'https://via.placeholder.com/35'}
                alt="Profile"
                className="profile-avatar"
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <div className="dropdown-item-text">
                  <strong>{currentUser?.username}</strong>
                  <div className="text-muted small">{currentUser?.email}</div>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => setActiveView('profile')}
                >
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={onLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;