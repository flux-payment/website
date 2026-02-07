import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Calendar, Shield, Lock, LogOut,
    ArrowLeft, Award, Briefcase, CheckCircle2
} from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { merchantApi } from '../../services/merchantApi';
import MerchantShopAvatar from './MerchantShopAvatar';

const MerchantProfile = () => {
    const navigate = useNavigate();
    const { merchantId, merchantCode, merchantName, logout } = useMerchantAuth();
    const [profileData, setProfileData] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    useEffect(() => {
        if (merchantId) {
            fetchProfile();
        }
    }, [merchantId]);

    const fetchProfile = async () => {
        try {
            const data = await merchantApi.getProfile(merchantId);
            setProfileData(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/merchant/login');
    };

    const handlePasswordChange = async () => {
        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        if (oldPassword === newPassword) {
            setPasswordError('New password must be different from old password');
            return;
        }

        setIsChangingPassword(true);
        setPasswordError('');

        try {
            await merchantApi.changePassword(merchantId, oldPassword, newPassword);
            setPasswordSuccess(true);
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }, 2000);
        } catch (error) {
            setPasswordError(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const InfoCard = ({ label, value, icon: Icon, isStatus }) => (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <p className="text-xs text-white/40 font-['Plus_Jakarta_Sans'] font-bold tracking-wider uppercase">
                        {label}
                    </p>
                    {isStatus ? (
                        <div className="mt-1 px-2 py-0.5 bg-green-500/20 rounded text-green-400 text-xs font-bold inline-block">
                            {value?.toUpperCase()}
                        </div>
                    ) : (
                        <p className="text-white font-medium font-['Plus_Jakarta_Sans']">
                            {value || 'N/A'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/40 via-purple-900/20 to-black z-0" />

            <div className="relative z-10 p-6 max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />
                        <MerchantShopAvatar name={merchantName} size={100} />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-black p-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h1 className="mt-6 text-3xl font-bold font-['Unbounded'] text-center">
                        {merchantName}
                    </h1>
                    <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                        <Award className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-['Source_Code_Pro'] text-white/70">
                            Merchant Account
                        </span>
                    </div>
                </motion.div>

                {/* Business Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 mb-8"
                >
                    <h2 className="text-sm font-bold text-white/40 pl-2 mb-4 tracking-widest font-['Plus_Jakarta_Sans']">
                        BUSINESS DETAILS
                    </h2>

                    <InfoCard
                        label="Business Name"
                        value={profileData?.business_name || merchantName}
                        icon={Briefcase}
                    />
                    <InfoCard
                        label="Merchant ID"
                        value={merchantCode || merchantId?.substring(0, 8)}
                        icon={User}
                    />
                    <InfoCard
                        label="Contact"
                        value={profileData?.contact}
                        icon={Phone}
                    />
                    <InfoCard
                        label="Status"
                        value={profileData?.status || 'Active'}
                        icon={Shield}
                        isStatus
                    />
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 mb-10"
                >
                    <h2 className="text-sm font-bold text-white/40 pl-2 mb-4 tracking-widest font-['Plus_Jakarta_Sans']">
                        SECURITY
                    </h2>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="font-medium">Change Password</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                    </button>
                </motion.div>

                {/* Logout */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleLogout}
                    className="w-full py-4 border border-red-500/30 bg-red-500/10 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </motion.button>

                {/* Password Change Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl p-6 max-w-md w-full"
                        >
                            <h2 className="text-2xl font-bold mb-6 font-['Unbounded']">Change Password</h2>

                            {passwordSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    </div>
                                    <p className="text-green-400 font-medium">Password changed successfully!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2 font-['Plus_Jakarta_Sans']">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-['Plus_Jakarta_Sans']"
                                                placeholder="Enter current password"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2 font-['Plus_Jakarta_Sans']">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-['Plus_Jakarta_Sans']"
                                                placeholder="Enter new password (min 8 chars)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/60 mb-2 font-['Plus_Jakarta_Sans']">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-['Plus_Jakarta_Sans']"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                            {passwordError}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowPasswordModal(false);
                                                setOldPassword('');
                                                setNewPassword('');
                                                setConfirmPassword('');
                                                setPasswordError('');
                                            }}
                                            disabled={isChangingPassword}
                                            className="flex-1 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={isChangingPassword}
                                            className="flex-1 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-bold disabled:opacity-50"
                                        >
                                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantProfile;
