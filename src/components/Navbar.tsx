'use client';

import { Shield, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Get initial session
        try {
            supabase.auth.getSession().then(({ data: { session } }) => {
                setUser(session?.user ?? null);
            }).catch(err => {
                console.warn("Auth check failed (likely placeholder credentials):", err.message);
            });

            // Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
        } catch (e) {
            console.warn("Supabase not initialized", e);
        }
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#008751] rounded-lg flex items-center justify-center text-white">
                        <Shield className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold font-outfit text-[#008751]">BuildSafe</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    <Link href="/#how-it-works" className="hover:text-[#008751] transition-colors">How it Works</Link>
                    <Link href="/lands" className="hover:text-[#008751] transition-colors">Find Land</Link>
                    <Link href="/builders" className="hover:text-[#008751] transition-colors">Builders</Link>

                    {user ? (
                        <>
                            <Link href="/project" className="hover:text-[#008751] transition-colors">My Projects</Link>
                            <button
                                onClick={handleLogout}
                                className="text-slate-600 hover:text-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                            <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center font-bold text-[#008751]">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-[#008751] transition-colors">Login</Link>
                            <Link href="/signup" className="btn-primary">Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-6 shadow-xl transition-all duration-300",
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}>
                <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-[#008751]">How it Works</Link>
                <Link href="/lands" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-[#008751]">Find Land</Link>
                <Link href="/builders" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-[#008751]">Builders</Link>
                {user ? (
                    <>
                        <Link href="/project" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-[#008751]">My Projects</Link>
                        <button
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                            className="text-lg font-medium text-left text-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-[#008751]">Login</Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-center">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
