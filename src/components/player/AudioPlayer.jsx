import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ 
  src, 
  title = 'Audio Recitation',
  artist = '',
  thumbnail = '',
  autoPlay = false,
  showVolume = true,
  showSpeed = true,
  showDownload = true,
  showPlaylist = false,
  playlist = [],
  onPlaylistChange,
  onEnded,
  onError,
  size = 'medium',
  theme = 'gold',
  mini = false,
  onClose,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const currentSrc = showPlaylist && playlist.length > 0 ? playlist[currentTrackIndex]?.src || src : src;
  const currentTitle = showPlaylist && playlist.length > 0 ? playlist[currentTrackIndex]?.title || title : title;
  const currentArtist = showPlaylist && playlist.length > 0 ? playlist[currentTrackIndex]?.artist || artist : artist;

  // Speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Load audio when src changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (autoPlay) {
        play();
      }
    }
  }, [currentSrc]);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Set playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Play/Pause
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch((err) => {
          console.error('Playback error:', err);
          setError('Unable to play audio');
          setIsPlaying(false);
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.error('Audio error:', e);
    setError('Failed to load audio');
    setIsLoading(false);
    setIsPlaying(false);
    if (onError) onError(e);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (showPlaylist && currentTrackIndex < playlist.length - 1) {
      nextTrack();
    }
    if (onEnded) onEnded();
  };

  // Seek
  const handleSeek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (x / width) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleProgressBarMouseMove = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = (x / width) * 100;
      const handle = progressBarRef.current.querySelector('.progress-handle');
      if (handle) {
        handle.style.left = `${percentage}%`;
      }
    }
  };

  const handleProgressBarMouseLeave = () => {
    if (progressBarRef.current) {
      const handle = progressBarRef.current.querySelector('.progress-handle');
      if (handle) {
        handle.style.opacity = '0';
        handle.style.transform = 'scale(0)';
      }
    }
  };

  const handleProgressBarMouseEnter = () => {
    if (progressBarRef.current) {
      const handle = progressBarRef.current.querySelector('.progress-handle');
      if (handle) {
        handle.style.opacity = '1';
        handle.style.transform = 'scale(1)';
      }
    }
  };

  // Volume
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7);
  };

  // Speed
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedDropdown(false);
  };

  // Download
  const handleDownload = () => {
    if (currentSrc) {
      const link = document.createElement('a');
      link.href = currentSrc;
      link.download = `${currentTitle}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Playlist navigation
  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) {
        setTimeout(() => play(), 100);
      }
      if (onPlaylistChange) onPlaylistChange(currentTrackIndex + 1);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) {
        setTimeout(() => play(), 100);
      }
      if (onPlaylistChange) onPlaylistChange(currentTrackIndex - 1);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get volume icon
  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-player ${size} ${theme} ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''} ${error ? 'error' : ''} ${mini ? 'mini' : ''} ${className}`}>
      {/* Mini Player Close Button */}
      {mini && onClose && (
        <button className="mini-close" onClick={onClose} aria-label="Close">✕</button>
      )}
      
      {/* Play Button */}
      <button 
        className={`play-btn ${isPlaying ? 'playing' : ''}`} 
        onClick={togglePlay}
        disabled={isLoading || error}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        data-tooltip={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? '◉' : isPlaying ? '⏸' : '▶'}
      </button>

      {/* Playlist Previous/Next */}
      {showPlaylist && (
        <div className="playlist-controls">
          <button 
            className="prev-btn" 
            onClick={prevTrack}
            disabled={currentTrackIndex === 0}
            aria-label="Previous"
            data-tooltip="Previous"
          >
            ⏮
          </button>
          <button 
            className="next-btn" 
            onClick={nextTrack}
            disabled={currentTrackIndex === playlist.length - 1}
            aria-label="Next"
            data-tooltip="Next"
          >
            ⏭
          </button>
        </div>
      )}

      {/* Player Info */}
      <div className="player-info">
        <div className={`player-title ${isPlaying ? 'playing' : ''}`}>
          {currentTitle}
          {currentArtist && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}> - {currentArtist}</span>}
        </div>
        
        {/* Progress Bar */}
        <div 
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={handleProgressBarMouseLeave}
          onMouseEnter={handleProgressBarMouseEnter}
        >
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          <div className="progress-handle" style={{ left: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="time-display">
        <span className="current-time">{formatTime(currentTime)}</span>
        <span className="time-separator">/</span>
        <span className="duration-time">{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      {showVolume && (
        <div className="volume-control">
          <button className="volume-btn" onClick={toggleMute} aria-label="Volume" data-tooltip={volume > 0 ? 'Mute' : 'Unmute'}>
            {getVolumeIcon()}
          </button>
          <div className="volume-slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />
          </div>
        </div>
      )}

      {/* Speed Control */}
      {showSpeed && (
        <div className="speed-control">
          <button 
            className="speed-btn" 
            onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
            aria-label="Playback Speed"
            data-tooltip={`${playbackSpeed}x`}
          >
            {playbackSpeed}x
          </button>
          {showSpeedDropdown && (
            <div className="speed-dropdown">
              {speedOptions.map(speed => (
                <button
                  key={speed}
                  className={`speed-option ${playbackSpeed === speed ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Download Button */}
      {showDownload && currentSrc && (
        <button 
          className="download-btn" 
          onClick={handleDownload}
          aria-label="Download"
          data-tooltip="Download Audio"
        >
          ⬇️
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
};

// Playlist Component
export const AudioPlaylist = ({ 
  tracks, 
  onTrackSelect, 
  currentTrackId,
  className = '' 
}) => {
  return (
    <div className={`audio-playlist ${className}`}>
      <h3 className="playlist-title">Playlist</h3>
      <div className="playlist-tracks">
        {tracks.map((track, index) => (
          <div
            key={track.id || index}
            className={`playlist-track ${currentTrackId === track.id ? 'active' : ''}`}
            onClick={() => onTrackSelect(track.id)}
          >
            <div className="track-number">{index + 1}</div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
            <div className="track-duration">{track.duration || '--:--'}</div>
            {currentTrackId === track.id && (
              <div className="track-playing">
                <span className="playing-wave">🎵</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Wave Animation Component
export const AudioWaveform = ({ isPlaying, color = '#ffd700' }) => {
  return (
    <div className={`audio-waveform ${isPlaying ? 'playing' : ''}`}>
      {[...Array(10)].map((_, i) => (
        <div 
          key={i} 
          className="wave-bar" 
          style={{ 
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? `${20 + Math.random() * 30}px` : '20px'
          }}
        ></div>
      ))}
    </div>
  );
};

export default AudioPlayer;