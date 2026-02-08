import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ScannerPage from './components/ScannerPage';
import PaymentPage from './components/PaymentPage';
import EarlyAccessPage from './components/EarlyAccessPage';
import DownloadPage from './components/DownloadPage';
import Navbar from './components/Navbar';
import MerchantLogin from './components/merchant/MerchantLogin';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import AllTransactions from './components/merchant/AllTransactions';
import MerchantProfile from './components/merchant/MerchantProfile';
import MerchantSupport from './components/merchant/MerchantSupport';
import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/merchant/ProtectedRoute';
import { MerchantAuthProvider } from './contexts/MerchantAuthContext';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import RefundPage from './components/RefundPage';
import CancellationPage from './components/CancellationPage';

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/early-access', '/download', '/merchant/login', '/merchant/dashboard', '/merchant/transactions', '/pay', '/terms', '/privacy', '/refund-policy', '/cancellation-policy'];
  const isMerchantRoute = location.pathname.startsWith('/merchant');

  // Force title to "Flux" for browser alerts
  useEffect(() => {
    document.title = 'Flux';
  }, []);

  return (
    <MerchantAuthProvider>
      {!hideNavbarRoutes.includes(location.pathname) && !isMerchantRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/try" element={<ScannerPage />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/early-access" element={<EarlyAccessPage />} />
        <Route path="/download" element={<DownloadPage />} />

        {/* Merchant Routes */}
        <Route path="/merchant/login" element={<MerchantLogin />} />

        {/* Protected Merchant Routes */}
        <Route path="/merchant" element={<ProtectedRoute />}>
          <Route index element={<MerchantDashboard />} />
          <Route path="dashboard" element={<MerchantDashboard />} />
          <Route path="transactions" element={<AllTransactions />} />
          <Route path="profile" element={<MerchantProfile />} />
          <Route path="support" element={<MerchantSupport />} />
        </Route>

        {/* Policy Pages (Compliance URLs) */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPage />} />
        <Route path="/cancellation-policy" element={<CancellationPage />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MerchantAuthProvider>
  );
}

export default App;
