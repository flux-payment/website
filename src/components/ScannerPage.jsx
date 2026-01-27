import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import fluxLogo from '../assets/flux_logo.png';

function ScannerPage() {
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleScan = (detectedCodes) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue;
            setResult(rawValue);

            try {
                // Parse the QR data (expected to be JSON with payload and signature)
                const data = JSON.parse(rawValue);
                if (data && data.payload && data.signature) {
                    // Redirect to payment page with params
                    // Note: signature needs to be encoded if it contains special chars, but let's pass it first
                    // URL: /pay?qr={payload}&sig={signature}
                    const searchParams = new URLSearchParams();
                    searchParams.set('qr', data.payload);
                    searchParams.set('sig', data.signature);

                    // Small delay to show success
                    setTimeout(() => {
                        window.location.href = `/pay?${searchParams.toString()}`;
                    }, 500);
                }
            } catch (e) {
                console.error("Failed to parse QR data:", e);
                // If not JSON, maybe it's a direct URL? 
                // For now, only handling the specific app format.
            }
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    return (
        <div className="relative min-h-screen bg-black text-white font-sans selection:bg-flux-primary selection:text-white flex flex-col items-center pt-12 pb-8 px-4">

            {/* Header Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mb-10"
            >
                <img
                    src={fluxLogo}
                    alt="Flux Logo"
                    className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                />
                <h1 className="text-5xl font-black tracking-tighter text-white font-header">FLUX</h1>
            </motion.div>

            {/* Instruction */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                delay={0.2}
                className="text-lg text-white/80 mb-8 font-medium text-center"
            >
                Scan a Flux QR to pay
            </motion.p>

            {/* Scanner Container */}
            {/* Scanner Container with Gradient Border */}
            {/* Scanner Container with Glowing Gradient Border */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: [
                        "0 0 40px -5px rgba(59, 130, 246, 0.5)",   // Blue
                        "0 0 80px -10px rgba(168, 85, 247, 0.7)",  // Purple
                        "0 0 160px -5px rgba(255, 255, 255, 0.6)", // White - Max distance
                        "0 0 40px -5px rgba(59, 130, 246, 0.5)"    // Loop
                    ]
                }}
                transition={{
                    scale: { delay: 0.3, duration: 0.5 },
                    opacity: { delay: 0.3, duration: 0.5 },
                    boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                className="w-full max-w-sm rounded-[2.1rem] p-[3px] bg-gradient-to-br from-blue-500 via-purple-500 to-white relative aspect-square"
            >
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                    <Scanner
                        onScan={handleScan}
                        onError={handleError}
                        components={{
                            audio: true,
                            onOff: true,
                            torch: true,
                            finder: false
                        }}
                        styles={{
                            container: {
                                width: '100%',
                                height: '100%',
                                borderRadius: '1.5rem'
                            },
                            video: {
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%'
                            }
                        }}
                    />

                    {/* Scanning Line Animation */}
                    <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        className="absolute left-0 w-full h-[2px] bg-flux-primary shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] z-30"
                    />
                </div>
            </motion.div>

            {/* Result Display (Optional) */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 max-w-sm w-full"
                >
                    <p className="text-sm text-white/50 mb-1 uppercase tracking-widest text-xs font-bold">Scanned Data</p>
                    <p className="font-mono text-flux-primary break-all">{result}</p>
                </motion.div>
            )}

            <footer className="fixed bottom-8 left-0 right-0 text-center text-white/20 text-xs pointer-events-none z-50">
                Flux Secure Scanner
            </footer>
        </div>
    );
}

export default ScannerPage;
