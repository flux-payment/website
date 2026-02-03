import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ArrowLeft } from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { merchantApi } from '../../services/merchantApi';
import MerchantDrawer from './MerchantDrawer';
import TransactionDetailsModal from './TransactionDetailsModal';

const AllTransactions = () => {
    const navigate = useNavigate();
    const { merchantId } = useMerchantAuth();
    const [transactions, setTransactions] = useState([]);
    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        if (merchantId) {
            fetchAllTransactions();
        }
    }, [merchantId]);

    useEffect(() => {
        if (transactions.length > 0) {
            setGroupedTransactions(groupTransactions(transactions));
        }
    }, [transactions]);

    const fetchAllTransactions = async () => {
        setIsLoading(true);
        try {
            const data = await merchantApi.getTransactions(merchantId, { limit: 100, offset: 0 });
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const groupTransactions = (txns) => {
        if (txns.length === 0) return [];

        const grouped = [];
        let lastHeader = null;

        txns.forEach((tx) => {
            const date = new Date(tx.created_at * 1000);
            const header = getHeaderForDate(date);

            if (lastHeader !== header) {
                grouped.push({ type: 'header', label: header });
                lastHeader = header;
            }
            grouped.push({ type: 'transaction', data: tx });
        });

        return grouped;
    };

    const getHeaderForDate = (date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffTime = today - dateOnly;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return 'Last 7 Days';

        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const TransactionTile = ({ transaction }) => {
        const isSuccess = transaction.status === 'captured' || transaction.status === 'authorized';
        const amount = transaction.net_amount ?? transaction.amount;
        const date = new Date(transaction.created_at * 1000);

        const userName = transaction.user_name || 'Unknown User';
        const cardInfo = `${transaction.card_network || 'Card'} •••• ${transaction.card_last4 || ''}`;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-4 mb-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setSelectedTransaction(transaction)}
            >
                <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                        <div className={`w-5 h-5 ${isSuccess ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {isSuccess ? '↓' : '✕'}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-sm font-['Plus_Jakarta_Sans']">
                            {userName}
                        </h3>
                        <p className="text-white/50 text-xs font-['Source_Code_Pro']">
                            {cardInfo}
                        </p>
                    </div>

                    {/* Amount & Time */}
                    <div className="text-right">
                        <p className={`font-bold font-['Unbounded'] text-sm ${isSuccess ? 'text-green-400' : 'text-red-400'
                            }`}>
                            +₹{amount}
                        </p>
                        <p className="text-white/40 text-[10px] font-['Source_Code_Pro']">
                            {date.getDate()}/{date.getMonth() + 1} {String(date.getHours()).padStart(2, '0')}:{String(date.getMinutes()).padStart(2, '0')}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    const SectionHeader = ({ label }) => (
        <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <p className="text-white/40 text-[10px] font-['Plus_Jakarta_Sans'] font-bold tracking-widest">
                {label.toUpperCase()}
            </p>
            <div className="flex-1 h-px bg-white/10"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0C1938] to-[#120826] text-white">
            {/* Header */}
            <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold font-['Unbounded']">All Transactions</h1>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 pb-20">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : groupedTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-6xl mb-4 opacity-20">📄</div>
                        <p className="text-white/50 font-['Plus_Jakarta_Sans']">No transactions yet</p>
                    </div>
                ) : (
                    <>
                        {groupedTransactions.map((item, index) => (
                            item.type === 'header' ? (
                                <SectionHeader key={`header-${index}`} label={item.label} />
                            ) : (
                                <TransactionTile key={item.data.id || index} transaction={item.data} />
                            )
                        ))}
                    </>
                )}
            </div>

            {/* Drawer */}
            <MerchantDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <TransactionDetailsModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    role="merchant"
                />
            )}
        </div>
    );
};

export default AllTransactions;
