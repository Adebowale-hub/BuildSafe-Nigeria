'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Land } from '@/types';
import { MapPin, DollarSign, Layout, Calendar, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const DRAKE_LANDS: Partial<Land>[] = [
    { title: "Lekki Prime Estate", location: "Lekki Phase 2, Lagos", price_per_plot: 45000000, description: "Sand-filled land with 100% dry terrain. Ready for immediate construction." },
    { title: "Epe Green Valley", location: "Ketun, Epe, Lagos", price_per_plot: 5000000, description: "Fast developing area. Perfect for long-term investment or residential build." },
    { title: "Ibeju-Lekki Waterfront", location: "Eleko, Lagos", price_per_plot: 12000000, description: "Beautiful waterfront view. Proximity to the Free Trade Zone." },
    { title: "Abuja Heights", location: "Maitama Ext, Abuja", price_per_plot: 85000000, description: "Highly exclusive area with premium security and utility layout." },
];

export default function LandMarketplace() {
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLands = async () => {
            const { data, error } = await supabase.from('lands').select('*');
            if (!error && data && data.length > 0) {
                setLands(data as Land[]);
            } else {
                // Fallback for demo
                setLands(DRAKE_LANDS as Land[]);
            }
            setLoading(false);
        };
        fetchLands();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold font-outfit mb-4">Land Marketplace</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">Foundation of your dream starts here. Browse verified land plots and schedule meetings with owners directly.</p>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-12 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="text" placeholder="Search by location (Lagos, Abuja...)" className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-[#008751] outline-none font-medium" />
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors font-bold text-slate-600">
                            <Filter className="w-5 h-5" /> Filters
                        </button>
                        <select className="px-6 py-4 rounded-2xl border border-slate-100 bg-white font-bold text-slate-600 outline-none">
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lands.map((land, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
                        >
                            <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-2">
                                        <MapPin className="w-4 h-4" /> {land.location}
                                    </div>
                                    <h3 className="text-white text-2xl font-bold font-outfit">{land.title}</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-[#008751]">
                                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400 block mb-1">Price per plot</span>
                                        <span className="text-2xl font-bold font-outfit">{formatCurrency(land.price_per_plot)}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#008751]/5 flex items-center justify-center text-[#008751]">
                                        <Layout className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 italic">"{land.description}"</p>

                                <div className="space-y-3">
                                    <Link
                                        href={`/project/new?land_id=${land.id}`}
                                        className="w-full bg-[#008751] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#007043] transition-all transform active:scale-95 shadow-lg shadow-[#008751]/20"
                                    >
                                        Select this Land <ChevronRight className="w-5 h-5" />
                                    </Link>
                                    <button
                                        className="w-full bg-white text-[#008751] border-2 border-[#008751]/10 py-4 rounded-2xl font-bold hover:bg-[#008751]/5 transition-all flex items-center justify-center gap-2"
                                        onClick={() => alert("Scheduling system coming soon!")}
                                    >
                                        <Calendar className="w-5 h-5" /> Schedule Owner Meeting
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
