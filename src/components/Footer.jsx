import React, { useEffect, useState } from 'react';

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const usefulLinks = [
    { label: 'मुख्य पृष्ठ', href: '#' },
    { label: 'हमारे बारे में', href: '#about-detail' },
    { label: 'विकास कार्यों की सूची', href: '#works' },
    { label: 'ऑनलाइन सेवाएं', href: '#live-feeds' },
    { label: 'आवेदन दर्ज करें', href: '#aavedan' }
  ];

  const govPortals = [
    { label: 'म.प्र. ऑनलाइन', href: 'https://mponline.gov.in', target: '_blank' },
    { label: 'समग्र पोर्टल', href: 'https://samagra.gov.in', target: '_blank' },
    { label: 'पंचायत दर्पण', href: 'https://www.mppanchayatdarpan.gov.in/', target: '_blank' },
    { label: 'पीएम आवास पोर्टल', href: 'https://pmayg.nic.in/', target: '_blank' },
    { label: 'डिजिटल इंडिया', href: 'https://www.digitalindia.gov.in/', target: '_blank' }
  ];

  return (
    <footer id="contact" className="p-footer-main">
      {/* Top Bar: Newsletter */}
      <div className="footer-news-bar">
        <div className="f-container">
          <div className="news-flex">
            <div className="news-text">
              <h3>
                <i className="fas fa-paper-plane"></i> ताज़ा सूचनाएं प्राप्त करें
              </h3>
              <p>अपना मोबाइल नंबर दर्ज करें ताकि पंचायत की योजनाओं की जानकारी SMS द्वारा मिल सके।</p>
            </div>
            <div className="news-form">
              <input type="tel" placeholder="अपना मोबाइल नंबर डालें..." maxLength="10" />
              <button type="button">
                जुड़ें <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="footer-mid">
        <div className="f-container">
          <div className="f-grid">
            {/* Brand Col */}
            <div className="f-col brand-col">
              <div className="f-logo">
                <div className="logo-icon">
                  <i className="fas fa-landmark"></i>
                </div>
                <div className="logo-text">
                  <span className="l-main">पथरिया जाट</span>
                  <span className="l-sub">ग्राम पंचायत</span>
                </div>
              </div>
              <p className="f-about-text">
                हमारा संकल्प: डिजिटल सशक्तिकरण और ग्राम विकास। ग्राम पंचायत पथरिया जाट को एक आदर्श डिजिटल गाँव बनाने की दिशा में निरंतर प्रयासरत।
              </p>
              <div className="f-social">
                <a href="#" className="s-fb" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="s-tw" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="s-yt" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="s-wa" title="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Useful Links */}
            <div className="f-col">
              <h4 className="f-heading">उपयोगी लिंक</h4>
              <ul className="f-links">
                {usefulLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href}>
                      <i className="fas fa-angle-right"></i> {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gov Portals */}
            <div className="f-col">
              <h4 className="f-heading">सरकारी पोर्टल</h4>
              <ul className="f-links">
                {govPortals.map((portal, idx) => (
                  <li key={idx}>
                    <a href={portal.href} target={portal.target}>
                      <i className="fas fa-external-link-alt"></i> {portal.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="f-col contact-col">
              <h4 className="f-heading">संपर्क करें</h4>
              <div className="f-contact-list">
                <div className="c-item">
                  <div className="c-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="c-text">पंचायत भवन, पथरिया जाट, जिला सागर (म.प्र.) 470001</div>
                </div>
                <div className="c-item">
                  <div className="c-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="c-text">
                    +91 07496 - 224XXX<br />
                    <small>हेल्पलाइन: 181 (CM Helpline)</small>
                  </div>
                </div>
                <div className="c-item">
                  <div className="c-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="c-text">contact@pathariyajatpanchayat.in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="f-container">
          <div className="bottom-flex">
            <div className="b-copyright">
              © 2024 <strong>ग्राम पंचायत पथरिया जाट</strong> | सर्वाधिकार सुरक्षित।
              <div className="dev-credit">
                Designed & Developed by <span className="gs-text">Garud Stacks PVT LTD</span>
              </div>
            </div>
            <div className="b-badges">
              <span className="badge-item">
                <i className="fas fa-shield-alt"></i> सुरक्षित पोर्टल
              </span>
              <span className="badge-item">
                <i className="fas fa-flag"></i> #DigitalIndia
              </span>
              <a href="/admin" className="badge-item" style={{ color: '#D4AF37', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fas fa-user-shield"></i> एडमिन लॉगिन
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={`back-to-top-btn ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        title="Go to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </footer>
  );
}

export default Footer;
