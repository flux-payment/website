import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ScannerPage from './components/ScannerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/try" element={<ScannerPage />} />
    </Routes>
  );
}

export default App;
