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
                    className="relative bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col"
                >
                    {/* Draggable Handle bar (mobile) */}
                    <motion.div
                        className="flex justify-center pt-4 pb-2 sm:hidden cursor-grab active:cursor-grabbing"
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(e, info) => {
                            if (info.offset.y > 100) {
                                onClose();
                            }
                        }}
                    >
                        <div className="w-10 h-1 bg-white/20 rounded-full" />
                    </motion.div>

                    {/* Close button (desktop) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block z-10"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto px-6 pb-6 flex-1">
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
                            {transaction.user_contact && (
                                <DetailRow label="Contact" value={transaction.user_contact} />
                            )}
                            {transaction.user_email && (
                                <DetailRow label="Email" value={transaction.user_email} />
                            )}
                            {transaction.vpa && (
                                <DetailRow label="UPI VPA" value={transaction.vpa} />
                            )}
                            <DetailRow label="Payment ID" value={transaction.razorpay_payment_id || 'N/A'} />
                            {transaction.description && (
                                <DetailRow label="Description" value={transaction.description} />
                            )}
                            <DetailRow label="Order ID" value={transaction.razorpay_order_id || 'N/A'} />
                            <DetailRow
                                label="Method"
                                value={transaction.method ? `${transaction.method.toUpperCase()}${transaction.card_last4 ? ` •••• ${transaction.card_last4}` : ''}` : 'N/A'}
                            />
                        </div>

                        {/* Settlement Breakdown (Merchant Only) */}
                        {role === 'merchant' && (transaction.razorpay_fee != null || settlementData) && (
                            <div className="mt-6">
                                {loadingSettlement ? (
                                    <div className="flex justify-center py-4">
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-white font-bold text-sm font-['Plus_Jakarta_Sans']">
                                                Settlement Breakdown
                                            </h3>
                                            {transaction.estimation_status === 'estimated' && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[9px] font-bold rounded border border-yellow-500/30">
                                                    ESTIMATED
                                                </span>
                                            )}
                                            {transaction.is_confirmed && (
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded border border-green-500/30">
                                                    CONFIRMED
                                                </span>
                                            )}
                                        </div>

                                        <DetailRow
                                            label="Gross Amount"
                                            value={`₹${(settlementData?.amount_collected || transaction.amount)?.toFixed(2)}`}
                                        />

                                        {/* Detailed Fee Breakdown */}
                                        <div className="ml-4 space-y-1 my-2">
                                            {(transaction.razorpay_fee != null || settlementData?.deductions?.bank_fee != null) && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-white/40">Bank Fee</span>
                                                    <span className="text-red-400 font-mono">
                                                        -₹{(settlementData?.deductions?.bank_fee || transaction.razorpay_fee)?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {((settlementData?.deductions?.flux_fee || transaction.flux_fee) > 0) && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-white/40">Flux Fee</span>
                                                    <span className="text-orange-400 font-mono">
                                                        -₹{(settlementData?.deductions?.flux_fee || transaction.flux_fee)?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {((settlementData?.deductions?.gst || transaction.gst) > 0) && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-white/40">GST (18%)</span>
                                                    <span className="text-purple-400 font-mono">
                                                        -₹{(settlementData?.deductions?.gst || transaction.gst)?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-white/10 my-2" />

                                        <DetailRow
                                            label="Net Settlement"
                                            value={`₹${(settlementData?.net_settlement || transaction.net_amount || transaction.amount)?.toFixed(2)}`}
                                        />

                                        {transaction.fee_strategy && (
                                            <p className="text-white/30 text-[10px] mt-2 font-mono">
                                                Strategy: {transaction.fee_strategy}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all font-['Plus_Jakarta_Sans']"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TransactionDetailsModal;
