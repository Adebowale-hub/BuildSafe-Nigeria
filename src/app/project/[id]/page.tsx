'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Project, Milestone } from '@/types';
import { Shield, Clock, CheckCircle2, AlertCircle, FileText, Camera, CreditCard, ChevronRight, MapPin, Hammer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectDashboard({ params }: { params: { id: string } }) {
    const { user, profile, loading: authLoading } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !params.id) return;

        const fetchProjectData = async () => {
            setLoading(true);
            try {
                // Fetch Project
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (projectError) throw projectError;
                setProject(projectData as Project);

                // Fetch Milestones
                const { data: milestoneData, error: milestoneError } = await supabase
                    .from('milestones')
                    .select('*')
                    .eq('project_id', params.id)
                    .order('order', { ascending: true });

                if (milestoneError) throw milestoneError;
                setMilestones(milestoneData as Milestone[]);

            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [user, params.id]);

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008751]"></div></div>;

    if (error || !project) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
                    <p className="text-slate-500 mb-6">{error || "The project you're looking for doesn't exist or you don't have access."}</p>
                    <Link href="/project" className="btn-primary">Back to My Projects</Link>
                </div>
            </div>
        );
    }

    const completedPercentage = milestones.length > 0
        ? Math.round((milestones.filter(m => m.status === 'released').length / milestones.length) * 100)
        : 0;

    const nextMilestone = milestones.find(m => m.status === 'pending' || m.status === 'funded' || m.status === 'submitted');

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <main className="container mx-auto max-w-6xl">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/project" className="text-[#008751] font-bold flex items-center gap-2 hover:underline mb-6 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Projects
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold font-outfit">{project.title}</h1>
                                <span className={cn(
                                    "text-xs font-bold px-3 py-1 rounded-full uppercase",
                                    project.status === 'in_progress' ? "bg-blue-50 text-blue-600" :
                                        project.status === 'completed' ? "bg-green-50 text-green-600" :
                                            "bg-slate-100 text-slate-500"
                                )}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {project.location}</span>
                                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Verified Build</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="btn-outline flex items-center gap-2 py-3">
                                <FileText className="w-5 h-5" /> Report
                            </button>
                            {profile?.role === 'client' && project.status === 'open' && (
                                <button className="btn-primary py-3 px-8">Assign Builder</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Project Budget</p>
                        <h3 className="text-3xl font-bold font-outfit">{formatCurrency(project.budget, project.currency)}</h3>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Construction Progress</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completedPercentage}%` }}
                                    className="h-full bg-[#008751] rounded-full"
                                />
                            </div>
                            <span className="font-bold text-xl">{completedPercentage}%</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Next Step</p>
                        {nextMilestone ? (
                            <div className="flex items-center gap-2 text-[#008751] font-bold text-lg">
                                <Clock className="w-5 h-5" /> {nextMilestone.title}
                            </div>
                        ) : (
                            <div className="text-slate-400 font-bold italic">No active milestones</div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Milestones */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-outfit">Project Roadmap</h2>
                            {profile?.role === 'client' && (
                                <button className="text-[#008751] font-bold text-sm hover:underline">+ Add Milestone</button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex gap-6 items-start">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg",
                                                m.status === 'released' ? "bg-[#008751] text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {m.status === 'released' ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-1">{m.title}</h4>
                                                <p className="text-sm text-slate-500 max-w-md">{m.description || "Specifications pending builder input."}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <StatusBadge status={m.status as any} />
                                            <span className="font-bold text-lg">{formatCurrency(m.amount, project.currency)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                Allocation: {m.percentage_allocation}%
                                            </div>
                                            {m.evidence_urls.length > 0 && (
                                                <div className="flex items-center gap-1 text-[#008751] font-bold text-xs uppercase">
                                                    <Camera className="w-3 h-3" /> {m.evidence_urls.length} Evidence Uploads
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {profile?.role === 'builder' && m.status === 'funded' && (
                                                <button className="bg-[#008751] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                                                    Submit Evidence
                                                </button>
                                            )}
                                            {profile?.role === 'client' && m.status === 'pending' && (
                                                <button className="bg-[#008751] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                                                    Fund Milestone
                                                </button>
                                            )}
                                            {profile?.role === 'client' && m.status === 'submitted' && (
                                                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                                                    Release Payment
                                                </button>
                                            )}
                                            <button className="text-slate-400 p-2 hover:text-[#008751] transition-colors">
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Evidence Panel */}
                        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Camera className="w-6 h-6 text-[#008751]" /> Reality Check
                                </h3>
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="aspect-square bg-slate-800 rounded-2xl border border-white/5 flex items-center justify-center text-slate-600 group hover:border-[#008751]/50 transition-all cursor-pointer">
                                            <Camera className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-[#008751] py-4 rounded-2xl font-bold hover:bg-[#007043] transition-all transform active:scale-95 shadow-xl">
                                    View Full Gallery
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#008751]/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-[#008751]" /> Project Logs
                            </h3>
                            <div className="space-y-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-1 h-auto bg-slate-100 rounded-full" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Payment Released</p>
                                            <p className="text-xs text-slate-500 mb-1">Phase {i} completed by Pro Builder</p>
                                            <p className="text-[10px] text-slate-400">2 days ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ status }: { status: 'pending' | 'funded' | 'submitted' | 'approved' | 'released' }) {
    const styles = {
        pending: "bg-slate-100 text-slate-500",
        funded: "bg-blue-50 text-blue-600 border border-blue-100",
        submitted: "bg-amber-50 text-amber-600 border border-amber-100",
        approved: "bg-green-50 text-green-600 border border-green-100",
        released: "bg-[#008751]/10 text-[#008751] border border-[#008751]/20"
    };

    const labels = {
        pending: "Awaiting Funding",
        funded: "Funded (In Escrow)",
        submitted: "Awaiting Review",
        approved: "Approved",
        released: "Paid to Builder"
    };

    return (
        <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest", styles[status])}>
            {labels[status]}
        </span>
    );
}
