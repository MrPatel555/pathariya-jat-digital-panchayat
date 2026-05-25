import React from 'react';

function VillageProjects() {
  const completedProjects = [
    "ग्राम के मुख्य मार्गों पर सीसी रोड एवं पक्की नाली का निर्माण",
    "जल जीवन मिशन के अंतर्गत घर-घर शुद्ध पेयजल (फेज 1 पूर्ण)",
    "पंचायत भवन का आधुनिकीकरण एवं जीर्णोद्धार",
    "सार्वजनिक चौराहों और मार्गों पर सोलर स्ट्रीट लाइट स्थापना",
    "स्वच्छ भारत अभियान के तहत सुलभ सार्वजनिक शौचालय का निर्माण",
    "प्राथमिक विद्यालय में अतिरिक्त कक्ष का निर्माण एवं रंग-रोगन",
    "श्मशान घाट में टीन शेड एवं बाउंड्री वाल का निर्माण",
    "ग्राम में जल संचयन हेतु पुराने तालाब का गहरीकरण"
  ];

  const upcomingProjects = [
    "युवाओं के लिए सर्वसुविधायुक्त खेल मैदान का निर्माण",
    "ग्राम पंचायत में ई-लाइब्रेरी एवं उन्नत कंप्यूटर सेंटर",
    "आंगनवाड़ी केंद्रों का स्मार्टकरण (डिजिटल क्लास एवं खिलौने)",
    "कचरा प्रबंधन एवं वर्मी कंपोस्ट (जैविक खाद) यूनिट की स्थापना",
    "प्राचीन मंदिर एवं तालाब क्षेत्र का भव्य सौंदर्यीकरण",
    "किसानों के लिए आधुनिक कृषि उपकरण बैंक की शुरुआत",
    "ग्राम के प्रमुख स्थानों पर सुरक्षा हेतु सीसीटीवी कैमरा एवं वाई-फाई",
    "महिलाओं के लिए सिलाई एवं कौशल विकास केंद्र"
  ];

  return (
    <div className="projects-section" id="projects">
      <div className="projects-container">
        <div className="stats-title-wrap">
          <div className="section-badge" style={{ background: '#E0E7FF', color: '#1E40AF', borderColor: '#BFDBFE' }}>
            <i className="fas fa-tasks"></i> विकास की उड़ान
          </div>
          <h2>
            प्रगति के <span>कदम</span>
          </h2>
          <div className="underline"></div>
          <p className="section-subtitle">
            ग्राम पंचायत पथरिया जाट में सफलतापूर्वक पूर्ण किए गए विकास कार्य एवं हमारी भावी योजनाएं।
          </p>
        </div>

        <div className="projects-grid">
          {/* Left Column: Completed Projects */}
          <div className="project-card success-card">
            <div className="project-card-header">
              <h3><i className="fas fa-check-circle"></i> सफल प्रयास (पूर्ण)</h3>
            </div>
            <div className="project-card-body">
              <div className="scroll-content-up">
                {/* Render list twice for infinite seamless scroll */}
                {[...completedProjects, ...completedProjects].map((item, idx) => (
                  <div key={idx} className="scroll-item">
                    <i className="fas fa-check"></i>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Projects */}
          <div className="project-card upcoming-card">
            <div className="project-card-header">
              <h3><i className="fas fa-rocket"></i> भावी योजनाएं (आगामी)</h3>
            </div>
            <div className="project-card-body">
              <div className="scroll-content-up">
                {/* Render list twice for infinite seamless scroll */}
                {[...upcomingProjects, ...upcomingProjects].map((item, idx) => (
                  <div key={idx} className="scroll-item">
                    <i className="fas fa-star"></i>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VillageProjects;