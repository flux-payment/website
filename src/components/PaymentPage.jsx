import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store, Coffee, Utensils, Cake, Wine, ShoppingBag,
    Shirt, Scissors, Dumbbell, Car, Book, Activity, Plane,
    Smartphone, Gamepad2, CreditCard, Briefcase, Star, Zap,
    CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

const getSmartAvatarProps = (name) => {
    const lowerName = name.toLowerCase();
    let Icon = Store;
    let gradient = "from-violet-500 to-purple-600";

    // 1. Determine Icon based on keywords
    if (lowerName.includes('coffee') || lowerName.includes('cafe') || lowerName.includes('tea')) Icon = Coffee;
    else if (lowerName.includes('food') || lowerName.includes('burger') || lowerName.includes('pizza') || lowerName.includes('restaurant') || lowerName.includes('kitchen')) Icon = Utensils;
    else if (lowerName.includes('cake') || lowerName.includes('bakery') || lowerName.includes('sweet')) Icon = Cake;
    else if (lowerName.includes('bar') || lowerName.includes('pub') || lowerName.includes('wine')) Icon = Wine;
    else if (lowerName.includes('mart') || lowerName.includes('store') || lowerName.includes('shop') || lowerName.includes('retail')) Icon = ShoppingBag;
    else if (lowerName.includes('fashion') || lowerName.includes('cloth') || lowerName.includes('wear') || lowerName.includes('boutique')) Icon = Shirt;
    else if (lowerName.includes('tech') || lowerName.includes('mobile') || lowerName.includes('gadget') || lowerName.includes('repair')) Icon = Smartphone;
    else if (lowerName.includes('game') || lowerName.includes('gaming') || lowerName.includes('arcade')) Icon = Gamepad2;
    else if (lowerName.includes('salon') || lowerName.includes('barber') || lowerName.includes('hair') || lowerName.includes('beauty')) Icon = Scissors;
    else if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('crossfit') || lowerName.includes('yoga')) Icon = Dumbbell;
    else if (lowerName.includes('car') || lowerName.includes('auto') || lowerName.includes('garage') || lowerName.includes('mechanic')) Icon = Car;
    else if (lowerName.includes('book') || lowerName.includes('stationery')) Icon = Book;
    else if (lowerName.includes('pharmacy') || lowerName.includes('med') || lowerName.includes('clinic') || lowerName.includes('dr')) Icon = Activity;
    else if (lowerName.includes('travel') || lowerName.includes('trip') || lowerName.includes('flight') || lowerName.includes('tour')) Icon = Plane;
    else if (lowerName.includes('finance') || lowerName.includes('bank') || lowerName.includes('invest')) Icon = CreditCard;
    else if (lowerName.includes('consult') || lowerName.includes('service') || lowerName.includes('agency')) Icon = Briefcase;
    else if (lowerName.includes('electric') || lowerName.includes('power')) Icon = Zap;

    // 2. Determine Gradient deterministically based on name hash
    const gradients = [
        "from-indigo-500 to-violet-600",
        "from-pink-500 to-rose-600",
        "from-emerald-500 to-teal-600",
        "from-amber-500 to-orange-600",
        "from-blue-500 to-cyan-600",
        "from-fuchsia-500 to-purple-600",
        "from-red-500 to-pink-600",
        "from-cyan-500 to-blue-600"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % gradients.length;
    gradient = gradients[index];

    return { Icon, gradient };
};

const MerchantAvatar = ({ name }) => {
    const { Icon, gradient } = useMemo(() => getSmartAvatarProps(name), [name]);

    return (
        <div className="relative group">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative z-10"
            >
                <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-[2rem] flex items-center justify-center shadow-2xl shadow-black/50 ring-4 ring-white/10 relative overflow-hidden transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 translate-z-0`}>

                    {/* Animated Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                    {/* Abstract Shapes/Blobs */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full blur-xl"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-4 -left-4 w-16 h-16 bg-black/10 rounded-full blur-xl"
                    />

                    {/* Main Icon */}
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        <Icon className="w-9 h-9 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10" strokeWidth={2} />
                    </motion.div>

                    {/* Glossy Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'skewX(-20deg) translateX(-150%)', animation: 'shine 3s infinite' }} />
                </div>
            </motion.div>

            {/* Background Glow - Simplified for performance */}
            <div className={`absolute inset-0 -z-10 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-40`} />
        </div>
    );
};

export default function PaymentPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [merchant, setMerchant] = useState(null);
    const [amount, setAmount] = useState('');
    const [contact, setContact] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isAmountLocked, setIsAmountLocked] = useState(false);

    // Validation states
    const [amountError, setAmountError] = useState('');
    const [contactError, setContactError] = useState('');
    const [touched, setTouched] = useState({ amount: false, contact: false, name: false });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const qr = params.get('qr');
        const sig = params.get('sig');
        const merchantCode = params.get('m');
        const amt = params.get('amount') || params.get('a') || params.get('am');

        if (merchantCode) {
            // New Unsigned Flow
            fetchMerchantInfoByCode(merchantCode, amt);
        } else if (qr && sig) {
            // Legacy Signed Flow
            fetchMerchantInfo(qr, sig);
        } else {
            setError("Invalid payment link. Please scan the QR code to pay.");
            setLoading(false);
        }
    }, []);

    const fetchMerchantInfoByCode = async (code, amt) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.get(`${backendUrl}/pay/info`, {
                params: { m: code, amount: amt },
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                }
            });

            if (!data || !data.merchant_name) {
                console.error("Invalid merchant data received:", data);
                throw new Error("Invalid merchant data received from server.");
            }

            setMerchant(data);
            if (data.amount > 0) {
                setAmount((data.amount / 100).toString());
                setIsAmountLocked(true);
            } else if (amt) {
                // If backend didn't return amount but url had it, set it manually
                setAmount((parseFloat(amt) / 100).toString());
                setIsAmountLocked(true);
            }
        } catch (err) {
            console.error(err);
            setError("Merchant not found or server error.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMerchantInfo = async (qr, sig) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.get(`${backendUrl}/pay/info`, {
                params: { qr, sig },
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                }
            });

            if (!data || !data.merchant_name) {
                console.error("Invalid merchant data received:", data);
                throw new Error("Invalid merchant data received from server.");
            }

            setMerchant(data);
            if (data.amount > 0) {
                setAmount((data.amount / 100).toString());
            }
        } catch (err) {
            console.error(err);
            setError("This payment link is invalid, expired, or the server is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    // Validation functions
    const validateAmount = (val) => {
        if (!val || val.trim() === '') {
            return 'Amount is required';
        }
        const numVal = parseFloat(val);
        if (isNaN(numVal) || numVal <= 0) {
            return 'Enter a valid amount greater than ₹0';
        }
        if (numVal > 1000000) {
            return 'Amount cannot exceed ₹10,00,000';
        }
        return '';
    };

    const validateContact = (val) => {
        if (!val || val.trim() === '') {
            return 'Mobile number is required';
        }
        if (!/^\d{10}$/.test(val)) {
            return 'Enter a valid 10-digit mobile number';
        }
        return '';
    };

    // Handle amount change with validation
    const handleAmountChange = useCallback((e) => {
        const val = e.target.value;
        setAmount(val);
        if (touched.amount) {
            setAmountError(validateAmount(val));
        }
    }, [touched.amount]);

    // Handle contact change with validation
    const handleContactChange = useCallback((e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setContact(val);
        if (touched.contact) {
            setContactError(validateContact(val));
        }
    }, [touched.contact]);

    // Handle blur events
    const handleAmountBlur = useCallback(() => {
        setTouched(prev => ({ ...prev, amount: true }));
        setAmountError(validateAmount(amount));
    }, [amount]);

    const handleContactBlur = useCallback(() => {
        setTouched(prev => ({ ...prev, contact: true }));
        setContactError(validateContact(contact));
    }, [contact]);

    const handlePay = async () => {
        // First mark all fields as touched
        setTouched({ amount: true, contact: true, name: true });

        // Then validate on next tick to ensure touched state is updated
        setTimeout(() => {
            const amtErr = validateAmount(amount);
            const cntErr = validateContact(contact);

            setAmountError(amtErr);
            setContactError(cntErr);

            if (amtErr || cntErr) {
                // Focus on first error field for better UX
                if (amtErr) {
                    document.querySelector('input[type="number"]')?.focus();
                } else if (cntErr) {
                    document.querySelector('input[type="tel"]')?.focus();
                }
                return;
            }

            // Only proceed with payment if no errors
            proceedWithPayment();
        }, 0);
    };

    const proceedWithPayment = async () => {

        setSubmitting(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const rzpKey = import.meta.env.VITE_RAZORPAY_KEY;
            const payAmount = parseFloat(amount) * 100;

            // Create Razorpay order first (required for netbanking and other payment methods)
            const orderResponse = await axios.post(`${backendUrl}/orders`, {
                user_id: "GUEST", // Guest user for web payments
                amount: payAmount,
                currency: merchant.currency || "INR",
                receipt: `receipt_${Date.now()}`,
                notes: {
                    type: "merchant_pay",
                    merchant_id: merchant.merchant_id,
                    user_name: name || "Guest",
                    contact: contact
                }
            });

            const orderId = orderResponse.data.razorpay_order_id;

            const options = {
                key: rzpKey,
                amount: payAmount,
                currency: merchant.currency || "INR",
                name: merchant.merchant_name,
                description: `Payment to ${merchant.merchant_name}`,
                order_id: orderId, // Required for netbanking and other payment methods
                prefill: {
                    contact: contact,
                    name: name
                },
                notes: {
                    type: "merchant_pay",
                    merchant_id: merchant.merchant_id,
                    user_name: name || "Guest"
                },
                handler: async function (response) {
                    try {
                        await axios.post(`${backendUrl}/pay/process`, {
                            payment_id: response.razorpay_payment_id,
                            merchant_id: merchant.merchant_id,
                            amount: payAmount,
                            description: "Web QR Payment"
                        });
                        setSuccess(true);
                    } catch (e) {
                        alert("Payment verification failed, but your money is safe.");
                        console.error(e);
                        setSubmitting(false);
                    }
                },
                theme: {
                    color: "#8b5cf6"
                },
                modal: {
                    backdropclose: false,
                    escape: false,
                    ondismiss: () => setSubmitting(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert(response.error.description);
                setSubmitting(false);
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong, please try again after sometime.");
            setSubmitting(false);
        }
    };

    const ErrorState = ({ message }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm p-8 bg-zinc-900/90 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-2xl"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <AlertCircle className="w-8 h-8 text-red-500" />
            </motion.div>
            <h2 className="text-xl font-header font-bold text-white mb-2">Invalid Link</h2>
            <p className="text-gray-400 text-sm">{message}</p>
        </motion.div>
    );

    const SuccessState = () => (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-zinc-900/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 ring-4 ring-green-500/20"
            >
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-header font-bold text-white mb-2"
            >
                Paid ₹{amount}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 mb-8"
            >
                to {merchant.merchant_name}
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 bg-black/40 rounded-xl mb-6 border border-white/5"
            >
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transaction Status</p>
                <p className="text-green-400 font-bold flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    SUCCESSFUL
                </p>
            </motion.div>
            <p className="text-xs text-gray-500">You can safely close this window.</p>
        </motion.div>
    );

    const isFormValid = !amountError && !contactError && amount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-violet-950/20 flex flex-col items-center p-4 relative overflow-hidden selection:bg-violet-500/30 selection:text-violet-200 touch-action-manipulation">
            {/* Animated Background Glows - Optimized for Android */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.2, 0.3]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-20%] left-[-10%] will-change-transform w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.25, 0.3, 0.25]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-20%] right-[-10%] will-change-transform w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
            />

            {/* Center accent glow - Less intensive */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none opacity-20" />

            <div className="w-full max-w-md flex flex-col items-center relative z-10 py-4 md:py-6 gap-4">



                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 gap-4"
                        >
                            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                            <p className="text-white/40 text-sm font-medium animate-pulse tracking-wide">SECURE LINK</p>
                        </motion.div>
                    ) : error ? (
                        <ErrorState message={error} key="error" />
                    ) : success ? (
                        <SuccessState key="success" />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative ring-1 ring-white/5"
                        >
                            {/* Merchant Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-b from-white/10 to-transparent px-5 pt-5 pb-4 flex flex-col items-center text-center"
                            >
                                <div className="flex justify-center mb-3">
                                    <MerchantAvatar name={merchant.merchant_name} />
                                </div>
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl font-header font-bold text-white leading-tight mb-2 tracking-tight"
                                >
                                    {merchant.merchant_name}
                                </motion.h2>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20"
                                >
                                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Verified Merchant</span>
                                </motion.div>
                            </motion.div>

                            <div className="p-5 space-y-4">
                                {/* Amount Input Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`bg-black/20 rounded-2xl p-5 border transition-all duration-300 ${touched.amount && amountError
                                        ? 'border-red-500/50 bg-red-500/5'
                                        : touched.amount && !amountError
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : 'border-white/5 focus-within:border-violet-500/50 focus-within:bg-black/40'
                                        } group`}
                                >
                                    <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 text-center transition-colors ${touched.amount && amountError
                                        ? 'text-red-400'
                                        : 'text-gray-500 group-focus-within:text-violet-400'
                                        }`}>
                                        Amount to Pay <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative flex items-center justify-center">
                                        <span className="text-3xl font-light text-gray-600 mr-1 mb-1">₹</span>
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            onBlur={handleAmountBlur}
                                            placeholder="0"
                                            disabled={isAmountLocked}
                                            className={`w-full bg-transparent border-none p-0 text-5xl font-header font-bold text-white placeholder-gray-800 text-center focus:outline-none focus:ring-0 ${isAmountLocked ? 'opacity-80 cursor-not-allowed' : ''}`}
                                        />
                                        {touched.amount && !amountError && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2"
                                            >
                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {touched.amount && amountError && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                    x: [0, -10, 10, -10, 10, 0]
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ x: { duration: 0.4 } }}
                                                className="flex items-center gap-2 mt-3 text-red-400 text-xs font-medium"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                <span>{amountError}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Details Section */}
                                <div className="space-y-3">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-2"
                                    >
                                        <label className={`text-[10px] uppercase ml-3 font-bold tracking-widest transition-colors ${touched.contact && contactError ? 'text-red-400' : 'text-gray-500'
                                            }`}>
                                            Your Mobile <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`relative group border rounded-xl transition-all duration-300 ${touched.contact && contactError
                                            ? 'border-red-500/50 bg-red-500/5'
                                            : touched.contact && !contactError
                                                ? 'border-green-500/50 bg-green-500/5'
                                                : 'border-white/10 bg-white/5 focus-within:border-violet-500/50 focus-within:bg-white/10'
                                            }`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-mono text-sm">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={contact}
                                                onChange={handleContactChange}
                                                onBlur={handleContactBlur}
                                                placeholder="99999 99999"
                                                className="w-full bg-transparent border-none py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-0 font-mono tracking-wide text-sm"
                                            />
                                            {touched.contact && !contactError && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {touched.contact && contactError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: 'auto',
                                                        x: [0, -10, 10, -10, 10, 0]
                                                    }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ x: { duration: 0.4 } }}
                                                    className="flex items-center gap-2 ml-3 text-red-400 text-xs font-medium"
                                                >
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{contactError}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[10px] text-gray-500 uppercase ml-3 font-bold tracking-widest">
                                            Your Name <span className="text-gray-700 normal-case tracking-normal font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm"
                                        />
                                    </motion.div>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePay}
                                    disabled={submitting}
                                    className={`w-full relative overflow-hidden group py-3.5 rounded-xl shadow-lg transition-all duration-300 ${submitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'shadow-violet-900/20 hover:shadow-violet-900/40'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-500 group-hover:to-indigo-500 transition-colors duration-300"></div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-300"></div>

                                    <span className="relative z-10 font-header font-bold text-lg flex items-center justify-center gap-2 text-white tracking-wide">
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>PROCESSING...</span>
                                            </>
                                        ) : (
                                            <>
                                                PAY ₹{amount || '0'}
                                                <svg className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
