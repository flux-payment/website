import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DownloadPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const inviteCode = location.state?.code;

    const handleDownload = async (e) => {
        e.preventDefault();

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
