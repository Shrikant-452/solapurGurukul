import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './HeroManagement.css';

const HeroManagement = () => {
  const [heroBg, setHeroBg] = useState('');
  const [sliderImages, setSliderImages] = useState([]);
  const [bgPreview, setBgPreview] = useState('');

  useEffect(() => {
    loadHeroData();
    window.addEventListener('heroImagesUpdated', loadHeroData);
    window.addEventListener('heroBgUpdated', loadHeroData);
    return () => {
      window.removeEventListener('heroImagesUpdated', loadHeroData);
      window.removeEventListener('heroBgUpdated', loadHeroData);
    };
  }, []);

  const loadHeroData = () => {
    const savedBg = localStorage.getItem('hero_bg_image');
    setHeroBg(savedBg || '');
    setBgPreview(savedBg || '');
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

  const handleBgFileUpload = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large! Max 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setHeroBg(base64);
      setBgPreview(base64);
      localStorage.setItem('hero_bg_image', base64);
      window.dispatchEvent(new Event('heroBgUpdated'));
      toast.success('Background updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleBgDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleBgFileUpload(file);
    else toast.error('Please drop an image file');
  };

  const triggerBgInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files[0]) handleBgFileUpload(e.target.files[0]);
    };
    input.click();
  };

  const removeHeroBg = () => {
    setHeroBg('');
    setBgPreview('');
    localStorage.removeItem('hero_bg_image');
    window.dispatchEvent(new Event('heroBgUpdated'));
    toast.success('Background removed');
  };

  const handleSliderFileUpload = (index, file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large! Max 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...sliderImages];
      updated[index].url = reader.result;
      setSliderImages(updated);
      localStorage.setItem('hero_slider_images', JSON.stringify(updated));
      window.dispatchEvent(new Event('heroImagesUpdated'));
      toast.success('Slider image updated');
    };
    reader.readAsDataURL(file);
  };

  const handleSliderDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleSliderFileUpload(index, file);
    else toast.error('Please drop an image file');
  };

  const updateSliderField = (index, field, value) => {
    const updated = [...sliderImages];
    updated[index][field] = value;
    setSliderImages(updated);
    localStorage.setItem('hero_slider_images', JSON.stringify(updated));
    window.dispatchEvent(new Event('heroImagesUpdated'));
    toast.success('Slider updated');
  };

  const addSliderImage = () => {
    if (sliderImages.length >= 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }
    const updated = [...sliderImages, { url: "", name: "New Image", description: "Description" }];
    setSliderImages(updated);
    localStorage.setItem('hero_slider_images', JSON.stringify(updated));
    window.dispatchEvent(new Event('heroImagesUpdated'));
    toast.success('New image added');
  };

  const removeSliderImage = (index) => {
    const updated = sliderImages.filter((_, i) => i !== index);
    setSliderImages(updated);
    localStorage.setItem('hero_slider_images', JSON.stringify(updated));
    window.dispatchEvent(new Event('heroImagesUpdated'));
    toast.success('Image removed');
  };

  return (
    <div className="hero-management">
      <h2>Hero Background</h2>
      <div className="hero-bg-control">
        <div className="drop-zone" onDrop={handleBgDrop} onDragOver={(e) => e.preventDefault()} onClick={triggerBgInput}>
          {bgPreview ? (
            <img src={bgPreview} alt="Background preview" className="bg-preview" />
          ) : (
            <>
              <div className="drop-icon">🖼️</div>
              <p>Drag & drop or click to upload background image</p>
              <small>Max 5MB</small>
            </>
          )}
        </div>
        <button onClick={removeHeroBg} className="btn-outline">Remove BG</button>
      </div>

      <h2>Slider Images (max 6)</h2>
      <div className="slider-images-list">
        {sliderImages.map((img, idx) => (
          <div key={idx} className="slider-image-item">
            <div className="image-preview">
              {img.url ? <img src={img.url} alt="preview" /> : <div className="no-image">No image</div>}
            </div>
            <div className="image-fields">
              <input type="text" placeholder="Name" value={img.name} onChange={(e) => updateSliderField(idx, 'name', e.target.value)} />
              <input type="text" placeholder="Description" value={img.description} onChange={(e) => updateSliderField(idx, 'description', e.target.value)} />
            </div>
            <div className="image-actions">
              <div className="drop-zone-small" onDrop={(e) => handleSliderDrop(e, idx)} onDragOver={(e) => e.preventDefault()} onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  if (e.target.files[0]) handleSliderFileUpload(idx, e.target.files[0]);
                };
                input.click();
              }}>
                <span>📷</span> Upload/Replace
              </div>
              <button onClick={() => removeSliderImage(idx)} className="btn-danger-small">🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {sliderImages.length < 6 && (
        <button onClick={addSliderImage} className="btn-primary">+ Add Image</button>
      )}
    </div>
  );
};

export default HeroManagement;