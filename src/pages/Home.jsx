// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PopularMantras from '../components/cards/PopularMantras';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [heroBgImage, setHeroBgImage] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Load hero images from localStorage
  useEffect(() => {
    loadHeroImages();
    loadHeroBgImage();
    
    window.addEventListener('heroImagesUpdated', loadHeroImages);
    window.addEventListener('heroBgUpdated', loadHeroBgImage);
    
    return () => {
      window.removeEventListener('heroImagesUpdated', loadHeroImages);
      window.removeEventListener('heroBgUpdated', loadHeroBgImage);
    };
  }, []);

  const loadHeroImages = () => {
    const savedImages = localStorage.getItem('hero_slider_images');
    if (savedImages) {
      setSliderImages(JSON.parse(savedImages));
    } else {
      const defaultImages = [
        { url: "https://i.pinimg.com/564x/3b/7d/1b/3b7d1be222e6c70d205a092ef6a22b1f.jpg", name: "Lord Ganesha", description: "Remover of Obstacles" },
        { url: "https://i.pinimg.com/564x/98/5c/2b/985c2b6d5c7f0a2b2e0f0e8b5b9a5f7d.jpg", name: "Lord Shiva", description: "The Destroyer of Evil" },
        { url: "https://i.pinimg.com/564x/8a/5c/1d/8a5c1d3e7f9a2b3c4d5e6f7a8b9c0d1e.jpg", name: "Goddess Durga", description: "The Protector" }
      ];
      setSliderImages(defaultImages);
      localStorage.setItem('hero_slider_images', JSON.stringify(defaultImages));
    }
  };

  const loadHeroBgImage = () => {
    const savedBg = localStorage.getItem('hero_bg_image');
    if (savedBg) setHeroBgImage(savedBg);
    else setHeroBgImage('');
  };

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    const handleKeyPress = (e) => { if (e.key === 'a' || e.key === 'A') setIsAdminMode(prev => !prev); };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const updateHeroImage = (index, field, value) => {
    const updatedImages = [...sliderImages];
    updatedImages[index][field] = value;
    setSliderImages(updatedImages);
    localStorage.setItem('hero_slider_images', JSON.stringify(updatedImages));
    window.dispatchEvent(new Event('heroImagesUpdated'));
  };

  const addHeroImage = () => {
    const updatedImages = [...sliderImages, { url: "", name: "New Image", description: "Description" }];
    setSliderImages(updatedImages);
    localStorage.setItem('hero_slider_images', JSON.stringify(updatedImages));
    window.dispatchEvent(new Event('heroImagesUpdated'));
  };

  const removeHeroImage = (index) => {
    const updatedImages = sliderImages.filter((_, i) => i !== index);
    setSliderImages(updatedImages);
    localStorage.setItem('hero_slider_images', JSON.stringify(updatedImages));
    window.dispatchEvent(new Event('heroImagesUpdated'));
  };

  const updateHeroBg = (url) => {
    setHeroBgImage(url);
    localStorage.setItem('hero_bg_image', url);
    window.dispatchEvent(new Event('heroBgUpdated'));
  };

  const removeHeroBg = () => {
    setHeroBgImage('');
    localStorage.removeItem('hero_bg_image');
    window.dispatchEvent(new Event('heroBgUpdated'));
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e8dcc0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b4c2c" font-family="Arial,sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className="spiritual-dashboard">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: heroBgImage ? `linear-gradient(135deg, rgba(26, 15, 5, 0.85), rgba(44, 28, 14, 0.9)), url(${heroBgImage})` : 'linear-gradient(135deg, #1a0f05 0%, #2c1c0e 50%, #1a0f05 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="hero-pattern"></div>
        
        {isAdminMode && (
          <div className="admin-controls">
            <div className="admin-panel">
              <h3>Admin Controls - Hero Section</h3>
              <div className="admin-bg-control">
                <label>Hero Background Image URL:</label>
                <div className="admin-input-group">
                  <input type="text" placeholder="Enter background image URL" value={heroBgImage} onChange={(e) => updateHeroBg(e.target.value)} />
                  <button onClick={removeHeroBg} className="admin-btn-remove">Remove BG</button>
                </div>
              </div>
              <div className="admin-slider-control">
                <h4>Slider Images</h4>
                {sliderImages.map((img, index) => (
                  <div key={index} className="admin-image-item">
                    <div className="admin-image-preview">
                      {img.url ? <img src={img.url} alt={img.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} onError={handleImageError} /> : <div style={{ width: '60px', height: '60px', background: '#ccc', borderRadius: '8px' }}></div>}
                    </div>
                    <div className="admin-image-fields">
                      <input type="text" placeholder="Image URL" value={img.url} onChange={(e) => updateHeroImage(index, 'url', e.target.value)} />
                      <input type="text" placeholder="Name" value={img.name} onChange={(e) => updateHeroImage(index, 'name', e.target.value)} />
                      <input type="text" placeholder="Description" value={img.description} onChange={(e) => updateHeroImage(index, 'description', e.target.value)} />
                    </div>
                    <button onClick={() => removeHeroImage(index)} className="admin-btn-remove">Remove</button>
                  </div>
                ))}
                <button onClick={addHeroImage} className="admin-btn-add">+ Add New Image</button>
              </div>
            </div>
          </div>
        )}

        {isAdminMode && (
          <div className="admin-mode-indicator">
            <span>🔧 Admin Mode Active - Press 'A' to exit</span>
          </div>
        )}

        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <span className="hero-badge">🕉️ Sacred Hymns & Spiritual Guidance</span>
              <h1 className="hero-title">Discover the Power of <span className="title-highlight">Ancient Mantras</span></h1>
              <p className="hero-description">Explore thousands of stotras, mantras, and devotional hymns with Devanagari, transliteration, meaning, and audio.</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => navigate('/mantras')}>
                  <span>📜</span> Explore Library
                </button>
                <button className="btn-outline" onClick={() => navigate('/about')}>
                  <span>🕉️</span> Learn More
                </button>
              </div>
            </div>
            
            <div className="hero-image-slider">
              <div className="mandala-bg"></div>
              <div className="image-circle">
                <div className="image-container">
                  {sliderImages.map((image, index) => (
                    <div key={index} className={`slide-image ${currentSlide === index ? 'active' : ''}`}>
                      {image.url ? <img src={image.url} alt={image.name} onError={handleImageError} /> : <div className="image-placeholder">No Image</div>}
                      <div className="image-caption">
                        <h3>{image.name || 'Deity'}</h3>
                        <p>{image.description || 'Sacrament'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="slider-dots">
                  {sliderImages.map((_, index) => (
                    <button key={index} className={`dot ${currentSlide === index ? 'active' : ''}`} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Mantras Component */}
      <PopularMantras limit={8} showViewAll={true} />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919876543210" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" />
        <span className="whatsapp-tooltip">Need Help? Chat with us</span>
      </a>
    </div>
  );
};

export default Home;