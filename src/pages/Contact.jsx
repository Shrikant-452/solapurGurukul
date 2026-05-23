import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <div className="contact-om animate-glow">ॐ</div>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">We'd love to hear from you</p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>contact@solapurgurukulam.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>Solapur, Maharashtra, India</p>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <textarea placeholder="Your Message" rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;