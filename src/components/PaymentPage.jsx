import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store, Coffee, Utensils, Cake, Wine, ShoppingBag,
    Shirt, Scissors, Dumbbell, Car, Book, Activity, Plane,
    Smartphone, Gamepad2, CreditCard, Briefcase, Star, Zap,
    CheckCircle2, AlertCircle, Loader2, Share2, Copy, Check, Download
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
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isAmountLocked, setIsAmountLocked] = useState(false);
    const [txnDetails, setTxnDetails] = useState(null);
    const copiedRef = useRef(false);
    const sharingRef = useRef(false);
    const copyBtnRef = useRef(null);

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
                    contact: contact,
                    description: description || null
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
                        const processRes = await axios.post(`${backendUrl}/pay/process`, {
                            payment_id: response.razorpay_payment_id,
                            merchant_id: merchant.merchant_id,
                            amount: payAmount,
                            description: description || "Web QR Payment"
                        });
                        const methodData = processRes.data || {};
                        setTxnDetails({
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id || orderId,
                            timestamp: new Date(),
                            method: methodData.method || '',
                            vpa: methodData.vpa || '',
                            card: methodData.card || null,
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

    const generateReceiptCanvas = () => {
        const scale = 2;
        const W = 420 * scale;
        const pad = 32 * scale;
        const detailRows = [];

        const txnDate = txnDetails?.timestamp
            ? txnDetails.timestamp.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

        if (txnDetails?.paymentId) detailRows.push(['Payment ID', txnDetails.paymentId]);
        if (txnDetails?.orderId) detailRows.push(['Order ID', txnDetails.orderId]);
        detailRows.push(['Date & Time', txnDate]);
        if (name) detailRows.push(['Paid By', name]);
        if (contact) detailRows.push(['Phone', `+91 ${contact}`]);
        // Payment method
        if (txnDetails?.method === 'upi' && txnDetails?.vpa) {
            detailRows.push(['Method', `UPI • ${txnDetails.vpa}`]);
        } else if (txnDetails?.method === 'card' && txnDetails?.card) {
            const c = txnDetails.card;
            detailRows.push(['Method', `${c.network || 'Card'} •••• ${c.last4}`]);
        } else if (txnDetails?.method === 'netbanking') {
            detailRows.push(['Method', 'Net Banking']);
        } else if (txnDetails?.method === 'wallet') {
            detailRows.push(['Method', 'Wallet']);
        } else if (txnDetails?.method) {
            detailRows.push(['Method', txnDetails.method.toUpperCase()]);
        }
        if (description) detailRows.push(['Note', description]);
        detailRows.push(['Status', '✓ Completed']);

        const rowH = 38 * scale;
        const headerH = 220 * scale;
        const detailHeaderH = 30 * scale;
        const detailPad = 16 * scale;
        const detailBlockH = detailHeaderH + detailRows.length * rowH + detailPad * 2;
        const footerH = 50 * scale;
        const H = headerH + detailBlockH + 24 * scale + footerH + 20 * scale;

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, W, H);

        // Card background with subtle border
        const cardX = 12 * scale, cardY = 12 * scale;
        const cardW = W - 24 * scale, cardH = H - 24 * scale;
        const r = 24 * scale;
        ctx.beginPath();
        ctx.moveTo(cardX + r, cardY);
        ctx.lineTo(cardX + cardW - r, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
        ctx.lineTo(cardX + cardW, cardY + cardH - r);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
        ctx.lineTo(cardX + r, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
        ctx.lineTo(cardX, cardY + r);
        ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
        ctx.closePath();
        ctx.fillStyle = '#18181b';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.15)';
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();

        // ---- Header area ----
        let y = cardY + 36 * scale;
        const cx = W / 2;

        // Green circle with checkmark
        const circR = 32 * scale;
        const grd = ctx.createLinearGradient(cx - circR, y, cx + circR, y + circR * 2);
        grd.addColorStop(0, '#4ade80');
        grd.addColorStop(1, '#059669');
        ctx.beginPath();
        ctx.arc(cx, y + circR, circR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Checkmark
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 14 * scale, y + circR + 2 * scale);
        ctx.lineTo(cx - 4 * scale, y + circR + 12 * scale);
        ctx.lineTo(cx + 16 * scale, y + circR - 10 * scale);
        ctx.stroke();

        y += circR * 2 + 30 * scale;

        // Amount
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${28 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`₹${amount}`, cx, y);
        y += 32 * scale;

        // "paid to Merchant"
        ctx.fillStyle = '#9ca3af';
        ctx.font = `${13 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        ctx.fillText(`paid to `, cx - ctx.measureText(`paid to ${merchant.merchant_name}`).width / 2 + ctx.measureText('paid to ').width / 2, y);
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${13 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        // Actually, let's simplify
        ctx.fillStyle = '#9ca3af';
        ctx.font = `${13 * scale}px -apple-system, sans-serif`;
        const paidText = `paid to ${merchant.merchant_name}`;
        ctx.fillText(paidText, cx, y);
        y += 24 * scale;

        // "✓ SUCCESSFUL" badge
        const badgeText = '✓ SUCCESSFUL';
        ctx.font = `bold ${11 * scale}px -apple-system, sans-serif`;
        const badgeW = ctx.measureText(badgeText).width + 20 * scale;
        const badgeH = 24 * scale;
        const badgeX = cx - badgeW / 2;
        const badgeR = badgeH / 2;
        ctx.beginPath();
        ctx.moveTo(badgeX + badgeR, y);
        ctx.lineTo(badgeX + badgeW - badgeR, y);
        ctx.quadraticCurveTo(badgeX + badgeW, y, badgeX + badgeW, y + badgeR);
        ctx.quadraticCurveTo(badgeX + badgeW, y + badgeH, badgeX + badgeW - badgeR, y + badgeH);
        ctx.lineTo(badgeX + badgeR, y + badgeH);
        ctx.quadraticCurveTo(badgeX, y + badgeH, badgeX, y + badgeR);
        ctx.quadraticCurveTo(badgeX, y, badgeX + badgeR, y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(34,197,94,0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.25)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();
        ctx.fillStyle = '#4ade80';
        ctx.font = `bold ${11 * scale}px -apple-system, sans-serif`;
        ctx.fillText(badgeText, cx, y + badgeH / 2 + 4 * scale);

        y += badgeH + 20 * scale;

        // ---- Detail Card ----
        const detX = pad;
        const detW = W - pad * 2;
        const detR = 14 * scale;
        ctx.beginPath();
        ctx.moveTo(detX + detR, y);
        ctx.lineTo(detX + detW - detR, y);
        ctx.quadraticCurveTo(detX + detW, y, detX + detW, y + detR);
        ctx.lineTo(detX + detW, y + detailBlockH - detR);
        ctx.quadraticCurveTo(detX + detW, y + detailBlockH, detX + detW - detR, y + detailBlockH);
        ctx.lineTo(detX + detR, y + detailBlockH);
        ctx.quadraticCurveTo(detX, y + detailBlockH, detX, y + detailBlockH - detR);
        ctx.lineTo(detX, y + detR);
        ctx.quadraticCurveTo(detX, y, detX + detR, y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();

        // "TRANSACTION DETAILS" header
        ctx.textAlign = 'left';
        ctx.fillStyle = '#6b7280';
        ctx.font = `bold ${9 * scale}px -apple-system, sans-serif`;
        ctx.fillText('TRANSACTION DETAILS', detX + detailPad, y + detailPad + 12 * scale);

        let rowY = y + detailPad + detailHeaderH;
        detailRows.forEach(([label, value], i) => {
            const ry = rowY + i * rowH;
            // Separator line
            if (i > 0) {
                ctx.strokeStyle = 'rgba(255,255,255,0.04)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(detX + detailPad, ry);
                ctx.lineTo(detX + detW - detailPad, ry);
                ctx.stroke();
            }

            // Label
            ctx.textAlign = 'left';
            ctx.fillStyle = '#6b7280';
            ctx.font = `500 ${10 * scale}px -apple-system, sans-serif`;
            ctx.fillText(label.toUpperCase(), detX + detailPad, ry + rowH / 2 + 4 * scale);

            // Value
            ctx.textAlign = 'right';
            if (label === 'Status') {
                ctx.fillStyle = '#4ade80';
                ctx.font = `600 ${12 * scale}px -apple-system, sans-serif`;
            } else {
                ctx.fillStyle = '#e5e7eb';
                ctx.font = (label === 'Payment ID' || label === 'Order ID')
                    ? `${10 * scale}px monospace`
                    : `${12 * scale}px -apple-system, sans-serif`;
            }
            ctx.fillText(value, detX + detW - detailPad, ry + rowH / 2 + 4 * scale);
        });

        y += detailBlockH + 16 * scale;

        // ---- Footer / Watermark ----
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(W - pad, y);
        ctx.stroke();
        y += 20 * scale;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#4b5563';
        ctx.font = `${10 * scale}px -apple-system, sans-serif`;
        ctx.fillText('Powered by Flux • paywithflux.vercel.app', cx, y);

        return canvas;
    };

    const handleShare = async () => {
        if (sharingRef.current) return;
        sharingRef.current = true;

        try {
            const canvas = generateReceiptCanvas();
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], `flux-receipt-${txnDetails?.paymentId || 'payment'}.png`, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Payment Receipt - Flux',
                    files: [file],
                });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            if (e.name !== 'AbortError') console.error('Share failed:', e);
        } finally {
            sharingRef.current = false;
        }
    };

    const handleDownload = async () => {
        if (sharingRef.current) return;
        sharingRef.current = true;

        try {
            const canvas = generateReceiptCanvas();
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `flux-receipt-${txnDetails?.paymentId || 'payment'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error('Download failed:', e);
        } finally {
            sharingRef.current = false;
        }
    };

    const handleCopy = async () => {
        const txnDate = txnDetails?.timestamp
            ? txnDetails.timestamp.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

        const receiptText = [
            `✅ Payment Successful`,
            ``,
            `Amount: ₹${amount}`,
            `To: ${merchant.merchant_name}`,
            name ? `From: ${name}` : null,
            contact ? `Phone: +91 ${contact}` : null,
            txnDetails?.method === 'upi' && txnDetails?.vpa ? `Method: UPI • ${txnDetails.vpa}` :
                txnDetails?.method === 'card' && txnDetails?.card ? `Method: ${txnDetails.card.network || 'Card'} •••• ${txnDetails.card.last4}` :
                    txnDetails?.method ? `Method: ${txnDetails.method.toUpperCase()}` : null,
            `Date: ${txnDate}`,
            description ? `Note: ${description}` : null,
            ``,
            `Payment ID: ${txnDetails?.paymentId || 'N/A'}`,
            `Order ID: ${txnDetails?.orderId || 'N/A'}`,
            `Status: Completed`,
            ``,
            `Powered by Flux • paywithflux.vercel.app`,
        ].filter(Boolean).join('\n');

        try {
            await navigator.clipboard.writeText(receiptText);
            // Show check icon briefly via DOM (no state change = no re-render)
            if (copyBtnRef.current) {
                copyBtnRef.current.dataset.copied = 'true';
                copyBtnRef.current.querySelector('.copy-icon')?.classList.add('hidden');
                copyBtnRef.current.querySelector('.check-icon')?.classList.remove('hidden');
                setTimeout(() => {
                    if (copyBtnRef.current) {
                        copyBtnRef.current.dataset.copied = 'false';
                        copyBtnRef.current.querySelector('.copy-icon')?.classList.remove('hidden');
                        copyBtnRef.current.querySelector('.check-icon')?.classList.add('hidden');
                    }
                }, 2000);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const DetailRow = ({ label, value, mono }) => (
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-b-0">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
            <span className={`text-sm text-gray-200 text-right max-w-[60%] break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        </div>
    );

    const SuccessState = () => {
        const txnDate = txnDetails?.timestamp ? txnDetails.timestamp.toLocaleString('en-IN', {
            dateStyle: 'medium', timeStyle: 'short'
        }) : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-zinc-900/90 backdrop-blur-xl border border-green-500/20 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl"
            >
                {/* Success Header */}
                <div className="p-6 pb-5 text-center bg-gradient-to-b from-green-500/10 to-transparent">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 ring-4 ring-green-500/20"
                    >
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-header font-bold text-white mb-1"
                    >
                        ₹{amount}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-gray-400 text-sm"
                    >
                        paid to <span className="text-white font-semibold">{merchant.merchant_name}</span>
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20"
                    >
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold tracking-wider uppercase">Successful</span>
                    </motion.div>
                </div>

                {/* Transaction Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mx-4 mb-4 p-4 bg-black/40 rounded-2xl border border-white/5"
                >
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Transaction Details</p>
                    {txnDetails?.paymentId && <DetailRow label="Payment ID" value={txnDetails.paymentId} mono />}
                    {txnDetails?.orderId && <DetailRow label="Order ID" value={txnDetails.orderId} mono />}
                    <DetailRow label="Date & Time" value={txnDate} />
                    {name && <DetailRow label="Paid By" value={name} />}
                    {contact && <DetailRow label="Phone" value={`+91 ${contact}`} />}
                    {txnDetails?.method === 'upi' && txnDetails?.vpa && (
                        <DetailRow label="Method" value={`UPI • ${txnDetails.vpa}`} />
                    )}
                    {txnDetails?.method === 'card' && txnDetails?.card && (
                        <DetailRow label="Method" value={`${txnDetails.card.network || 'Card'} •••• ${txnDetails.card.last4}`} />
                    )}
                    {txnDetails?.method && txnDetails.method !== 'upi' && txnDetails.method !== 'card' && (
                        <DetailRow label="Method" value={txnDetails.method === 'netbanking' ? 'Net Banking' : txnDetails.method === 'wallet' ? 'Wallet' : txnDetails.method.toUpperCase()} />
                    )}
                    {description && <DetailRow label="Note" value={description} />}
                    <DetailRow label="Status" value={
                        <span className="text-green-400 font-semibold">✓ Completed</span>
                    } />
                </motion.div>

                <div className="px-4 pb-3 flex gap-3">
                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-all text-sm font-semibold"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Receipt
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        ref={copyBtnRef}
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <Copy className="w-4 h-4 copy-icon" />
                        <Check className="w-4 h-4 text-green-400 check-icon hidden" />
                    </button>
                </div>

                {/* Footer */}
                <div className="px-4 pb-5 text-center">
                    <p className="text-[11px] text-gray-600">This is your payment receipt. You can safely close this page.</p>
                </div>
            </motion.div>
        );
    };

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

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[10px] text-gray-500 uppercase ml-3 font-bold tracking-widest">
                                            Description <span className="text-gray-700 normal-case tracking-normal font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                                            placeholder="e.g., Consultation fee, Product purchase, Service charge"
                                            rows="2"
                                            maxLength="200"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm resize-none"
                                        />
                                        <div className="text-right text-xs text-gray-600">
                                            {description.length}/200
                                        </div>
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
