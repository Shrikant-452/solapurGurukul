import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './MantraCard.css';

const MantraCard = ({ mantra, onClick, showBookmark = true, isBookmarked = false, onBookmark }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const getLocalizedName = () => {
    switch(i18n.language) {
      case 'hi': return mantra.name_hi || mantra.name;
      case 'mr': return mantra.name_mr || mantra.name;
      case 'te': return mantra.name_te || mantra.name;
      case 'kn': return mantra.name_kn || mantra.name;
      default: return mantra.name_en || mantra.name;
    }
  };

  const getLocalizedDeity = () => {
    switch(i18n.language) {
      case 'hi': return mantra.deity_hi || mantra.deity;
      case 'mr': return mantra.deity_mr || mantra.deity;
      case 'te': return mantra.deity_te || mantra.deity;
      case 'kn': return mantra.deity_kn || mantra.deity;
      default: return mantra.deity;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(mantra);
    } else {
      navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    }
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(mantra.id);
    }
  };

  const getBadge = () => {
    if (mantra.isNew) return <span className="card-badge new">New</span>;
    if (mantra.isPopular) return <span className="card-badge popular">Popular</span>;
    return null;
  };

  return (
    <div
      className={`mantra-card ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {getBadge()}
      
      {showBookmark && (
        <button 
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      )}
      
      <div className="mantra-card-header" style={{ borderColor: mantra.color || '#ffd700' }}>
        <span className="deity-badge" style={{ background: `${mantra.color || '#ffd700'}20`, color: mantra.color || '#ffd700' }}>
          {getLocalizedDeity()}
        </span>
        <span className="language-badge">{mantra.language}</span>
      </div>
      
      <h3 className="mantra-card-name">{getLocalizedName()}</h3>
      
      <div className="mantra-card-verse">
        <p className="verse-text">{mantra.verses?.[0]?.dev || 'ॐ'}</p>
      </div>
      
      <div className="mantra-card-footer">
        <span className="read-more">{t('mantras.read_more')}</span>
      </div>
      
      {mantra.views !== undefined && (
        <div className="mantra-card-stats">
          <span className="stat-item">
            <span className="stat-icon">👁️</span> {mantra.views}
          </span>
          <span className="stat-item">
            <span className="stat-icon">⬇️</span> {mantra.downloads}
          </span>
        </div>
      )}
    </div>
  );
};

export default MantraCard;