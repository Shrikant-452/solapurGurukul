import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularMantras.css';

const PopularMantras = ({ limit = 8, showViewAll = true }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [popularMantras, setPopularMantras] = useState([]);
  const autoScrollIntervalRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    loadPopularMantras();
    window.addEventListener('mantrasUpdated', loadPopularMantras);
    return () => {
      window.removeEventListener('mantrasUpdated', loadPopularMantras);
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, []);

  const loadPopularMantras = () => {
    const savedMantras = localStorage.getItem('admin_mantras');
    
    if (savedMantras) {
      const allMantras = JSON.parse(savedMantras);
      const publishedMantras = allMantras.filter(m => m.status === 'published');
      const sortedByViews = [...publishedMantras].sort((a, b) => (b.views || 0) - (a.views || 0));
      const topMantras = sortedByViews.slice(0, limit);
      
      const formattedMantras = topMantras.map(m => {
        // IMPORTANT: Use imageUrl, not image
        let imageUrl = null;
        if (m.imageUrl && typeof m.imageUrl === 'string') {
          if (m.imageUrl.startsWith('data:') || m.imageUrl.startsWith('http')) {
            imageUrl = m.imageUrl;
          }
        }
        
        return {
          id: m.id,
          name: m.name,
          deity: m.deity,
          description: m.purpose || `Powerful ${m.deity} mantra for spiritual growth`,
          views: (m.views || 0).toLocaleString(),
          imageUrl: imageUrl,  // Fixed: Use imageUrl property
          color: m.color || '#c85a00',
          icon: m.icon || '🔱'
        };
      });
      
      setPopularMantras(formattedMantras);
      console.log('Loaded mantras with images:', formattedMantras.map(m => ({ name: m.name, hasImage: !!m.imageUrl })));
    } else {
      const defaultMantras = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", deity: "Ganesha", description: "Most powerful mantra for new beginnings", views: "1.2K", imageUrl: null, color: "#c85a00", icon: "🐘" },
        { id: 2, name: "महामृत्युंजय मंत्र", deity: "Shiva", description: "Powerful mantra for health and healing", views: "2.3K", imageUrl: null, color: "#0a5a50", icon: "🕉️" },
        { id: 3, name: "विष्णु सहस्रनाम", deity: "Vishnu", description: "Thousand divine names for protection", views: "1.8K", imageUrl: null, color: "#4a2878", icon: "🌊" }
      ];
      setPopularMantras(defaultMantras.slice(0, limit));
    }
  };

  // Auto-scroll function - smooth infinite scrolling
  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current && !isHovering) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        if (scrollLeft + clientWidth >= scrollWidth - 50) {
          scrollRef.current.scrollTo({
            left: 1,
            behavior: 'smooth'
          });
        } else {
          scrollRef.current.scrollBy({
            left: 2.5,
            behavior: 'smooth'
          });
        }
      }
    }, 30);
  };

  // Start auto-scroll on mount
  useEffect(() => {
    if (popularMantras.length > 0) {
      setTimeout(() => {
        startAutoScroll();
      }, 100);
    }
    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, [popularMantras.length]);

  const handleCardClick = (mantra) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
  };

  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/mantras');
  };

  if (popularMantras.length === 0) return null;

  // Triple the array for seamless infinite scrolling
  const loopedMantras = [...popularMantras, ...popularMantras, ...popularMantras];

  return (
    <section className="popular-mantras-section">
      <div className="container">
        <div className="popular-header-right">
          <div className="header-line"></div>
          <div className="popular-title-wrapper">
            <span className="star-icon">✨</span>
            <span className="popular-title-text">POPULAR MANTRAS</span>
            <span className="star-icon">✨</span>
          </div>
        </div>

        <div className="popular-scroll-wrapper">
          <div className="scroll-gradient-mask left"></div>
          <div 
            className="popular-mantras-horizontal"
            ref={scrollRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {loopedMantras.map((mantra, index) => (
              <div 
                key={`${mantra.id}-${index}`} 
                className="popular-card-new"
                onClick={() => handleCardClick(mantra)}
              >
                <div className="card-inner">
                  <div className="card-image-new">
                    {mantra.imageUrl ? (
                      <img 
                        src={mantra.imageUrl} 
                        alt={mantra.name} 
                        loading="lazy"
                        onError={(e) => {
                          console.log('Image failed to load for:', mantra.name);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'card-image-placeholder';
                            placeholder.style.background = `${mantra.color}20`;
                            placeholder.innerHTML = `<span class="placeholder-icon">${mantra.icon || '🔱'}</span>`;
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="card-image-placeholder" style={{ background: `${mantra.color}20` }}>
                        <span className="placeholder-icon">{mantra.icon || '🔱'}</span>
                      </div>
                    )}
                    <div className="card-rank-new">#{index % popularMantras.length + 1}</div>
                  </div>
                  <div className="card-content-new">
                    <h3 className="card-name-new">{mantra.name}</h3>
                    <p className="card-deity-new" style={{ color: mantra.color }}>🙏 {mantra.deity}</p>
                    <p className="card-desc-new">{mantra.description}</p>
                    <div className="card-footer-new">
                      <span className="card-views-new">👁️ {mantra.views}</span>
                      <span className="card-read-new" style={{ color: mantra.color }}>Read →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-gradient-mask right"></div>
        </div>

        {showViewAll && (
          <div className="view-all-popular">
            <button className="btn-view-all-new" onClick={handleViewAllClick}>
              View All Mantras →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularMantras;