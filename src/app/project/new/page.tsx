'use client';

import { useState } from 'react';
import { Shield, ChevronRight, Upload, Calendar, DollarSign, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function NewProject() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const landId = searchParams?.get('land_id');

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('0 - 3 Months');

    const handlePublish = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    {
                        client_id: user.id,
                        land_id: landId || null,
                        title,
                        description,
                        location,
                        budget: parseFloat(budget),
                        status: 'open'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            // Optional: Create default milestones based on typical builds
            if (data) {
                const milestones = [];

                // Add Land Acquisition tasks if land is selected
                if (landId) {
                    milestones.push(
                        { project_id: data.id, title: 'Land Owner Meeting & Verification', order: 1, percentage_allocation: 10, amount: parseFloat(budget) * 0.1, description: 'Meet with landowners and verify documents (C of O, survey papers).' },
                        { project_id: data.id, title: 'Foundational Survey & Clearing', order: 2, percentage_allocation: 10, amount: parseFloat(budget) * 0.1, description: 'Land survey confirmation and site clearing.' }
                    );
                }

                milestones.push(
                    { project_id: data.id, title: 'Foundation & Leveling', order: landId ? 3 : 1, percentage_allocation: 20, amount: parseFloat(budget) * 0.2 },
                    { project_id: data.id, title: 'Superstructure & Roofing', order: landId ? 4 : 2, percentage_allocation: 30, amount: parseFloat(budget) * 0.3 },
                    { project_id: data.id, title: 'Finishing & Fittings', order: landId ? 5 : 3, percentage_allocation: 30, amount: parseFloat(budget) * 0.3 },
                );

                await supabase.from('milestones').insert(milestones);
                router.push(`/project/${data.id}`);
                router.refresh();
            }
        } catch (err) {
            console.error("Error creating project:", err);
            alert("Failed to create project. Please check if you are logged in correctly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <main className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold font-outfit mb-4">Start New Project</h1>
                    <p className="text-slate-600">Tell us what you want to build and we'll help you find the right pros.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all",
                                step >= s ? "bg-[#008751] text-white" : "bg-slate-200 text-slate-500"
                            )}>
                                {s}
                            </div>
                            {s < 3 && <div className="w-20 h-1 bg-slate-200 rounded-full" />}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-xl"
                >
                    {step === 1 && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold mb-6">Basic Information</h3>
                            <div>
                                <label className="block text-sm font-bold mb-3">Project Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 4 Bedroom Bungalow in Lekki"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3">Detailed Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your vision, materials, etc."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-3">Location (State/LGA)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Lagos, Ibeju-Lekki"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-14 pr-5 py-5 rounded-2xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3">Total Budget (NGN)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            placeholder="50,000,000"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="w-full pl-14 pr-5 py-5 rounded-2xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold mb-6">Blueprints & Timeline</h3>
                            <div className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-16 text-center hover:border-[#008751]/20 transition-colors cursor-pointer group">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#008751]/10 transition-colors">
                                    <Upload className="w-10 h-10 text-slate-300 group-hover:text-[#008751] transition-colors" />
                                </div>
                                <p className="font-bold text-xl text-slate-700">Click to upload blueprints</p>
                                <p className="text-slate-400 mt-2">PDF, JPG or PNG (Max 10MB)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3">Desired Timeline</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <select
                                        value={timeline}
                                        onChange={(e) => setTimeline(e.target.value)}
                                        className="w-full pl-14 pr-5 py-5 rounded-2xl border border-slate-200 appearance-none bg-white font-medium"
                                    >
                                        <option>0 - 3 Months</option>
                                        <option>3 - 6 Months</option>
                                        <option>6 - 12 Months</option>
                                        <option>1 Year+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10 text-center py-8">
                            <div className="w-24 h-24 bg-[#008751]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-12 h-12 text-[#008751]" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold font-outfit mb-4">Review & Publish</h3>
                                <p className="text-slate-500 max-w-md mx-auto">Your project will be made available to verified builders. Your funds will stay safe in escrow until milestones are completed.</p>
                            </div>
                            <div className="bg-[#008751]/5 p-8 rounded-[2rem] text-left border border-[#008751]/10 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-[#008751] mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5" /> BuildSafe Guarantee
                                    </h4>
                                    <p className="text-sm text-slate-600 italic">"We verify every builder's NIN and past projects. Your money is only released when you see the results."</p>
                                </div>
                                <Shield className="absolute -bottom-4 -right-4 w-24 h-24 text-[#008751]/5" />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-16 pt-10 border-t border-slate-50">
                        <button
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            className={cn("px-10 py-5 rounded-2xl font-bold transition-all text-slate-400 hover:bg-slate-50 hover:text-slate-600", step === 1 ? "opacity-0 invisible" : "")}
                        >
                            Back
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(s => s + 1) : handlePublish()}
                            disabled={loading || !title || !budget}
                            className="btn-primary px-12 py-5 text-lg min-w-[200px] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (step === 3 ? "Publish Project" : "Continue")}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

