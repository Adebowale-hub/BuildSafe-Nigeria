import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.user_metadata.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch Stats
        const [usersCount, buildersCount, projectsCount, escrowSum] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'builder'),
            supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('milestones').select('amount').eq('status', 'funded')
        ]);

        const totalEscrow = (escrowSum.data || []).reduce((acc: number, m: any) => acc + Number(m.amount), 0);

        return NextResponse.json({
            users: usersCount.count || 0,
            builders: buildersCount.count || 0,
            projects: projectsCount.count || 0,
            escrow: totalEscrow
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
