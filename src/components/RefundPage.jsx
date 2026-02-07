import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RefundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-2">Refund Policy</h1>
                    <p className="text-gray-400">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                    <p>Flux believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Cancellations will be considered only if the request is made within 3-5 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
                        <li>Flux does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
                        <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 3-5 days of receipt of the products.</li>
                        <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 3-5 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
                        <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
                        <li>In case of any Refunds approved by the Flux, it'll take 3-5 days for the refund to be processed to the end customer.</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
                    <p>© 2026 Flux Payment Technologies. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
