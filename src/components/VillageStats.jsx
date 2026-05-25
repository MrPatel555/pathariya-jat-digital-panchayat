import React from 'react';

function VillageStats() {
  const stats = [
    {
      icon: 'fas fa-person-hiking',
      number: '136',
      label: 'वुजुर्गस्था पेंशन',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-people-group',
      number: '57',
      label: 'विधिया पेंशन',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-wheelchair',
      number: '45',
      label: 'दिव्यांग पेंशन',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-shield',
      number: '50',
      label: 'सामाजिक सुरक्षा',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-tractor',
      number: '380',
      label: 'किसान मानपत्र',
      color: '#D97706'
    },
    {
      icon: 'fas fa-hand-holding-heart',
      number: '561',
      label: 'मुख्यमंत्री पेंशन',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-user',
      number: '89',
      label: 'कल्याणी सहायता',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-hard-hat',
      number: '220',
      label: 'भर्तिक सहायता',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-home',
      number: '42',
      label: 'परिवार सहायता',
      color: '#064E3B'
    },
    {
      icon: 'fas fa-check-circle',
      number: '1,542',
      label: 'कुल लाभार्थी',
      color: '#D97706'
    }
  ];

  return (
    <div className="village-stats-section">
      <div className="stats-container">
        <div className="stats-title-wrap">
          <div className="section-badge">
            <i className="fas fa-hand-holding-heart"></i> जन कल्याण योजनाएं
          </div>
          <h2>
            योजनाओं के <span>लाभार्थी</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            पथरिया जाट पंचायत में विभिन्न पेंशन एवं सहायता योजनाओं से लाभान्वित नागरिकों का विवरण।
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-line" style={{ backgroundColor: stat.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VillageStats;
