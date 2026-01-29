import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ScannerPage from './components/ScannerPage';
import PaymentPage from './components/PaymentPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/try" element={<ScannerPage />} />
        <Route path="/pay" element={<PaymentPage />} />
      </Routes>
    </>
  );
}

export default App;
