import React from 'react';
import './Analytics.css';

const Analytics = ({ mantras }) => {
  const totalViews = mantras.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalDownloads = mantras.reduce((sum, m) => sum + (m.downloads || 0), 0);
  const publishedCount = mantras.filter(m => m.status === 'published').length;
  const draftCount = mantras.filter(m => m.status === 'draft').length;

  return (
    <div className="analytics">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-number">{totalViews.toLocaleString()}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬇️</div>
          <div className="stat-number">{totalDownloads.toLocaleString()}</div>
          <div className="stat-label">Total Downloads</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-number">{publishedCount}</div>
          <div className="stat-label">Published Mantras</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{draftCount}</div>
          <div className="stat-label">Draft Mantras</div>
        </div>
      </div>
      <div className="chart-placeholder">
        <p>📊 Chart coming soon – you can integrate a library like Recharts.</p>
      </div>
    </div>
  );
};

export default Analytics;