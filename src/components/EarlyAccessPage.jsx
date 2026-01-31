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

    const [requestErrors, setRequestErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const errors = {};

        // Validation Logic
        if (!data.businessName?.trim()) errors.businessName = 'Business Name is required';
        if (!data.contactPerson?.trim()) errors.contactPerson = 'Contact Person is required';

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(data.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // WhatsApp Validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!data.whatsapp?.trim()) {
            errors.whatsapp = 'WhatsApp number is required';
        } else if (!phoneRegex.test(data.whatsapp.replace(/\D/g, ''))) {
            errors.whatsapp = 'Please enter a valid 10-digit number';
        }

        if (Object.keys(errors).length > 0) {
            setRequestErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            // Google Apps Script Web App URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoa8cGFyJgOmr-EIfkuIovJxwPYWD60_PtxVETlNTJtOJD2Y1cL6kUSPRTf-0gdUtuKQ/exec';

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Standard for Google Scripts to avoid CORS errors (opaque response)
            });

            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                                    placeholder="ENTER CODE"
                                    value={inviteCode}
                                    onChange={(e) => {
                                        setInviteCode(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full px-4 py-5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-flux-primary focus:ring-2 focus:ring-flux-primary/50 outline-none text-center text-2xl font-bold tracking-[0.5em] uppercase transition-all placeholder:text-white/20 placeholder:tracking-normal placeholder:font-normal"
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

                    {isSubmitted ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-900/50 p-8 rounded-3xl border border-green-500/30 text-center"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">We Will Contact You</h3>
                            <p className="text-gray-400">We've added you to the priority queue. Look out for a message on WhatsApp from our Key Manager.</p>
                        </motion.div>
                    ) : (
                        <form
                            onSubmit={handleRequestSubmit}
                            noValidate
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    required
                                    onChange={() => setRequestErrors(prev => ({ ...prev, businessName: '' }))}
                                    className={`w-full px-4 py-3 bg-zinc-900 border ${requestErrors.businessName ? 'border-red-500' : 'border-white/10'} rounded-xl focus:border-white/30 outline-none transition-all`}
                                    placeholder="Your Business Name"
                                />
                                {requestErrors.businessName && <p className="text-red-500 text-xs">{requestErrors.businessName}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    required
                                    onChange={() => setRequestErrors(prev => ({ ...prev, contactPerson: '' }))}
                                    className={`w-full px-4 py-3 bg-zinc-900 border ${requestErrors.contactPerson ? 'border-red-500' : 'border-white/10'} rounded-xl focus:border-white/30 outline-none transition-all`}
                                    placeholder="Full Name"
                                />
                                {requestErrors.contactPerson && <p className="text-red-500 text-xs">{requestErrors.contactPerson}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    onChange={() => setRequestErrors(prev => ({ ...prev, email: '' }))}
                                    className={`w-full px-4 py-3 bg-zinc-900 border ${requestErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl focus:border-white/30 outline-none transition-all`}
                                    placeholder="name@company.com"
                                />
                                {requestErrors.email && <p className="text-red-500 text-xs">{requestErrors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    required
                                    onChange={() => setRequestErrors(prev => ({ ...prev, whatsapp: '' }))}
                                    className={`w-full px-4 py-3 bg-zinc-900 border ${requestErrors.whatsapp ? 'border-red-500' : 'border-white/10'} rounded-xl focus:border-white/30 outline-none transition-all`}
                                    placeholder="10 digit number"
                                />
                                {requestErrors.whatsapp && <p className="text-red-500 text-xs">{requestErrors.whatsapp}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            REQUESTING...
                                        </>
                                    ) : 'REQUEST CODE'}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
