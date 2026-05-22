import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="user-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
          <h1 className="dashboard-title">Welcome, {user?.name || 'Devotee'}!</h1>
          <p className="dashboard-subtitle">Your spiritual journey dashboard</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📜</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Bookmarked Mantras</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Favorite Deities</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Chanting Sessions</div>
          </div>
        </div>
        
        <div className="dashboard-recent">
          <h2>Recently Viewed Mantras</h2>
          <div className="recent-list">
            <p className="no-data">No mantras viewed yet. Start exploring!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;