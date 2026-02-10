'use client';

import { useState } from 'react';
import { Milestone } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentReleaseModalProps {
    milestone: Milestone;
    currency: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PaymentReleaseModal({ milestone, currency, onConfirm, onCancel }: PaymentReleaseModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleConfirmRelease = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/escrow/release-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    milestoneId: milestone.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to release payment');
            }

            setSuccess(true);

            // Wait a moment to show success, then callback
            setTimeout(() => {
                onConfirm();
            }, 1500);

        } catch (err: any) {
            console.error('Payment release error:', err);
            setError(err.message || 'Failed to release payment');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2 font-outfit">Payment Released!</h2>
                    <p className="text-slate-500">The builder will receive the payment shortly.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative"
                >
                    {/* Close button */}
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Warning Icon */}
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-amber-600" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold mb-2 font-outfit">Release Payment?</h2>
                    <p className="text-slate-500 mb-8">
                        This action will release the escrow funds to the builder. Make sure you've verified the work quality before proceeding.
                    </p>

                    {/* Milestone Details */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                        <div className="mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Milestone</p>
                            <h3 className="text-xl font-bold">{milestone.title}</h3>
                        </div>

                        {milestone.evidence_urls && milestone.evidence_urls.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence Submitted</p>
                                <div className="flex gap-2">
                                    {milestone.evidence_urls.slice(0, 3).map((url, i) => (
                                        <div key={i} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                                            <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {milestone.evidence_urls.length > 3 && (
                                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                                            +{milestone.evidence_urls.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-slate-200 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-600">Amount to Release</span>
                                <span className="text-3xl font-bold font-outfit text-[#008751]">{formatCurrency(milestone.amount, currency)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-amber-800 font-bold">
                            ⚠️ This action cannot be undone. Once released, the payment will be transferred to the builder.
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
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-4 rounded-2xl font-bold border-2 border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmRelease}
                            disabled={loading}
                            className="flex-1 bg-[#008751] text-white py-4 rounded-2xl font-bold hover:bg-[#007043] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Releasing...
                                </>
                            ) : (
                                'Confirm Release'
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
