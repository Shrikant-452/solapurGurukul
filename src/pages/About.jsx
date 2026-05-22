import React from 'react';
import './About.css';

const About = () => {
  const aboutItems = [
    { icon: '🕉️', title: 'Our Mission', text: 'Divine Mantra is dedicated to preserving and sharing the vast treasury of Hindu prayers, hymns, and stotras.' },
    { icon: '📜', title: 'What is a Mantra?', text: 'A mantra is a sacred utterance that is considered capable of creating transformation.' },
    { icon: '✨', title: 'Our Collection', text: 'Our library contains mantras across all major traditions — Shaiva, Vaishnava, Shakta, Smarta.' },
    { icon: '⬇️', title: 'Free Access', text: 'All mantras are freely available for reading and chanting.' }
  ];
  
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <div className="about-om">ॐ</div>
          <h1 className="about-title">About Divine Mantra</h1>
          <p className="about-subtitle">Preserving the sacred hymns of Sanatana Dharma</p>
        </div>
        
        <div className="about-grid">
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