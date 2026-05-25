import React from 'react';

function HeroSection() {
  return (
    <div className="hero-container">
      <div className="hero-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default HeroSection;
