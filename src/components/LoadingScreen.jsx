import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import fluxLogo from '../assets/flux_logo.png';

export default function HeroHeartbeat() {
    const { scrollYProgress } = useScroll();
    const scrollRange = [0, 0.3];

    // Vertical positioning - move higher to match Navbar
    const heroY = useTransform(scrollYProgress, scrollRange, ["50vh", "15px"]); // Changed 24px to 15px

    // Scale - same for both
    const uniqueScale = useTransform(scrollYProgress, scrollRange, [1, 0.15]);

    // Opacity - Fade out completely by the time it settles, letting Navbar take over
    const containerOpacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]);

    // Logo opacity - keeps existing logic but bound by container opacity
    const logoOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

    // Heartbeat
    const [showHeartbeat, setShowHeartbeat] = useState(true);
    useEffect(() => {
        // Force scroll to top on mount to ensure animation starts from beginning
        window.scrollTo(0, 0);

        const unsubscribe = scrollYProgress.on("change", (v) => {
            setShowHeartbeat(v < 0.05);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* TEXT - Perfectly Centered */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    y: heroY,
                    x: "-50%", // Always centered
                    scale: uniqueScale,
                    opacity: containerOpacity,
                    originX: 0.5,
                    originY: 0.5,
                    willChange: 'transform',
                }}
            >
                <h1
                    className={`text-[20vw] font-black tracking-tighter text-white leading-none font-header select-none whitespace-nowrap ${showHeartbeat ? 'animate-heartbeat' : ''
                        }`}
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitFontSmoothing: 'antialiased',
                    }}
                >
                    FLUX
                </h1>

                {/* LOGO - Absolute positioned relative to the TEXT container */}
                {/* This ensures it moves/scales exactly with the text */}
                <motion.img
                    src={fluxLogo}
                    alt="Flux Logo"
                    style={{
                        position: 'absolute',
                        top: '50%', // Center vertically relative to text
                        right: '100%', // Position to the LEFT of the text
                        y: '-50%', // Center vertically anchor
                        x: -20, // Small gap
                        opacity: logoOpacity,
                    }}
                    className="w-[16vw] h-[16vw] object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                />
            </motion.div>
        </div>
    );
}
