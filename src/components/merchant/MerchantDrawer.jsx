import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    LayoutDashboard,
    User,
    Receipt,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import MerchantShopAvatar from './MerchantShopAvatar';

const MerchantDrawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { merchantCode, merchantName, logout } = useMerchantAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/merchant/dashboard' },
        { icon: User, label: 'Profile', path: '/merchant/profile' },
        { icon: Receipt, label: 'All Transactions', path: '/merchant/transactions' },
        { icon: HelpCircle, label: 'Support', path: '/merchant/support' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/merchant/login');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-full w-80 bg-[#121212] z-50 flex flex-col"
                    >
                        {/* Header with Profile */}
                        <div className="p-6 pt-8 bg-gradient-to-br from-blue-900/30 to-transparent">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <div className="flex items-center gap-4 mt-4">
                                <MerchantShopAvatar name={merchantName} size={48} />
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg font-['Plus_Jakarta_Sans'] uppercase">
                                        {merchantName || 'Merchant'}
                                    </h3>
                                    <p className="text-white/70 text-sm font-['Source_Code_Pro']">
                                        MID: {merchantCode || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-2" />

                        {/* Navigation Menu */}
                        <nav className="flex-1 px-4 py-2 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all font-['Plus_Jakarta_Sans'] ${isActive
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Logout Button */}
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-['Plus_Jakarta_Sans'] font-semibold"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MerchantDrawer;
