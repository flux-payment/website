import React from 'react';


export default function TermsPage() {

    return (
        <div className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div
                        onClick={() => window.location.href = '/'}
                        className="text-gray-400 hover:text-white mb-4 transition-colors inline-block cursor-pointer"
                    >
                        ← Back to Home
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
                    <p className="text-gray-400">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                    <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Flux, whose registered/operational office is 202, O Wing, Savannah, Baif Road, Wagholi, Pune, Maharashtra - 412207 . "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
                    <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>The content of the pages of this website is subject to change without notice.</li>
                        <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                        <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
                        <li>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                        <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
                        <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
                        <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without Flux's prior written consent.</li>
                        <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</li>
                        <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
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
