import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, HelpCircle, Send, CheckCircle2, Clock,
    MessageSquare, ChevronRight, AlertCircle, Plus
} from 'lucide-react';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { merchantApi } from '../../services/merchantApi';

const MerchantSupport = () => {
    const navigate = useNavigate();
    const { merchantId } = useMerchantAuth();
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

    useEffect(() => {
        if (merchantId) {
            fetchTickets();
        }
    }, [merchantId]);

    const fetchTickets = async () => {
        try {
            const data = await merchantApi.getTickets(merchantId);
            setTickets(data.tickets || []);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await merchantApi.createTicket(merchantId, newTicket);
            setNewTicket({ subject: '', message: '' });
            setIsCreating(false);
            fetchTickets();
            alert('Ticket created successfully!');
        } catch (error) {
            console.error('Failed to create ticket:', error);
            alert('Failed to create ticket');
        }
    };

    const TicketCard = ({ ticket }) => {
        const isResolved = ticket.status === 'resolved';
        const date = new Date(ticket.created_at * 1000);

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors mb-4"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${isResolved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                        {isResolved ? 'Resolved' : 'Open'}
                    </div>
                    <span className="text-white/30 text-xs font-['Source_Code_Pro']">
                        {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                    </span>
                </div>

                <h3 className="text-white font-bold font-['Plus_Jakarta_Sans'] mb-2">
                    {ticket.subject}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2">
                    {ticket.message}
                </p>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold font-['Unbounded']">Support</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="p-5 max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold font-['Unbounded'] mb-2">
                        How can we help?
                    </h2>
                    <p className="text-white/50 text-sm">
                        Create a ticket and our team will get back to you within 24 hours.
                    </p>
                </div>

                {/* Create Ticket Form */}
                <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-8 border border-white/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        Raise a Ticket
                    </h3>

                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Subject"
                            value={newTicket.subject}
                            onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                        <textarea
                            placeholder="Describe your issue..."
                            value={newTicket.message}
                            onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Submit Ticket
                        </button>
                    </form>
                </div>

                {/* Tickets List */}
                <div>
                    <h3 className="text-sm font-bold text-white/40 mb-4 tracking-widest font-['Plus_Jakarta_Sans']">
                        PREVIOUS TICKETS
                    </h3>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-8 opacity-50">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-white/20" />
                            <p>No tickets raised yet</p>
                        </div>
                    ) : (
                        <div>
                            {tickets.map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MerchantSupport;
