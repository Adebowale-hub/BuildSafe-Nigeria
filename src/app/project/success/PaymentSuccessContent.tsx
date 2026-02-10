'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const reference = searchParams.get('reference');

    useEffect(() => {
        // Optional: Track successful payment
        console.log('Payment successful:', { sessionId, reference });
    }, [sessionId, reference]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#008751]/5 via-white to-blue-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#008751]/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

                    <div className="relative z-10">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-32 h-32 bg-[#008751]/10 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                            >
                                <CheckCircle2 className="w-16 h-16 text-[#008751]" />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold mb-4 font-outfit"
                        >
                            Payment Successful!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-slate-500 mb-8"
                        >
                            Your funds are now safely held in escrow. The builder can proceed with the milestone.
                        </motion.p>

                        {/* Transaction Details */}
                        {(sessionId || reference) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-slate-50 rounded-2xl p-6 mb-8 inline-block"
                            >
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Transaction Reference</p>
                                <p className="text-sm font-mono text-slate-700">{sessionId || reference}</p>
                            </motion.div>
                        )}

                        {/* Next Steps */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left"
                        >
                            <h3 className="font-bold text-blue-900 mb-3">What happens next?</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">✓</span>
                                    <span>Your milestone is now funded and the builder will be notified</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">✓</span>
                                    <span>Funds remain in escrow until you approve the completed work</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">✓</span>
                                    <span>Track progress on your project dashboard</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link
                                href="/project"
                                className="inline-flex items-center gap-2 bg-[#008751] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#007043] transition-all shadow-lg hover:shadow-xl"
                            >
                                View My Projects
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        <p className="text-xs text-slate-400 mt-8">
                            You'll receive a confirmation email shortly
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
