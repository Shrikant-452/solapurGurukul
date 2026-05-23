import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MantraCard.css';

const MantraCard = ({ mantra, onClick, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(mantra);
    } else {
      navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    }
  };

  // Get tag display name
  const getTagName = () => {
    if (mantra.tag) return mantra.tag;
    if (mantra.deity === "Ganesha") return "Popular";
    if (mantra.deity === "Lakshmi") return "Ashtakam";
    if (mantra.deity === "Shiva") return "Panchakshara";
    if (mantra.deity === "Hanuman") return "Chalisa";
    if (mantra.deity === "Vishnu") return "Sahasranam";
    if (mantra.deity === "Durga") return "Navratri";
    return mantra.deity;
  };

  // Check for uploaded image (base64 or http URL)
  const imageSrc = mantra.imageUrl && (mantra.imageUrl.startsWith('data:') || mantra.imageUrl.startsWith('http')) ? mantra.imageUrl : null;
  const defaultIcon = mantra.icon || '🔱';

  return (
    <div 
      className={`mantra-card-library ${variant} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ 
        borderTopColor: mantra.color || '#c85a00'
      }}
    >
      {/* Header row with tag and image/icon */}
      <div className="mantra-card-header-row">
        <div className="mantra-card-tag" style={{ background: `${mantra.color || '#c85a00'}15`, color: mantra.color || '#c85a00' }}>
          {getTagName()}
        </div>
        <div className="mantra-card-image">
          {imageSrc ? (
            <img src={imageSrc} alt={mantra.name} className="mantra-card-img" />
          ) : (
            <span className="mantra-card-emoji">{defaultIcon}</span>
          )}
        </div>
      </div>

      <h3 className="mantra-card-title">{mantra.name}</h3>
      <p className="mantra-card-deity">🙏 {mantra.deity}</p>

      {/* Verse preview */}
      <div className="mantra-card-verse-preview">
        <p>{mantra.verses?.[0]?.dev?.substring(0, 60) || mantra.verse?.substring(0, 60) || 'ॐ'}...</p>
      </div>

      {/* Footer */}
      <div className="mantra-card-footer">
        <span className="mantra-card-occasion">📅 {mantra.occasion || 'Daily'}</span>
        <span className="mantra-card-read">Read more →</span>
      </div>
    </div>
  );
};

// Featured Card Variant
export const FeaturedMantraCard = ({ mantra, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(mantra);
    } else {
      navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    }
  };

  const imageSrc = mantra.imageUrl && (mantra.imageUrl.startsWith('data:') || mantra.imageUrl.startsWith('http')) ? mantra.imageUrl : null;
  const defaultIcon = 'ॐ';

  return (
    <div 
      className={`featured-mantra-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ borderColor: mantra.color || '#c85a00' }}
    >
      <div className="featured-card-badge">✨ Featured</div>
      <div className="featured-card-icon" style={{ background: `${mantra.color || '#c85a00'}20`, color: mantra.color || '#c85a00' }}>
        {imageSrc ? (
          <img src={imageSrc} alt={mantra.name} className="featured-card-img" />
        ) : (
          defaultIcon
        )}
      </div>
      <h3 className="featured-card-name">{mantra.name}</h3>
      <p className="featured-card-deity">{mantra.deity}</p>
      <p className="featured-card-desc">{mantra.purpose?.substring(0, 60)}...</p>
      <button className="featured-card-btn" style={{ borderColor: mantra.color || '#c85a00', color: mantra.color || '#c85a00' }}>
        Chant Now →
      </button>
    </div>
  );
};

// Small Card Variant
export const SmallMantraCard = ({ mantra, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(mantra);
    } else {
      navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    }
  };

  const imageSrc = mantra.imageUrl && (mantra.imageUrl.startsWith('data:') || mantra.imageUrl.startsWith('http')) ? mantra.imageUrl : null;
  const defaultIcon = 'ॐ';

  return (
    <div className="small-mantra-card" onClick={handleClick}>
      <div className="small-card-icon" style={{ background: `${mantra.color || '#c85a00'}20`, color: mantra.color || '#c85a00' }}>
        {imageSrc ? (
          <img src={imageSrc} alt={mantra.name} className="small-card-img" />
        ) : (
          defaultIcon
        )}
      </div>
      <div className="small-card-info">
        <h4 className="small-card-name">{mantra.name}</h4>
        <p className="small-card-deity">{mantra.deity}</p>
      </div>
      <div className="small-card-arrow">→</div>
    </div>
  );
};

export default MantraCard;