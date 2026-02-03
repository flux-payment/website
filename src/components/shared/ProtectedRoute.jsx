import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useMerchantAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/merchant/login" replace />;
};

export default ProtectedRoute;
