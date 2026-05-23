import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    showAudio: true,
    showPDF: true,
    showImage: true,
    enablePdfDownload: true,  // ✅ NEW: PDF download toggle
    autoPlayAudio: false,
    defaultLanguage: 'sanskrit'
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('settingsUpdated'));
    toast.success(`${key} updated`);
  };

  return (
    <div className="settings">
      <h2>⚙️ Global Settings</h2>
      <div className="settings-group">
        <label>Show Audio Player</label>
        <button className={`toggle-btn ${settings.showAudio ? 'active' : ''}`} onClick={() => updateSetting('showAudio', !settings.showAudio)}>
          {settings.showAudio ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="settings-group">
        <label>Show PDF Viewer</label>
        <button className={`toggle-btn ${settings.showPDF ? 'active' : ''}`} onClick={() => updateSetting('showPDF', !settings.showPDF)}>
          {settings.showPDF ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="settings-group">
        <label>Show Deity Images</label>
        <button className={`toggle-btn ${settings.showImage ? 'active' : ''}`} onClick={() => updateSetting('showImage', !settings.showImage)}>
          {settings.showImage ? 'ON' : 'OFF'}
        </button>
      </div>
      {/* ✅ NEW: PDF Download toggle */}
      <div className="settings-group">
        <label>Enable PDF Download Button</label>
        <button className={`toggle-btn ${settings.enablePdfDownload ? 'active' : ''}`} onClick={() => updateSetting('enablePdfDownload', !settings.enablePdfDownload)}>
          {settings.enablePdfDownload ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="settings-group">
        <label>Auto-play Audio</label>
        <button className={`toggle-btn ${settings.autoPlayAudio ? 'active' : ''}`} onClick={() => updateSetting('autoPlayAudio', !settings.autoPlayAudio)}>
          {settings.autoPlayAudio ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="settings-group">
        <label>Default Language</label>
        <select value={settings.defaultLanguage} onChange={(e) => updateSetting('defaultLanguage', e.target.value)}>
          <option value="sanskrit">Sanskrit</option>
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
        </select>
      </div>
      <div className="settings-note">Changes apply immediately across the site.</div>
    </div>
  );
};

export default Settings;