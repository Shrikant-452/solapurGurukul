import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularMantras.css';

const PopularMantras = ({ limit = 8, showViewAll = true }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [popularMantras, setPopularMantras] = useState([]);
  const autoScrollIntervalRef = useRef(null);

  // Load popular mantras from localStorage
  useEffect(() => {
    loadPopularMantras();
    window.addEventListener('mantrasUpdated', loadPopularMantras);
    return () => window.removeEventListener('mantrasUpdated', loadPopularMantras);
  }, []);

  const loadPopularMantras = () => {
    const savedPopular = localStorage.getItem('popular_mantras');
    if (savedPopular) {
      const parsed = JSON.parse(savedPopular);
      setPopularMantras(limit ? parsed.slice(0, limit) : parsed);
    } else {
      const defaultPopular = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", deity: "Ganesha", description: "Most powerful mantra for new beginnings", views: "15.2K", image: "https://i.pinimg.com/564x/3b/7d/1b/3b7d1be222e6c70d205a092ef6a22b1f.jpg" },
        { id: 2, name: "महामृत्युंजय मंत्र", deity: "Shiva", description: "Powerful mantra for health and healing", views: "12.8K", image: "https://i.pinimg.com/564x/98/5c/2b/985c2b6d5c7f0a2b2e0f0e8b5b9a5f7d.jpg" },
        { id: 3, name: "विष्णु सहस्रनाम", deity: "Vishnu", description: "Thousand divine names for protection", views: "10.5K", image: "https://i.pinimg.com/564x/8a/5c/1d/8a5c1d3e7f9a2b3c4d5e6f7a8b9c0d1e.jpg" },
        { id: 4, name: "दुर्गा सप्तशती", deity: "Durga", description: "Powerful for protection and victory", views: "9.2K", image: "https://i.pinimg.com/564x/7a/4b/2c/7a4b2c3d4e5f6a7b8c9d0e1f2a3b4c5d.jpg" },
        { id: 5, name: "हनुमान चालीसा", deity: "Hanuman", description: "For strength and courage", views: "18.5K", image: "https://i.pinimg.com/564x/6b/3a/1d/6b3a1d2e3f4a5b6c7d8e9f0a1b2c3d4e.jpg" },
        { id: 6, name: "ॐ नमः शिवाय", deity: "Shiva", description: "The supreme mantra for inner peace", views: "22.1K", image: "https://i.pinimg.com/564x/98/5c/2b/985c2b6d5c7f0a2b2e0f0e8b5b9a5f7d.jpg" },
        { id: 7, name: "गायत्री मंत्र", deity: "Gayatri", description: "Vedic mantra for spiritual awakening", views: "14.3K", image: "https://i.pinimg.com/564x/5a/4b/3c/5a4b3c2d1e2f3a4b5c6d7e8f9a0b1c2d.jpg" },
        { id: 8, name: "श्री राम जय राम", deity: "Rama", description: "Mantra for righteousness and courage", views: "11.7K", image: "https://i.pinimg.com/564x/4b/3a/2c/4b3a2c1d2e3f4a5b6c7d8e9f0a1b2c3d.jpg" }
      ];
      setPopularMantras(limit ? defaultPopular.slice(0, limit) : defaultPopular);
      localStorage.setItem('popular_mantras', JSON.stringify(defaultPopular));
    }
  };

  // Auto-scroll function - never stops, seamless loop
  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If near the end, jump to the beginning smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 100) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 3, behavior: 'smooth' });
        }
      }
    }, 30);
  };

  // Start auto-scroll on mount
  useEffect(() => {
    if (popularMantras.length > 0) {
      startAutoScroll();
    }
    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, [popularMantras.length]);

  const handleCardClick = (mantra) => {
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
  };

  if (popularMantras.length === 0) return null;

  // Triple the array for seamless looping
  const loopedMantras = [...popularMantras, ...popularMantras, ...popularMantras];

  return (
    <section className="popular-mantras-section">
      <div className="container">
        {/* Header with right-aligned title */}
        <div className="popular-header-right">
          <div className="header-line"></div>
          <div className="popular-title-wrapper">
            <span className="star-icon">✨</span>
            <span className="popular-title-text">POPULAR MANTRAS</span>
            <span className="star-icon">✨</span>
          </div>
        </div>

        {/* Scroll Container with gradient masks */}
        <div className="popular-scroll-wrapper">
          <div className="scroll-gradient-mask left"></div>
          <div 
            className="popular-mantras-horizontal"
            ref={scrollRef}
          >
            {loopedMantras.map((mantra, index) => (
              <div 
                key={`${mantra.id}-${index}`} 
                className="popular-card-new"
                onClick={() => handleCardClick(mantra)}
              >
                <div className="card-inner">
                  <div className="card-image-new">
                    <img src={mantra.image} alt={mantra.name} loading="lazy" />
                    <div className="card-rank-new">#{index % popularMantras.length + 1}</div>
                  </div>
                  <div className="card-content-new">
                    <h3 className="card-name-new">{mantra.name}</h3>
                    <p className="card-deity-new">🙏 {mantra.deity}</p>
                    <p className="card-desc-new">{mantra.description}</p>
                    <div className="card-footer-new">
                      <span className="card-views-new">👁️ {mantra.views}</span>
                      <span className="card-read-new">Read →</span>
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
            <button className="btn-view-all-new" onClick={() => navigate('/mantras')}>
              View All Mantras →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularMantras;