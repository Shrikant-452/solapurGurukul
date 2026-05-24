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
      const defaultMantras = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles", verse: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", status: "published", color: "#c85a00", views: 1247, icon: "🐘", imageUrl: null },
        { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", language: "Sanskrit", occasion: "Daily", purpose: "Inner peace", verse: "ॐ नमः शिवाय", status: "published", color: "#0a5a50", views: 2341, icon: "🕉️", imageUrl: null },
        { id: 3, name: "महालक्ष्मी अष्टकम्", deity: "Lakshmi", language: "Sanskrit", occasion: "Friday", purpose: "Wealth and prosperity", verse: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते", status: "published", color: "#e06b10", views: 987, icon: "🪷", imageUrl: null }
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
        { id: 1, name: "Ganesha", icon: "🐘", imageUrl: null, color: "#c85a00", description: "Remover of Obstacles" },
        { id: 2, name: "Shiva", icon: "🕉️", imageUrl: null, color: "#0a5a50", description: "The Destroyer of Evil" },
        { id: 3, name: "Vishnu", icon: "🌊", imageUrl: null, color: "#4a2878", description: "The Preserver" },
        { id: 4, name: "Lakshmi", icon: "🪷", imageUrl: null, color: "#e06b10", description: "Goddess of Wealth" },
        { id: 5, name: "Durga", icon: "⚔️", imageUrl: null, color: "#7a1818", description: "The Warrior Goddess" },
        { id: 6, name: "Hanuman", icon: "🙏", imageUrl: null, color: "#f59040", description: "The Devotee" },
        { id: 7, name: "Saraswati", icon: "📖", imageUrl: null, color: "#d4aa30", description: "Goddess of Knowledge" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  };

  // Get category icon (prefer imageUrl over icon)
  const getCategoryIcon = (cat) => {
    if (cat.imageUrl && (cat.imageUrl.startsWith('data:') || cat.imageUrl.startsWith('http'))) {
      return cat.imageUrl;
    }
    return cat.icon || '📿';
  };

  // Build deities from categories with proper image handling
  const deities = categories.map(cat => ({
    name: cat.name,
    icon: getCategoryIcon(cat),
    color: cat.color,
    description: cat.description,
    count: mantras.filter(m => m.deity === cat.name).length
  }));

  // Map for MantrasByDeity component
  const deityInfoMap = {};
  categories.forEach(cat => {
    deityInfoMap[cat.name] = {
      name: cat.name,
      icon: getCategoryIcon(cat),
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearDeityFilter = () => {
    setSelectedDeity(null);
    setFilteredMantras([]);
    setSearchTerm('');
    navigate('/mantras', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMantraClick = (mantra) => {
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="mantras-page-full">
      <div className="container">
        <div className="mantras-page-header">
          <div className="mantras-page-om">ॐ</div>
          <h1 className="mantras-page-title">Mantras by <span className="title-gold">Deity</span></h1>
          <p className="mantras-page-subtitle">Browse powerful mantras by deity and tradition</p>
        </div>

        <div className="deities-grid">
          {deities.map((deity, index) => (
            <div 
              key={deity.name} 
              className="deity-category-card"
              onClick={() => handleDeityClick(deity.name)}
              style={{ 
                borderBottomColor: deity.color,
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="deity-card-icon">
                {typeof deity.icon === 'string' && (deity.icon.startsWith('data:') || deity.icon.startsWith('http')) ? (
                  <img 
                    src={deity.icon} 
                    alt={deity.name} 
                    className="deity-card-img"
                  />
                ) : (
                  <span className="deity-card-emoji">{deity.icon}</span>
                )}
              </div>
              <h3 className="deity-card-name">{deity.name}</h3>
              <p className="deity-card-desc">{deity.description}</p>
              <div className="deity-card-count" style={{ color: deity.color }}>
                {deity.count} Mantra{deity.count !== 1 && 's'}
              </div>
              <div className="deity-card-btn" style={{ color: deity.color }}>
                View Mantras →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mantras;