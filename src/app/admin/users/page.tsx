'use client';

import { useEffect, useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, MoreVertical, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                if (Array.isArray(data)) setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const toggleVerification = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'verified' ? 'unverified' : 'verified';
        // In a real app, this should also be an API route or Server Action
        // For now, we'll keep the logic but the user should handle this via a PATCH API
        alert("Verification toggle needs a secure API endpoint. Implementing now...");
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-outfit mb-2">Users & Builders</h1>
                    <p className="text-slate-500">Manage account access and professional verifications.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full md:w-80 outline-none focus:ring-2 focus:ring-[#008751]"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-widest">User</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Verification</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Date Joined</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {users.map((user, i) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-slate-50/50 transition-colors group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full rounded-2xl object-cover" /> : <User className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{user.full_name || 'Anonymous'}</div>
                                            <div className="text-xs text-slate-400">ID: ...{user.id.slice(-8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'builder' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    {user.role === 'builder' ? (
                                        <button
                                            onClick={() => toggleVerification(user.id, user.verification_status)}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                                                user.verification_status === 'verified'
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {user.verification_status === 'verified' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                            {user.verification_status === 'verified' ? 'Verified' : 'Unverified'}
                                        </button>
                                    ) : (
                                        <span className="text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-slate-400 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
