import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  // Hide navbar on admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English', short: 'EN' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', nativeName: 'Hindi', short: 'HI' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', nativeName: 'Marathi', short: 'MR' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', nativeName: 'Telugu', short: 'TE' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', nativeName: 'Kannada', short: 'KN' }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('language', langCode);
    setIsLangOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mantras', path: '/mantras' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-btn')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Don't render navbar on admin page
  if (isAdminPage) {
    return null;
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-om">ॐ</span>
          <span className="logo-text">Solapur <span className="logo-gold">Gurukulam</span></span>
        </Link>

        <div className="desktop-nav">
          <div className="nav-links">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {/* Language Selector - Fixed Style */}
            <div className="lang-selector">
              <button className="lang-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
                <span className="lang-flag">{currentLangObj.flag}</span>
                <span className="lang-short">{currentLangObj.short}</span>
                <span className="lang-arrow">▼</span>
              </button>
              
              {isLangOpen && (
                <div className="lang-dropdown">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-native">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="auth-buttons">
                {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
                <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-link">Login</Link>
                <Link to="/register" className="register-link">Register</Link>
              </div>
            )}
          </div>
        </div>

        <button className={`menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-logo">ॐ</span>
          <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>
        <div className="mobile-menu-content">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          
          <div className="mobile-lang-section">
            <div className="mobile-lang-title">🌐 Select Language</div>
            <div className="mobile-lang-grid">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`mobile-lang-option ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => { changeLanguage(lang.code); setIsMenuOpen(false); }}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {user ? (
            <div className="mobile-auth">
              {isAdmin && <Link to="/admin" className="mobile-admin-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
              <Link to="/dashboard" className="mobile-dashboard-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
            </div>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" className="mobile-login-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-register-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;