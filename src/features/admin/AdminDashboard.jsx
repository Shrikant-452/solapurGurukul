import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mantras, setMantras] = useState([
    { id: 1, name: "ॐ गण गणपतये नमः", deity: "Ganesha", language: "Sanskrit", status: "Published" },
    { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", language: "Sanskrit", status: "Published" },
  ]);

  const stats = [
    { icon: '📜', value: mantras.length.toString(), label: 'Total Mantras', color: '#ffd700' },
    { icon: '👥', value: getAllUsers().length.toString(), label: 'Total Users', color: '#20b2aa' },
    { icon: '👁️', value: '1,247', label: 'Total Views', color: '#9370db' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo"><span className="logo-om">ॐ</span><span>Admin Panel</span></div>
        <nav className="admin-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button className={`nav-item ${activeTab === 'mantras' ? 'active' : ''}`} onClick={() => setActiveTab('mantras')}>📜 Manage Mantras</button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</button>
          <button className="nav-item" onClick={() => navigate('/')}>🏠 Back to Site</button>
        </nav>
      </div>
      
      <div className="admin-main">
        <div className="admin-header"><h1>Admin Dashboard</h1><div className="admin-user"><span>{user?.name}</span><div className="admin-avatar">{user?.name?.[0]}</div></div></div>
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="stats-grid">{stats.map((stat, index) => (<div key={index} className="stat-card" style={{ borderColor: stat.color }}><div className="stat-icon">{stat.icon}</div><div className="stat-value">{stat.value}</div><div className="stat-label">{stat.label}</div></div>))}</div>
          )}
          {activeTab === 'mantras' && (<div><h2>Manage Mantras</h2><table className="mantras-table"><thead><tr><th>ID</th><th>Name</th><th>Deity</th><th>Language</th><th>Status</th></tr></thead><tbody>{mantras.map(m => (<tr key={m.id}><td>{m.id}</td><td>{m.name}</td><td>{m.deity}</td><td>{m.language}</td><td>{m.status}</td></tr>))}</tbody></table></div>)}
          {activeTab === 'users' && (<div><h2>Users</h2><table className="users-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{getAllUsers().map(u => (<tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>))}</tbody></table></div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;