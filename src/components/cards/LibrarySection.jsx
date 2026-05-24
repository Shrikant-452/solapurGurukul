// components/Public/LibrarySection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MantraCard from '../cards/MantraCard';

const LibrarySection = ({ mantras, loading, title = "Sacred Library", showViewAll = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('all');

  // Get unique deities from mantras
  const deities = ['all', ...new Set(mantras.map(m => m.deity))];

  // Filter mantras based on search and deity
  const filteredMantras = mantras.filter(m => {
    const matchesSearch = searchTerm === '' || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.purpose && m.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDeity = selectedDeity === 'all' || m.deity === selectedDeity;
    return matchesSearch && matchesDeity;
  });

  const handleMantraClick = (mantra) => {
    // Scroll to top BEFORE navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Navigate to mantra detail
    navigate(`/mantra/${mantra.id}`, { state: { mantra } });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <section className="library-section">
      <div className="container">
        <div className="library-header">
          <h2 className="library-title">{title}</h2>
          <p className="library-subtitle">Browse the complete collection of Hindu devotional texts</p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-wrapper">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by stotra name, deity, or purpose..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>✕</button>
              )}
            </div>
          </div>
          
          <div className="filter-wrapper">
            <select 
              className="deity-filter" 
              value={selectedDeity}
              onChange={(e) => setSelectedDeity(e.target.value)}
            >
              {deities.map(deity => (
                <option key={deity} value={deity}>
                  {deity === 'all' ? 'All Deities' : deity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredMantras.length} of {mantras.length} stotras
        </div>

        {/* Mantras Grid */}
        {loading ? (
          <div className="loading-mantras">Loading mantras...</div>
        ) : (
          <>
            <div className="mantras-home-grid">
              {filteredMantras.slice(0, 6).map((mantra, index) => (
                <div 
                  key={mantra.id} 
                  className="scroll-stagger" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MantraCard 
                    mantra={mantra} 
                    onClick={handleMantraClick}
                    variant="default"
                  />
                </div>
              ))}
            </div>

            {filteredMantras.length === 0 && (
              <div className="no-mantras-found">
                <p>No mantras found. Try a different search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LibrarySection;