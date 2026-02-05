'use client';

import { Shield, MapPin, Star, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { BuilderProfile } from '@/types';
import { cn } from '@/lib/utils';

// Mock data for Phase 1
const MOCK_BUILDERS: Partial<BuilderProfile>[] = [
    { id: '1', full_name: 'Lagos Elite Constructions', location: 'Lagos', specialties: ['Residential', 'Renovation'], rating: 4.8, verification_status: 'verified' },
    { id: '2', full_name: 'Abuja Structural Pro', location: 'Abuja', specialties: ['Commercial', 'Structural'], rating: 4.9, verification_status: 'verified' },
    { id: '3', full_name: 'Standard Builders NG', location: 'Ibadan', specialties: ['Roofing', 'Finishing'], rating: 4.5, verification_status: 'verified' },
    { id: '4', full_name: 'Coastal Homes', location: 'Lekki', specialties: ['Luxury Homes', 'Interior'], rating: 5.0, verification_status: 'verified' },
    { id: '5', full_name: 'Delta Foundation Experts', location: 'Warri', specialties: ['Foundation', 'Piling'], rating: 4.7, verification_status: 'verified' },
];

export default function BuilderDirectory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');

    const filteredBuilders = MOCK_BUILDERS.filter(b =>
        (b.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (locationFilter === 'All' || b.location === locationFilter)
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <main className="container mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold font-outfit mb-4">Find Verified Builders</h1>
                    <p className="text-slate-600">Browse through our curated list of construction professionals across Nigeria.</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by builder name or specialty..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008751]/50 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            className="w-full appearance-none px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008751]/50 bg-white"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="All">All Locations</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja">Abuja</option>
                            <option value="Ibadan">Ibadan</option>
                            <option value="Lekki">Lekki</option>
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>

                {/* Builder Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBuilders.map((builder) => (
                        <div key={builder.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                                <div className="flex items-center gap-1 bg-[#008751]/10 text-[#008751] px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    <Shield className="w-3 h-3" /> Verified
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-[#008751] transition-colors">{builder.full_name}</h3>
                            <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm">
                                <MapPin className="w-4 h-4" /> {builder.location}, Nigeria
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {builder.specialties?.map(s => (
                                    <span key={s} className="bg-slate-50 px-3 py-1 rounded-lg text-xs text-slate-600 font-medium">{s}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-1 font-bold">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {builder.rating}
                                </div>
                                <Link
                                    href={`/builders/${builder.id}`}
                                    className="text-[#008751] font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                                >
                                    View Profile <Search className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBuilders.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg italic">No builders found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
