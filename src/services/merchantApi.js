const API_BASE = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('flux_merchant_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const merchantApi = {
    // Auth - CORRECT: /auth/merchant-login
    login: async (contact, password) => {
        const response = await fetch(`${API_BASE}/auth/merchant-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    // Merchant Profile - /merchants/{id}
    getProfile: async (id) => {
        const response = await fetch(`${API_BASE}/merchants/${id}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    // Balance & Stats - /merchants/{id}/balance
    getBalance: async (id) => {
        const response = await fetch(`${API_BASE}/merchants/${id}/balance`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch balance');
        return response.json();
    },

    // QR Code Generation - /merchants/{id}/qr
    getQR: async (id, amount = null) => {
        const url = amount
            ? `${API_BASE}/merchants/${id}/qr?amount=${amount}`
            : `${API_BASE}/merchants/${id}/qr`;

        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to generate QR');
        return response.json();
    },

    // Transactions - /merchants/{id}/transactions
    getTransactions: async (id, { limit = 10, offset = 0 } = {}) => {
        const response = await fetch(
            `${API_BASE}/merchants/${id}/transactions?limit=${limit}&offset=${offset}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    // Settlement Breakdown - /settlements/breakdown/{payment_id}
    getSettlementBreakdown: async (paymentId) => {
        const response = await fetch(
            `${API_BASE}/settlements/breakdown/${paymentId}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch settlement breakdown');
        return response.json();
    },

    // Support - /support/tickets
    getTickets: async (merchantId) => {
        const response = await fetch(
            `${API_BASE}/support/tickets?merchant_id=${merchantId}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch tickets');
        return response.json();
    },

    createTicket: async (merchantId, { subject, message }) => {
        const response = await fetch(`${API_BASE}/support/tickets`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                merchant_id: merchantId,
                subject,
                message
            }),
        });
        if (!response.ok) throw new Error('Failed to create ticket');
        return response.json();
    },
};
