'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { useEffect, useState } from 'react';
import { Shield, Plus, Hammer, MapPin, Clock, ChevronRight, AlertCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';

export default function ProjectsPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchProjects = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .or(`client_id.eq.${user.id},builder_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setProjects(data as Project[]);
            }
            setLoading(false);
        };

        fetchProjects();
    }, [user]);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008751]"></div></div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">You're not logged in</h1>
                    <p className="text-slate-500 mb-8">Please log in to view and manage your construction projects.</p>
                    <Link href="/login" className="btn-primary w-full inline-block">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-outfit mb-2">My Projects</h1>
                        <p className="text-slate-500">Manage and track your active construction sites.</p>
                    </div>
                    {profile?.role === 'client' && (
                        <Link href="/project/new" className="btn-primary flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Start New Project
                        </Link>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#008751] outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none">
                            <option>All Statuses</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Open</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 h-64 animate-pulse">
                                <div className="h-6 w-2/3 bg-slate-100 rounded-full mb-4" />
                                <div className="h-4 w-1/2 bg-slate-100 rounded-full mb-8" />
                                <div className="h-10 w-full bg-slate-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer border-b-4 border-b-transparent hover:border-b-[#008751]"
                                onClick={() => window.location.href = `/project/${project.id}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                        project.status === 'in_progress' ? "bg-blue-50 text-blue-600" :
                                            project.status === 'completed' ? "bg-green-50 text-green-600" :
                                                project.status === 'open' ? "bg-[#008751]/10 text-[#008751]" :
                                                    "bg-slate-50 text-slate-500"
                                    )}>
                                        {project.status.replace('_', ' ')}
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{formatCurrency(project.budget, project.currency)}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-[#008751] transition-colors">{project.title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4" /> {project.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Clock className="w-4 h-4" /> Started {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Hammer className="w-4 h-4" /> {project.builder_id ? "Pro Builder Assigned" : "Awaiting Builder"}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex -space-x-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-[#008751] flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Dashboard <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                            <Hammer className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">No projects yet</h2>
                        <p className="text-slate-500 mb-10 max-w-lg mx-auto">
                            {profile?.role === 'client'
                                ? "You haven't posted any projects yet. Start building your dream project today."
                                : "You haven't been assigned to any projects yet. Make sure your profile is verified to attract clients."}
                        </p>
                        {profile?.role === 'client' && (
                            <Link href="/project/new" className="btn-primary px-12 py-5 text-lg">
                                Post Your First Project
                            </Link>
                        )}
                        {profile?.role === 'builder' && (
                            <Link href="/builders" className="btn-outline px-12 py-5 text-lg">
                                Improve Your Profile
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

