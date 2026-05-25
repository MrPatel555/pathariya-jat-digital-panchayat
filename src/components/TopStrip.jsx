import React from 'react';

function TopStrip() {
  return (
    <div className="top-strip">
      <div className="social-group">
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-x-twitter"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-youtube"></i>
      </div>
      <div className="top-search">
        <input type="text" placeholder="Search" />
        <button><i className="fas fa-search"></i></button>
      </div>
    </div>
  );
}

export default TopStrip;
