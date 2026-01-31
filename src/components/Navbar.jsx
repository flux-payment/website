import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fluxLogo from '../assets/flux_logo.png';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // height of navbar + breathing room
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`flex items-center gap-3 cursor-pointer group transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <img
                        src={fluxLogo}
                        alt="Flux"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all"
                    />
                    <span className="text-2xl font-black tracking-tighter text-white font-header">FLUX</span>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</button>
                    <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</button>
                    <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">About</button>

                    <button
                        onClick={() => window.location.href = '/early-access'}
                        className="px-5 py-2 rounded-full bg-flux-primary hover:bg-flux-primary/80 border border-flux-primary text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    >
                        UNLOCK EARLY ACCESS
                    </button>
                </div>

                {/* Mobile Menu Button (Simplified for now) */}
                <div className="md:hidden">
                    <button onClick={() => window.location.href = '/early-access'} className="text-sm font-bold text-flux-primary">EARLY ACCESS</button>
                </div>
            </div>
        </motion.nav>
    );
}
