'use client';

import { LayoutDashboard, Users, HardHat, LandPlot, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users & Builders', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: HardHat },
    { name: 'Land Catalog', href: '/admin/lands', icon: LandPlot },
    { name: 'Admin Profile', href: '/admin/profile', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold font-outfit text-slate-800">Admin</h2>
                        <p className="text-sm text-slate-500 font-medium">BuildSafe Control</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold",
                                    isActive
                                        ? "bg-[#008751] text-white shadow-lg shadow-[#008751]/20 translate-x-1"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-slate-100 italic text-[10px] text-slate-400">
                    <Link href="/" className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Back to Main Site
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-80">
                <div className="md:p-12 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
