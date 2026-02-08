import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
    Store, Share2, Copy, Download, RefreshCw,
    TrendingUp, Wallet, DollarSign, ArrowRight,
    CheckCircle2, Clock, Menu
} from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { merchantApi } from '../../services/merchantApi';
import MerchantDrawer from './MerchantDrawer';
import TransactionDetailsModal from './TransactionDetailsModal';
import PWAInstallPrompt from './PWAInstallPrompt';

const MerchantDashboard = () => {
    const navigate = useNavigate();
    const { merchantId, merchantCode, merchantName, logout } = useMerchantAuth();
    const [qrData, setQrData] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoadingQR, setIsLoadingQR] = useState(false);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [isLoadingTxns, setIsLoadingTxns] = useState(false);
    const [includeAmount, setIncludeAmount] = useState(false);
    const [amount, setAmount] = useState('');
    const [percentageMarkup, setPercentageMarkup] = useState(0);
    const [customPercentage, setCustomPercentage] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const qrCanvasRef = useRef(null);
    const shareCanvasRef = useRef(null);
    const toastTimeoutRef = useRef(null);
    const [toastMessage, setToastMessage] = useState(null);

    // ... (rest of vars)

    const showToast = (msg) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToastMessage(msg);
        toastTimeoutRef.current = setTimeout(() => {
            setToastMessage(null);
            toastTimeoutRef.current = null;
        }, 3000);
    };

    // ... (rest of functions)


    useEffect(() => {
        if (merchantId) {
            fetchQR();
            fetchBalance();
            fetchTransactions();
        }
    }, [merchantId]);

    const fetchQR = async () => {
        setIsLoadingQR(true);
        try {
            let amountInPaise = null;
            if (includeAmount && amount) {
                const baseAmount = parseFloat(amount);
                // Apply markup percentage
                const finalAmount = baseAmount + (baseAmount * percentageMarkup / 100);
                amountInPaise = Math.round(finalAmount * 100);
            }
            const data = await merchantApi.getQR(merchantId, amountInPaise);
            setQrData(data);
        } catch (err) {
            console.error('QR fetch error:', err);
        } finally {
            setIsLoadingQR(false);
        }
    };

    const fetchBalance = async () => {
        setIsLoadingBalance(true);
        try {
            const data = await merchantApi.getBalance(merchantId);
            setBalance(data);
        } catch (err) {
            console.error('Balance fetch error:', err);
        } finally {
            setIsLoadingBalance(false);
        }
    };

    const fetchTransactions = async () => {
        setIsLoadingTxns(true);
        try {
            const data = await merchantApi.getTransactions(merchantId, { limit: 5 });
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error('Transactions fetch error:', err);
        } finally {
            setIsLoadingTxns(false);
        }
    };

    const getQRUrl = () => {
        // Use the new simplified format: /pay?m=MERCHANT_CODE[&amount=...]
        const baseUrl = import.meta.env.VITE_FRONTEND_URL;
        let amountParam = '';
        if (includeAmount && amount) {
            const baseAmount = parseFloat(amount);
            const finalAmount = baseAmount + (baseAmount * percentageMarkup / 100);
            amountParam = `&amount=${Math.round(finalAmount * 100)}`;
        }
        return `${baseUrl}/pay?m=${merchantCode}${amountParam}`;
    };

    // Share QR as beautiful image (matching Flutter app)
    const shareQR = async () => {
        if (!qrData) return;

        try {
            const canvas = shareCanvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const width = 400;
            const height = 600;
            canvas.width = width;
            canvas.height = height;

            // Background gradient (matching Flutter)
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#0C1938');
            gradient.addColorStop(1, '#120826');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Flux Logo & Branding
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Unbounded';
            ctx.textAlign = 'center';
            ctx.fillText('Flux', width / 2, 100);

            ctx.font = '14px Plus Jakarta Sans';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('Changing How You Use Cards', width / 2, 130);

            // White QR container
            const qrSize = 240;
            const qrX = (width - qrSize - 48) / 2;
            const qrY = 170;

            // Draw white rounded rectangle
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(qrX, qrY, qrSize + 48, qrSize + 48, 32);
            ctx.fill();

            // Draw QR code from canvas
            // We need to wait for the image to load if we're drawing it manually, 
            // but since we have the QR rendered in the DOM, we can draw it from there.
            const sourceCanvas = qrCanvasRef.current?.querySelector('canvas');
            if (sourceCanvas) {
                ctx.drawImage(sourceCanvas, qrX + 24, qrY + 24, qrSize, qrSize);
            }

            // Merchant info box
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.roundRect(50, 480, 300, 80, 20);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px Plus Jakarta Sans';
            ctx.textAlign = 'center';
            ctx.fillText(merchantName, width / 2, 515);

            ctx.fillStyle = '#60A5FA';
            ctx.font = '600 13px Plus Jakarta Sans';
            ctx.fillText('Scan to Pay via Flux', width / 2, 540);

            // Convert to blob and share
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'flux-qr.png', { type: 'image/png' });

                // Generate payment link using merchant_id (100002), not UUID
                const baseUrl = 'https://paywithflux.vercel.app/pay';
                const paymentLink = includeAmount && amount
                    ? `${baseUrl}?m=${merchantCode || merchantId}&amount=${amount * 100}`
                    : `${baseUrl}?m=${merchantCode || merchantId}`;

                // Create share text with payment link
                const shareText = includeAmount && amount
                    ? `Pay ${merchantName} ₹${amount} securely using Flux!\n\nOr click here: ${paymentLink}`
                    : `Pay ${merchantName} securely using Flux!\n\nOr click here to pay: ${paymentLink}`;

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        text: shareText,
                    });
                } else {
                    // Fallback: download
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'flux-qr.png';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        } catch (err) {
            console.error('Share error:', err);
            showToast('Failed to share QR');
        }
    };

    const copyQRData = async () => {
        try {
            if (!navigator.clipboard) {
                showToast('Clipboard not available');
                return;
            }

            // Generate link
            const baseUrl = window.location.origin;
            // Use the new simplified format logic here too if needed, but for now generic link is fine?
            // Wait, we want to share the link that the USER uses.
            // The user uses the 'Pay' page.
            // My previous edit to PaymentPage supports 'm'.
            // So link should be: `${baseUrl}/pay?m=${merchantCode}...`
            const shortUrl = `${import.meta.env.VITE_FRONTEND_URL}/pay?m=${merchantCode}${includeAmount && amount ? `&a=${parseFloat(amount) * 100}` : ''}`;

            await navigator.clipboard.writeText(shortUrl);
            showToast('Payment link copied!');
        } catch (err) {
            console.error('Copy error:', err);
            showToast('Failed to copy');
        }
    };

    const downloadQR = () => {
        const canvas = qrCanvasRef.current?.querySelector('canvas');
        if (!canvas) return;

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `flux-qr-${merchantName}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Hidden Canvas for Sharing */}
            <canvas ref={shareCanvasRef} style={{ display: 'none' }} />

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-3 ring-1 ring-white/5"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="font-medium text-sm text-white tracking-wide font-['Plus_Jakarta_Sans']">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header */}
            <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <img src="/flux_logo.png" alt="Flux" className="w-8 h-8 object-contain" />
                            <h1 className="text-2xl font-bold font-['Unbounded'] text-white tracking-wide">Flux</h1>
                        </div>
                        {/* <p className="text-[10px] text-white/70 font-['Unbounded'] tracking-wide">
                            CHANGING HOW YOU USE CARDS
                        </p> */}
                    </div>

                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Merchant Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="glass-card rounded-3xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans']">{merchantName}</h2>
                            <p className="text-sm text-gray-400 font-['Source_Code_Pro']">MID: {merchantCode || merchantId?.substring(0, 8)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* QR Code Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    {/* Amount Toggle */}
                    <div className="glass-card rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold font-['Plus_Jakarta_Sans']">Fixed Amount</span>
                            <button
                                onClick={() => setIncludeAmount(!includeAmount)}
                                className={`relative w-14 h-7 rounded-full transition-colors ${includeAmount ? 'bg-blue-500' : 'bg-gray-700'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${includeAmount ? 'translate-x-7' : ''
                                        }`}
                                />
                            </button>
                        </div>

                        {includeAmount && (
                            <>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-['Plus_Jakarta_Sans'] text-lg"
                                />

                                {/* Percentage Markup Section */}
                                {amount && (
                                    <div className="mt-4 space-y-3">
                                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                                            Add Markup (Optional)
                                        </label>

                                        {/* Quick Select Buttons */}
                                        <div className="flex gap-2">
                                            {[3, 5, 10, 18].map((percent) => (
                                                <button
                                                    key={percent}
                                                    onClick={() => {
                                                        setPercentageMarkup(percent);
                                                        setCustomPercentage('');
                                                    }}
                                                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${percentageMarkup === percent && !customPercentage
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {percent}%
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom Percentage Input */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={customPercentage}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCustomPercentage(val);
                                                    setPercentageMarkup(parseFloat(val) || 0);
                                                }}
                                                placeholder="Custom %"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                                            />
                                            {percentageMarkup > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setPercentageMarkup(0);
                                                        setCustomPercentage('');
                                                    }}
                                                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {/* Amount Breakdown */}
                                        {percentageMarkup > 0 && (
                                            <div className="p-3 bg-white/5 rounded-lg space-y-1 text-sm">
                                                <div className="flex justify-between text-gray-400">
                                                    <span>Base Amount:</span>
                                                    <span>₹{parseFloat(amount).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-blue-400">
                                                    <span>Markup ({percentageMarkup}%):</span>
                                                    <span>₹{(parseFloat(amount) * percentageMarkup / 100).toFixed(2)}</span>
                                                </div>
                                                <div className="h-px bg-white/10 my-1" />
                                                <div className="flex justify-between text-white font-bold">
                                                    <span>Final Amount:</span>
                                                    <span>₹{(parseFloat(amount) + (parseFloat(amount) * percentageMarkup / 100)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            onClick={fetchQR}
                            disabled={isLoadingQR}
                            className="w-full mt-3 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoadingQR ? 'animate-spin' : ''}`} />
                            {qrData ? 'Update QR' : 'Generate QR'}
                        </button>
                    </div>

                    {/* QR Display */}
                    {qrData && (
                        <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-blue-500/20">
                            <div ref={qrCanvasRef} className="flex justify-center">
                                <QRCodeCanvas
                                    value={getQRUrl()}
                                    size={280}
                                    level="H"
                                    imageSettings={{
                                        src: "/flux-logo.png",
                                        height: 50,
                                        width: 50,
                                        excavate: true,
                                    }}
                                />
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-green-700 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                Razorpay Secured
                            </div>
                        </div>
                    )}

                    {/* QR Actions */}
                    {qrData && (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={shareQR}
                                className="py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Share QR
                            </button>
                            <button
                                onClick={copyQRData}
                                className="py-3 bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                            >
                                <Copy className="w-5 h-5" />
                                Copy Data
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Balance Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-3xl p-6"
                >
                    {isLoadingBalance ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
                            <div className="pb-4 sm:pb-0 border-b sm:border-b-0 border-white/10">
                                <div className="text-2xl font-bold text-white">₹{balance?.lifetime_total || 0}</div>
                                <div className="text-sm text-gray-400 mt-1">Total Earned</div>
                            </div>
                            <div className="py-4 sm:py-0 border-b sm:border-b-0 sm:border-x border-white/10">
                                <div className="text-2xl font-bold text-green-400">₹{balance?.unsettled_amount || 0}</div>
                                <div className="text-sm text-gray-400 mt-1">Balance</div>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <div className="text-2xl font-bold text-gray-300">₹{balance?.settled_amount || 0}</div>
                                <div className="text-sm text-gray-400 mt-1">Settled</div>
                            </div>
                        </div>
                    )}
                </motion.div >

                {/* Recent Transactions */}
                < motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 tracking-wide font-['Plus_Jakarta_Sans']">RECENT TRANSACTIONS</h3>
                        <button
                            onClick={() => navigate('/merchant/transactions')}
                            className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors"
                        >
                            View All
                        </button>
                    </div>

                    {
                        isLoadingTxns ? (
                            <div className="glass-card rounded-2xl p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No transactions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {transactions.map((txn, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedTransaction(txn)}
                                        className="glass-card rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === 'captured' ? 'bg-green-500/20' : 'bg-red-500/20'
                                                    }`}>
                                                    <TrendingUp className={`w-5 h-5 ${txn.status === 'captured' ? 'text-green-400' : 'text-red-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{txn.user_name || txn.user_contact || 'Guest'}</div>
                                                    <div className="text-xs text-gray-500 font-['Source_Code_Pro'] flex items-center gap-2">
                                                        <span>{txn.captured_at_formatted || txn.created_at_formatted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold text-lg ${txn.status === 'captured' ? 'text-green-400' : 'text-gray-400'}`}>
                                                    +₹{txn.net_amount || txn.amount}
                                                </div>
                                                <div className="text-xs text-gray-500 font-['Source_Code_Pro'] uppercase mt-0.5">
                                                    {txn.method || 'UPI'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </motion.div >
            </div >

            {/* Drawer */}
            < MerchantDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <TransactionDetailsModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    role="merchant"
                />
            )}

            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
        </div >
    );
};

export default MerchantDashboard;
