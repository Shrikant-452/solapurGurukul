// components/Public/MantraDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './MantraDetail.css';   // ✅ Fixed import – no ManageMantras.css

const MantraDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mantra, setMantra] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dev');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const pdfjsLibRef = useRef(null);
  const [pdfDownloadEnabled, setPdfDownloadEnabled] = useState(true);

  // Fallback mantras (keep your own array)
  const allMantras = [
    { id: 1, name: "श्री गणेश स्तोत्रम्", deity: "Ganesha", language: "Sanskrit", occasion: "Daily", purpose: "Removal of obstacles", verse: "वक्रतुण्ड...", roman: "Vakratunda...", meaning: "Meaning...", color: "#c85a00", views: 1247, hasImage: true, imageUrl: "https://i.pinimg.com/564x/3b/7d/1b/3b7d1be222e6c70d205a092ef6a22b1f.jpg" },
    // ... add your other default mantras here
  ];

  // Load settings for PDF download toggle
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPdfDownloadEnabled(settings.enablePdfDownload !== false);
    }
  }, []);

  useEffect(() => {
    let mantraData = null;
    if (location.state?.mantra) {
      mantraData = location.state.mantra;
    } else if (id) {
      mantraData = allMantras.find(m => m.id === parseInt(id));
    }
    if (mantraData) {
      const normalized = {
        ...mantraData,
        verse: mantraData.verse || (mantraData.verses?.[0]?.dev) || "ॐ नमः शिवाय",
        roman: mantraData.roman || (mantraData.verses?.[0]?.roman) || "",
        meaning: mantraData.meaning || (mantraData.verses?.[0]?.meaning) || "",
        language: mantraData.language || "Sanskrit",
        occasion: mantraData.occasion || "Daily",
        purpose: mantraData.purpose || "Chanting this mantra brings spiritual growth.",
        hasImage: mantraData.hasImage ?? true,
        imageUrl: mantraData.imageUrl || `https://via.placeholder.com/400?text=${encodeURIComponent(mantraData.deity || "Deity")}`,
        color: mantraData.color || "#c85a00",
        pdfUrl: mantraData.pdfUrl || null
      };
      setMantra(normalized);
    }
  }, [id, location.state]);

  // Load PDF.js library from CDN
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        pdfjsLibRef.current = window.pdfjsLib;
      };
      document.head.appendChild(script);
    } else {
      pdfjsLibRef.current = window.pdfjsLib;
    }
  }, []);

  // Render PDF pages as images (no toolbar, no download)
  useEffect(() => {
    if (!showPdf || !mantra?.pdfUrl || !pdfjsLibRef.current) return;
    const renderPdf = async () => {
      setPdfLoading(true);
      setPdfPages([]);
      try {
        let pdfData = null;
        const pdfUrl = mantra.pdfUrl;
        if (pdfUrl.startsWith('data:application/pdf')) {
          const base64 = pdfUrl.split(',')[1];
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          pdfData = byteArray;
        } else if (pdfUrl.startsWith('http')) {
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          pdfData = await blob.arrayBuffer();
        } else {
          throw new Error('Invalid PDF URL');
        }
        const loadingTask = pdfjsLibRef.current.getDocument({ data: pdfData });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;
          pages.push(canvas.toDataURL());
        }
        setPdfPages(pages);
      } catch (err) {
        console.error('PDF render error:', err);
      } finally {
        setPdfLoading(false);
      }
    };
    renderPdf();
  }, [showPdf, mantra, pdfjsLibRef.current]);

  // Block shortcuts & right-click when PDF modal open
  useEffect(() => {
    if (showPdf) document.body.classList.add('pdf-modal-open');
    else document.body.classList.remove('pdf-modal-open');
    return () => document.body.classList.remove('pdf-modal-open');
  }, [showPdf]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showPdf) return;
      if ((e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12' || e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const handleContextMenu = (e) => { if (showPdf) e.preventDefault(); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [showPdf]);

  // Audio handlers
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(err => console.log("Audio error:", err));
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (progressBarRef.current && audioRef.current && duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const seekTime = (x / rect.width) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const copyVerses = () => {
    const text = `${mantra.name}\n\n${selectedTab === 'dev' ? mantra.verse : selectedTab === 'roman' ? mantra.roman : mantra.meaning}`;
    navigator.clipboard.writeText(text);
    alert('Verses copied to clipboard!');
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(mantra.name + ' mantra chant')}`, '_blank');
  };

  const getDeityIcon = () => {
    const icons = { Ganesha: "🐘", Shiva: "🕉️", Vishnu: "🌊", Lakshmi: "🪷", Saraswati: "📖", Durga: "⚔️", Hanuman: "🙏" };
    return icons[mantra?.deity] || "🕉️";
  };

  const handleViewAllByDeity = () => navigate(`/mantras/deity/${mantra.deity.toLowerCase()}`);
  const handleBack = () => (window.history.length > 2 ? navigate(-1) : navigate('/mantras'));

  if (!mantra) return <div className="mantra-detail-page">Loading...</div>;

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="mantra-detail-page">
      <div className="container">
        <button className="back-button" onClick={handleBack}>← Back</button>
        <div className="detail-card">
          {/* Header */}
          <div className="detail-header" style={{ borderLeftColor: mantra.color }}>
            <div className="detail-header-content">
              <div className="detail-icon" style={{ background: `${mantra.color}20`, color: mantra.color }}>
                {mantra.imageUrl && (mantra.imageUrl.startsWith('data:') || mantra.imageUrl.startsWith('http')) ? (
                  <img src={mantra.imageUrl} alt={mantra.deity} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : getDeityIcon()}
              </div>
              <div>
                <h1 className="detail-title">{mantra.name}</h1>
                <div className="detail-meta">
                  <span className="meta-badge" style={{ background: `${mantra.color}15`, color: mantra.color }}>🙏 {mantra.deity}</span>
                  <span className="meta-badge">📅 {mantra.occasion}</span>
                  <span className="meta-badge">🔊 {mantra.language}</span>
                  <span className="meta-badge">👁️ {mantra.views?.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            <button className={`tab-btn ${selectedTab === 'dev' ? 'active' : ''}`} onClick={() => setSelectedTab('dev')}><span className="tab-icon">📜</span> Devanagari</button>
            <button className={`tab-btn ${selectedTab === 'roman' ? 'active' : ''}`} onClick={() => setSelectedTab('roman')}><span className="tab-icon">🔤</span> Transliteration</button>
            <button className={`tab-btn ${selectedTab === 'meaning' ? 'active' : ''}`} onClick={() => setSelectedTab('meaning')}><span className="tab-icon">📖</span> Meaning</button>
          </div>

          {/* Verses */}
          <div className="detail-verses">
            <div className="verse-block">
              <div className="verse-number">1</div>
              <div className="verse-content">
                {selectedTab === 'dev' && <p className="verse-dev">{mantra.verse}</p>}
                {selectedTab === 'roman' && <p className="verse-roman">{mantra.roman || "Not available"}</p>}
                {selectedTab === 'meaning' && <p className="verse-meaning">{mantra.meaning || "Not available"}</p>}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="detail-purpose"><h3>✨ Purpose & Benefits</h3><p>{mantra.purpose}</p></div>

          {/* Audio Player */}
          <div className="audio-player-section">
            <div className="audio-player-header"><span className="audio-title">🎵 Audio Recitation</span><span className="audio-status">{isPlaying ? 'Playing...' : 'Ready to play'}</span></div>
            <div className="audio-player-controls">
              <button className="play-pause-btn" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
              <div className="progress-container">
                <div className="time-current">{formatTime(currentTime)}</div>
                <div className="progress-bar" ref={progressBarRef} onClick={handleSeek}><div className="progress-fill" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div></div>
                <div className="time-duration">{formatTime(duration)}</div>
              </div>
              <div className="volume-control">
                <button className="volume-btn" onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}</button>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="volume-slider" />
              </div>
              <div className="speed-control">
                <button className="speed-btn">{playbackSpeed}x</button>
                <div className="speed-dropdown">{speedOptions.map(speed => (<button key={speed} className={`speed-option ${playbackSpeed === speed ? 'active' : ''}`} onClick={() => changeSpeed(speed)}>{speed}x</button>))}</div>
              </div>
            </div>
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} src={mantra.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} />
          </div>

          {/* Action Buttons */}
          <div className="detail-actions">
            <button className="action-btn youtube" onClick={openYouTube}><span>▶️</span> Listen on YouTube</button>
            <button className="action-btn pdf" onClick={() => setShowPdf(true)}><span>📖</span> Read PDF</button>
            <button className="action-btn copy" onClick={copyVerses}><span>📋</span> Copy Verses</button>
            {mantra.hasImage && <button className="action-btn image" onClick={() => setShowImage(true)}><span>🖼️</span> View Image</button>}
            <button className="action-btn deity" onClick={handleViewAllByDeity}><span>🔱</span> All {mantra.deity} Mantras</button>
          </div>
        </div>
      </div>

      {/* PDF Modal – scrollable pages, no download toolbar */}
      {showPdf && (
        <div className="modal-overlay" onClick={() => setShowPdf(false)} onContextMenu={(e) => e.preventDefault()}>
          <div className="modal-content pdf-modal" onClick={e => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
            <div className="modal-header">
              <h3>📖 {mantra.name}</h3>
              <div className="modal-header-actions">
                <button className="fullscreen-btn" onClick={() => {
                  const container = document.querySelector('.pdf-pages-container');
                  if (container && !document.fullscreenElement) container.requestFullscreen();
                  else document.exitFullscreen();
                }} title="Full Screen">⛶</button>
                <button className="modal-close" onClick={() => setShowPdf(false)}>✕</button>
              </div>
            </div>
            <div className="modal-body pdf-viewer">
              {pdfLoading ? <p style={{ textAlign: 'center', padding: '40px' }}>Loading PDF...</p> : pdfPages.length > 0 ? (
                <div className="pdf-pages-container" onContextMenu={(e) => e.preventDefault()}>
                  {pdfPages.map((src, idx) => <img key={idx} src={src} alt={`Page ${idx+1}`} className="pdf-page" />)}
                </div>
              ) : <p style={{ textAlign: 'center', padding: '40px', color: '#6b4820' }}>No PDF available.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImage && (
        <div className="modal-overlay" onClick={() => setShowImage(false)}>
          <div className="modal-content image-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>🖼️ {mantra.deity} - {mantra.name}</h3><button className="modal-close" onClick={() => setShowImage(false)}>✕</button></div>
            <div className="modal-body image-viewer">
              <img src={mantra.imageUrl} alt={mantra.deity} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '12px' }} onError={(e) => { if (!imageError) { e.target.src = "https://via.placeholder.com/400?text=Image+Not+Available"; setImageError(true); } }} />
              <p style={{ textAlign: 'center', marginTop: '16px', color: '#6b4820' }}>{mantra.deity} - {mantra.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MantraDetail;