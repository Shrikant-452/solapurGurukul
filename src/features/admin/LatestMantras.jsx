import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './LatestMantras.css';

const LatestMantras = () => {
  const [latestMantras, setLatestMantras] = useState([]);
  const [allMantras, setAllMantras] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load all mantras
    const savedMantras = localStorage.getItem('admin_mantras');
    if (savedMantras) {
      const parsed = JSON.parse(savedMantras);
      const published = parsed.filter(m => m.status === 'published');
      setAllMantras(published);
    }

    // Load latest mantras
    const savedLatest = localStorage.getItem('latest_mantras');
    if (savedLatest) {
      setLatestMantras(JSON.parse(savedLatest));
    } else {
      // Default latest mantras
      const defaultLatest = [
        { id: 1, name: "ॐ गण गणपतये नमः", deity: "Ganesha", description: "Remover of obstacles", color: "#c85a00", date: new Date().toISOString() },
        { id: 2, name: "ॐ नमः शिवाय", deity: "Shiva", description: "The great liberator", color: "#0a5a50", date: new Date().toISOString() },
        { id: 3, name: "ॐ श्री रामाय नमः", deity: "Rama", description: "Embodiment of righteousness", color: "#4a2878", date: new Date().toISOString() }
      ];
      setLatestMantras(defaultLatest);
      localStorage.setItem('latest_mantras', JSON.stringify(defaultLatest));
    }
    setLoading(false);
  };

  const saveLatestMantras = (updated) => {
    setLatestMantras(updated);
    localStorage.setItem('latest_mantras', JSON.stringify(updated));
    window.dispatchEvent(new Event('latestMantrasUpdated'));
    toast.success('Latest mantras updated successfully!');
  };

  const addToLatest = (mantra) => {
    if (latestMantras.some(m => m.id === mantra.id)) {
      toast.error('This mantra is already in latest list');
      return;
    }
    if (latestMantras.length >= 10) {
      toast.error('Maximum 10 mantras allowed in latest list');
      return;
    }
    
    const newLatest = {
      id: mantra.id,
      name: mantra.name,
      deity: mantra.deity,
      description: mantra.purpose || mantra.description || 'Sacred chant',
      color: mantra.color || '#c85a00',
      date: new Date().toISOString()
    };
    
    saveLatestMantras([...latestMantras, newLatest]);
    setShowAddModal(false);
  };

  const removeFromLatest = (id) => {
    const updated = latestMantras.filter(m => m.id !== id);
    saveLatestMantras(updated);
  };

  const moveUp = (index) => {
    if (index > 0) {
      const updated = [...latestMantras];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      saveLatestMantras(updated);
    }
  };

  const moveDown = (index) => {
    if (index < latestMantras.length - 1) {
      const updated = [...latestMantras];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      saveLatestMantras(updated);
    }
  };

  const updateDescription = (id, newDescription) => {
    const updated = latestMantras.map(m => 
      m.id === id ? { ...m, description: newDescription } : m
    );
    saveLatestMantras(updated);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="latest-mantras-admin">
      <div className="admin-header">
        <h2>📜 Latest Mantras Management</h2>
        <p>Manage mantras that appear in the auto-scrolling section on homepage (Max 10)</p>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add to Latest</button>
      </div>

      <div className="latest-mantras-list">
        {latestMantras.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <p>No mantras in latest list</p>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Your First Mantra</button>
          </div>
        ) : (
          latestMantras.map((mantra, index) => (
            <div key={mantra.id} className="latest-item" style={{ borderLeftColor: mantra.color }}>
              <div className="item-number">{index + 1}</div>
              <div className="item-content">
                <div className="item-header">
                  <h3>{mantra.name}</h3>
                  <div className="item-badge" style={{ background: `${mantra.color}20`, color: mantra.color }}>
                    {mantra.deity}
                  </div>
                </div>
                <input 
                  type="text" 
                  value={mantra.description} 
                  onChange={(e) => updateDescription(mantra.id, e.target.value)}
                  className="description-input"
                />
                <div className="item-date">Added: {new Date(mantra.date).toLocaleDateString()}</div>
              </div>
              <div className="item-actions">
                <button className="move-btn up" onClick={() => moveUp(index)} title="Move Up">↑</button>
                <button className="move-btn down" onClick={() => moveDown(index)} title="Move Down">↓</button>
                <button className="remove-btn" onClick={() => removeFromLatest(mantra.id)} title="Remove">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add Mantra to Latest</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Select a mantra to add to the auto-scrolling latest section:</p>
              <div className="mantras-list-select">
                {allMantras.filter(m => !latestMantras.some(l => l.id === m.id)).map(mantra => (
                  <div key={mantra.id} className="select-item" onClick={() => addToLatest(mantra)}>
                    <div className="select-icon" style={{ background: `${mantra.color}20`, color: mantra.color }}>ॐ</div>
                    <div className="select-info">
                      <div className="select-name">{mantra.name}</div>
                      <div className="select-deity">{mantra.deity}</div>
                    </div>
                  </div>
                ))}
              </div>
              {allMantras.filter(m => !latestMantras.some(l => l.id === m.id)).length === 0 && (
                <div className="no-mantras">No more mantras available. Create new mantras first.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestMantras;