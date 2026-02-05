'use client';

import { Shield, Upload, FileCheck, Landmark, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BuilderVerify() {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="h-16 border-b bg-white flex items-center px-6">
                <Link href="/" className="flex items-center gap-2 font-bold font-outfit text-[#008751]">
                    <Shield className="w-6 h-6" /> BuildSafe
                </Link>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold font-outfit mb-4">Builder Verification</h1>
                    <p className="text-slate-600">Upload your credentials to get the "Verified" badge and start bidding on projects.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-[#008751]/10 rounded-xl flex items-center justify-center mb-6">
                                <Landmark className="text-[#008751] w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Business Registration</h3>
                            <p className="text-sm text-slate-500 mb-6">Upload your CAC (Corporate Affairs Commission) certificate.</p>
                            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:border-[#008751]/20 transition-all cursor-pointer">
                                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <span className="text-sm font-bold text-slate-400">Select PDF or Image</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-[#008751]/10 rounded-xl flex items-center justify-center mb-6">
                                <UserCheck className="text-[#008751] w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Identity Verification</h3>
                            <p className="text-sm text-slate-500 mb-6">Upload a valid government-issued ID (NIN, PVC, or Passport).</p>
                            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:border-[#008751]/20 transition-all cursor-pointer">
                                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <span className="text-sm font-bold text-slate-400">Select PDF or Image</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                            <h3 className="text-2xl font-bold mb-4 relative z-10">Why Verify?</h3>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex items-start gap-3">
                                    <FileCheck className="text-[#008751] w-5 h-5 mt-1" />
                                    <span>Access to high-budget diaspora projects</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FileCheck className="text-[#008751] w-5 h-5 mt-1" />
                                    <span>Lower commission on escrow payouts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FileCheck className="text-[#008751] w-5 h-5 mt-1" />
                                    <span>Priority listing in the Builder Directory</span>
                                </li>
                            </ul>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#008751]/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-4">Company Details</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="CAC Registration Number" className="w-full p-4 rounded-xl border border-slate-200" />
                                <input type="text" placeholder="Tax ID (optional)" className="w-full p-4 rounded-xl border border-slate-200" />
                            </div>
                        </div>

                        <button className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2">
                            Submit for Approval <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
