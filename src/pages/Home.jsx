import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MantraCard from '../components/cards/MantraCard';
import PopularMantras from '../pages/PopularMantras'; // ✅ Uncommented
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mantras, setMantras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState([]);
  const [heroBgImage, setHeroBgImage] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Load hero images from localStorage
  useEffect(() => {
    loadHeroImages();
    loadHeroBgImage();
    loadMantras();
    
    window.addEventListener('mantrasUpdated', loadMantras);
    window.addEventListener('heroImagesUpdated', loadHeroImages);
    window.addEventListener('heroBgUpdated', loadHeroBgImage);
    
    return () => {
      window.removeEventListener('mantrasUpdated', loadMantras);
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

  const loadMantras = () => {
    const savedMantras = localStorage.getItem('admin_mantras');
    if (savedMantras) {
      const parsed = JSON.parse(savedMantras);
      const published = parsed.filter(m => m.status === 'published');
      const normalized = published.map(m => ({
        ...m,
        verse: m.verse || (m.verses && m.verses[0]?.dev) || "ॐ नमः शिवाय",
      }));
      setMantras(normalized);
    } else {
      const defaultMantras = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", tag: "Popular", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles", verse: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", status: "published", color: "#c85a00", views: 1247, icon: "🐘" },
        { id: 2, name: "महालक्ष्मी अष्टकम्", tag: "Ashtakam", deity: "Lakshmi", language: "Sanskrit", occasion: "Friday Puja", purpose: "Wealth and prosperity", verse: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥", status: "published", color: "#e06b10", views: 987, icon: "🪷" },
        { id: 3, name: "शिव पञ्चाक्षर स्तोत्रम्", tag: "Panchakshara", deity: "Shiva", language: "Sanskrit", occasion: "Shivaratri, Monday", purpose: "Inner peace, liberation", verse: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय॥", status: "published", color: "#0a5a50", views: 2341, icon: "🕉️" },
        { id: 4, name: "हनुमान चालीसा", tag: "Chalisa", deity: "Hanuman", language: "Hindi", occasion: "Tuesday, Saturday", purpose: "Strength and courage", verse: "श्रीगुरु चरण सरोज रज निज मन मुकुर सुधारि।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥", status: "published", color: "#f59040", views: 876, icon: "🙏" },
        { id: 5, name: "विष्णु सहस्रनामम्", tag: "Sahasranam", deity: "Vishnu", language: "Sanskrit", occasion: "Ekadashi, Sunday", purpose: "Protection, moksha", verse: "विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः॥", status: "published", color: "#4a2878", views: 1892, icon: "🌊" },
        { id: 6, name: "दुर्गा सप्तशती", tag: "Navratri", deity: "Durga", language: "Sanskrit", occasion: "Navratri", purpose: "Victory over evil", verse: "अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते।\nगिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते॥", status: "published", color: "#7a1818", views: 1567, icon: "⚔️" }
      ];
      setMantras(defaultMantras);
      localStorage.setItem('admin_mantras', JSON.stringify(defaultMantras));
    }
    setLoading(false);
  };

  const filteredMantras = mantras.filter(m => {
    const matchesSearch = searchTerm === '' || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.purpose && m.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDeity = selectedDeity === 'all' || m.deity === selectedDeity;
    return matchesSearch && matchesDeity;
  });

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const deities = ['all', ...new Set(mantras.map(m => m.deity))];
  
  const handleMantraClick = (mantra) => navigate(`/mantra/${mantra.id}`, { state: { mantra } });

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

  return (
    <div className="spiritual-dashboard">
      {/* Hero Section (compressed) */}
      <section 
        className="hero-section"
        style={{
          background: heroBgImage ? `linear-gradient(135deg, rgba(26, 15, 5, 0.85), rgba(44, 28, 14, 0.9)), url(${heroBgImage})` : 'linear-gradient(135deg, #1a0f05 0%, #2c1c0e 50%, #1a0f05 100%)',
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
                      {img.url ? <img src={img.url} alt={img.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} /> : <div style={{ width: '60px', height: '60px', background: '#ccc', borderRadius: '8px' }}></div>}
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

        <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="hero-wrapper" style={{ gap: '30px' }}>
            <div className="hero-content">
              <span className="hero-badge">🕉️ Sacred Hymns & Spiritual Guidance</span>
              <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Discover the Power of <span className="title-highlight">Ancient Mantras</span></h1>
              <p className="hero-description" style={{ fontSize: '0.95rem', marginBottom: '24px' }}>Explore thousands of stotras, mantras, and devotional hymns with Devanagari, transliteration, meaning, and audio.</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => navigate('/mantras')}><span>📜</span> Explore Library</button>
                <button className="btn-outline" onClick={() => navigate('/about')}><span>🕉️</span> Learn More</button>
              </div>
            </div>
            
            <div className="hero-image-slider">
              <div className="mandala-bg"></div>
              <div className="image-circle">
                <div className="image-container">
                  {sliderImages.map((image, index) => (
                    <div key={index} className={`slide-image ${currentSlide === index ? 'active' : ''}`}>
                      {image.url ? <img src={image.url} alt={image.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }} /> : <div className="image-placeholder">No Image</div>}
                      <div className="image-caption"><h3>{image.name || 'Deity'}</h3><p>{image.description || 'Sacrament'}</p></div>
                    </div>
                  ))}
                </div>
                <div className="slider-dots">
                  {sliderImages.map((_, index) => (<button key={index} className={`dot ${currentSlide === index ? 'active' : ''}`} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Section - compressed */}
      <section className="library-section" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="library-header" style={{ marginBottom: '24px' }}>
            <h2 className="library-title" style={{ fontSize: '2rem' }}>Sacred <span className="title-gold">Library</span></h2>
            <p className="library-subtitle" style={{ fontSize: '0.9rem' }}>Browse the complete collection of Hindu devotional texts</p>
          </div>

          <div className="search-filter-section" style={{ marginBottom: '24px' }}>
            <div className="search-wrapper">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search by stotra name, deity, or purpose..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>}
              </div>
            </div>
            <div className="filter-wrapper">
              <select className="deity-filter" value={selectedDeity} onChange={(e) => setSelectedDeity(e.target.value)}>
                {deities.map(deity => (<option key={deity} value={deity}>{deity === 'all' ? 'All Deities' : deity}</option>))}
              </select>
            </div>
          </div>

          <div className="results-count" style={{ marginBottom: '16px', fontSize: '0.8rem' }}>Showing {filteredMantras.length} of {mantras.length} stotras</div>

          {loading ? (
            <div className="loading-mantras">Loading mantras...</div>
          ) : (
            <>
              <div className="mantras-home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {filteredMantras.slice(0, 6).map((mantra) => (<MantraCard key={mantra.id} mantra={mantra} onClick={handleMantraClick} variant="default" />))}
              </div>

              {filteredMantras.length === 0 && (<div className="no-mantras-found"><p>No mantras found. Try a different search.</p></div>)}

              <div className="view-all-mantras" style={{ textAlign: 'center' }}>
                <button className="btn-primary" onClick={() => navigate('/mantras')} style={{ padding: '10px 24px' }}>View All Mantras →</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ✅ Popular Mantras Component - now visible */}
      <PopularMantras limit={8} showViewAll={true} />

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/919876543210" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" />
        <span className="whatsapp-tooltip">Need Help? Chat with us</span>
      </a>
    </div>
  );
};

export default Home;