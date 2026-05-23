import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import './ManageMantras.css';

const ManageMantras = () => {
  const [mantras, setMantras] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ New: categories from storage
  const [search, setSearch] = useState('');
  const [filterDeity, setFilterDeity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  
  // Drag & drop refs
  const imageDropRef = useRef(null);
  const audioDropRef = useRef(null);
  const pdfDropRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    deity: '',
    language: 'Sanskrit',
    occasion: '',
    purpose: '',
    verses: [{ dev: '', roman: '', meaning: '' }],
    status: 'published',
    imageUrl: '',
    audioUrl: '',
    pdfUrl: ''
  });

  // Load mantras and categories
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
      setMantras(JSON.parse(saved));
    } else {
      const defaultMantras = [
        { id: 1, name: "ॐ गण गणपतये नमः", name_en: "Om Gan Ganapataye Namah", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles, success in all endeavors", verses: [{ dev: "ॐ गण गणपतये नमः", roman: "Om Gan Ganapataye Namah", meaning: "Salutations to Lord Ganesha" }], status: "published", color: "#c85a00", views: 1247, downloads: 342, imageUrl: "", audioUrl: "", pdfUrl: "" },
        { id: 2, name: "ॐ नमः शिवाय", name_en: "Om Namah Shivaya", deity: "Shiva", language: "Sanskrit", occasion: "Daily, Monday", purpose: "Inner peace, liberation, spiritual growth", verses: [{ dev: "ॐ नमः शिवाय", roman: "Om Namah Shivaya", meaning: "Salutations to Lord Shiva" }], status: "published", color: "#0a5a50", views: 2341, downloads: 567, imageUrl: "", audioUrl: "", pdfUrl: "" },
        { id: 3, name: "ॐ श्री रामाय नमः", name_en: "Om Shri Ramaya Namah", deity: "Rama", language: "Sanskrit", occasion: "Daily, Tuesday", purpose: "Strength, righteousness, protection", verses: [{ dev: "ॐ श्री रामाय नमः", roman: "Om Shri Ramaya Namah", meaning: "Salutations to Lord Rama" }], status: "published", color: "#4a2878", views: 1892, downloads: 421, imageUrl: "", audioUrl: "", pdfUrl: "" }
      ];
      setMantras(defaultMantras);
      localStorage.setItem('admin_mantras', JSON.stringify(defaultMantras));
      window.dispatchEvent(new Event('mantrasUpdated'));
    }
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      // Default categories if none exist
      const defaultCategories = [
        { id: 1, name: 'Ganesha', description: 'Remover of Obstacles', imageUrl: '🐘', color: '#c85a00', mantraCount: 0 },
        { id: 2, name: 'Lakshmi', description: 'Goddess of Wealth', imageUrl: '🪷', color: '#e06b10', mantraCount: 0 },
        { id: 3, name: 'Shiva', description: 'The Destroyer of Evil', imageUrl: '🕉️', color: '#0a5a50', mantraCount: 0 },
        { id: 4, name: 'Hanuman', description: 'God of Strength', imageUrl: '🙏', color: '#f59040', mantraCount: 0 }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      window.dispatchEvent(new Event('categoriesUpdated'));
    }
  };

  // Build deityColors map from categories
  const deityColors = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.color;
    return acc;
  }, {});

  const saveMantras = (updated) => {
    setMantras(updated);
    localStorage.setItem('admin_mantras', JSON.stringify(updated));
    window.dispatchEvent(new Event('mantrasUpdated'));
    toast.success('Mantras saved successfully!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      deity: '',
      language: 'Sanskrit',
      occasion: '',
      purpose: '',
      verses: [{ dev: '', roman: '', meaning: '' }],
      status: 'published',
      imageUrl: '',
      audioUrl: '',
      pdfUrl: ''
    });
    setImagePreview('');
    setAudioFileName('');
    setPdfFileName('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerseChange = (index, field, value) => {
    const newVerses = [...formData.verses];
    newVerses[index][field] = value;
    setFormData({ ...formData, verses: newVerses });
  };

  const addVerse = () => {
    setFormData({
      ...formData,
      verses: [...formData.verses, { dev: '', roman: '', meaning: '' }]
    });
  };

  const removeVerse = (index) => {
    const newVerses = formData.verses.filter((_, i) => i !== index);
    setFormData({ ...formData, verses: newVerses });
  };

  // File upload handlers
  const handleFileUpload = (type, file) => {
    if (!file) return;
    const maxSize = type === 'image' ? 10 : 20;
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large! Max ${maxSize}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (type === 'image') {
        setFormData({ ...formData, imageUrl: base64 });
        setImagePreview(base64);
        toast.success('Image uploaded!');
      } else if (type === 'audio') {
        setFormData({ ...formData, audioUrl: base64 });
        setAudioFileName(file.name);
        toast.success('Audio uploaded!');
      } else if (type === 'pdf') {
        setFormData({ ...formData, pdfUrl: base64 });
        setPdfFileName(file.name);
        toast.success('PDF uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(type, file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const triggerFileInput = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'audio' ? 'audio/*' : '.pdf';
    input.onchange = (e) => {
      if (e.target.files[0]) handleFileUpload(type, e.target.files[0]);
    };
    input.click();
  };

  const handleAddMantra = () => {
    if (!formData.name || !formData.deity) {
      toast.error('Please fill mantra name and deity');
      return;
    }
    const newMantra = {
      id: Date.now(),
      name: formData.name,
      name_en: formData.name_en,
      deity: formData.deity,
      language: formData.language,
      occasion: formData.occasion,
      purpose: formData.purpose,
      verses: formData.verses.filter(v => v.dev || v.roman || v.meaning),
      status: formData.status,
      color: deityColors[formData.deity] || '#c85a00',
      views: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      imageUrl: formData.imageUrl,
      audioUrl: formData.audioUrl,
      pdfUrl: formData.pdfUrl
    };
    saveMantras([newMantra, ...mantras]);
    setShowAddModal(false);
    resetForm();
    toast.success('Mantra added successfully!');
  };

  const openEditModal = (mantra) => {
    setSelectedMantra(mantra);
    setFormData({
      name: mantra.name,
      name_en: mantra.name_en || '',
      deity: mantra.deity,
      language: mantra.language,
      occasion: mantra.occasion || '',
      purpose: mantra.purpose || '',
      verses: mantra.verses || [{ dev: '', roman: '', meaning: '' }],
      status: mantra.status,
      imageUrl: mantra.imageUrl || '',
      audioUrl: mantra.audioUrl || '',
      pdfUrl: mantra.pdfUrl || ''
    });
    setImagePreview(mantra.imageUrl || '');
    setAudioFileName(mantra.audioUrl ? 'Audio file' : '');
    setPdfFileName(mantra.pdfUrl ? 'PDF file' : '');
    setShowEditModal(true);
  };

  const handleUpdateMantra = () => {
    if (!formData.name || !formData.deity) {
      toast.error('Please fill mantra name and deity');
      return;
    }
    const updatedMantras = mantras.map(mantra =>
      mantra.id === selectedMantra.id
        ? {
            ...selectedMantra,
            name: formData.name,
            name_en: formData.name_en,
            deity: formData.deity,
            language: formData.language,
            occasion: formData.occasion,
            purpose: formData.purpose,
            verses: formData.verses,
            status: formData.status,
            color: deityColors[formData.deity] || '#c85a00',
            imageUrl: formData.imageUrl,
            audioUrl: formData.audioUrl,
            pdfUrl: formData.pdfUrl
          }
        : mantra
    );
    saveMantras(updatedMantras);
    setShowEditModal(false);
    resetForm();
    toast.success('Mantra updated successfully!');
  };

  const openDeleteModal = (mantra) => {
    setSelectedMantra(mantra);
    setShowDeleteModal(true);
  };

  const handleDeleteMantra = () => {
    const updatedMantras = mantras.filter(mantra => mantra.id !== selectedMantra.id);
    saveMantras(updatedMantras);
    setShowDeleteModal(false);
    setSelectedMantra(null);
    toast.success('Mantra deleted successfully!');
  };

  const toggleStatus = (id) => {
    const updatedMantras = mantras.map(mantra =>
      mantra.id === id
        ? { ...mantra, status: mantra.status === 'published' ? 'draft' : 'published' }
        : mantra
    );
    saveMantras(updatedMantras);
    toast.success('Status updated successfully!');
  };

  // Build filter options from categories
  const filterOptions = ['all', ...categories.map(c => c.name)];

  const filteredMantras = mantras.filter(m => {
    const matchSearch = search === '' || 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      (m.name_en && m.name_en.toLowerCase().includes(search.toLowerCase())) ||
      m.deity.toLowerCase().includes(search.toLowerCase());
    const matchDeity = filterDeity === 'all' || m.deity === filterDeity;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchDeity && matchStatus;
  });

  // DropZone component (defined inside for access to refs)
  const DropZone = ({ type, label, preview, fileName, onDrop, onDragOver, onClick }) => (
    <div
      ref={type === 'image' ? imageDropRef : type === 'audio' ? audioDropRef : pdfDropRef}
      className={`drop-zone ${preview ? 'has-file' : ''}`}
      onDrop={(e) => onDrop(e, type)}
      onDragOver={onDragOver}
      onClick={onClick}
    >
      {type === 'image' && preview && <img src={preview} alt="Preview" className="image-preview" />}
      {type !== 'image' && preview && <div className="file-info">📄 {fileName}</div>}
      {!preview && (
        <>
          <div className="drop-icon">{type === 'image' ? '🖼️' : type === 'audio' ? '🎵' : '📄'}</div>
          <p>Drag & drop or click to upload {label}</p>
          <small>Max {type === 'image' ? '10MB' : '20MB'}</small>
        </>
      )}
    </div>
  );

  return (
    <div className="manage-mantras">
      <div className="manage-header">
        <div>
          <h2>📜 Manage Mantras</h2>
          <p>Total: {mantras.length} | Published: {mantras.filter(m => m.status === 'published').length} | Draft: {mantras.filter(m => m.status === 'draft').length}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Mantra</button>
      </div>

      <div className="filters-bar">
        <input type="text" placeholder="Search by name, deity..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterDeity} onChange={(e) => setFilterDeity(e.target.value)}>
          {filterOptions.map(opt => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Deities' : opt}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mantra</th>
              <th>Deity</th>
              <th>Language</th>
              <th>Occasion</th>
              <th>Status</th>
              <th>Views</th>
              <th>Media</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMantras.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No mantras found</td>
              </tr>
            ) : (
              filteredMantras.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className="mantra-title">{m.name}</div>
                    <div className="mantra-subtitle">{m.name_en}</div>
                  </td>
                  <td><span className="deity-badge" style={{ background: `${m.color}20`, color: m.color }}>{m.deity}</span></td>
                  <td>{m.language}</td>
                  <td>{m.occasion || '-'}</td>
                  <td>
                    <button className={`status-badge ${m.status}`} onClick={() => toggleStatus(m.id)}>
                      {m.status === 'published' ? '✓ Published' : '📝 Draft'}
                    </button>
                  </td>
                  <td>{m.views || 0}</td>
                  <td>
                    <div className="media-icons">
                      {m.imageUrl && <span title="Has Image">🖼️</span>}
                      {m.audioUrl && <span title="Has Audio">🎵</span>}
                      {m.pdfUrl && <span title="Has PDF">📄</span>}
                      {!m.imageUrl && !m.audioUrl && !m.pdfUrl && <span className="no-media">—</span>}
                    </div>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => openEditModal(m)}>✏️</button>
                    <button className="action-btn delete" onClick={() => openDeleteModal(m)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Mantra</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <input type="text" name="name" placeholder="Mantra Name (Devanagari)" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="name_en" placeholder="Mantra Name (English)" value={formData.name_en} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <select name="deity" value={formData.deity} onChange={handleInputChange}>
                  <option value="">Select Deity</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  <option>Sanskrit</option><option>Hindi</option><option>English</option>
                </select>
              </div>
              <input type="text" name="occasion" placeholder="Occasion (e.g., Daily, Monday)" value={formData.occasion} onChange={handleInputChange} />
              <textarea name="purpose" placeholder="Purpose / Benefits" rows="3" value={formData.purpose} onChange={handleInputChange}></textarea>
              
              <div className="file-uploads">
                <DropZone type="image" label="Image" preview={imagePreview} fileName={audioFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('image')} />
                <DropZone type="audio" label="Audio" preview={formData.audioUrl} fileName={audioFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('audio')} />
                <DropZone type="pdf" label="PDF" preview={formData.pdfUrl} fileName={pdfFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('pdf')} />
              </div>

              <label>Verses:</label>
              {formData.verses.map((verse, index) => (
                <div key={index} className="verse-group">
                  <div className="verse-header">
                    <span>Verse {index + 1}</span>
                    {index > 0 && <button type="button" className="remove-verse" onClick={() => removeVerse(index)}>✕</button>}
                  </div>
                  <textarea placeholder="Devanagari text" value={verse.dev} onChange={(e) => handleVerseChange(index, 'dev', e.target.value)} rows="2" />
                  <textarea placeholder="Transliteration" value={verse.roman} onChange={(e) => handleVerseChange(index, 'roman', e.target.value)} rows="2" />
                  <textarea placeholder="Meaning" value={verse.meaning} onChange={(e) => handleVerseChange(index, 'meaning', e.target.value)} rows="2" />
                </div>
              ))}
              <button type="button" className="add-verse-btn" onClick={addVerse}>+ Add Another Verse</button>
              
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddMantra}>Add Mantra</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Mantra</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <input type="text" name="name" placeholder="Mantra Name (Devanagari)" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="name_en" placeholder="Mantra Name (English)" value={formData.name_en} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <select name="deity" value={formData.deity} onChange={handleInputChange}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  <option>Sanskrit</option><option>Hindi</option><option>English</option>
                </select>
              </div>
              <input type="text" name="occasion" placeholder="Occasion" value={formData.occasion} onChange={handleInputChange} />
              <textarea name="purpose" placeholder="Purpose / Benefits" rows="3" value={formData.purpose} onChange={handleInputChange}></textarea>
              
              <div className="file-uploads">
                <DropZone type="image" label="Image" preview={imagePreview} fileName={audioFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('image')} />
                <DropZone type="audio" label="Audio" preview={formData.audioUrl} fileName={audioFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('audio')} />
                <DropZone type="pdf" label="PDF" preview={formData.pdfUrl} fileName={pdfFileName} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => triggerFileInput('pdf')} />
              </div>

              <label>Verses:</label>
              {formData.verses.map((verse, index) => (
                <div key={index} className="verse-group">
                  <div className="verse-header">
                    <span>Verse {index + 1}</span>
                    {index > 0 && <button type="button" className="remove-verse" onClick={() => removeVerse(index)}>✕</button>}
                  </div>
                  <textarea placeholder="Devanagari text" value={verse.dev} onChange={(e) => handleVerseChange(index, 'dev', e.target.value)} rows="2" />
                  <textarea placeholder="Transliteration" value={verse.roman} onChange={(e) => handleVerseChange(index, 'roman', e.target.value)} rows="2" />
                  <textarea placeholder="Meaning" value={verse.meaning} onChange={(e) => handleVerseChange(index, 'meaning', e.target.value)} rows="2" />
                </div>
              ))}
              <button type="button" className="add-verse-btn" onClick={addVerse}>+ Add Verse</button>

              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateMantra}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedMantra && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content confirm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗑️ Delete Mantra</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedMantra.name}</strong>?</p>
              <p className="warning">This action cannot be undone!</p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteMantra}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMantras;