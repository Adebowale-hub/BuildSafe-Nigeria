'use client';

import { useEffect, useState } from 'react';
import { Users, HardHat, LandPlot, Wallet, ArrowUpRight, ArrowDownRight, Activity, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const recentActivity = [
    { title: 'New Builder Verified', time: '2 hours ago', user: 'Lagos Structural Ltd', type: 'verification' },
    { title: 'Milestone Funded', time: '5 hours ago', user: 'Project #982 (Lekki)', type: 'payment' },
    { title: 'New Project Created', time: 'Yesterday', user: 'Adebowale Joshua', type: 'project' },
    { title: 'Dispute Flagged', time: '2 days ago', user: 'Ibeju-Lekki Site', type: 'alert' },
];

export default function AdminOverview() {
    const [statsData, setStatsData] = useState({ users: 0, builders: 0, projects: 0, escrow: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (!data.error) setStatsData(data);
            } catch (e) {
                console.error("Stats fail", e);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const stats = [
        { name: 'Total Users', value: statsData.users.toLocaleString(), change: '+12%', type: 'increase', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Verified Builders', value: statsData.builders.toLocaleString(), change: '+5%', type: 'increase', icon: HardHat, color: 'text-[#008751]', bg: 'bg-[#008751]/10' },
        { name: 'Active Projects', value: statsData.projects.toLocaleString(), change: '-2%', type: 'decrease', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Escrow Volume', value: formatCurrency(statsData.escrow), change: '+18%', type: 'increase', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-12 text-slate-900">
            <div>
                <h1 className="text-4xl font-bold font-outfit mb-2">Platform Overview</h1>
                <p className="text-slate-500">Real-time health of the BuildSafe Nigeria ecosystem.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className={cn("flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full", stat.type === 'increase' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
                                {stat.type === 'increase' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.name}</h3>
                        <p className="text-3xl font-bold font-outfit">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Activity and Charts Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute right-10 top-10 flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#008751] animate-pulse" />
                        <span className="text-xs font-bold text-slate-400">LIVE FEED</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-8">Recent Activities</h3>
                    <div className="space-y-6">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                                <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-[#008751] transition-colors" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{activity.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{activity.user}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 text-[#008751] font-bold border-2 border-[#008751]/5 rounded-2xl hover:bg-[#008751]/5 transition-all">
                        View Audit Log
                    </button>
                </div>

                <div className="bg-gradient-to-br from-[#008751] to-[#005a36] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#008751]/20">
                    <h3 className="text-2xl font-bold mb-6">Security Health</h3>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2 text-sm font-bold">
                                <span>RLS Enforcement</span>
                                <span>100%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2 text-sm font-bold">
                                <span>Session Health</span>
                                <span>94%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[94%]" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 p-6 bg-white/10 rounded-[2rem] backdrop-blur-sm border border-white/10">
                        <p className="text-sm italic text-white/80">"Systems are stable. Admin Service Role established and active."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline helper for CN to avoid import issues
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
