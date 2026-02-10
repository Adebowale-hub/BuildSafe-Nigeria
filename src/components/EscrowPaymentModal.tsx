'use client';

import { useState } from 'react';
import { Milestone, Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface EscrowPaymentModalProps {
    milestone: Milestone;
    project: Project;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EscrowPaymentModal({ milestone, project, onClose, onSuccess }: EscrowPaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determine payment method based on currency
    const paymentMethod = project.currency === 'NGN' ? 'paystack' : 'stripe';
    const paymentGateway = paymentMethod === 'paystack' ? 'Paystack' : 'Stripe';

    const handleProceedToPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/escrow/fund-milestone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    milestoneId: milestone.id,
                    paymentMethod
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate payment');
            }

            // Redirect to payment gateway
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (err: any) {
            console.error('Payment initialization error:', err);
            setError(err.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#008751]/10 rounded-full blur-3xl -mr-20 -mt-20" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-[#008751]/10 rounded-3xl flex items-center justify-center mb-6">
                            <CreditCard className="w-10 h-10 text-[#008751]" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold mb-2 font-outfit">Fund Milestone</h2>
                        <p className="text-slate-500 mb-8">Secure your funds in escrow until work is completed and approved.</p>

                        {/* Milestone Details */}
                        <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Milestone</p>
                                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Allocation</p>
                                    <p className="text-lg font-bold text-[#008751]">{milestone.percentage_allocation}%</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-600">Amount to Pay</span>
                                    <span className="text-3xl font-bold font-outfit">{formatCurrency(milestone.amount, project.currency)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Info */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <span className="font-bold">Payment via {paymentGateway}</span>
                                {paymentMethod === 'paystack'
                                    ? ' - You\'ll be redirected to complete payment securely with your card or bank transfer.'
                                    : ' - You\'ll be redirected to Stripe\'s secure checkout page.'}
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-4 rounded-2xl font-bold border-2 border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceedToPayment}
                                disabled={loading}
                                className="flex-1 bg-[#008751] text-white py-4 rounded-2xl font-bold hover:bg-[#007043] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Proceed to Pay
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-400">
                                🔒 Secured by {paymentGateway} • Your payment is protected
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
