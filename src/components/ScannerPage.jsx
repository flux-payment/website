import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import fluxLogo from '../assets/flux_logo.png';

function ScannerPage() {
    const [result, setResult] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const navigate = useNavigate();

    const handleScan = (detectedCodes) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue;
            setResult(rawValue);

            try {
                // Parse the QR data (expected to be JSON with payload and signature)
                const data = JSON.parse(rawValue);
                if (data && data.payload && data.signature) {
                    // Redirect to payment page with params
                    // Note: signature needs to be encoded if it contains special chars, but let's pass it first
                    // URL: /pay?qr={payload}&sig={signature}
                    const searchParams = new URLSearchParams();
                    searchParams.set('qr', data.payload);
                    searchParams.set('sig', data.signature);

                    // Small delay to show success
                    setTimeout(() => {
                        window.location.href = `/pay?${searchParams.toString()}`;
                    }, 500);
                }
            } catch (e) {
                console.error("Failed to parse QR data:", e);
                // If not JSON, maybe it's a direct URL? 
                // For now, only handling the specific app format.
            }
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    return (
        <div className="relative min-h-screen bg-black text-white font-sans selection:bg-flux-primary selection:text-white flex flex-col items-center pt-12 pb-8 px-4">

            {/* Header Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mb-10"
            >
                <img
                    src={fluxLogo}
                    alt="Flux Logo"
                    className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                />
                <h1 className="text-5xl font-black tracking-tighter text-white font-header">FLUX</h1>
            </motion.div>

            {/* Instruction */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                delay={0.2}
                className="text-lg text-white/80 mb-8 font-medium text-center"
            >
                Scan a Flux QR to pay
            </motion.p>

            {/* Scanner Container */}
            {/* Scanner Container with Gradient Border */}
            {/* Scanner Container with Glowing Gradient Border */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: [
                        "0 0 40px -5px rgba(59, 130, 246, 0.5)",   // Blue
                        "0 0 80px -10px rgba(168, 85, 247, 0.7)",  // Purple
                        "0 0 160px -5px rgba(255, 255, 255, 0.6)", // White - Max distance
                        "0 0 40px -5px rgba(59, 130, 246, 0.5)"    // Loop
                    ]
                }}
                transition={{
                    scale: { delay: 0.3, duration: 0.5 },
                    opacity: { delay: 0.3, duration: 0.5 },
                    boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                className="w-full max-w-sm rounded-[2.1rem] p-[3px] bg-gradient-to-br from-blue-500 via-purple-500 to-white relative aspect-square"
            >
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                    <Scanner
                        onScan={handleScan}
                        onError={handleError}
                        components={{
                            audio: true,
                            onOff: true,
                            torch: true,
                            finder: false
                        }}
                        styles={{
                            container: {
                                width: '100%',
                                height: '100%',
                                borderRadius: '1.5rem'
                            },
                            video: {
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%'
                            }
                        }}
                    />

                    {/* Scanning Line Animation */}
                    <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        className="absolute left-0 w-full h-[2px] bg-flux-primary shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] z-30"
                    />
                </div>
            </motion.div>

            {/* Result Display (Optional) */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 max-w-sm w-full"
                >
                    <p className="text-sm text-white/50 mb-1 uppercase tracking-widest text-xs font-bold">Scanned Data</p>
                    <p className="font-mono text-flux-primary break-all">{result}</p>
                </motion.div>
            )}

            {/* Legal Footer Links */}
            <div className="mt-8 flex justify-center items-center gap-3 text-[10px] sm:text-xs text-white/40 w-full text-center px-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors flex-shrink-0">Contact Us</button>
                <span>•</span>
                <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors flex-shrink-0">Privacy Policy</button>
                <span>•</span>
                <button onClick={() => setActiveModal('refund')} className="hover:text-white transition-colors flex-shrink-0">Cancellations & Refunds</button>
                <span>•</span>
                <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors flex-shrink-0">Terms & Conditions</button>
            </div>

            <footer className="fixed bottom-2 left-0 right-0 text-center text-white/10 text-[10px] pointer-events-none z-10">
                Flux Secure Scanner
            </footer>

            {/* Modal Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
                                <h2 className="text-lg font-bold text-white capitalize">
                                    {activeModal === 'refund' ? 'Cancellations & Refunds' :
                                        activeModal === 'terms' ? 'Terms & Conditions' :
                                            activeModal === 'privacy' ? 'Privacy Policy' : 'Contact Us'}
                                </h2>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto text-sm text-white/70 leading-relaxed font-light space-y-4">
                                {LEGAL_CONTENT[activeModal]}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
                <p><strong className="text-white/90">E-Mail ID:</strong> adityakksingh23@gmail.com</p>
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
                <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at adityakksingh23@gmail.com</li>
            </ul>
            <p>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
            <p>If you believe that any information we are holding on you is incorrect or incomplete, please write to 406, C Wing, Nilgiri Apartment, Manohar Nagar Bamandaya Pada, Marol Mumbai MAHARASHTRA 400072 . or contact us at 9507510924 or adityakksingh23@gmail.com as soon as possible. We will promptly correct any information found to be incorrect.</p>
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

export default ScannerPage;
