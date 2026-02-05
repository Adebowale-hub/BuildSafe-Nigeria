'use client';

import { useEffect, useState } from 'react';
import { HardHat, MapPin, DollarSign, Activity, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ProjectOversight() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch('/api/admin/projects');
                const data = await response.json();
                if (Array.isArray(data)) setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-outfit mb-2">Project Oversight</h1>
                    <p className="text-slate-500">Monitor construction roadmap progress and financial health.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-100 bg-white font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter className="w-5 h-5" /> Filter by Status
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center gap-8 group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                                )}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">Started {new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#008751] transition-colors">{project.title}</h3>
                            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {project.location}</div>
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Budget: {formatCurrency(project.budget)}</div>
                                <div className="flex items-center gap-2 font-bold text-slate-700"><Activity className="w-4 h-4 text-[#008751]" /> Client: {project.profiles?.full_name || 'Anonymous'}</div>
                            </div>
                        </div>

                        <div className="w-full lg:w-48">
                            <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Progress</span>
                                <span className="text-[#008751]">45%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#008751] w-[45%]" />
                            </div>
                        </div>

                        <Link
                            href={`/project/${project.id}`}
                            className="w-full lg:w-auto bg-slate-50 text-slate-800 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#008751] hover:text-white transition-all group/btn"
                        >
                            Review Details <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}

                {projects.length === 0 && !loading && (
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center">
                        <Activity className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-400">No active projects to monitor</h3>
                        <p className="text-slate-400 mt-2 italic">When clients post projects, they will appear here for oversight.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
