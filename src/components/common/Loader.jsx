import React from 'react';
import './Loader.css';

const Loader = ({ type = 'spinner', size = 'medium', text = 'Loading...', fullScreen = false }) => {
  
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`loader-spinner ${size}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={`loader-dots ${size}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`loader-pulse ${size}`}>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </div>
        );
      
      case 'om':
        return (
          <div className={`loader-om ${size}`}>
            <span className="om-symbol">ॐ</span>
            <div className="om-glow"></div>
          </div>
        );
      
      case 'mandala':
        return (
          <div className={`loader-mandala ${size}`}>
            <div className="mandala-circle"></div>
            <div className="mandala-circle"></div>
            <div className="mandala-circle"></div>
            <div className="mandala-center">ॐ</div>
          </div>
        );
      
      default:
        return (
          <div className={`loader-spinner ${size}`}>
            <div className="spinner-ring"></div>
          </div>
        );
    }
  };

  const loaderContent = (
    <div className={`loader-container ${type} ${size} ${fullScreen ? 'fullscreen' : ''}`}>
      {renderLoader()}
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen-overlay">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

// Skeleton Loader Component
export const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-footer"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        );
      
      case 'detail':
        return (
          <div className="skeleton-detail">
            <div className="skeleton-header-large"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line short"></div>
            <div className="skeleton-verse"></div>
            <div className="skeleton-verse"></div>
          </div>
        );
      
      case 'grid':
        return (
          <div className="skeleton-grid">
            {Array(count).fill().map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-footer"></div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="skeleton-wrapper">
      {renderSkeleton()}
    </div>
  );
};

// Page Loader Component
export const PageLoader = () => {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="loader-om large">
          <span className="om-symbol">ॐ</span>
        </div>
        <p>Loading Divine Mantras...</p>
      </div>
    </div>
  );
};

// Button Loader Component
export const ButtonLoader = ({ size = 'small' }) => {
  return (
    <span className={`button-loader ${size}`}>
      <span className="button-spinner"></span>
    </span>
  );
};

export default Loader;