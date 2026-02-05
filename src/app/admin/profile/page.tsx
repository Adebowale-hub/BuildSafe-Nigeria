'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Shield, Mail, Calendar, Key, UserCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProfile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/backend/login';
    };

    if (!user) return null;

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold font-outfit mb-2">Admin Profile</h1>
                <p className="text-slate-500">Manage your administrative session and security settings.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#008751]/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                            <div className="w-32 h-32 bg-[#008751] rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-[#008751]/20">
                                <UserCircle className="w-16 h-16" />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold font-outfit mb-2">{user.user_metadata?.full_name || 'BuildSafe Admin'}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <span className="bg-[#008751]/10 text-[#008751] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                        Super Admin
                                    </span>
                                    <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                        Verified System Node
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-50">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <Mail className="w-4 h-4 text-[#008751]" /> {user.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Member Since</span>
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <Calendar className="w-4 h-4 text-[#008751]" /> {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Key className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Security Keys</h3>
                            <p className="text-sm text-slate-500 font-medium">Manage your 2FA and hardware authentication tokens.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Access Logs</h3>
                            <p className="text-sm text-slate-500 font-medium">Review recent sign-in attempts and active sessions.</p>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h3>
                        <div className="space-y-4 relative z-10">
                            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all text-left flex items-center justify-between group">
                                Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all text-left flex items-center justify-between group">
                                Enable 2FA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 px-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all text-left flex items-center justify-between group"
                            >
                                Terminate Session <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#008751]/5 border border-[#008751]/10 rounded-[2.5rem] p-8 text-center">
                        <p className="text-xs font-bold text-[#008751] uppercase tracking-widest mb-2">Network Status</p>
                        <p className="text-sm text-slate-600 font-medium">BuildSafe Secure Node • v1.0.4-stable</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
