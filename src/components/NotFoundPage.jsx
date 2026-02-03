import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center max-w-lg"
            >
                <motion.div
                    initial={{ scale: 0.8, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.1
                    }}
                    className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20"
                >
                    <Compass className="w-12 h-12 text-blue-400" />
                </motion.div>

                <h1 className="text-6xl font-bold font-['Unbounded'] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                    404
                </h1>

                <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] mb-4">
                    Uh oh, you wandered to nowhere
                </h2>

                <p className="text-gray-400 mb-8 font-['Plus_Jakarta_Sans']">
                    The page you are looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-gray-200 transition-colors font-['Plus_Jakarta_Sans']"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
