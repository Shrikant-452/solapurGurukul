import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './MantraDetail.css';

const MantraDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dev');
  const [mantra, setMantra] = useState(null);

  useEffect(() => {
    // Try to get mantra from location state first
    if (location.state?.mantra) {
      setMantra(location.state.mantra);
    } else {
      // If not in state, load from localStorage
      const savedMantras = localStorage.getItem('admin_mantras');
      if (savedMantras) {
        const mantras = JSON.parse(savedMantras);
        const found = mantras.find(m => m.id === parseInt(id));
        setMantra(found);
      }
    }
  }, [id, location.state]);

  if (!mantra) {
    return (
      <div className="mantra-detail-page">
        <div className="container">
          <button className="back-button" onClick={() => navigate('/mantras')}>
            ← Back to Mantras
          </button>
          <div className="detail-not-found">
            <h2>Mantra not found</h2>
            <p>The mantra you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'dev', label: 'Devanagari' },
    { key: 'roman', label: 'Transliteration' },
    { key: 'meaning', label: 'Meaning' }
  ];

  return (
    <div className="mantra-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/mantras')}>
          ← Back to Mantras
        </button>

        <div className="detail-card">
          <div className="detail-header" style={{ borderLeftColor: mantra.color || '#c85a00' }}>
            <h1 className="detail-title">{mantra.name}</h1>
            <div className="detail-meta">
              <span 
                className="meta-badge" 
                style={{ 
                  background: `${mantra.color || '#c85a00'}20`, 
                  color: mantra.color || '#c85a00' 
                }}
              >
                🙏 {mantra.deity}
              </span>
              <span className="meta-badge">📅 {mantra.occasion || 'Daily'}</span>
              <span className="meta-badge">🔊 {mantra.language}</span>
            </div>
          </div>

          <div className="detail-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${selectedTab === tab.key ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="detail-verses">
            {mantra.verses && mantra.verses.length > 0 ? (
              mantra.verses.map((verse, index) => (
                <div key={index} className="verse-block">
                  <div className="verse-number">{index + 1}</div>
                  <div className="verse-content">
                    {selectedTab === 'dev' && (
                      <p className="verse-dev">{verse.dev || verse.devanagari || 'Not available'}</p>
                    )}
                    {selectedTab === 'roman' && (
                      <p className="verse-roman">{verse.roman || verse.transliteration || 'Not available'}</p>
                    )}
                    {selectedTab === 'meaning' && (
                      <p className="verse-meaning">{verse.meaning || 'Not available'}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-verses">No verses available for this mantra.</div>
            )}
          </div>

          {mantra.purpose && (
            <div className="detail-purpose">
              <h3>Purpose & Benefits</h3>
              <p>{mantra.purpose}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MantraDetail;