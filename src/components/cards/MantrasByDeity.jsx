// src/components/cards/MantrasByDeity.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MantrasByDeity.css';

const MantrasByDeity = ({ deityName, mantras, deityInfo, onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('MantrasByDeity received:', { deityName, mantrasCount: mantras?.length, deityInfo });

  // If no mantras, show message
  if (!mantras || mantras.length === 0) {
    return (
      <div className="mantras-by-deity-page">
        <div className="container">
          <button className="back-button" onClick={onBack}>← Back to all deities</button>
          <div className="deity-header">
            <div className="deity-icon-large">
              {deityInfo?.icon && (deityInfo.icon.startsWith('data:') || deityInfo.icon.startsWith('http')) ? (
                <img src={deityInfo.icon} alt={deityInfo.name} className="deity-header-image" />
              ) : (
                <span>{deityInfo?.icon || '📿'}</span>
              )}
            </div>
            <div className="deity-info">
              <h1 className="deity-name">{deityInfo?.name || 'Deity'} Mantras</h1>
              <p className="deity-description">{deityInfo?.description || ''}</p>
            </div>
          </div>
          <div className="no-mantras-found">
            <h3>No mantras found for {deityInfo?.name}</h3>
            <p>Add mantras for this deity in the admin panel.</p>
            <button className="back-button" onClick={onBack} style={{ marginTop: '20px' }}>← Back to all deities</button>
          </div>
        </div>
      </div>
    );
  }

  // Filter mantras based on search
  const filteredMantras = mantras.filter(m => {
    const search = searchTerm.toLowerCase();
    return (m.name && m.name.toLowerCase().includes(search)) ||
           (m.deity && m.deity.toLowerCase().includes(search));
  });

  const handleMantraClick = (mantra) => {
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalViews = mantras.reduce((sum, m) => sum + (m.views || 0), 0);
  const languages = [...new Set(mantras.map(m => m.language))];

  // Get first verse for preview
  const getVersePreview = (mantra) => {
    const verse = mantra.verses?.[0]?.dev || mantra.verse || '';
    return verse.length > 100 ? verse.substring(0, 100) + '...' : verse;
  };

  return (
    <div className="mantras-by-deity-page">
      <div className="container">
        <button className="back-button" onClick={onBack}>← Back to all deities</button>

        <div className="deity-header">
          <div className="deity-icon-large">
            {deityInfo?.icon && (deityInfo.icon.startsWith('data:') || deityInfo.icon.startsWith('http')) ? (
              <img src={deityInfo.icon} alt={deityInfo.name} className="deity-header-image" />
            ) : (
              <span>{deityInfo?.icon || '📿'}</span>
            )}
          </div>
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
                  {mantra.imageUrl ? (
                    <img src={mantra.imageUrl} alt={mantra.name} className="mantra-card-image-small" />
                  ) : (
                    <span className="mantra-icon">{deityInfo?.icon || '🔱'}</span>
                  )}
                </div>
                <h3 className="mantra-title">{mantra.name}</h3>
                <p className="mantra-deity" style={{ color: mantra.color }}>🙏 {mantra.deity}</p>
                <p className="mantra-verse">{getVersePreview(mantra)}</p>
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