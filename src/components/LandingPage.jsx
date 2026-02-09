import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroHeartbeat from './LoadingScreen';
import FlyingCards from './FlyingCards';

export default function LandingPage() {
    const navigate = useNavigate();

    // Check for payment QR parameters on homepage and redirect to /pay
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const qr = params.get('qr');
        const sig = params.get('sig');
        if (qr && sig) {
            // Redirect to /pay while preserving params
            window.location.href = `/pay?qr=${qr}&sig=${sig}`;
        }
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [activeModal, setActiveModal] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Phone Validation
        const phoneRegex = /^[0-9]{10}$/; // Simple 10 digit validation
        if (!formData.phone.match(phoneRegex)) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setStatus('loading');

        try {
            // await new Promise(resolve => setTimeout(resolve, 1500)); // Removed mock delay

            // Google Sheet Integration
            const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
            console.log("Submitting to Google Sheet URL:", googleSheetUrl);

            if (!googleSheetUrl || googleSheetUrl.includes("PLACEHOLDER")) {
                alert("Please configure VITE_GOOGLE_SHEET_URL in your .env file!");
                setStatus('idle');
                return;
            }

            if (googleSheetUrl.includes("docs.google.com/spreadsheets")) {
                alert("Incorrect URL Configuration!\n\nYou have pasted the 'Spreadsheet URL' into .env.\nYou need the 'Apps Script Web App URL' which starts with 'https://script.google.com/macros/s/...'\n\n1. Go to your Sheet > Extensions > Apps Script.\n2. Paste the code.\n3. Deploy > New Deployment > Select 'Web App' > Who has access: 'Anyone'.\n4. Copy the URL ending in '/exec'.");
                setStatus('idle');
                console.error("Wrong URL Type: User used Spreadsheet URL instead of Web App URL.");
                return;
            }

            // Create FormData for Google Apps Script
            const data = new FormData();
            data.append('businessName', formData.businessName);
            data.append('contactPerson', formData.contactPerson);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('created_at', new Date().toISOString());

            await fetch(googleSheetUrl, {
                method: 'POST',
                body: data,
                mode: 'no-cors' // Handle CORS for Google Scripts
            });

            setStatus('success');
            setFormData({ businessName: '', contactPerson: '', email: '', phone: '' });
        } catch (error) {
            console.error("Signup failed:", error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-black text-white selection:bg-flux-primary selection:text-white overflow-hidden">

            {/* HERO SECTION */}
            <section className="relative h-[220vh]" id="home">
                {/* The Hero/Header Logic encapsulated here (Fixed Position) */}
                <HeroHeartbeat />

                {/* Flying Cards Animation */}
                <div className="relative z-20 bg-black">
                    <FlyingCards title="ACCEPT PAYMENTS EFFORTLESSLY" />
                </div>

                <div className="absolute bottom-32 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pointer-events-auto"
                    >
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-flux-primary hover:bg-flux-primary/80 text-white font-bold rounded-full text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
                        >
                            View Services & Pricing
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* SEPARATOR GRADIENT */}
            <div className="h-32 bg-gradient-to-b from-black to-zinc-950 pointer-events-none" />

            {/* ABOUT SECTION - Premium Commerce OS */}
            <section id="about" className="py-24 px-6 bg-zinc-950 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-20 space-y-4"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-header leading-tight">
                            The Operating System for <br />
                            <span className="text-white">Premium Commerce.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
                            Flux is India’s first credit-led marketplace connecting high-intent customers with exclusive offline retailers. We are rewriting the rules of local transactions.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white border-l-4 border-flux-primary pl-4">How the Flux Ecosystem Works</h3>
                                <p className="text-gray-400 text-lg">
                                    We operate on a <strong className="text-white">Managed Marketplace Model</strong>, ensuring trust, speed, and liquidity for both buyers and sellers.
                                </p>
                            </div>

                            <ul className="space-y-8">
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">01. The Flux Network (Partner Onboarding)</h4>
                                    <p className="text-gray-400">Premium offline retailers join Flux as Verified Fulfillment Partners. We curate only the best service providers (Electronics, Wellness, Luxury) to ensure quality.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">02. Frictionless Checkout (The Transaction)</h4>
                                    <p className="text-gray-400">Customers purchase goods and services directly via the Flux App. We act as the <strong className="text-flux-primary">Merchant of Record (MoR)</strong>, handling the complexity of credit-card processing, security, and tokenization so the user doesn't have to.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">03. Instant Fulfillment (The Service)</h4>
                                    <p className="text-gray-400">Once the transaction is verified on our platform, the Partner provides the product or service instantly. No waiting, no friction.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">04. Partner Settlements (The Payout)</h4>
                                    <p className="text-gray-400">We handle the financial heavy lifting. Flux consolidates daily sales and disburses Vendor Payouts to our partners on a <strong className="text-white">T+2 cycle</strong>, ensuring their cash flow never stops.</p>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-32"
                        >
                            {/* Ecosystem Visual - Connected Flow */}
                            <div className="relative aspect-square rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center">
                                {/* Background Grid */}
                                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

                                {/* Connection Lines SVG Layer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                                    {/* Line: Customer to Flux */}
                                    <motion.path
                                        d="M300 120 L300 250"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                    />
                                    {/* Lines: Flux to Partners */}
                                    <motion.path
                                        d="M300 350 L150 450"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                    />
                                    <motion.path
                                        d="M300 350 L300 450"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                    />
                                    <motion.path
                                        d="M300 350 L450 450"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                    />

                                    {/* Moving Particles (Simulating Transactions) */}
                                    <circle r="4" fill="#fff" filter="url(#glow)">
                                        <animateMotion
                                            dur="2s"
                                            repeatCount="indefinite"
                                            path="M300 120 L300 250"
                                            keyPoints="0;1"
                                            keyTimes="0;1"
                                            calcMode="linear"
                                        />
                                    </circle>
                                    <circle r="3" fill="#6366f1">
                                        <animateMotion
                                            dur="2s"
                                            begin="1s"
                                            repeatCount="indefinite"
                                            path="M300 350 L150 450"
                                            keyPoints="0;1"
                                            keyTimes="0;1"
                                            calcMode="linear"
                                        />
                                    </circle>
                                    <circle r="3" fill="#6366f1">
                                        <animateMotion
                                            dur="2s"
                                            begin="1.5s"
                                            repeatCount="indefinite"
                                            path="M300 350 L300 450"
                                            keyPoints="0;1"
                                            keyTimes="0;1"
                                            calcMode="linear"
                                        />
                                    </circle>
                                    <circle r="3" fill="#6366f1">
                                        <animateMotion
                                            dur="2s"
                                            begin="1.2s"
                                            repeatCount="indefinite"
                                            path="M300 350 L450 450"
                                            keyPoints="0;1"
                                            keyTimes="0;1"
                                            calcMode="linear"
                                        />
                                    </circle>

                                    <defs>
                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                                            <stop offset="50%" stopColor="rgba(99, 102, 241, 1)" />
                                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                </svg>

                                {/* Nodes Container (CSS Grid/Flex) - Properly positioned relative to SVG coordinates */}
                                {/* Assuming SVG ViewBox is ~ 600x600 based on paths roughly? Actually wrapper is responsive. 
                                    I will use absolute percentages to position the HTML nodes to match the SVG paths.
                                    Center is 50%.
                                */}
                                <div className="absolute inset-0 z-10 w-full h-full">
                                    {/* 1. Customer Node (Top Center) */}
                                    <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-gray-300 tracking-wider bg-black/50 px-2 py-1 rounded">CUSTOMERS</span>
                                    </div>

                                    {/* 2. Flux Central Engine (Center) */}
                                    <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="relative">
                                            {/* Pulse Effects */}
                                            <div className="absolute inset-0 bg-flux-primary/30 rounded-full animate-ping"></div>
                                            <div className="w-24 h-24 bg-black border-2 border-flux-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] z-20 relative">
                                                <div className="text-center">
                                                    <span className="block text-2xl font-black text-white tracking-widest">FLUX</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Partner Nodes (Bottom) */}
                                    <div className="absolute bottom-[15%] w-full flex justify-between px-16">
                                        {/* Partner 1 */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-mono">ELECTRONICS</span>
                                        </div>
                                        {/* Partner 2 */}
                                        <div className="flex flex-col items-center gap-2 translate-y-8">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-mono">LUXURY</span>
                                        </div>
                                        {/* Partner 3 */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-mono">WELLNESS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 font-header">PRICING & PLANS</h2>
                        <p className="text-xl text-gray-400">Transparent pricing for our partner network.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                        {/* Standard Plan */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-flux-primary/50 transition-all group flex flex-col"
                        >
                            <div className="absolute top-0 right-0 px-4 py-1 bg-gray-700 text-xs font-bold rounded-bl-xl text-white">WAITLISTED</div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Standard Access</h3>
                                <div className="mb-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">₹0</span>
                                    <span className="text-gray-400">/ year</span>
                                </div>
                                <ul className="space-y-4 text-gray-300 mb-8">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="font-bold text-white">One-Time Setup: ₹999</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Flat 2% MDR
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Standard T+2 Settlement
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Email Support
                                    </li>
                                </ul>
                            </div>
                            <button
                                disabled
                                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 font-bold transition-all mt-auto cursor-not-allowed text-gray-500"
                            >
                                Currently Full
                            </button>
                        </motion.div>

                        {/* Flux Black (Enterprise) */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-flux-primary/30 shadow-[0_0_50px_-20px_rgba(99,102,241,0.3)] transition-all overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 px-4 py-1 bg-flux-primary text-xs font-bold rounded-bl-xl text-white">INVITE ONLY</div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    Flux Black
                                </h3>
                                <div className="mb-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">₹4,999</span>
                                    <span className="text-gray-400">/ year</span>
                                </div>
                                <ul className="space-y-4 text-gray-300 mb-8">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="font-bold text-white">Setup Fee: ₹499 (With Code)</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="font-bold text-white">Reduced Custom MDR</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Priority Payouts
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Dedicated Account Manager
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => window.location.href = '/early-access'}
                                className="w-full py-4 rounded-xl bg-flux-primary hover:bg-flux-primary/90 text-white font-bold shadow-lg transition-all mt-auto"
                            >
                                I Have a Code
                            </button>
                        </motion.div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            Standard Access is currently waitlisted. <a href="/early-access" className="text-flux-primary hover:text-white underline">Use an Invite Code to skip the queue.</a>
                        </p>
                    </div>
                </div>
            </section>



            {/* FOOTER */}
            {/* FOOTER */}
            <footer className="mt-auto flex flex-col items-center gap-4 w-full pb-6 z-10 px-4 pt-12 border-t border-white/5 bg-black">
                {/* Legal Entity Information */}
                <div className="text-center text-xs text-gray-400 space-y-1 max-w-2xl">
                    <p><strong className="text-gray-300">Legal Entity:</strong> Singh Global Ventures | <strong className="text-gray-300">Brand:</strong> Pay With Flux</p>
                    <p><strong className="text-gray-300">Proprietor:</strong> Bandana Singh</p>
                    <p className="text-[11px]">202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207</p>
                    <p className="text-[11px]"><strong className="text-gray-300">Contact:</strong> paywithfluxtech@gmail.com | +91 9507510924</p>
                </div>

                <p className="text-gray-500 text-sm">© 2026 Flux Payment Technologies. All rights reserved.</p>


                <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-xs text-white/40">
                    <button onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors">Contact Us</button>
                    <span className="hidden sm:inline">•</span>
                    <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                    <span className="hidden sm:inline">•</span>
                    <button onClick={() => setActiveModal('refund')} className="hover:text-white transition-colors">Cancellations & Refunds</button>
                    <span className="hidden sm:inline">•</span>
                    <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
                </div>
            </footer>

            {/* Modal Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
                                <h2 className="text-lg font-bold text-white capitalize">
                                    {activeModal === 'refund' ? 'Cancellations & Refunds' :
                                        activeModal === 'terms' ? 'Terms & Conditions' :
                                            activeModal === 'privacy' ? 'Privacy Policy' : 'Contact Us'}
                                </h2>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto text-sm text-white/70 leading-relaxed font-light space-y-4 text-left">
                                {LEGAL_CONTENT[activeModal]}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const LEGAL_CONTENT = {
    contact: (
        <>
            <p>You may contact us using the information below:</p>
            <div className="space-y-2 mt-4">
                <p><strong className="text-white/90">Legal Entity Name:</strong> Singh Global Ventures</p>
                <p><strong className="text-white/90">Brand / DBA Name:</strong> Pay With Flux</p>
                <p><strong className="text-white/90">Proprietor:</strong> Bandana Singh</p>
                <p><strong className="text-white/90">Registered Address:</strong> 202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207</p>
                <p><strong className="text-white/90">Operational Address:</strong> 202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207</p>
                <p><strong className="text-white/90">Telephone No:</strong> 9507510924</p>
                <p><strong className="text-white/90">E-Mail ID:</strong> paywithfluxtech@gmail.com</p>
            </div>
        </>
    ),
    privacy: (
        <>
            <p>This privacy policy sets out how Flux uses and protects any information that you give Flux when you visit their website and/or agree to purchase from them. Flux is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement. Flux may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.</p>
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Name</li>
                <li>Contact information including email address</li>
                <li>Demographic information such as postcode, preferences and interests, if required</li>
                <li>Other information relevant to customer surveys and/or offers</li>
            </ul>
            <p><strong>What we do with the information we gather</strong></p>
            <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Internal record keeping.</li>
                <li>We may use the information to improve our products and services.</li>
                <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail.</li>
                <li>We may use the information to customise the website according to your interests.</li>
            </ul>
            <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
            <p><strong>How we use cookies</strong></p>
            <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
            <p>We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
            <p>Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
            <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</p>
            <p><strong>Controlling your personal information</strong></p>
            <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at paywithfluxtech@gmail.com</li>
            </ul>
            <p>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
            <p>If you believe that any information we are holding on you is incorrect or incomplete, please write to 202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207 . or contact us at 9507510924 or paywithfluxtech@gmail.com as soon as possible. We will promptly correct any information found to be incorrect.</p>
        </>
    ),
    refund: (
        <>
            <p>Flux believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Cancellations will be considered only if the request is made within 3-5 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
                <li>Flux does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
                <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 3-5 days of receipt of the products.</li>
                <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 3-5 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
                <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
                <li>In case of any Refunds approved by the Flux, it’ll take 3-5 days for the refund to be processed to the end customer.</li>
            </ul>
        </>
    ),
    terms: (
        <>
            <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Flux, whose registered/operational office is 202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207 . "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
            <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>The content of the pages of this website is subject to change without notice.</li>
                <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
                <li>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
                <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
                <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without Flux’s prior written consent.</li>
                <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</li>
                <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
            </ul>
        </>
    )
}
