import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FlyingCards({ title = "COMING SOON" }) {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // COMING SOON and CARDS animate TOGETHER and END together
    const textY = useTransform(scrollYProgress, [0, 1], ["80vh", "60vh"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, 0]); // Fade out by 0.5 (midpoint)

    // CARDS burst OUT from Coming Soon AS IT RISES

    // CARD 1 - Stops mid-flight with tilt (funky)
    const card1Y = useTransform(scrollYProgress, [0, 0.85], ["80vh", "20vh"]); // Moved up from 30vh
    const card1X = useTransform(scrollYProgress, [0, 0.85], ["0vw", "-25vw"]);
    const card1RotateZ = useTransform(scrollYProgress, [0, 0.85], [0, -220]);
    const card1RotateY = useTransform(scrollYProgress, [0, 0.85], [0, 120]);
    const card1RotateX = useTransform(scrollYProgress, [0, 0.85], [0, 60]);
    const card1Opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
    const card1Scale = useTransform(scrollYProgress, [0, 0.4, 0.85], [0.5, 1.2, 1]);

    // CARD 2 - Stops mid-flight with tilt (funky)
    const card2Y = useTransform(scrollYProgress, [0, 0.9], ["80vh", "16vh"]); // Moved up from 26vh
    const card2RotateZ = useTransform(scrollYProgress, [0, 0.9], [0, 200]);
    const card2RotateX = useTransform(scrollYProgress, [0, 0.9], [0, -130]);
    const card2Opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
    const card2Scale = useTransform(scrollYProgress, [0, 0.45, 0.9], [0.5, 1.3, 1.1]);

    // CARD 3 - Stops mid-flight with tilt (funky)
    const card3Y = useTransform(scrollYProgress, [0, 0.87], ["80vh", "20vh"]); // Moved up from 30vh
    const card3X = useTransform(scrollYProgress, [0, 0.87], ["0vw", "25vw"]);
    const card3RotateZ = useTransform(scrollYProgress, [0, 0.87], [0, 250]);
    const card3RotateY = useTransform(scrollYProgress, [0, 0.87], [0, -140]);
    const card3RotateX = useTransform(scrollYProgress, [0, 0.87], [0, -70]);
    const card3Opacity = useTransform(scrollYProgress, [0, 0.22], [0, 1]);
    const card3Scale = useTransform(scrollYProgress, [0, 0.4, 0.87], [0.5, 1.2, 1]);

    return (
        <div ref={containerRef} className="relative h-[220vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-visible">

                {/* 3D Perspective Container */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '2000px' }}>

                    {/* COMING SOON TEXT - Rises and centers properly */}
                    <motion.div
                        style={{
                            opacity: textOpacity,
                            zIndex: 10,
                        }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            style={{
                                y: textY,
                            }}
                            className="text-center px-8"
                        >
                            <h2
                                className="text-[5vw] md:text-[4vw] font-black tracking-tight text-white leading-tight break-words max-w-[90vw]"
                                style={{
                                    textShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 140px rgba(99, 102, 241, 0.7)',
                                }}
                            >
                                {title}
                            </h2>
                            <div
                                className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-6"
                                style={{
                                    boxShadow: '0 0 35px rgba(168, 85, 247, 1)',
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* CARDS - Burst FROM the rising text */}

                    {/* CARD 1 - Purple/Left */}
                    <motion.div
                        style={{
                            y: card1Y,
                            x: card1X,
                            rotateZ: card1RotateZ,
                            rotateY: card1RotateY,
                            rotateX: card1RotateX,
                            opacity: card1Opacity,
                            scale: card1Scale,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 50px 120px -30px rgba(147, 51, 234, 1), 0 0 180px rgba(168, 85, 247, 0.7), inset 0 3px 50px rgba(255, 255, 255, 0.25)',
                            zIndex: 50,
                            willChange: 'transform',
                        }}
                        className="absolute w-40 h-60 bg-gradient-to-br from-purple-600/85 via-purple-700/85 to-purple-900/85 rounded-xl border border-purple-400/60 backdrop-blur-lg"
                    >
                        <div className="p-4">
                            <div className="w-9 h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md"
                                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}
                            />
                        </div>
                    </motion.div>

                    {/* CARD 3 - Blue/Right */}
                    <motion.div
                        style={{
                            y: card3Y,
                            x: card3X,
                            rotateZ: card3RotateZ,
                            rotateY: card3RotateY,
                            rotateX: card3RotateX,
                            opacity: card3Opacity,
                            scale: card3Scale,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 50px 120px -30px rgba(59, 130, 246, 1), 0 0 180px rgba(99, 102, 241, 0.7), inset 0 3px 50px rgba(255, 255, 255, 0.25)',
                            zIndex: 50,
                            willChange: 'transform',
                        }}
                        className="absolute w-40 h-60 bg-gradient-to-br from-blue-600/85 via-blue-700/85 to-blue-900/85 rounded-xl border border-blue-400/60 backdrop-blur-lg"
                    >
                        <div className="p-4">
                            <div className="w-9 h-7 bg-gradient-to-br from-blue-200 to-blue-400 rounded-md"
                                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}
                            />
                        </div>
                    </motion.div>

                    {/* CARD 2 - Dark/Center */}
                    <motion.div
                        style={{
                            y: card2Y,
                            rotateZ: card2RotateZ,
                            rotateX: card2RotateX,
                            opacity: card2Opacity,
                            scale: card2Scale,
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 55px 130px -30px rgba(0, 0, 0, 1), 0 0 200px rgba(255, 255, 255, 0.3), inset 0 3px 50px rgba(255, 255, 255, 0.3)',
                            zIndex: 60,
                            willChange: 'transform',
                        }}
                        className="absolute w-40 h-60 bg-gradient-to-br from-slate-700/95 via-gray-800/95 to-slate-900/95 rounded-xl border border-white/50 backdrop-blur-lg"
                    >
                        <div className="p-4">
                            <div className="w-9 h-7 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md"
                                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
