'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Fetch role from profiles table instead of metadata
            // This is more reliable if the admin updates roles manually in the DB
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError || profile?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Access Denied: Your account does not have administrator privileges.");
            }

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#008751]/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#008751] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#008751]/40">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold font-outfit text-white mb-2">BuildSafe Admin</h1>
                    <p className="text-slate-400 font-medium">Internal Gateway • Authorized Personal Only</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-6 text-slate-100">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#008751] outline-none transition-all placeholder:text-slate-700"
                            placeholder="admin@buildsafe.ng"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Secure Passkey</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#008751] outline-none transition-all placeholder:text-slate-700"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#008751] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#007043] transition-all transform active:scale-95 shadow-xl shadow-[#008751]/20 disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Login to Control Center"}
                        {!loading && <Lock className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-bold pt-4">
                        <Lock className="w-3 h-3" />
                        <span>256-BIT ENCRYPTION ACTIVE</span>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
