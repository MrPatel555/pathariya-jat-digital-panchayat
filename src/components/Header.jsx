import React from 'react';

function Header() {
  const helplineData = [
    {
      label: 'पुलिस सहायता',
      sublabel: 'आपातकालीन सेवा',
      number: '112 / 100',
      bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
      borderColor: '#FCA5A5',
      iconColor: '#DC2626',
      icon: 'fas fa-shield-alt'
    },
    {
      label: 'एम्बुलेंस सेवा',
      sublabel: 'संजीवनी',
      number: '108',
      bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
      borderColor: '#86EFAC',
      iconColor: '#16A34A',
      icon: 'fas fa-ambulance'
    },
    {
      label: 'सीएम हेल्पलाइन',
      sublabel: 'म.प्र. शासन',
      number: '181',
      bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      borderColor: '#93C5FD',
      iconColor: '#2563EB',
      icon: 'fas fa-headset'
    },
    {
      label: 'महिला हेल्पलाइन',
      sublabel: 'सुरक्षा और सहायता',
      number: '1090',
      bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      borderColor: '#F9A8D4',
      iconColor: '#DB2777',
      icon: 'fas fa-female'
    },
    {
      label: 'फायर ब्रिगेड',
      sublabel: 'अग्नि शमन',
      number: '101',
      bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      borderColor: '#FDBA74',
      iconColor: '#EA580C',
      icon: 'fas fa-fire-extinguisher'
    },
    {
      label: 'चाइल्ड हेल्पलाइन',
      sublabel: 'बच्चों के लिए',
      number: '1098',
      bg: 'linear-gradient(135deg, #FEFCE8 0%, #FEF08A 100%)',
      borderColor: '#FDE047',
      iconColor: '#CA8A04',
      icon: 'fas fa-child'
    },
    {
      label: 'साइबर क्राइम',
      sublabel: 'वित्तीय धोखाधड़ी',
      number: '1930',
      bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      borderColor: '#C4B5FD',
      iconColor: '#7C3AED',
      icon: 'fas fa-laptop-code'
    }
  ];

  return (
    <div className="header">
      <div className="logo-wrap">
        <img src="logo.png" alt="Logo" />
        <div className="logo-text">
          <h2>Pathariya Jat Digital Panchayat</h2>
          <p>
            <b>Sagar tehsil of Sagar district,</b><br />
            Madhya Pradesh (India)
          </p>
        </div>
      </div>

      <div className="helpline-wrapper">
        <div className="helpline-track">
          {[...helplineData, ...helplineData].map((item, idx) => (
            <div 
              key={idx} 
              className="helpline-card"
              style={{
                background: item.bg,
                border: `2px solid ${item.borderColor}`,
                boxShadow: `0 4px 10px ${item.borderColor}40`
              }}
            >
              <span style={{ color: '#334155', fontWeight: '600' }}>
                {item.label}
                {item.sublabel && <><br /><small style={{ color: '#64748B', fontWeight: 'normal' }}>{item.sublabel}</small></>}
              </span>
              <strong style={{ color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '18px', marginTop: '4px' }}>
                <i className={item.icon}></i> {item.number}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
