import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mantras.css';

const Mantras = () => {
  const [mantras, setMantras] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDeity, setFilterDeity] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMantras();
    window.addEventListener('mantrasUpdated', loadMantras);
    return () => window.removeEventListener('mantrasUpdated', loadMantras);
  }, []);

  const loadMantras = () => {
    const savedMantras = localStorage.getItem('admin_mantras');
    if (savedMantras) {
      setMantras(JSON.parse(savedMantras));
    } else {
      const defaultMantras = [
        { id: 1, name: "ॐ गण गणपतये नमः", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles", verses: [{ dev: "ॐ गण गणपतये नमः" }], color: "#c85a00", status: "published" },
        { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", language: "Sanskrit", occasion: "Daily", purpose: "Inner peace", verses: [{ dev: "ॐ नमः शिवाय" }], color: "#0a5a50", status: "published" },
        { id: 3, name: "ॐ श्री रामाय नमः", deity: "Rama", language: "Sanskrit", occasion: "Daily", purpose: "Strength", verses: [{ dev: "ॐ श्री रामाय नमः" }], color: "#4a2878", status: "published" }
      ];
      setMantras(defaultMantras);
      localStorage.setItem('admin_mantras', JSON.stringify(defaultMantras));
    }
    setLoading(false);
  };

  const filteredMantras = mantras.filter(m => {
    const matchesSearch = search === '' || m.name.toLowerCase().includes(search.toLowerCase()) || m.deity.toLowerCase().includes(search.toLowerCase());
    const matchesDeity = filterDeity === 'all' || m.deity === filterDeity;
    return matchesSearch && matchesDeity && m.status === 'published';
  });

  const deities = ['all', ...new Set(mantras.map(m => m.deity))];

  if (loading) return <div className="loading">Loading mantras...</div>;

  return (
    <div className="mantras-page">
      <div className="container">
        <div className="mantras-header">
          <h1 className="mantras-title">Sacred Mantras</h1>
          <p className="mantras-subtitle">Browse our complete collection of devotional hymns</p>
        </div>

        <div className="filters-section">
          <input type="text" className="search-input" placeholder="Search by mantra name, deity..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-select" value={filterDeity} onChange={(e) => setFilterDeity(e.target.value)}>
            <option value="all">All Deities</option>
            {deities.filter(d => d !== 'all').map(deity => <option key={deity} value={deity}>{deity}</option>)}
          </select>
        </div>

        <div className="mantras-grid">
          {filteredMantras.map(mantra => (
            <div key={mantra.id} className="mantra-card" onClick={() => navigate(`/mantra/${mantra.id}`, { state: { mantra } })}>
              <div className="mantra-card-header" style={{ borderColor: mantra.color }}>
                <span className="deity-badge" style={{ background: `${mantra.color}20`, color: mantra.color }}>{mantra.deity}</span>
                <span className="language-badge">{mantra.language}</span>
              </div>
              <h3 className="mantra-name">{mantra.name}</h3>
              <div className="mantra-verse"><p>{mantra.verses[0]?.dev}</p></div>
              <div className="mantra-footer"><span className="read-more">Read more →</span></div>
            </div>
          ))}
        </div>

        {filteredMantras.length === 0 && <div className="no-results">No mantras found. Try a different search.</div>}
      </div>
    </div>
  );
};

export default Mantras;