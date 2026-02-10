'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-white rounded-[3rem] p-12 shadow-xl text-center">
                    {/* Cancel Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <XCircle className="w-16 h-16 text-slate-400" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-outfit">Payment Cancelled</h1>
                    <p className="text-xl text-slate-500 mb-8">
                        No worries! Your payment was not processed.
                    </p>

                    {/* Info Box */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
                        <h3 className="font-bold text-slate-900 mb-3">What you can do:</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#008751] mt-0.5">→</span>
                                <span>Return to your project and try funding again</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#008751] mt-0.5">→</span>
                                <span>Contact support if you experienced any issues</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#008751] mt-0.5">→</span>
                                <span>Milestones can be funded anytime you're ready</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/project"
                            className="inline-flex items-center gap-2 bg-[#008751] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#007043] transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Projects
                        </Link>

                        <a
                            href="mailto:support@buildsafe.ng"
                            className="inline-flex items-center gap-2 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Contact Support
                        </a>
                    </div>

                    <p className="text-xs text-slate-400 mt-8">
                        Need help? We're here Monday - Friday, 9am - 5pm WAT
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
