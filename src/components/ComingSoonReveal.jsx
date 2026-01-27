import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';

export default function ComingSoonReveal() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const rzpKey = import.meta.env.VITE_RAZORPAY_KEY;

            if (!backendUrl || !rzpKey) {
                alert("Configuration missing. Please set VITE_BACKEND_URL and VITE_RAZORPAY_KEY.");
                setLoading(false);
                return;
            }

            // 1. Create Order
            const { data: orderData } = await axios.post(`${backendUrl}/orders`, {
                amount: 100, // ₹1.00
                currency: "INR",
                notes: { type: "early_access" }
            });

            // 2. Open Razorpay
            const options = {
                key: rzpKey,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Flux Payment",
                description: "Early Access Membership",
                order_id: orderData.razorpay_order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        await axios.post(`${backendUrl}/payments/verify`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert("Welcome to Flux! Early access granted.");
                    } catch (e) {
                        alert("Payment verification failed.");
                        console.error(e);
                    }
                },
                theme: {
                    color: "#7c3aed"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={ref} className="bg-black flex flex-col items-center justify-center py-16">
            <div className="relative px-8 flex flex-col items-center">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-white leading-none text-center"
                >
                    COMING SOON
                </motion.h2>

                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8"
                />

                {/* Join Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    onClick={handleJoin}
                    disabled={loading}
                    className="mt-12 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-purple-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Join Early Access - ₹1"}
                </motion.button>
            </div>
        </div>
    );
}
