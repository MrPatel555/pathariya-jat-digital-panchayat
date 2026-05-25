import React from 'react';

function MobileHeader({ onMenuClick }) {
  return (
    <div className="mobile-header">
      <div className="mobile-top">
        <div className="mobile-social">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
        </div>
        <div className="mobile-search">
          <input type="text" placeholder="Search" />
          <button><i className="fas fa-search"></i></button>
        </div>
      </div>

      <div className="mobile-main">
        <div className="mobile-logo">
          <img src="./logo.png" alt="Logo" />
          <div className="mobile-text">
            <b>Department of Panchayati Raj</b><br />
            Digital Panchayat Management System – Pathariya Jat<br />
            Sagar, Madhya Pradesh (India)
          </div>
        </div>
        <div className="mobile-menu" id="menuBtn" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </div>
  );
}

export default MobileHeader;
