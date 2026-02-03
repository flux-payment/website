import React, { createContext, useContext, useState, useEffect } from 'react';

const MerchantAuthContext = createContext(null);

export const useMerchantAuth = () => {
    const context = useContext(MerchantAuthContext);
    if (!context) {
        throw new Error('useMerchantAuth must be used within MerchantAuthProvider');
    }
    return context;
};

export const MerchantAuthProvider = ({ children }) => {
    const [merchantId, setMerchantId] = useState(null); // UUID for API calls
    const [merchantCode, setMerchantCode] = useState(null); // 6-digit display code
    const [merchantName, setMerchantName] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('flux_merchant_token');
        const storedId = localStorage.getItem('flux_merchant_id'); // UUID
        const storedCode = localStorage.getItem('flux_merchant_code'); // 6-digit
        const storedName = localStorage.getItem('flux_merchant_name');

        if (storedToken && storedId) {
            setToken(storedToken);
            setMerchantId(storedId);
            setMerchantCode(storedCode);
            setMerchantName(storedName || 'Merchant');
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials) => {
        // credentials: { contact, password }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/merchant-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            // Try to parse response as JSON
            let data;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned invalid response. Please check backend.');
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Login failed');
            }

            // Backend returns: { id: <uuid>, merchant_id: <6-digit>, name, token, ... }
            // id (UUID) is used for authenticated API calls
            // merchant_id (6-digit) is used for display
            const merchantUuid = data.id; // UUID for API authentication
            const merchantDisplayId = data.merchant_id || data.client_id; // 6-digit code
            const merchantName = data.display_name || data.business_name || data.name || 'Merchant';

            // Store in state and localStorage
            setToken(data.token);
            setMerchantId(merchantUuid); // Store UUID as merchantId for API calls
            setMerchantCode(merchantDisplayId); // Store 6-digit code separately
            setMerchantName(merchantName);

            localStorage.setItem('flux_merchant_token', data.token);
            localStorage.setItem('flux_merchant_id', merchantUuid); // Store UUID
            localStorage.setItem('flux_merchant_code', merchantDisplayId); // Store 6-digit
            localStorage.setItem('flux_merchant_name', merchantName);

            return data;
        } catch (error) {
            // Re-throw with better error message
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to backend. Is the server running?');
            }
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setMerchantId(null);
        setMerchantCode(null);
        setMerchantName(null);

        localStorage.removeItem('flux_merchant_token');
        localStorage.removeItem('flux_merchant_id');
        localStorage.removeItem('flux_merchant_code');
        localStorage.removeItem('flux_merchant_name');
    };

    const refreshAuth = async () => {
        // Could implement token refresh logic here if backend supports it
        const storedToken = localStorage.getItem('flux_merchant_token');
        if (!storedToken) {
            logout();
            return false;
        }
        return true;
    };

    const value = {
        merchantId, // UUID for API calls
        merchantCode, // 6-digit display code
        merchantName,
        token,
        isAuthenticated: !!token && !!merchantId,
        isLoading,
        login,
        logout,
        refreshAuth,
    };

    return (
        <MerchantAuthContext.Provider value={value}>
            {children}
        </MerchantAuthContext.Provider>
    );
};
