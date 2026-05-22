import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const stats = [
    { value: '500+', label: 'Sacred Mantras' },
    { value: '50+', label: 'Divine Deities' },
    { value: '8', label: 'Languages' },
    { value: '10K+', label: 'Devotees' }
  ];
  
  const categories = [
    { icon: '🌅', name: 'Morning Prayers', color: '#ffcd00', path: '/mantras' },
    { icon: '🪔', name: 'Festival Mantras', color: '#ff8c00', path: '/mantras' },
    { icon: '📖', name: 'Learn Sanskrit', color: '#00d4aa', path: '/about' },
    { icon: '🕌', name: 'Community Sabha', color: '#a855f7', path: '/contact' }
  ];
  
  const featuredMantras = [
    { name: "ॐ गण गणपतये नमः", deity: "Ganesha", color: "#ffcd00", description: "Remover of obstacles, bestower of wisdom and prosperity", gradient: "linear-gradient(135deg, #ffcd00, #ff8c00)" },
    { name: "ॐ नमः शिवाय", deity: "Shiva", color: "#00d4aa", description: "The supreme mantra for inner peace and liberation", gradient: "linear-gradient(135deg, #00d4aa, #00b894)" },
    { name: "ॐ श्री रामाय नमः", deity: "Rama", color: "#ff6b6b", description: "Embodiment of righteousness, courage, and virtue", gradient: "linear-gradient(135deg, #ff6b6b, #ee5a5a)" }
  ];
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-om">ॐ</div>
            <h1 className="hero-title">Divine Mantra</h1>
            <p className="hero-subtitle">Treasury of Sacred Hymns</p>
            <p className="hero-description">
              Discover the power of ancient mantras, stotras, and devotional hymns. 
              A sacred treasury for spiritual seekers.
            </p>
            <button className="btn-primary" onClick={() => navigate('/mantras')}>
              Explore Library →
            </button>
            
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Mantras Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Mantras</h2>
            <button className="view-all-btn" onClick={() => navigate('/mantras')}>
              View All →
            </button>
          </div>
          
          <div className="featured-grid">
            {featuredMantras.map((mantra, index) => (
              <div 
                key={index} 
                className="featured-card"
              >
                <div className="featured-card-icon" style={{ background: mantra.gradient }}>
                  ॐ
                </div>
                <h3 className="featured-card-name">{mantra.name}</h3>
                <p className="featured-card-deity">🙏 {mantra.deity}</p>
                <p className="featured-card-description">{mantra.description}</p>
                <button 
                  className="featured-card-btn"
                  onClick={() => navigate('/mantras')}
                >
                  Chant Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title text-center">Explore Categories</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="category-card" 
                onClick={() => navigate(category.path)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Floating decorative elements */}
      <div className="floating-element" style={{ top: '10%', left: '5%' }}>🕉️</div>
      <div className="floating-element" style={{ top: '70%', right: '3%', animationDelay: '5s' }}>🔱</div>
      <div className="floating-element" style={{ bottom: '15%', left: '8%', animationDelay: '2s' }}>🌸</div>
      <div className="floating-element" style={{ top: '40%', right: '10%', animationDelay: '7s' }}>✨</div>
    </div>
  );
};

export default Home;