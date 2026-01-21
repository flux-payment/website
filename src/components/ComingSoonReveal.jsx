import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ComingSoonReveal() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <div ref={ref} className="bg-black flex items-center justify-center py-16">
            <div className="relative px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-white leading-none text-center"
                >
                    COMING SOON
                </motion.h2>

                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8"
                />
            </div>
        </div>
    );
}
