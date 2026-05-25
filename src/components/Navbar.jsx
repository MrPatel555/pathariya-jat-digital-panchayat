import React, { useState } from 'react';

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { label: 'मुख्य पृष्ठ', href: '#' },
    {
      label: 'हमारे बारे में',
      href: '#about-detail',
      dropdown: [
        { label: 'परिचय', href: '#about-detail' },
        { label: 'विज़न और मिशन', href: '#about-detail' }
      ]
    },
    { label: 'योजनाएं', href: '#projects' },
    { label: 'सुविधाएं', href: '#facilities' },
    {
      label: 'प्रमुख आंकड़े',
      href: '#panchayatStats',
      dropdown: [
        { label: 'कुल जनसंख्या आंकड़े', href: '#panchayatStats' },
        { label: 'योजना अपडेट्स', href: '#live-feeds' },
        { label: 'जन संवाद और आभार', href: '#testimonials' }
      ]
    },
    { label: 'गैलरी', href: '#gallery' },
    {
      label: 'हमारे कार्य',
      href: '#works',
      dropdown: [
        { label: 'ऑनलाइन सेवाएं', href: '#live-feeds' },
        { label: 'विकास कार्य', href: '#works' }
      ]
    },
    { label: 'आयोजन', href: '#events' },
    { label: 'आवेदन / सुझाव', href: '#aavedan' },
    {
      label: 'संपर्क करें',
      href: '#contact',
      dropdown: [
        { label: 'पंचायत कार्यालय', href: '#contact' },
        { label: 'हेल्पलाइन नंबर', href: '#contact' }
      ]
    },
    { label: 'जन आवाज', href: '#testimonials' }
  ];

  return (
    <nav className="navbar">
      <ul>
        {navItems.map((item, idx) => (
          <li
            key={idx}
            onMouseEnter={() => item.dropdown && setActiveDropdown(idx)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a href={item.href}>
              {item.label}
              {item.dropdown && <i className="fas fa-chevron-down"></i>}
            </a>
            {item.dropdown && (
              <div className="dropdown">
                {item.dropdown.map((subitem, subidx) => (
                  <a key={subidx} href={subitem.href}>
                    {subitem.label}
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
