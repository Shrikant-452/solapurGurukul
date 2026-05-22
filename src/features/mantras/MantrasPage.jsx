import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MantrasPage.css';

const MANTRA_DATA = [
  { id: 1, name: "ॐ गण गणपतये नमः", deity: "Ganesha", language: "Sanskrit", occasion: "Daily, New Beginnings", purpose: "Removal of obstacles, success in all endeavors", verses: [{ dev: "ॐ गण गणपतये नमः" }], color: "#ffd700" },
  { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", language: "Sanskrit", occasion: "Daily, Monday", purpose: "Inner peace, liberation, spiritual growth", verses: [{ dev: "ॐ नमः शिवाय" }], color: "#20b2aa" },
  { id: 3, name: "ॐ श्री रामाय नमः", deity: "Rama", language: "Sanskrit", occasion: "Daily, Tuesday", purpose: "Strength, righteousness, protection", verses: [{ dev: "ॐ श्री रामाय नमः" }], color: "#4f46e5" },
];

const MantraCard = ({ mantra, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div className={`mantra-card ${hovered ? 'hovered' : ''}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onClick(mantra)}>
      <div className="mantra-card-top" style={{ borderColor: mantra.color }}>
        <div className="mantra-deity-badge" style={{ background: `${mantra.color}20`, color: mantra.color }}>{mantra.deity}</div>
        <div className="mantra-language">{mantra.language}</div>
      </div>
      <h3 className="mantra-name">{mantra.name}</h3>
      <div className="mantra-verse-preview"><p className="verse-dev">{mantra.verses[0].dev}</p></div>
      <div className="mantra-meta"><div className="meta-item"><span className="meta-icon">📅</span><span className="meta-text">{mantra.occasion}</span></div></div>
      <div className="mantra-card-footer"><span className="read-more">Read more →</span></div>
    </div>
  );
};

function MantrasPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const filteredMantras = MANTRA_DATA.filter(mantra => mantra.name.toLowerCase().includes(search.toLowerCase()) || mantra.deity.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="mantras-page">
      <div className="container">
        <div className="mantras-header"><h1 className="mantras-title">Sacred Mantras</h1><p className="mantras-subtitle">Browse our complete collection of devotional hymns</p></div>
        <div className="filters-section">
          <input type="text" className="search-input" placeholder="Search by mantra name, deity, or purpose..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="results-count">Showing {filteredMantras.length} of {MANTRA_DATA.length} mantras</div>
        </div>
        <div className="mantras-grid">{filteredMantras.map(mantra => (<MantraCard key={mantra.id} mantra={mantra} onClick={() => console.log('View mantra:', mantra)} />))}</div>
      </div>
    </div>
  );
}

export default MantrasPage;