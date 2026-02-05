'use client';

import { Shield, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6">
            <Link href="/" className="flex items-center gap-2 mb-12">
                <div className="w-12 h-12 bg-[#008751] rounded-xl flex items-center justify-center">
                    <Shield className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-bold font-outfit text-[#008751]">BuildSafe</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl"
            >
                <h1 className="text-3xl font-bold font-outfit mb-2">Welcome Back</h1>
                <p className="text-slate-500 mb-8">Login to manage your construction projects.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-bold mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none transition-all"
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
                        className="w-full bg-[#008751] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#007043] transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : (
                            <>Login <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-500">
                        Don't have an account? <Link href="/signup" className="text-[#008751] font-bold hover:underline flex items-center justify-center gap-1 mt-2">
                            <UserPlus className="w-4 h-4" /> Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>

            <p className="mt-8 text-slate-400 text-xs text-center max-w-xs">
                By logging in, you agree to our Terms of Service and Privacy Policy. Securely managed in Nigeria.
            </p>
        </div>
    );
}
