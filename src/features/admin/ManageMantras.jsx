import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import './ManageMantras.css';

const ManageMantras = () => {
  const [mantras, setMantras] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDeity, setFilterDeity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageDropRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    title: '',
    subtitle: '',
    largeText: '',
    deity: '',
    language: 'Sanskrit',
    occasion: '',
    verses: [{ dev: '', roman: '', meaning: '' }],
    status: 'published',
    imageUrl: ''
  });

  const deityColors = {
    Ganesha: '#c85a00', Shiva: '#0a5a50', Vishnu: '#4a2878',
    Rama: '#b08820', Krishna: '#1a8070', Durga: '#7a1818',
    Lakshmi: '#e06b10', Saraswati: '#d4aa30', Hanuman: '#f59040'
  };

  // Load categories function
  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    console.log('Loading categories from localStorage:', saved);
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaultCategories = [
        { id: 1, name: "Ganesha", icon: "🐘", color: "#c85a00", description: "Remover of Obstacles" },
        { id: 2, name: "Shiva", icon: "🕉️", color: "#0a5a50", description: "The Destroyer of Evil" },
        { id: 3, name: "Lakshmi", icon: "🪷", color: "#e06b10", description: "Goddess of Wealth" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      window.dispatchEvent(new Event('categoriesUpdated')); // ✅ Added
    }
  };

  // Load mantras function
  const loadMantras = () => {
    const saved = localStorage.getItem('admin_mantras');
    if (saved) {
      setMantras(JSON.parse(saved));
    } else {
      const defaultMantras = [
        { id: 1, name: "श्री गणेश स्तोत्रम्", name_en: "Shri Ganesh Stotram", title: "", subtitle: "", largeText: "", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", verses: [{ dev: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", roman: "Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada.", meaning: "O Lord with curved trunk, massive body, radiant as ten million suns — make all my works obstacle-free, always." }], status: "published", color: "#c85a00", views: 1247, imageUrl: "" },
        { id: 2, name: "ॐ नमः शिवाय", name_en: "Om Namah Shivaya", title: "", subtitle: "", largeText: "", deity: "Shiva", language: "Sanskrit", occasion: "Daily, Monday", verses: [{ dev: "ॐ नमः शिवाय", roman: "Om Namah Shivaya", meaning: "Salutations to Lord Shiva" }], status: "published", color: "#0a5a50", views: 2341, imageUrl: "" },
        { id: 3, name: "महालक्ष्मी अष्टकम्", name_en: "Mahalakshmi Ashtakam", title: "", subtitle: "", largeText: "", deity: "Lakshmi", language: "Sanskrit", occasion: "Friday Puja", verses: [{ dev: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥", roman: "Namaste'stu Mahamaye Shripithe Surapujite, Shankhachakragadahaste Mahalakshmi Namo'stu Te.", meaning: "Salutations to you, O Great Illusion — O Mahalakshmi, salutations to you." }], status: "published", color: "#e06b10", views: 987, imageUrl: "" }
      ];
      setMantras(defaultMantras);
      localStorage.setItem('admin_mantras', JSON.stringify(defaultMantras));
      window.dispatchEvent(new Event('mantrasUpdated')); // ✅ Added
    }
  };

  // Initial load
  useEffect(() => {
    loadMantras();
    loadCategories();
    
    // Listen for updates
    const handleMantrasUpdated = () => {
      console.log('mantrasUpdated event received');
      loadMantras();
    };
    
    const handleCategoriesUpdated = () => {
      console.log('categoriesUpdated event received');
      loadCategories();
    };
    
    window.addEventListener('mantrasUpdated', handleMantrasUpdated);
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    
    return () => {
      window.removeEventListener('mantrasUpdated', handleMantrasUpdated);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
    };
  }, []);

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
      title: '',
      subtitle: '',
      largeText: '',
      deity: '',
      language: 'Sanskrit',
      occasion: '',
      verses: [{ dev: '', roman: '', meaning: '' }],
      status: 'published',
      imageUrl: ''
    });
    setImagePreview('');
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

  const handleImageUpload = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large! Max 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setFormData({ ...formData, imageUrl: base64 });
      setImagePreview(base64);
      toast.success('Image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageUpload(file);
    else toast.error('Please drop an image file');
  };

  const handleDragOver = (e) => e.preventDefault();

  const triggerImageInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
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
      title: formData.title,
      subtitle: formData.subtitle,
      largeText: formData.largeText,
      deity: formData.deity,
      language: formData.language,
      occasion: formData.occasion,
      verses: formData.verses.filter(v => v.dev || v.roman || v.meaning),
      status: formData.status,
      color: deityColors[formData.deity] || '#c85a00',
      views: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      imageUrl: formData.imageUrl
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
      title: mantra.title || '',
      subtitle: mantra.subtitle || '',
      largeText: mantra.largeText || '',
      deity: mantra.deity,
      language: mantra.language,
      occasion: mantra.occasion || '',
      verses: mantra.verses || [{ dev: '', roman: '', meaning: '' }],
      status: mantra.status,
      imageUrl: mantra.imageUrl || ''
    });
    setImagePreview(mantra.imageUrl || '');
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
            title: formData.title,
            subtitle: formData.subtitle,
            largeText: formData.largeText,
            deity: formData.deity,
            language: formData.language,
            occasion: formData.occasion,
            verses: formData.verses,
            status: formData.status,
            color: deityColors[formData.deity] || '#c85a00',
            imageUrl: formData.imageUrl
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

  const filteredMantras = mantras.filter(m => {
    const matchSearch = search === '' || 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      (m.name_en && m.name_en.toLowerCase().includes(search.toLowerCase())) ||
      m.deity.toLowerCase().includes(search.toLowerCase());
    const matchDeity = filterDeity === 'all' || m.deity === filterDeity;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchDeity && matchStatus;
  });

  const filterOptions = ['all', ...categories.map(c => c.name)];

  const ImageDropZone = () => (
    <div
      ref={imageDropRef}
      className={`drop-zone ${imagePreview ? 'has-file' : ''}`}
      onDrop={handleImageDrop}
      onDragOver={handleDragOver}
      onClick={triggerImageInput}
    >
      {imagePreview ? (
        <img src={imagePreview} alt="Preview" className="image-preview" />
      ) : (
        <>
          <div className="drop-icon">🖼️</div>
          <p>Drag & drop or click to upload image</p>
          <small>Max 10MB (optional)</small>
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
          {filterOptions.map(opt => <option key={opt} value={opt}>{opt === 'all' ? 'All Deities' : opt}</option>)}
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
              <th>Image</th>
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
                  <td>
                    <span className="deity-badge" style={{ background: `${m.color}20`, color: m.color }}>{m.deity}</span>
                  </td>
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
                      {m.imageUrl ? <span title="Has Image">🖼️</span> : <span className="no-media">—</span>}
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
                <input type="text" name="name" placeholder="Mantra Name (Devanagari) *" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="name_en" placeholder="Mantra Name (English)" value={formData.name_en} onChange={handleInputChange} />
              </div>
              
              <input type="text" name="title" placeholder="Title (Optional)" value={formData.title} onChange={handleInputChange} />
              <input type="text" name="subtitle" placeholder="Subtitle (Optional)" value={formData.subtitle} onChange={handleInputChange} />
              <textarea name="largeText" placeholder="Mantra Text (Large content)" rows="4" value={formData.largeText} onChange={handleInputChange}></textarea>
              
              <div className="form-row">
                <select name="deity" value={formData.deity} onChange={handleInputChange}>
                  <option value="">Select Deity *</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  <option>Sanskrit</option><option>Hindi</option><option>English</option>
                </select>
              </div>
              <input type="text" name="occasion" placeholder="Occasion (e.g., Daily, Monday)" value={formData.occasion} onChange={handleInputChange} />
              
              <label>Image (Optional):</label>
              <ImageDropZone />

              <label>Verses:</label>
              {formData.verses.map((verse, idx) => (
                <div key={idx} className="verse-group">
                  <div className="verse-header">
                    <span>Verse {idx + 1}</span>
                    {idx > 0 && <button type="button" className="remove-verse" onClick={() => removeVerse(idx)}>✕</button>}
                  </div>
                  <textarea placeholder="Devanagari text" value={verse.dev} onChange={(e) => handleVerseChange(idx, 'dev', e.target.value)} rows="2" />
                  <textarea placeholder="Transliteration" value={verse.roman} onChange={(e) => handleVerseChange(idx, 'roman', e.target.value)} rows="2" />
                  <textarea placeholder="Meaning" value={verse.meaning} onChange={(e) => handleVerseChange(idx, 'meaning', e.target.value)} rows="2" />
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
                <input type="text" name="name" placeholder="Mantra Name (Devanagari) *" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="name_en" placeholder="Mantra Name (English)" value={formData.name_en} onChange={handleInputChange} />
              </div>
              
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
              <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleInputChange} />
              <textarea name="largeText" placeholder="Mantra Text" rows="4" value={formData.largeText} onChange={handleInputChange}></textarea>
              
              <div className="form-row">
                <select name="deity" value={formData.deity} onChange={handleInputChange}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  <option>Sanskrit</option><option>Hindi</option><option>English</option>
                </select>
              </div>
              <input type="text" name="occasion" placeholder="Occasion" value={formData.occasion} onChange={handleInputChange} />
              
              <label>Image (Optional):</label>
              <ImageDropZone />

              <label>Verses:</label>
              {formData.verses.map((verse, idx) => (
                <div key={idx} className="verse-group">
                  <div className="verse-header">
                    <span>Verse {idx + 1}</span>
                    {idx > 0 && <button type="button" className="remove-verse" onClick={() => removeVerse(idx)}>✕</button>}
                  </div>
                  <textarea placeholder="Devanagari text" value={verse.dev} onChange={(e) => handleVerseChange(idx, 'dev', e.target.value)} rows="2" />
                  <textarea placeholder="Transliteration" value={verse.roman} onChange={(e) => handleVerseChange(idx, 'roman', e.target.value)} rows="2" />
                  <textarea placeholder="Meaning" value={verse.meaning} onChange={(e) => handleVerseChange(idx, 'meaning', e.target.value)} rows="2" />
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
              <p>Delete <strong>{selectedMantra.name}</strong>?</p>
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