import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-om">ॐ</span>
              <span>Divine Mantra</span>
            </div>
            <p className="footer-desc">A digital treasury of Hindu devotional literature, open to all seekers of truth.</p>
            <div className="footer-verse">
              <p>सर्वे भवन्तु सुखिनः</p>
              <p className="verse-meaning">May all beings be happy, may all be free from disease.</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/mantras">Mantras</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li><Link to="/mantras">Ganesha Mantras</Link></li>
              <li><Link to="/mantras">Shiva Mantras</Link></li>
              <li><Link to="/mantras">Vishnu Mantras</Link></li>
              <li><Link to="/mantras">Devi Mantras</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Divine Mantra. All rights reserved.</p>
          <p className="copyright-note">All mantras are for devotional purposes only</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;