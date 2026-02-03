import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed the prompt in this session
        const hasSeenPrompt = sessionStorage.getItem('pwa_install_prompt_seen');

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the default browser install prompt
            e.preventDefault();

            // Store the event for later use
            setDeferredPrompt(e);

            // Show our custom prompt if user hasn't seen it this session
            if (!hasSeenPrompt) {
                setTimeout(() => {
                    setShowPrompt(true);
                }, 2000); // Show after 2 seconds on dashboard
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the browser's install prompt
        deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);

        // Clear the prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
        sessionStorage.setItem('pwa_install_prompt_seen', 'true');
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa_install_prompt_seen', 'true');
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-20 left-4 right-4 z-[200] max-w-md mx-auto"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-[2px] rounded-2xl shadow-2xl">
                        <div className="bg-black rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                                    <Download className="w-6 h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white font-['Plus_Jakarta_Sans'] mb-1">
                                        Install Flux Dashboard
                                    </h3>
                                    <p className="text-sm text-gray-300 font-['Plus_Jakarta_Sans'] mb-3">
                                        Add to your home screen for quick access
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleInstall}
                                            className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors font-['Plus_Jakarta_Sans']"
                                        >
                                            Install App
                                        </button>
                                        <button
                                            onClick={handleDismiss}
                                            className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg text-sm hover:bg-white/20 transition-colors font-['Plus_Jakarta_Sans']"
                                        >
                                            Not Now
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDismiss}
                                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallPrompt;
