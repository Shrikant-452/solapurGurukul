import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import ManageMantras from './ManageMantras';
import HeroManagement from './HeroManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import Categories from './Categories';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mantras, setMantras] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [mediaFilesCount, setMediaFilesCount] = useState(0);

  // Load data
  useEffect(() => {
    loadMantras();
    loadCategories();
    loadActivityLog();
    
    // Listen for updates
    const handleMantrasUpdate = () => {
      loadMantras();
    };
    
    const handleCategoriesUpdate = () => {
      loadCategories();
    };
    
    const handleForceRefresh = () => {
      loadCategories();
      loadMantras();
    };
    
    window.addEventListener('mantrasUpdated', handleMantrasUpdate);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    window.addEventListener('categoriesForceRefresh', handleForceRefresh);
    
    return () => {
      window.removeEventListener('mantrasUpdated', handleMantrasUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
      window.removeEventListener('categoriesForceRefresh', handleForceRefresh);
    };
  }, []);

  const loadMantras = () => {
    const saved = localStorage.getItem('admin_mantras');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMantras(parsed);
    } else {
      setMantras([]);
    }
    calculateMediaFiles();
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCategories(parsed);
    } else {
      setCategories([]);
    }
  };

  const loadActivityLog = () => {
    const saved = localStorage.getItem('activity_log');
    if (saved) setActivityLog(JSON.parse(saved));
    else setActivityLog([]);
  };

  const calculateMediaFiles = () => {
    const saved = localStorage.getItem('admin_mantras');
    if (saved) {
      const mantrasList = JSON.parse(saved);
      let count = 0;
      mantrasList.forEach(m => {
        if (m.imageUrl) count++;
        if (m.audioUrl) count++;
        if (m.pdfUrl) count++;
      });
      setMediaFilesCount(count);
    } else setMediaFilesCount(0);
  };

  // Stats
  const totalMantras = mantras.length;
  const publishedCount = mantras.filter(m => m.status === 'published').length;
  const draftCount = mantras.filter(m => m.status === 'draft').length;

  // Mantras by deity (from categories with counts)
  const deityCounts = categories.map(cat => ({
    name: cat.name,
    count: mantras.filter(m => m.deity === cat.name).length,
    color: cat.color,
    icon: cat.imageUrl?.startsWith('data:') ? '🖼️' : (cat.imageUrl || '📿')
  })).filter(d => d.count > 0);

  // Mantras by type (tag)
  const typeCounts = {
    'Stotram': mantras.filter(m => m.tag === 'Stotram' || m.name?.includes('स्तोत्र')).length,
    'Aṣṭakam': mantras.filter(m => m.tag === 'Ashtakam' || m.name?.includes('अष्टक')).length,
    'Sahasranāma': mantras.filter(m => m.tag === 'Sahasranam' || m.name?.includes('सहस्रनाम')).length,
    'Cālīsā': mantras.filter(m => m.tag === 'Chalisa' || m.name?.includes('चालीसा')).length,
    'Other': mantras.filter(m => !m.tag && !m.name?.includes('स्तोत्र') && !m.name?.includes('अष्टक') && !m.name?.includes('सहस्रनाम') && !m.name?.includes('चालीसा')).length
  };

  // Quick stats – Sanskrit stotras
  const sanskritCount = mantras.filter(m => m.language === 'Sanskrit').length;

  // Recent activity (last 5)
  const recentActivities = [...activityLog].reverse().slice(0, 5);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'categories', icon: '📂', label: 'Categories' },
    { id: 'mantras', icon: '📜', label: 'Manage Mantras' },
    { id: 'hero', icon: '🖼️', label: 'Hero Section' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>☰</button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-om">ॐ</span>
            {sidebarOpen && <span>Admin Panel</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-name">{item.label}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.[0] || 'A'}</div>
            {sidebarOpen && (<div className="user-details"><div className="user-name">{user?.name || 'Admin'}</div><div className="user-role">Super Administrator</div></div>)}
          </div>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}><span className="nav-icon">🚪</span>{sidebarOpen && <span>Logout</span>}</button>
          <button className="back-to-site-btn" onClick={() => navigate('/')}><span className="nav-icon">←</span>{sidebarOpen && <span>Back to Site</span>}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="mobile-overlay show" onClick={toggleMobileMenu}></div>}

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>{activeTab === 'dashboard' && 'Dashboard'}{activeTab === 'categories' && 'Categories Management'}{activeTab === 'mantras' && 'Manage Mantras'}{activeTab === 'hero' && 'Hero Section Management'}{activeTab === 'users' && 'User Management'}{activeTab === 'analytics' && 'Analytics'}{activeTab === 'settings' && 'Settings'}</h1>
          <div className="header-actions"><button className="back-button" onClick={() => navigate('/')}>← Back to Site</button><div className="user-avatar-small">{user?.name?.[0] || 'A'}</div></div>
        </div>
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards Row */}
              <div className="stats-grid">
                <div className="stat-card" style={{ borderLeftColor: '#c85a00' }}><div className="stat-icon">📜</div><div className="stat-number">{totalMantras}</div><div className="stat-label">Total Stotras</div><div className="stat-change up">↑ 3 this month</div></div>
                <div className="stat-card" style={{ borderLeftColor: '#0a5a50' }}><div className="stat-icon">✅</div><div className="stat-number">{publishedCount}</div><div className="stat-label">Published</div><div className="stat-change up">↑ 2 this week</div></div>
                <div className="stat-card" style={{ borderLeftColor: '#e06b10' }}><div className="stat-icon">📝</div><div className="stat-number">{draftCount}</div><div className="stat-label">Drafts</div><div className="stat-change down">↓ 1 pending review</div></div>
                <div className="stat-card" style={{ borderLeftColor: '#b08820' }}><div className="stat-icon">🖼️</div><div className="stat-number">{mediaFilesCount}</div><div className="stat-label">Media Files</div><div className="stat-change up">↑ 5 new uploads</div></div>
              </div>

              {/* Two columns: Stotras by Deity + By Type */}
              <div className="dashboard-two-columns">
                <div className="dashboard-card">
                  <h3>📿 Stotras by Deity</h3>
                  <div className="deity-list">
                    {deityCounts.length > 0 ? (
                      deityCounts.map(d => (
                        <div key={d.name} className="deity-item">
                          <div className="deity-icon" style={{ background: `${d.color}15`, color: d.color }}>{d.icon}</div>
                          <div className="deity-info">
                            <span className="deity-name">{d.name}</span>
                            <div className="deity-bar">
                              <div className="deity-bar-fill" style={{ width: `${(d.count / totalMantras) * 100}%`, background: d.color }}></div>
                            </div>
                            <span className="deity-count">{d.count} stotra{d.count !== 1 && 's'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-text">No mantras assigned yet. Add categories and mantras.</p>
                    )}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>🏷️ By Type</h3>
                  <div className="type-list">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <div key={type} className="type-item">
                        <span className="type-name">{type}</span>
                        <span className="type-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity + Quick Stats */}
              <div className="dashboard-two-columns">
                <div className="dashboard-card">
                  <h3>🕒 Recent Activity</h3>
                  <div className="activity-list">
                    {recentActivities.length === 0 && <p className="empty-text">No recent activity</p>}
                    {recentActivities.map((act, idx) => (
                      <div key={idx} className="activity-item">
                        <span className="activity-icon">{act.type === 'add' ? '➕' : act.type === 'edit' ? '✏️' : act.type === 'delete' ? '🗑️' : '📌'}</span>
                        <span className="activity-text">{act.message}</span>
                        <span className="activity-time">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>⚡ Quick Stats</h3>
                  <div className="quick-stats">
                    <div className="quick-stat">
                      <span className="quick-icon">🔤</span>
                      <div className="quick-info">
                        <span className="quick-label">Sanskrit Stotras</span>
                        <span className="quick-value">{sanskritCount}</span>
                      </div>
                    </div>
                    <div className="quick-stat">
                      <span className="quick-icon">👥</span>
                      <div className="quick-info">
                        <span className="quick-label">Total Users</span>
                        <span className="quick-value">{getAllUsers().length}</span>
                      </div>
                    </div>
                    <div className="quick-stat">
                      <span className="quick-icon">📂</span>
                      <div className="quick-info">
                        <span className="quick-label">Categories</span>
                        <span className="quick-value">{categories.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'categories' && <Categories key={activeTab} />}
          {activeTab === 'mantras' && <ManageMantras />}
          {activeTab === 'hero' && <HeroManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'analytics' && <Analytics mantras={mantras} />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;