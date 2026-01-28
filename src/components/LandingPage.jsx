import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroHeartbeat from './LoadingScreen';
import FlyingCards from './FlyingCards';

export default function LandingPage() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [activeModal, setActiveModal] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Mock submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real scenario, we would use axios.post here
            // await axios.post('https://razorpay-wallet-backend.onrender.com/api/merchants', formData);
            // Since we don't have the exact API contract, we'll simulate success for the demo.

            setStatus('success');
            setFormData({ businessName: '', contactPerson: '', email: '', phone: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-black text-white selection:bg-flux-primary selection:text-white overflow-hidden">

            {/* HERO SECTION */}
            <section className="relative h-[220vh]" id="home">
                {/* The Hero/Header Logic encapsulated here (Fixed Position) */}
                <HeroHeartbeat />

                {/* Flying Cards Animation */}
                <div className="relative z-20 bg-black">
                    <FlyingCards title="ACCEPT PAYMENTS EFFORTLESSLY" />
                </div>

                <div className="absolute bottom-32 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pointer-events-auto"
                    >
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-flux-primary hover:bg-flux-primary/80 text-white font-bold rounded-full text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
                        >
                            View Services & Pricing
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* SEPARATOR GRADIENT */}
            <div className="h-32 bg-gradient-to-b from-black to-zinc-950 pointer-events-none" />

            {/* ABOUT SECTION - Premium Commerce OS */}
            <section id="about" className="py-24 px-6 bg-zinc-950 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-20 space-y-4"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-header leading-tight">
                            The Operating System for <br />
                            <span className="text-white">Premium Commerce.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
                            Flux is India’s first credit-led marketplace connecting high-intent customers with exclusive offline retailers. We are rewriting the rules of local transactions.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white border-l-4 border-flux-primary pl-4">How the Flux Ecosystem Works</h3>
                                <p className="text-gray-400 text-lg">
                                    We operate on a <strong className="text-white">Managed Marketplace Model</strong>, ensuring trust, speed, and liquidity for both buyers and sellers.
                                </p>
                            </div>

                            <ul className="space-y-8">
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">01. The Flux Network (Partner Onboarding)</h4>
                                    <p className="text-gray-400">Premium offline retailers join Flux as Verified Fulfillment Partners. We curate only the best service providers (Electronics, Wellness, Luxury) to ensure quality.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">02. Frictionless Checkout (The Transaction)</h4>
                                    <p className="text-gray-400">Customers purchase goods and services directly via the Flux App. We act as the <strong className="text-flux-primary">Merchant of Record (MoR)</strong>, handling the complexity of credit-card processing, security, and tokenization so the user doesn't have to.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">03. Instant Fulfillment (The Service)</h4>
                                    <p className="text-gray-400">Once the transaction is verified on our platform, the Partner provides the product or service instantly. No waiting, no friction.</p>
                                </li>
                                <li className="relative pl-8 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                    <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-flux-primary ring-4 ring-black" />
                                    <h4 className="text-lg font-bold text-white mb-2">04. Partner Settlements (The Payout)</h4>
                                    <p className="text-gray-400">We handle the financial heavy lifting. Flux consolidates daily sales and disburses Vendor Payouts to our partners on a <strong className="text-white">T+1 cycle</strong>, ensuring their cash flow never stops.</p>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-32"
                        >
                            {/* Abstract Visual of the Ecosystem */}
                            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
                                <div className="relative z-10 w-3/4 h-3/4 flex flex-col justify-between">
                                    {/* Buyers */}
                                    <div className="flex justify-center">
                                        <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold animate-pulse">
                                            High-Intent Customers
                                        </div>
                                    </div>

                                    {/* Central Engine */}
                                    <div className="flex-1 flex items-center justify-center my-8">
                                        <div className="w-40 h-40 bg-flux-primary/20 rounded-full border border-flux-primary/50 flex items-center justify-center relative shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-white">FLUX</div>
                                                <div className="text-xs text-flux-primary font-bold tracking-widest">ECOSYSTEM</div>
                                            </div>
                                            {/* Orbiting dots */}
                                            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/20" />
                                        </div>
                                    </div>

                                    {/* Partners */}
                                    <div className="flex justify-between w-full px-4">
                                        <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-white/10 text-xs text-gray-400">Electronics</div>
                                        <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-white/10 text-xs text-gray-400">Luxury</div>
                                        <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-white/10 text-xs text-gray-400">Wellness</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 font-header">PRICING & PLANS</h2>
                        <p className="text-xl text-gray-400">Transparent pricing for our partner network.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Standard Plan */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-flux-primary/50 transition-all group flex flex-col"
                        >
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Standard Access</h3>
                                <div className="mb-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">₹0</span>
                                    <span className="text-gray-400">/ month</span>
                                </div>
                                <ul className="space-y-4 text-gray-300 mb-8">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Standard MDR Transaction Fee
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        T+1 Days Settlement
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Email Support
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all mt-auto">
                                Get Started
                            </button>
                        </motion.div>

                        {/* Flux Black (Enterprise) */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-flux-primary/30 shadow-[0_0_50px_-20px_rgba(99,102,241,0.3)] transition-all overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 px-4 py-1 bg-flux-primary text-xs font-bold rounded-bl-xl text-white">RECOMMENDED</div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    Flux Black <span className="text-xs px-2 py-1 bg-white/10 rounded border border-white/20 font-normal">ENTERPRISE</span>
                                </h3>
                                <div className="mb-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">₹4,999</span>
                                    <span className="text-gray-400">/ year</span>
                                </div>
                                <ul className="space-y-4 text-gray-300 mb-8">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="font-bold text-white">Custom Rates</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Priority Payouts
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-flux-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Dedicated Key Manager
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-4 rounded-xl bg-flux-primary hover:bg-flux-primary/90 text-white font-bold shadow-lg transition-all mt-auto">
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-24 px-6 bg-zinc-950">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black mb-4 font-header">PARTNER WITH US</h2>
                            <p className="text-gray-400">Join the revolution in offline digital payments.</p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                                <p className="text-gray-400">Our team will contact you shortly to onboard your business.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-flux-primary hover:text-white transition-colors text-sm font-semibold"
                                >
                                    Submit another response
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Business Name</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Name of your business"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Contact Person</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Business Email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-flux-primary focus:ring-1 focus:ring-flux-primary outline-none transition-all"
                                            placeholder="Business Phone Number"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 mt-8 bg-gradient-to-r from-flux-primary to-purple-600 hover:from-flux-primary/90 hover:to-purple-600/90 text-white font-bold rounded-xl shadow-lg shadow-flux-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-black text-center text-gray-500 text-sm">
                <p>© 2026 Flux Payment Technologies. All rights reserved.</p>
                <p className="mt-2 text-gray-600">
                    <a href="mailto:paywithfluxtech@gmail.com" className="hover:text-flux-primary transition-colors">paywithfluxtech@gmail.com</a>
                </p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                </div>
            </footer>
        </div>
    );
}

const LEGAL_CONTENT = {
    contact: (
        <>
            <p>You may contact us using the information below:</p>
            <div className="space-y-2 mt-4">
                <p><strong className="text-white/90">Merchant Legal entity name:</strong> Flux</p>
                <p><strong className="text-white/90">Registered Address:</strong> 406, C Wing, Nilgiri Apartment, Manohar Nagar Bamandaya Pada, Marol Mumbai MAHARASHTRA 400072</p>
                <p><strong className="text-white/90">Operational Address:</strong> 406, C Wing, Nilgiri Apartment, Manohar Nagar Bamandaya Pada, Marol Mumbai MAHARASHTRA 400072</p>
                <p><strong className="text-white/90">Telephone No:</strong> 9507510924</p>
                <p><strong className="text-white/90">E-Mail ID:</strong> paywithfluxtech@gmail.com</p>
            </div>
        </>
    ),
    privacy: (
        <>
            <p>This privacy policy sets out how Flux uses and protects any information that you give Flux when you visit their website and/or agree to purchase from them. Flux is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement. Flux may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.</p>
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Name</li>
                <li>Contact information including email address</li>
                <li>Demographic information such as postcode, preferences and interests, if required</li>
                <li>Other information relevant to customer surveys and/or offers</li>
            </ul>
            <p><strong>What we do with the information we gather</strong></p>
            <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Internal record keeping.</li>
                <li>We may use the information to improve our products and services.</li>
                <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail.</li>
                <li>We may use the information to customise the website according to your interests.</li>
            </ul>
            <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
            <p><strong>How we use cookies</strong></p>
            <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
            <p>We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
            <p>Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
            <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</p>
            <p><strong>Controlling your personal information</strong></p>
            <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at paywithfluxtech@gmail.com</li>
            </ul>
            <p>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
            <p>If you believe that any information we are holding on you is incorrect or incomplete, please write to 406, C Wing, Nilgiri Apartment, Manohar Nagar Bamandaya Pada, Marol Mumbai MAHARASHTRA 400072 . or contact us at 9507510924 or paywithfluxtech@gmail.com as soon as possible. We will promptly correct any information found to be incorrect.</p>
        </>
    ),
    refund: (
        <>
            <p>Flux believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Cancellations will be considered only if the request is made within 3-5 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
                <li>Flux does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
                <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 3-5 days of receipt of the products.</li>
                <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 3-5 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
                <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
                <li>In case of any Refunds approved by the Flux, it’ll take 3-5 days for the refund to be processed to the end customer.</li>
            </ul>
        </>
    ),
    terms: (
        <>
            <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Flux, whose registered/operational office is 406, C Wing, Nilgiri Apartment, Manohar Nagar Bamandaya Pada, Marol Mumbai MAHARASHTRA 400072 . "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
            <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>The content of the pages of this website is subject to change without notice.</li>
                <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
                <li>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
                <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
                <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without Flux’s prior written consent.</li>
                <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</li>
                <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
            </ul>
        </>
    )
}
