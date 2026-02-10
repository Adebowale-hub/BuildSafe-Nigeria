import { NextRequest, NextResponse } from 'next/server';
import { updateEscrowStatus, updateMilestoneStatus, getEscrowByMilestone } from '@/services/escrow';
import { createClient } from '@supabase/supabase-js';

// Admin client for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { milestoneId } = await req.json();

        if (!milestoneId) {
            return NextResponse.json(
                { error: 'Missing required field: milestoneId' },
                { status: 400 }
            );
        }

        // Fetch milestone details
        const { data: milestone, error: milestoneError } = await supabaseAdmin
            .from('milestones')
            .select('*')
            .eq('id', milestoneId)
            .single();

        if (milestoneError || !milestone) {
            return NextResponse.json(
                { error: 'Milestone not found' },
                { status: 404 }
            );
        }

        // Verify milestone is in submitted or approved status
        if (milestone.status !== 'submitted' && milestone.status !== 'approved') {
            return NextResponse.json(
                { error: `Cannot release payment for milestone with status: ${milestone.status}. Milestone must be submitted or approved.` },
                { status: 400 }
            );
        }

        // Check if escrow transaction exists
        const escrowTransaction = await getEscrowByMilestone(milestoneId);

        if (!escrowTransaction) {
            return NextResponse.json(
                { error: 'No escrow transaction found for this milestone' },
                { status: 404 }
            );
        }

        if (escrowTransaction.status !== 'held') {
            return NextResponse.json(
                { error: `Escrow transaction is already ${escrowTransaction.status}` },
                { status: 400 }
            );
        }

        // Update milestone status to released
        await updateMilestoneStatus(milestoneId, 'released');

        // Update escrow transaction status to released
        await updateEscrowStatus(milestoneId, 'released');

        // TODO Phase 2: Trigger actual bank transfer to builder
        // For MVP, we just mark as released

        return NextResponse.json({
            success: true,
            message: 'Payment released successfully',
            milestoneId,
            status: 'released'
        });

    } catch (error: any) {
        console.error('Error releasing payment:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to release payment' },
            { status: 500 }
        );
    }
}
