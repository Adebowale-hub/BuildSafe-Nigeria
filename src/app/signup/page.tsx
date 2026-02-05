'use client';

import { Shield, Mail, Lock, ArrowRight, User, HardHat } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [role, setRole] = useState<'client' | 'builder'>('client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`.trim(),
                    role: role,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            // In a real app, you might want to show a "Check your email" message
            router.push('/login?message=Check your email to confirm your account');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
            <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-[#008751] rounded-lg flex items-center justify-center text-white">
                    <Shield className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold font-outfit text-[#008751]">BuildSafe</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl"
            >
                <h1 className="text-3xl font-bold font-outfit mb-2">Join BuildSafe</h1>
                <p className="text-slate-500 mb-8">Select your role and start building with confidence.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all text-left group",
                            role === 'client' ? "border-[#008751] bg-[#008751]/5" : "border-slate-100 hover:border-slate-200"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                            role === 'client' ? "bg-[#008751] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        )}>
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">I am a Client</h3>
                        <p className="text-xs text-slate-500 mt-1">Diaspora Nigerian looking to build.</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('builder')}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all text-left group",
                            role === 'builder' ? "border-[#008751] bg-[#008751]/5" : "border-slate-100 hover:border-slate-200"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                            role === 'builder' ? "bg-[#008751] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        )}>
                            <HardHat className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">I am a Builder</h3>
                        <p className="text-xs text-slate-500 mt-1">Verified pro looking for projects.</p>
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Ebuka"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Last Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Obi"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                            />
                        </div>
                    </div>

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
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Minimum 8 characters"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#008751] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#007043] transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : (
                            <>Create {role === 'client' ? 'Client' : 'Builder'} Account <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        Already have an account? <Link href="/login" className="text-[#008751] font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
