import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ScannerPage from './components/ScannerPage';
import PaymentPage from './components/PaymentPage';
import EarlyAccessPage from './components/EarlyAccessPage';
import DownloadPage from './components/DownloadPage';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/early-access', '/download'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/try" element={<ScannerPage />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/early-access" element={<EarlyAccessPage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </>
  );
}

export default App;
