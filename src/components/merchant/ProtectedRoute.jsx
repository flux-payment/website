import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useMerchantAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page, but save the current location they were trying to go to
        // so we can redirect them back after they login
        return <Navigate to="/merchant/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
