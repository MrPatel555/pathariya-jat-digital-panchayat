import React, { useEffect, useRef } from 'react';

function StatsCounter() {
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  const stats = [
    { icon: 'fas fa-users', label: 'कुल जनसंख्या', target: 9250 },
    { icon: 'fas fa-home', label: 'कुल घर', target: 2375 },
    { icon: 'fas fa-male', label: 'पुरुष', target: 4718 },
    { icon: 'fas fa-female', label: 'महिलाएँ', target: 4532 },
    { icon: 'fas fa-child', label: 'बच्चे', target: 2590 },
    { icon: 'fas fa-user-friends', label: 'बुजुर्ग', target: 740 }
  ];

  const animateCount = (element, target) => {
    const duration = 2000;
    let startTime = null;

    const update = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      element.innerText = Math.floor(easeOut * target).toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.innerText = target.toLocaleString('en-IN');
      }
    };

    requestAnimationFrame(update);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numbers = statsRef.current.querySelectorAll('.stat-number');
          const statTargets = [9250, 2375, 4718, 4532, 2590, 740];
          
          numbers.forEach((num, idx) => {
            if (num.innerText === "0") {
              animateCount(num, statTargets[idx]);
            }
          });
        }
      });
    }, { threshold: 0.3 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div className="stats-module" id="panchayatStats" ref={statsRef}>
      <div className="stats-container">
        <div className="stats-title-wrap">
          <div className="section-badge">
            <i className="fas fa-users"></i> जनसंख्या रूपरेखा
          </div>
          <h2>
            ग्राम पंचायत के <span>प्रमुख आँकड़े</span>
          </h2>
          <div className="underline"></div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="counter-card">
              <div className="icon-box">
                <i className={stat.icon}></i>
              </div>
              <div className="count-box">
                <span className="stat-number">0</span>
                <span className="suffix">+</span>
              </div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsCounter;
