// src/components/cards/MantraDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './MantraDetail.css';

const MantraDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mantra, setMantra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dev');

  const fetchMantraData = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      let mantraData = null;
      
      if (id) {
        const savedMantras = localStorage.getItem('admin_mantras');
        if (savedMantras) {
          const allMantras = JSON.parse(savedMantras);
          const freshData = allMantras.find(m => m.id === parseInt(id));
          if (freshData) mantraData = freshData;
        }
      }
      
      if (!mantraData && location.state?.mantra) {
        mantraData = location.state.mantra;
      }
      
      if (mantraData) {
        console.log('Mantra data loaded:', mantraData);
        
        const normalized = {
          id: mantraData.id,
          name: mantraData.name || 'Mantra',
          name_en: mantraData.name_en || '',
          title: mantraData.title || '',
          subtitle: mantraData.subtitle || '',
          largeText: mantraData.largeText || '',
          deity: mantraData.deity || 'Deity',
          language: mantraData.language || 'Sanskrit',
          occasion: mantraData.occasion || 'Daily',
          purpose: mantraData.purpose || '',
          verse: mantraData.verse || (mantraData.verses?.[0]?.dev) || (mantraData.largeText) || 'ॐ नमः शिवाय',
          roman: mantraData.roman || (mantraData.verses?.[0]?.roman) || '',
          meaning: mantraData.meaning || (mantraData.verses?.[0]?.meaning) || '',
          color: mantraData.color || '#c85a00',
          views: mantraData.views || 0,
          imageUrl: mantraData.imageUrl || null,
          icon: mantraData.icon || '🔱'
        };
        setMantra(normalized);
      } else {
        setError('Mantra not found');
        setMantra(null);
      }
    } catch (err) {
      console.error('Error fetching mantra:', err);
      setError('Error loading mantra');
      setMantra(null);
    } finally {
      setLoading(false);
    }
  }, [id, location.state]);

  useEffect(() => {
    fetchMantraData();
    
    const handleMantrasUpdated = () => {
      console.log('Mantras updated, refreshing...');
      fetchMantraData();
    };
    
    window.addEventListener('mantrasUpdated', handleMantrasUpdated);
    
    return () => {
      window.removeEventListener('mantrasUpdated', handleMantrasUpdated);
    };
  }, [id, fetchMantraData]);

  const copyVerses = () => {
    if (!mantra) return;
    let text = '';
    if (selectedTab === 'dev') {
      text = mantra.verse;
    } else if (selectedTab === 'roman') {
      text = mantra.roman || 'Transliteration not available';
    } else {
      text = mantra.meaning || 'Meaning not available';
    }
    navigator.clipboard.writeText(`${mantra.name}\n\n${text}`);
    alert('Verses copied to clipboard!');
  };

  const openYouTube = () => {
    if (!mantra) return;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(mantra.name + ' mantra chant')}`, '_blank');
  };

  const getDeityIcon = () => {
    const icons = {
      Ganesha: "🐘", Shiva: "🕉️", Vishnu: "🌊", Lakshmi: "🪷",
      Saraswati: "📖", Durga: "⚔️", Hanuman: "🙏", Surya: "☀️"
    };
    return icons[mantra?.deity] || mantra?.icon || "🕉️";
  };

  const handleViewAllByDeity = () => {
    if (!mantra) return;
    navigate(`/mantras/deity/${mantra.deity.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/mantras');
    }
  };

  if (loading) {
    return (
      <div className="mantra-detail-page">
        <div className="container">
          <button className="back-button" onClick={handleBack}>← Back</button>
          <div className="detail-loading">
            <div className="loading-spinner"></div>
            <h2>Loading mantra...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mantra) {
    return (
      <div className="mantra-detail-page">
        <div className="container">
          <button className="back-button" onClick={handleBack}>← Back to Mantras</button>
          <div className="detail-not-found">
            <h2>Mantra not found</h2>
            <p>The mantra you are looking for does not exist or has been removed.</p>
            <button className="btn-primary" onClick={() => navigate('/mantras')} style={{ marginTop: '20px' }}>
              Browse All Mantras
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mantra-detail-page">
      <div className="container">
        <button className="back-button" onClick={handleBack}>← Back</button>

        <div className="detail-card">
          <div className="detail-header" style={{ borderLeftColor: mantra.color }}>
            <div className="detail-header-content">
              <div className="detail-icon" style={{ background: `${mantra.color}20`, color: mantra.color }}>
                {mantra.imageUrl && (mantra.imageUrl.startsWith('data:') || mantra.imageUrl.startsWith('http')) ? (
                  <img src={mantra.imageUrl} alt={mantra.deity} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  getDeityIcon()
                )}
              </div>
              <div>
                <h1 className="detail-title">{mantra.name}</h1>
                {mantra.name_en && <div className="detail-name-en">{mantra.name_en}</div>}
                <div className="detail-meta">
                  <span className="meta-badge" style={{ background: `${mantra.color}15`, color: mantra.color }}>🙏 {mantra.deity}</span>
                  <span className="meta-badge">📅 {mantra.occasion}</span>
                  <span className="meta-badge">👁️ {(mantra.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Subtitle Section */}
          {mantra.title && (
            <div className="detail-title-section">
              <h2 className="detail-subtitle">{mantra.title}</h2>
              {mantra.subtitle && <h3 className="detail-small-subtitle">{mantra.subtitle}</h3>}
            </div>
          )}

          {/* Tabs */}
          <div className="detail-tabs">
            <button className={`tab-btn ${selectedTab === 'dev' ? 'active' : ''}`} onClick={() => setSelectedTab('dev')}>
              <span className="tab-icon">📜</span> Devanagari
            </button>
            <button className={`tab-btn ${selectedTab === 'roman' ? 'active' : ''}`} onClick={() => setSelectedTab('roman')}>
              <span className="tab-icon">🔤</span> Transliteration
            </button>
            <button className={`tab-btn ${selectedTab === 'meaning' ? 'active' : ''}`} onClick={() => setSelectedTab('meaning')}>
              <span className="tab-icon">📖</span> Meaning
            </button>
          </div>

          {/* Verse Content - Shows largeText first, then regular verse */}
          <div className="detail-verses">
            <div className="verse-block">
              <div className="verse-number">1</div>
              <div className="verse-content">
                {selectedTab === 'dev' && (
                  <p className="verse-dev">
                    {mantra.largeText || mantra.verse}
                  </p>
                )}
                {selectedTab === 'roman' && (
                  <p className="verse-roman">{mantra.roman || "Transliteration not available"}</p>
                )}
                {selectedTab === 'meaning' && (
                  <p className="verse-meaning">{mantra.meaning || "Meaning not available"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Purpose Section (if exists) */}
          {mantra.purpose && (
            <div className="detail-purpose">
              <h3>✨ Purpose & Benefits</h3>
              <p>{mantra.purpose}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-actions">
            <button className="action-btn youtube" onClick={openYouTube}>
              <span>▶️</span> Listen on YouTube
            </button>
            <button className="action-btn copy" onClick={copyVerses}>
              <span>📋</span> Copy Verses
            </button>
            <button className="action-btn deity" onClick={handleViewAllByDeity}>
              <span>🔱</span> All {mantra.deity} Mantras
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MantraDetail;