import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { merchantApi } from '../../services/merchantApi';

const TransactionDetailsModal = ({ transaction, onClose, role = 'merchant' }) => {
    const [settlementData, setSettlementData] = useState(null);
    const [loadingSettlement, setLoadingSettlement] = useState(false);

    useEffect(() => {
        // Fetch settlement breakdown for merchants on captured transactions
        if (role === 'merchant' && transaction?.razorpay_payment_id && transaction?.status === 'captured') {
            setLoadingSettlement(true);
            merchantApi.getSettlementBreakdown(transaction.razorpay_payment_id)
                .then(data => setSettlementData(data))
                .catch(err => console.error('Settlement breakdown error:', err))
                .finally(() => setLoadingSettlement(false));
        }
    }, [transaction, role]);

    if (!transaction) return null;

    const isSuccess = transaction.status === 'captured' || transaction.status === 'authorized';
    const amount = role === 'merchant' && transaction.net_amount != null
        ? transaction.net_amount
        : transaction.amount;

    // Use backend-provided formatted date or fallback to manual formatting
    const formattedDate = transaction.captured_at_formatted || transaction.created_at_formatted || (() => {
        const date = new Date(transaction.created_at * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    })();

    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between items-center py-2">
            <span className="text-white/40 text-sm">{label}</span>
            <span className="text-white/70 text-sm font-medium text-right flex-1 ml-4">{value}</span>
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(e, info) => {
                        if (info.offset.y > 100) {
                            onClose();
                        }
                    }}
                    className="relative bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
                >
                    {/* Handle bar (mobile) */}
                    <div className="flex justify-center mb-6 sm:hidden">
                        <div className="w-10 h-1 bg-white/20 rounded-full" />
                    </div>

                    {/* Close button (desktop) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Icon & Status */}
                    <div className="flex flex-col items-center mb-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                            {isSuccess ? (
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            ) : (
                                <XCircle className="w-12 h-12 text-red-400" />
                            )}
                        </div>

                        <h2 className="text-white text-4xl font-bold font-['Unbounded'] mb-2">
                            ₹{amount}
                        </h2>

                        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {(transaction.status || 'UNKNOWN').toUpperCase()}
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-1">
                        <DetailRow label="Date" value={formattedDate} />
                        {transaction.merchant_name && (
                            <DetailRow label="To" value={transaction.merchant_name} />
                        )}
                        {transaction.user_name && (
                            <DetailRow label="From" value={transaction.user_name} />
                        )}
                        <DetailRow label="Payment ID" value={transaction.razorpay_payment_id || 'N/A'} />
                        <DetailRow label="Order ID" value={transaction.razorpay_order_id || 'N/A'} />
                        <DetailRow
                            label="Method"
                            value={`${(transaction.method || 'card').toUpperCase()} - ${(transaction.card_network || '').toUpperCase()} •••• ${transaction.card_last4 || ''}`}
                        />
                    </div>

                    {/* Settlement Breakdown (Merchant Only) */}
                    {role === 'merchant' && transaction.razorpay_payment_id && (
                        <div className="mt-6">
                            {loadingSettlement ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            ) : settlementData ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <h3 className="text-white font-bold text-sm mb-3 font-['Plus_Jakarta_Sans']">
                                        Settlement Breakdown
                                    </h3>
                                    <DetailRow label="Gross Amount" value={`₹${settlementData.amount_collected}`} />
                                    <DetailRow
                                        label="Reference Fees"
                                        value={`-₹${settlementData.deductions?.total_fee || 0}`}
                                    />
                                    <p className="text-white/30 text-xs ml-4 mb-2">(Bank Fee + GST)</p>
                                    <div className="h-px bg-white/10 my-2" />
                                    <DetailRow label="Net Settlement" value={`₹${settlementData.net_settlement}`} />
                                    <div className="flex justify-end mt-2">
                                        <span className={`text-xs font-bold tracking-wider ${settlementData.status?.toLowerCase() === 'settled'
                                            ? 'text-green-400'
                                            : 'text-orange-400'
                                            }`}>
                                            STATUS: {(settlementData.status || 'PENDING').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all font-['Plus_Jakarta_Sans']"
                    >
                        Close
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TransactionDetailsModal;
