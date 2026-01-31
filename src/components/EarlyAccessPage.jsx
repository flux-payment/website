import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EarlyAccessPage() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [requestForm, setRequestForm] = useState({
        businessName: '',
        whatsapp: ''
    });

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!inviteCode.trim()) {
            setError('Please enter an invite code');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/validate-referral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: inviteCode.trim().toUpperCase() }),
            });

            if (response.ok) {
                navigate('/download');
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid invite code.');
            }
        } catch (err) {
            console.error(err);
            setError('Connection failed. Please try again.');
        }
    };

    const handleRequestSubmit = async (e) => {
        // Formspree handles the submission via the action attribute usually,
        // but here we might want to handle it with fetch if we want custom UI feedback.
        // For now, we will let the form submit normally or just show a success message mock.
        // Using formspree endpoint directly in action is the standard way.
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Left Side: Have a Code? */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center border-r border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-flux-primary/5 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md mx-auto w-full relative z-10"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-white mb-8 flex items-center gap-2 transition-colors"
                    >
                        &larr; Back to Home
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black mb-2 font-header">Enter the Inner Circle.</h1>
                    <p className="text-xl text-gray-400 mb-12">Flux is currently in Private Beta. Valid Invite Code required for signup.</p>

                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Have a Code?</h2>
                        <form onSubmit={handleCodeSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Invite Code (e.g. PRO50)"
                                    value={inviteCode}
                                    onChange={(e) => {
                                        setInviteCode(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full px-4 py-4 bg-black border border-white/20 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none text-center text-lg tracking-widest uppercase transition-all"
                                />
                                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-flux-primary hover:bg-flux-primary/90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02]"
                            >
                                VALIDATE & CLAIM OFFER
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Need a Code? */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-zinc-950 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-md mx-auto w-full"
                >
                    <h2 className="text-3xl font-bold mb-4">Need a Code?</h2>
                    <p className="text-gray-400 mb-8">We release codes in batches of 50. Tell us about your business to get prioritized.</p>

                    <form
                        action="https://formspree.io/f/YOUR_FORM_ID"
                        method="POST"
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                required
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:border-white/30 outline-none transition-all"
                                placeholder="Your Business Name"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</label>
                            <input
                                type="text"
                                name="contactPerson"
                                required
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:border-white/30 outline-none transition-all"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:border-white/30 outline-none transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number</label>
                            <input
                                type="tel"
                                name="whatsapp"
                                required
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:border-white/30 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all mt-4"
                        >
                            REQUEST CODE
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
