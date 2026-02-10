'use client';

import { Shield, Mail, Lock, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            if (authError.message.includes("Email not confirmed")) {
                setError("Email not confirmed. Please check your inbox for the verification link.");
            } else if (authError.message.includes("Invalid login credentials")) {
                setError("Invalid email or password. Please try again.");
            } else {
                setError(authError.message);
            }
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#008751] via-[#00a362] to-[#008751] p-12 items-center justify-center overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -30, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-lg text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link href="/" className="flex items-center gap-3 mb-12 group">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-8 h-8" />
                            </div>
                            <span className="text-4xl font-bold">BuildSafe</span>
                        </Link>

                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Welcome Back to Your<br />Construction Dashboard
                        </h1>
                        <p className="text-xl text-white/80 mb-12 leading-relaxed">
                            Manage your projects, track milestones, and connect with verified builders from anywhere in the world.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Track project progress in real-time",
                                "Secure escrow payment management",
                                "Direct communication with builders"
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-white/90">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8 justify-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <Shield className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-bold text-gradient">BuildSafe</span>
                    </Link>

                    <div className="card-glass p-8 lg:p-10">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-slate-600 mb-8">Login to manage your construction projects.</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#008751] focus:ring-4 focus:ring-[#008751]/10 outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#008751] focus:ring-4 focus:ring-[#008751]/10 outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#008751] focus:ring-[#008751]" />
                                    Remember me
                                </label>
                                <Link href="#" className="text-[#008751] font-bold hover:underline">Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-gradient py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Logging in...
                                    </div>
                                ) : (
                                    <>
                                        Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                            <p className="text-slate-600">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-[#008751] font-bold hover:underline inline-flex items-center gap-1">
                                    <UserPlus className="w-4 h-4" /> Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 text-slate-400 text-xs text-center">
                        By logging in, you agree to our{' '}
                        <Link href="#" className="underline hover:text-slate-600">Terms of Service</Link>{' '}
                        and{' '}
                        <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
