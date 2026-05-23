// components/Public/Mantras.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MantraCard from '../components/cards/MantraCard';
import MantrasByDeity from './MantrasByDeity';
import './Mantras.css';

const Mantras = () => {
  const navigate = useNavigate();
  const { deityName } = useParams();
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [filteredMantras, setFilteredMantras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mantras, setMantras] = useState([]);

  // Load mantras and categories from localStorage
  useEffect(() => {
    loadMantras();
    loadCategories();
    window.addEventListener('mantrasUpdated', loadMantras);
    window.addEventListener('categoriesUpdated', loadCategories);
    return () => {
      window.removeEventListener('mantrasUpdated', loadMantras);
      window.removeEventListener('categoriesUpdated', loadCategories);
    };
  }, []);

  const loadMantras = () => {
    const saved = localStorage.getItem('admin_mantras');
    if (saved) {
      const all = JSON.parse(saved);
      const published = all.filter(m => m.status === 'published');
      const sorted = published.sort((a, b) => b.id - a.id);
      setMantras(sorted);
    } else {
      // Default mantras if none exist
      const defaultMantras = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles", verse: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", status: "published", color: "#c85a00", views: 1247, icon: "🐘" },
        { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", language: "Sanskrit", occasion: "Daily", purpose: "Inner peace", verse: "ॐ नमः शिवाय", status: "published", color: "#0a5a50", views: 2341, icon: "🕉️" },
        { id: 3, name: "महालक्ष्मी अष्टकम्", deity: "Lakshmi", language: "Sanskrit", occasion: "Friday", purpose: "Wealth and prosperity", verse: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते", status: "published", color: "#e06b10", views: 987, icon: "🪷" }
      ];
      setMantras(defaultMantras);
      localStorage.setItem('admin_mantras', JSON.stringify(defaultMantras));
    }
    setLoading(false);
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaultCategories = [
        { id: 1, name: "Ganesha", icon: "🐘", color: "#c85a00", description: "Remover of Obstacles" },
        { id: 2, name: "Shiva", icon: "🕉️", color: "#0a5a50", description: "The Destroyer of Evil" },
        { id: 3, name: "Vishnu", icon: "🌊", color: "#4a2878", description: "The Preserver" },
        { id: 4, name: "Lakshmi", icon: "🪷", color: "#e06b10", description: "Goddess of Wealth" },
        { id: 5, name: "Durga", icon: "⚔️", color: "#7a1818", description: "The Warrior Goddess" },
        { id: 6, name: "Hanuman", icon: "🙏", color: "#f59040", description: "The Devotee" },
        { id: 7, name: "Saraswati", icon: "📖", color: "#d4aa30", description: "Goddess of Knowledge" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  };

  // Build deities from categories
  const deities = categories.map(cat => ({
    name: cat.name,
    icon: cat.icon || cat.imageUrl || '📿',
    color: cat.color,
    description: cat.description,
    count: mantras.filter(m => m.deity === cat.name).length
  }));

  // Map for MantrasByDeity component
  const deityInfoMap = {};
  categories.forEach(cat => {
    deityInfoMap[cat.name] = {
      name: cat.name,
      icon: cat.icon || cat.imageUrl || '📿',
      color: cat.color,
      description: cat.description
    };
  });

  // Handle URL parameter for direct deity access
  useEffect(() => {
    if (deityName && !loading && categories.length > 0) {
      const formattedDeity = deityName.charAt(0).toUpperCase() + deityName.slice(1);
      const deity = deities.find(d => d.name.toLowerCase() === formattedDeity.toLowerCase());
      if (deity) {
        filterByDeity(deity.name);
      }
    }
  }, [deityName, categories, loading]);

  const filterByDeity = (deity) => {
    setSelectedDeity(deity);
    const filtered = mantras.filter(m => m.deity === deity && m.status === 'published');
    setFilteredMantras(filtered);
    setSearchTerm('');
    navigate(`/mantras/deity/${deity.toLowerCase()}`, { replace: true });
  };

  const clearDeityFilter = () => {
    setSelectedDeity(null);
    setFilteredMantras([]);
    setSearchTerm('');
    navigate('/mantras', { replace: true });
  };

  const handleMantraClick = (mantra) => {
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
  };

  const handleDeityClick = (deityName) => {
    filterByDeity(deityName);
  };

  if (loading) {
    return (
      <div className="mantras-page-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="loading-mantras-page">Loading sacred mantras...</div>
      </div>
    );
  }

  // If a deity is selected, show MantrasByDeity component
  if (selectedDeity && deityInfoMap[selectedDeity]) {
    const deityInfo = deityInfoMap[selectedDeity];
    return (
      <MantrasByDeity
        deityName={selectedDeity}
        mantras={filteredMantras}
        deityInfo={deityInfo}
        onBack={clearDeityFilter}
      />
    );
  }

  // Otherwise show the deity grid
  return (
    <div className="mantras-page-full" style={{ background: "linear-gradient(145deg, #fef9f0 0%, #fff5e6 100%)", paddingTop: "40px", paddingBottom: "40px" }}>
      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
        <div className="mantras-page-header" style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="mantras-page-om" style={{ fontSize: "48px", fontWeight: "300", color: "#c85a00", opacity: 0.7, marginBottom: "4px" }}>ॐ</div>
          <h1 className="mantras-page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "800", background: "linear-gradient(135deg, #2c1c0e, #c85a00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            Mantras by <span className="title-gold">Deity</span>
          </h1>
          <p className="mantras-page-subtitle" style={{ color: "#6b4c2c", fontSize: "0.9rem" }}>Browse powerful mantras by deity and tradition</p>
        </div>

        <div className="deities-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {deities.map((deity, index) => (
            <div 
              key={deity.name} 
              className="deity-category-card"
              onClick={() => handleDeityClick(deity.name)}
              style={{ 
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                borderRadius: "20px",
                padding: "20px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "1px solid rgba(200, 90, 0, 0.2)",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 20px -8px ${deity.color}40`;
                e.currentTarget.style.borderColor = deity.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.borderColor = "rgba(200, 90, 0, 0.2)";
              }}
            >
              <div className="deity-card-icon" style={{ fontSize: "44px", marginBottom: "10px" }}>
                {deity.icon && (deity.icon.startsWith('data:') || deity.icon.startsWith('http')) ? (
                  <img src={deity.icon} alt={deity.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <span>{deity.icon || '📿'}</span>
                )}
              </div>
              <h3 className="deity-card-name" style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{deity.name}</h3>
              <p className="deity-card-desc" style={{ fontSize: "0.75rem", marginBottom: "10px" }}>{deity.description}</p>
              <div className="deity-card-count" style={{ display: "inline-block", background: `${deity.color}15`, color: deity.color, padding: "2px 12px", borderRadius: "30px", fontSize: "0.7rem", fontWeight: "600", marginBottom: "8px" }}>
                {deity.count} Mantra{deity.count !== 1 && 's'}
              </div>
              <div className="deity-card-btn" style={{ fontSize: "0.8rem", gap: "4px" }}>View Mantras →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mantras;