import React, { useState, useEffect } from 'react';
import './App.css';
import TopStrip from './components/TopStrip';
import Header from './components/Header';
import Navbar from './components/Navbar';
import MobileHeader from './components/MobileHeader';
import MobileNav from './components/MobileNav';
import HeroSection from './components/HeroSection';
import UpdateTicker from './components/UpdateTicker';
import AboutVillage from './components/AboutVillage';
import StatsCounter from './components/StatsCounter';
import DevelopmentWorks from './components/DevelopmentWorks';
import VillageStats from './components/VillageStats';
import VillageLocations from './components/VillageLocations';
import PanchayatTeam from './components/PanchayatTeam';
import VillageEvents from './components/VillageEvents';
import LiveFeeds from './components/LiveFeeds';
import VillageProjects from './components/VillageProjects';
import MediaCoverage from './components/MediaCoverage';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AboutDetail from './components/AboutDetail';
import WorkDetail from './components/WorkDetail';
import GalleryPage from './components/GalleryPage';
import TestimonialsPage from './components/TestimonialsPage';
import MediaCoveragePage from './components/MediaCoveragePage';
import BeforeAfter from './components/BeforeAfter';
import AavedanSujhav from './components/AavedanSujhav';
import AdminDashboard from './components/AdminDashboard';
import PermissionModal from './components/PermissionModal';
import { subscriptionManager } from './utils/subscriptionManager';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#');

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.hash || '#');
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    subscriptionManager.initLiveNotifications();
  }, []);

  // Security: Prevent Right-Click and Inspect Element (F12, Ctrl+Shift+I, Ctrl+U)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // /admin और #admin दोनों के लिए परफेक्ट राउटिंग
  const isAdminRoute = currentPath.includes('/admin') || currentPath.includes('#admin');

  return (
    <div className="App">
      
      {/* Notification Permission Modal (अगर पहले नहीं पूछा गया है तो दिखेगा) */}
      <PermissionModal />
      
      {/* वेबसाइट का नॉर्मल हेडर और नेविगेशन */}
      {!isAdminRoute && (
        <>
          <MobileHeader />
          <MobileNav />
          <TopStrip />
          <Header />
          <Navbar />
        </>
      )}
      
      {isAdminRoute ? (
        <AdminDashboard />
      ) : currentPath === '#about-detail' ? (
        <AboutDetail />
      ) : currentPath === '#gallery-page' ? (
        <GalleryPage />
      ) : currentPath.startsWith('#work-') ? (
        <WorkDetail workId={currentPath.replace('#work-', '')} />
      ) : currentPath === '#testimonials-page' ? (
        <TestimonialsPage />
      ) : currentPath === '#aavedan' ? (
        <AavedanSujhav />
      ) : currentPath === '#media-coverage-page' ? (
        <MediaCoveragePage />
      ) : (
        <>
          <HeroSection />
          <UpdateTicker />
          <AboutVillage />
          <StatsCounter />
          <BeforeAfter />
          <DevelopmentWorks />
          <VillageStats />
          <VillageLocations />
          <PanchayatTeam />
          <VillageEvents />
          <LiveFeeds />
          <Testimonials />
          <VillageProjects />
          <MediaCoverage />
        </>
      )}
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
