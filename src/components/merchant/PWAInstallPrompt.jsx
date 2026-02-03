import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        // Check if already in standalone mode
        const standalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsStandalone(standalone);

        // Check if user has already dismissed the prompt in this session
        const hasSeenPrompt = sessionStorage.getItem('pwa_install_prompt_seen');

        if (standalone || hasSeenPrompt) {
            return; // Don't show if already installed or dismissed
        }

        if (iOS) {
            // For iOS, show manual instructions after a delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 2000);
        } else {
            // For Chrome/Edge/Android, use beforeinstallprompt event
            const handleBeforeInstallPrompt = (e) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setTimeout(() => {
                    setShowPrompt(true);
                }, 2000);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            };
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);

        setDeferredPrompt(null);
        setShowPrompt(false);
        sessionStorage.setItem('pwa_install_prompt_seen', 'true');
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa_install_prompt_seen', 'true');
    };

    if (isStandalone) return null;

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
                                    {isIOS ? (
                                        <Share className="w-6 h-6 text-white" />
                                    ) : (
                                        <Download className="w-6 h-6 text-white" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white font-['Plus_Jakarta_Sans'] mb-1">
                                        Install Flux Dashboard
                                    </h3>

                                    {isIOS ? (
                                        <div className="text-sm text-gray-300 font-['Plus_Jakarta_Sans'] mb-3 space-y-1">
                                            <p>Add to your home screen:</p>
                                            <ol className="list-decimal list-inside space-y-0.5 text-xs">
                                                <li>Tap <Share className="w-3 h-3 inline mx-0.5" /> Share button below</li>
                                                <li>Scroll and tap "Add to Home Screen"</li>
                                                <li>Tap "Add"</li>
                                            </ol>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-300 font-['Plus_Jakarta_Sans'] mb-3">
                                            Add to your home screen for quick access
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        {!isIOS && (
                                            <button
                                                onClick={handleInstall}
                                                className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors font-['Plus_Jakarta_Sans']"
                                            >
                                                Install App
                                            </button>
                                        )}
                                        <button
                                            onClick={handleDismiss}
                                            className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg text-sm hover:bg-white/20 transition-colors font-['Plus_Jakarta_Sans']"
                                        >
                                            {isIOS ? 'Got it' : 'Not Now'}
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
