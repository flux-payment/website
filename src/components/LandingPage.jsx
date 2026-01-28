import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroHeartbeat from './LoadingScreen';
import FlyingCards from './FlyingCards';

export default function LandingPage() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Mock submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real scenario, we would use axios.post here
            // await axios.post('https://razorpay-wallet-backend.onrender.com/api/merchants', formData);
            // Since we don't have the exact API contract, we'll simulate success for the demo.

            setStatus('success');
            setFormData({ businessName: '', contactPerson: '', email: '', phone: '' });
        } catch (error) {
            console.error(error);
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

            {/* ABOUT SECTION - Business Logic */}
            <section id="about" className="py-24 px-6 bg-zinc-950 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-header"
                    >
                        ABOUT FLUX
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8 text-lg text-gray-400 leading-relaxed"
                        >
                            <p>
                                <strong className="text-white">Flux</strong> is a financial technology platform that enables offline retailers to accept digital payments. We act as a <strong className="text-flux-primary">Technology Service Provider (TSP)</strong> connecting merchants to payment aggregators via secure <strong className="text-flux-primary">Card-on-File Tokenization (CoF)</strong>.
                            </p>

                            <div className="pl-6 border-l-2 border-flux-primary space-y-4">
                                <h3 className="text-xl font-bold text-white">How it works:</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-flux-primary mt-1">01.</span>
                                        <span>Merchants register on the Flux Platform.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-flux-primary mt-1">02.</span>
                                        <span>Customers pay using the Flux App or Web Interface.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-flux-primary mt-1">03.</span>
                                        <span>Transactions are processed securely via RBI-compliant payment gateways.</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative h-[400px] rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 flex items-center justify-center overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                            {/* Visual Representation of Flow */}
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm text-sm">Merchant</div>
                                <div className="h-12 w-[1px] bg-gradient-to-b from-white/20 to-flux-primary"></div>
                                <div className="px-8 py-4 bg-flux-primary/20 rounded-xl border border-flux-primary/50 backdrop-blur-md font-bold text-flux-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                    FLUX TSP
                                </div>
                                <div className="h-12 w-[1px] bg-gradient-to-b from-flux-primary to-white/20"></div>
                                <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm text-sm">Payment Aggregator</div>
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
                        <h2 className="text-4xl md:text-6xl font-black mb-6 font-header">PRICING</h2>
                        <p className="text-xl text-gray-400">We offer transparent pricing for our merchant partners.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Standard Plan */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-flux-primary/50 transition-all group"
                        >
                            <h3 className="text-2xl font-bold mb-2">Standard Merchant</h3>
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">₹0.00</span>
                                <span className="text-gray-400">/ setup</span>
                            </div>
                            <ul className="space-y-4 text-gray-300 mb-8">
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Zero Setup Fee
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Standard Settlement (T+1)
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    2% Transaction Fee (MDR)
                                </li>
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all">
                                Get Started
                            </button>
                        </motion.div>

                        {/* Enterprise Plan */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative p-8 rounded-3xl bg-zinc-900 border border-flux-primary/30 shadow-[0_0_50px_-20px_rgba(99,102,241,0.3)] transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 px-4 py-1 bg-flux-primary text-xs font-bold rounded-bl-xl">RECOMMENDED</div>

                            <h3 className="text-2xl font-bold mb-2">Enterprise Partner</h3>
                            <div className="mb-6 flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">₹4,999</span>
                                <span className="text-gray-400">/ year</span>
                            </div>
                            <ul className="space-y-4 text-gray-300 mb-8">
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Instant Settlement
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Dedicated Account Manager
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Analytics Dashboard
                                </li>
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-flux-primary hover:bg-flux-primary/90 text-white font-bold shadow-lg transition-all">
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-24 px-6 bg-zinc-950">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black mb-4 font-header">PARTNER WITH US</h2>
                            <p className="text-gray-400">Join the revolution in offline digital payments.</p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                                <p className="text-gray-400">Our team will contact you shortly to onboard your business.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-flux-primary hover:text-white transition-colors text-sm font-semibold"
                                >
                                    Submit another response
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Business Name</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Flux Enterprises"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Contact Person</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Aditya Singh"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="hello@flux.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 mt-8 bg-gradient-to-r from-flux-primary to-purple-600 hover:from-flux-primary/90 hover:to-purple-600/90 text-white font-bold rounded-xl shadow-lg shadow-flux-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-black text-center text-gray-500 text-sm">
                <p>© 2026 Flux Payment Technologies. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                </div>
            </footer>
        </div>
    );
}
