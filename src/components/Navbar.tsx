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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Handle scroll effect for navbar
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

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

            return () => {
                window.removeEventListener('scroll', handleScroll);
                subscription.unsubscribe();
            };
        } catch (e) {
            console.warn("Supabase not initialized", e);
        }
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            scrolled ? "glass shadow-lg" : "bg-white/60 backdrop-blur-sm",
            "border-b border-slate-200/50"
        )}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <Shield className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-gradient">BuildSafe</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
                    <Link href="/#how-it-works" className="hover:text-[#008751] transition-colors relative group">
                        How it Works
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008751] group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link href="/lands" className="hover:text-[#008751] transition-colors relative group">
                        Find Land
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008751] group-hover:w-full transition-all duration-300" />
                    </Link>
                    <Link href="/builders" className="hover:text-[#008751] transition-colors relative group">
                        Builders
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008751] group-hover:w-full transition-all duration-300" />
                    </Link>

                    {user ? (
                        <>
                            <Link href="/project" className="hover:text-[#008751] transition-colors relative group">
                                My Projects
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008751] group-hover:w-full transition-all duration-300" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-slate-600 hover:text-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                            <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white shadow-md ring-2 ring-white">
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
                <button
                    className="md:hidden text-slate-700 hover:text-[#008751] transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute top-20 left-0 w-full glass border-b border-slate-200/50 shadow-xl transition-all duration-300 ease-out",
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}>
                <div className="container mx-auto p-6 flex flex-col gap-6">
                    <Link
                        href="/#how-it-works"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-[#008751] transition-colors"
                    >
                        How it Works
                    </Link>
                    <Link
                        href="/lands"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-[#008751] transition-colors"
                    >
                        Find Land
                    </Link>
                    <Link
                        href="/builders"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-[#008751] transition-colors"
                    >
                        Builders
                    </Link>
                    {user ? (
                        <>
                            <Link
                                href="/project"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium hover:text-[#008751] transition-colors"
                            >
                                My Projects
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="text-lg font-medium text-left text-red-600 hover:text-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium hover:text-[#008751] transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="btn-primary text-center"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
