import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, LogIn, Loader2 } from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';

const MerchantLogin = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useMerchantAuth();
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/merchant/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ contact, password });
            navigate('/merchant/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen merchant-gradient-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-['Unbounded'] text-4xl font-bold mb-2">Flux</h1>
                    <p className="text-gray-400 font-['Plus_Jakarta_Sans']">Merchant Dashboard</p>
                </div>

                {/* Login Form */}
                <div className="glass-card rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6 font-['Plus_Jakarta_Sans']">Welcome Back</h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone/ID Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-['Plus_Jakarta_Sans']">
                                Phone or Merchant ID
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter phone or ID"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-['Plus_Jakarta_Sans']"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-['Plus_Jakarta_Sans']">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-['Plus_Jakarta_Sans']"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-['Plus_Jakarta_Sans']"
                    >
                        ← Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MerchantLogin;
