import React from 'react';
import './About.css';

const About = () => {
  const aboutItems = [
    { icon: '🕉️', title: 'Our Mission', text: 'Solapur Gurukulam is dedicated to preserving and sharing the vast treasury of Hindu prayers, hymns, and stotras. We believe sacred knowledge should be accessible to all sincere seekers.' },
    { icon: '📜', title: 'What is a Stotra?', text: 'A stotra (स्तोत्र) is a hymn of praise to a deity. Unlike mantras, stotras may be recited by anyone with devotion. They form the heart of personal and communal Hindu devotional practice.' },
    { icon: '✨', title: 'Our Collection', text: 'Our library contains stotras, ashtakas, sahasranamas, kavachas, aartis and mantras across all major traditions — Shaiva, Vaishnava, Shakta, Smarta and Ganapatya.' },
    { icon: '⬇️', title: 'Free Access', text: 'All stotras are freely available for reading and chanting. We believe sacred knowledge should flow freely to all who seek it.' }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <div className="about-om animate-glow">ॐ</div>
          <h1 className="about-title">About Solapur Gurukulam</h1>
          <p className="about-subtitle">Preserving the sacred hymns of Sanatana Dharma</p>
        </div>
        
        <div className="about-grid stagger-children">
          {aboutItems.map((item, index) => (
            <div key={index} className="about-card">
              <div className="about-card-icon">{item.icon}</div>
              <h3 className="about-card-title">{item.title}</h3>
              <p className="about-card-text">{item.text}</p>
            </div>
          ))}
        </div>
        
        <div className="about-closing">
          <p className="closing-verse">सर्वे भवन्तु सुखिनः</p>
          <p className="closing-meaning">May all beings be happy, may all be free from disease.</p>
        </div>
      </div>
    </div>
  );
};

export default About;