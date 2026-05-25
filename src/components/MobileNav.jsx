import React, { useState, useEffect } from 'react';

function MobileNav() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');

    const handleMenuClick = () => setIsActive(true);
    const handleCloseClick = () => setIsActive(false);

    if (menuBtn) menuBtn.addEventListener('click', handleMenuClick);
    if (closeBtn) closeBtn.addEventListener('click', handleCloseClick);

    return () => {
      if (menuBtn) menuBtn.removeEventListener('click', handleMenuClick);
      if (closeBtn) closeBtn.removeEventListener('click', handleCloseClick);
    };
  }, []);

  const navLinks = [
    { label: 'मुख्य पृष्ठ', href: '#' },
    { label: 'हमारे बारे में', href: '#about-detail' },
    { label: 'योजनाएं', href: '#projects' },
    { label: 'सुविधाएं', href: '#facilities' },
    { label: 'गैलरी', href: '#gallery' },
    { label: 'हमारे कार्य', href: '#works' },
    { label: 'आयोजन', href: '#events' },
    { label: 'आवेदन / सुझाव', href: '#aavedan' },
    { label: 'संपर्क करें', href: '#contact' },
    { label: 'जन आवाज', href: '#testimonials' },
    { label: 'एडमिन लॉगिन', href: '/admin' }
  ];

  return (
    <div className={`mobile-nav ${isActive ? 'active' : ''}`} id="mobileNav">
      <div className="close-btn" id="closeBtn">
        <i className="fas fa-times"></i>
      </div>
      {navLinks.map((link, idx) => (
        <a key={idx} href={link.href} onClick={() => setIsActive(false)}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default MobileNav;
