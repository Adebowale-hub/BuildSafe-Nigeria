'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide navbar on admin and backend routes to prevent overlap
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/backend');

    if (isAdminRoute) return null;

    return <Navbar />;
}
