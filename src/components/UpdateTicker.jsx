import React from 'react';

function UpdateTicker() {
  return (
    <div className="update-ticker-wrap">
      <div className="ticker-label">
        <i className="fas fa-bullhorn"></i> पंचायत सूचना
      </div>
      <div className="ticker-content">
        <marquee behavior="scroll" direction="left" scrollamount="6" onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
          ✨ <strong>ग्राम पंचायत पथरिया जाट</strong> के डिजिटल पोर्टल में आपका हार्दिक स्वागत है। &nbsp; | &nbsp; 🌿 <span className="highlight">हमारा संकल्प:</span> पारदर्शी कार्यप्रणाली, स्वच्छ पर्यावरण और आत्मनिर्भर गाँव। &nbsp; | &nbsp; 📢 पंचायत की सभी नवीनतम योजनाओं, सूचनाओं और विकास कार्यों की जानकारी के लिए पोर्टल पर नियमित रूप से विजिट करें।
        </marquee>
      </div>
    </div>
  );
}

export default UpdateTicker;
