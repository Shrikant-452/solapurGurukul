// components/Public/MantrasByDeity.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MantrasByDeity.css';

const MantrasByDeity = ({ deityName, mantras, deityInfo, onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('Received mantras:', mantras); // Debug log

  // Check if mantras exist and are valid
  if (!mantras || mantras.length === 0) {
    return (
      <div className="mantras-by-deity-page">
        <div className="container">
          <button className="back-button" onClick={onBack}>← Back to all deities</button>
          <div className="deity-header">
            <div className="deity-icon-large">{deityInfo?.icon || '📿'}</div>
            <div className="deity-info">
              <h1 className="deity-name">{deityInfo?.name || 'Deity'} Mantras</h1>
              <p className="deity-description">{deityInfo?.description || ''}</p>
            </div>
          </div>
          <div className="no-mantras-found">
            <h3>No mantras found</h3>
            <p>Add mantras for this deity in the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  // Simple filter without complex validation
  const filteredMantras = mantras.filter(m => {
    const search = searchTerm.toLowerCase();
    return (m.name && m.name.toLowerCase().includes(search)) ||
           (m.deity && m.deity.toLowerCase().includes(search));
  });

  const handleMantraClick = (mantra) => {
    if (mantra && mantra.id) {
      navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    }
  };

  const totalViews = mantras.reduce((sum, m) => sum + (m.views || 0), 0);
  const languages = [...new Set(mantras.map(m => m.language))];

  return (
    <div className="mantras-by-deity-page">
      <div className="container">
        <button className="back-button" onClick={onBack}>← Back to all deities</button>

        <div className="deity-header">
          <div className="deity-icon-large">{deityInfo?.icon || '📿'}</div>
          <div className="deity-info">
            <h1 className="deity-name">{deityInfo?.name} Mantras</h1>
            <p className="deity-description">{deityInfo?.description}</p>
          </div>
          <div className="deity-mantra-count">{mantras.length} Mantras</div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">{totalViews.toLocaleString()}</div>
            <div className="stat-label">TOTAL VIEWS</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{mantras.length}</div>
            <div className="stat-label">MANTRAS</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{languages[0] || 'Sanskrit'}</div>
            <div className="stat-label">LANGUAGES</div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={`Search ${deityInfo?.name} mantras...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>}
          </div>
        </div>

        <div className="results-header">
          <h3>Found {filteredMantras.length} Mantra{filteredMantras.length !== 1 && 's'}</h3>
        </div>

        {filteredMantras.length === 0 ? (
          <div className="no-mantras-found">
            <h3>No mantras found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="mantras-grid">
            {filteredMantras.map((mantra) => (
              <div key={mantra.id} className="mantra-card" onClick={() => handleMantraClick(mantra)}>
                <div className="mantra-card-header">
                  <span className="mantra-language">{mantra.language || 'Sanskrit'}</span>
                  <span className="mantra-icon">{mantra.icon || '🔱'}</span>
                </div>
                <h3 className="mantra-title">{mantra.name}</h3>
                <p className="mantra-deity">🙏 {mantra.deity}</p>
                <p className="mantra-verse">
                  {mantra.verse ? (mantra.verse.length > 80 ? mantra.verse.substring(0, 80) + '...' : mantra.verse) : 'ॐ नमः शिवाय'}
                </p>
                <div className="mantra-footer">
                  <span className="mantra-occasion">📅 {mantra.occasion || 'Daily'}</span>
                  <span className="mantra-views">👁️ {(mantra.views || 0).toLocaleString()}</span>
                  <span className="mantra-read-more">Read →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MantrasByDeity;