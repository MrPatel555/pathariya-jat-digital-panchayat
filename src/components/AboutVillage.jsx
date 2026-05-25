import React, { useState, useEffect } from 'react';

function AboutVillage() {
  const [aboutData, setAboutData] = useState({
    title: 'पहाड़ों की छाँव, हरियाली का गाँव: हमारा पथरिया जाट',
    desc1: 'नमस्कार! चारों ओर से खूबसूरत पहाड़ों और हरियाली से घिरा हमारा \'पथरिया जाट\' सिर्फ एक पंचायत नहीं, बल्कि हम सबका एक प्यारा सा परिवार है। पहाड़ों से आती ठंडी हवाएं, शुद्ध वातावरण और अद्भुत प्राकृतिक सौंदर्य हमारे गाँव की असली पहचान हैं।',
    desc2: 'आज के इस बदलते दौर में, हम अपनी इसी प्राकृतिक धरोहर को बचाते हुए विकास की नई ऊंचाइयों को छू रहे हैं। हम सभी ग्रामवासी मिलकर अपने गाँव को एक स्वच्छ, हरित और स्मार्ट डिजिटल पंचायत बना रहे हैं। यह पोर्टल उसी दिशा में एक कदम है।',
    image: 'village-photo.jpg'
  });

  useEffect(() => {
    const fetchAboutData = () => {
      const saved = localStorage.getItem('panchayat_about_data');
      if (saved) setAboutData(JSON.parse(saved));
    };
    fetchAboutData(); // लोड होते ही डेटा लाए
    window.addEventListener('storage', fetchAboutData); // एडमिन चेंज करते ही तुरंत अपडेट
    return () => window.removeEventListener('storage', fetchAboutData);
  }, []);

  const titleParts = aboutData.title.split(':');

  return (
    <div className="about-village">
      <div className="village-container">
        <div className="village-text">
          <div className="section-badge">
            <i className="fas fa-laptop-house"></i> डिजिटल पंचायत
          </div>
          <h2 className="section-title">
            {titleParts[0]} {titleParts.length > 1 && <span>: {titleParts.slice(1).join(':')}</span>}
          </h2>
          <p>{aboutData.desc1}</p>
          <p>{aboutData.desc2}</p>
          <div className="hero-actions" style={{ marginTop: '30px' }}>
            <a href="#about-detail" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              विस्तार से जानें <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        <div className="village-image">
          <div className="image-accent"></div>
          <img src={aboutData.image} alt="About Pathariya Jat Panchayat" style={{ objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
}

export default AboutVillage;
