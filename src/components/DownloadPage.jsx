import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DownloadPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const inviteCode = location.state?.code;
    const [selectedPlatform, setSelectedPlatform] = useState('android');

    useEffect(() => {
        if (!inviteCode) {
            navigate('/early-access');
        }
    }, [inviteCode, navigate]);

    const handleDownload = async (e) => {
        e.preventDefault();

        if (selectedPlatform !== 'android') {
            return; // Only allow Android downloads for now
        }

        if (inviteCode) {
            try {
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/use-referral`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: inviteCode }),
                });
            } catch (error) {
                console.error('Failed to mark referral code as used:', error);
            }
        }

        // Set secure access cookie
        document.cookie = "flux_access=granted; path=/; max-age=3600; SameSite=Strict";

        // Trigger secure download
        window.location.href = "/api/get-apk";
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-flux-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 font-header text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                    Welcome, Partner.
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                    Your <span className="text-white font-bold">₹499 Setup Fee</span> has been <span className="text-flux-primary font-bold">deferred</span> until your first <span className="text-white font-bold">₹10,000</span> in sales.
                </p>

                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 mb-12 backdrop-blur-sm">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-4">WHAT HAPPENS NEXT?</p>
                    <ul className="text-left space-y-4 text-gray-300 max-w-md mx-auto">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">1</span>
                            <span>Download the Pilot App (v1.0) below.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">2</span>
                            <span>Sign in using your registered mobile number.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">3</span>
                            <span>Complete your KYC to activate payments.</span>
                        </li>
                    </ul>
                </div>


                {/* Platform Selection */}
                <div className="mb-8">
                    <p className="text-sm text-gray-400 text-center mb-4">Select Your Platform</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        {/* Android - Selectable */}
                        <button
                            onClick={() => setSelectedPlatform('android')}
                            className={`w-full sm:w-auto flex flex-col items-center gap-3 px-6 sm:px-8 py-5 sm:py-6 rounded-2xl border-2 transition-all ${selectedPlatform === 'android'
                                ? 'bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                : 'bg-white/5 border-white/10 hover:border-green-500/50'
                                }`}
                        >
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
                            </svg>
                            <div className="text-center">
                                <p className="font-bold text-white mb-1">Android</p>
                                <p className="text-xs text-green-500">Available Now</p>
                            </div>
                        </button>

                        {/* iOS - Coming Soon */}
                        <button
                            disabled
                            className="w-full sm:w-auto flex flex-col items-center gap-3 px-6 sm:px-8 py-5 sm:py-6 rounded-2xl border-2 bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                        >
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 0 0 4.69 9.39C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z" />
                            </svg>
                            <div className="text-center">
                                <p className="font-bold text-gray-400 mb-1">iOS</p>
                                <p className="text-xs text-gray-500">Coming Soon</p>
                            </div>
                        </button>
                    </div>
                </div>

                <a
                    href="#"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    DOWNLOAD PILOT APP (v1.0)
                </a>

                <button
                    onClick={() => navigate('/')}
                    className="block mx-auto mt-8 text-sm text-gray-500 hover:text-white transition-colors"
                >
                    Return to Home
                </button>
            </motion.div>
        </div>
    );
}
