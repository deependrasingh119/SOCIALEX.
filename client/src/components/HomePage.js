import React, { useState } from 'react';
import Navbar from './Navbar';
import Feed from './Feed';
import Profile from './Profile';
import Chat from './Chat';
import './HomePage.css';

const HomePage = ({ currentUser, onLogout }) => {
  const [activeView, setActiveView] = useState('home');

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <Feed currentUser={currentUser} />;
      case 'profile':
        return <Profile currentUser={currentUser} />;
      case 'chat':
        return <Chat currentUser={currentUser} />;
      default:
        return <Feed currentUser={currentUser} />;
    }
  };

  return (
    <div className="home-page">
      <Navbar 
        currentUser={currentUser} 
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />
      
      <div className="main-content">
        {renderActiveView()}
      </div>
    </div>
  );
};

export default HomePage;