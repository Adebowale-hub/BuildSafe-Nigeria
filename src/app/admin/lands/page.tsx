'use client';

import { useState } from 'react';
import { Plus, MapPin, DollarSign, Layout, Pencil, Trash2, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

// Mock listings for building the UI
const initialLands = [
    { id: '1', title: "Lekki Prime Estate", location: "Lekki Phase 2, Lagos", price_per_plot: 45000000, status: 'available', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80' },
    { id: '2', title: "Epe Green Valley", location: "Ketun, Epe, Lagos", price_per_plot: 5000000, status: 'pending', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80' },
];

export default function AdminLandManagement() {
    const [lands, setLands] = useState(initialLands);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-outfit mb-2">Land Catalog</h1>
                    <p className="text-slate-500">Manage properties available for project development.</p>
                </div>
                <button className="bg-[#008751] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-[#008751]/20 hover:scale-105 transition-all active:scale-95">
                    <Plus className="w-5 h-5" /> Add New Property
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lands.map((land, i) => (
                    <motion.div
                        key={land.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col group"
                    >
                        <div className="aspect-[16/10] relative">
                            <img src={land.image} className="w-full h-full object-cover" alt={land.title} />
                            <div className="absolute top-6 left-6">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg",
                                    land.status === 'available' ? 'bg-[#008751]/90 text-white' : 'bg-amber-100/90 text-amber-700'
                                )}>
                                    {land.status}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="w-12 h-12 rounded-full bg-white text-slate-800 flex items-center justify-center hover:scale-110 transition-transform"><Pencil className="w-5 h-5" /></button>
                                <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-bold font-outfit mb-2">{land.title}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                                <MapPin className="w-4 h-4 text-[#008751]" /> {land.location}
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">List Price</span>
                                    <span className="text-lg font-bold text-[#008751]">{formatCurrency(land.price_per_plot)}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Globe className="w-4 h-4 text-slate-300" />
                                    <Lock className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State / Add Placeholder */}
                <button className="border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-[#008751]/20 hover:text-[#008751]/50 transition-all min-h-[400px]">
                    <Plus className="w-12 h-12 mb-4" />
                    <span className="font-bold">List Another Property</span>
                </button>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
