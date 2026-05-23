import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    color: '#c85a00'
  });
  const [imagePreview, setImagePreview] = useState('');

  // Predefined color options for categories
  const colorOptions = [
    '#c85a00', '#0a5a50', '#4a2878', '#e06b10', 
    '#7a1818', '#f59040', '#d4aa30', '#1a8070', '#b08820'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaultCategories = [
        { id: 1, name: 'Ganesha', description: 'Remover of Obstacles', imageUrl: '🐘', color: '#c85a00', mantraCount: 0 },
        { id: 2, name: 'Lakshmi', description: 'Goddess of Wealth', imageUrl: '🪷', color: '#e06b10', mantraCount: 0 },
        { id: 3, name: 'Shiva', description: 'The Destroyer of Evil', imageUrl: '🕉️', color: '#0a5a50', mantraCount: 0 },
        { id: 4, name: 'Hanuman', description: 'God of Strength', imageUrl: '🙏', color: '#f59040', mantraCount: 0 }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  };

  const saveCategories = (updated) => {
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    window.dispatchEvent(new Event('categoriesUpdated'));
    toast.success('Categories saved!');
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large! Max 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result });
      setImagePreview(reader.result);
      toast.success('Image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileUpload(file);
    else toast.error('Please drop an image file');
  };

  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files[0]) handleFileUpload(e.target.files[0]);
    };
    input.click();
  };

  const handleAddCategory = () => {
    if (!formData.name) {
      toast.error('Category name required');
      return;
    }
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl || '📁',
      color: formData.color,
      mantraCount: 0
    };
    saveCategories([...categories, newCategory]);
    setShowAddModal(false);
    resetForm();
    toast.success('Category added!');
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
      color: cat.color
    });
    setImagePreview(cat.imageUrl && !cat.imageUrl.startsWith('data:') ? null : cat.imageUrl);
    setShowEditModal(true);
  };

  const handleUpdateCategory = () => {
    if (!formData.name) {
      toast.error('Category name required');
      return;
    }
    const updated = categories.map(cat =>
      cat.id === selectedCategory.id
        ? {
            ...cat,
            name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl,
            color: formData.color
          }
        : cat
    );
    saveCategories(updated);
    setShowEditModal(false);
    resetForm();
    toast.success('Category updated!');
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    const updated = categories.filter(cat => cat.id !== selectedCategory.id);
    saveCategories(updated);
    setShowDeleteModal(false);
    toast.success('Category deleted!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      color: '#c85a00'
    });
    setImagePreview('');
  };

  return (
    <div className="categories-management">
      <div className="categories-header">
        <h2>📂 Categories & Tags</h2>
        <p>Manage deities, types and occasions</p>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Category</button>
      </div>

      <div className="categories-list">
        {categories.map(cat => (
          <div key={cat.id} className="category-item" style={{ borderLeftColor: cat.color }}>
            <div className="category-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
              {cat.imageUrl?.startsWith('data:') ? (
                <img src={cat.imageUrl} alt={cat.name} className="category-img" />
              ) : (
                <span className="category-emoji">{cat.imageUrl || '📁'}</span>
              )}
            </div>
            <div className="category-info">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <span className="category-count">{cat.mantraCount} stotra{cat.mantraCount !== 1 && 's'}</span>
            </div>
            <div className="category-actions">
              <button className="btn-edit" onClick={() => openEditModal(cat)}>EDIT</button>
              <button className="btn-view" onClick={() => window.location.href = `/mantras/deity/${cat.name.toLowerCase()}`}>VIEW ALL</button>
              <button className="btn-delete" onClick={() => openDeleteModal(cat)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add Category</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input type="text" placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Description" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              
              <div className="drop-zone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={triggerFileInput}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <>
                    <div className="drop-icon">🖼️</div>
                    <p>Drag & drop or click to upload icon/image</p>
                    <small>Max 2MB</small>
                  </>
                )}
              </div>

              <label>Color:</label>
              <div className="color-picker">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    className={`color-option ${formData.color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setFormData({...formData, color: c})}
                  />
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddCategory}>Add Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - same fields */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Category</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input type="text" placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Description" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              
              <div className="drop-zone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={triggerFileInput}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : formData.imageUrl && !formData.imageUrl.startsWith('data:') ? (
                  <div className="emoji-preview">{formData.imageUrl}</div>
                ) : (
                  <>
                    <div className="drop-icon">🖼️</div>
                    <p>Drag & drop or click to upload icon/image</p>
                    <small>Max 2MB</small>
                  </>
                )}
              </div>

              <label>Color:</label>
              <div className="color-picker">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    className={`color-option ${formData.color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setFormData({...formData, color: c})}
                  />
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateCategory}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content confirm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗑️ Delete Category</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Delete <strong>{selectedCategory.name}</strong>?</p>
              <p className="warning">This will not delete mantras, but they will lose category association.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteCategory}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;