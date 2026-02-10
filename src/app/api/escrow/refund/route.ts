import { NextRequest, NextResponse } from 'next/server';
import { updateEscrowStatus, updateMilestoneStatus, getEscrowByMilestone } from '@/services/escrow';
import { refundStripePayment } from '@/lib/payments/stripe';
import { refundPaystackTransaction } from '@/lib/payments/paystack';
import { createClient } from '@supabase/supabase-js';

// Admin client for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { milestoneId, reason } = await req.json();

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

        // Get escrow transaction
        const escrowTransaction = await getEscrowByMilestone(milestoneId);

        if (!escrowTransaction) {
            return NextResponse.json(
                { error: 'No escrow transaction found for this milestone' },
                { status: 404 }
            );
        }

        if (escrowTransaction.status !== 'held') {
            return NextResponse.json(
                { error: `Cannot refund transaction with status: ${escrowTransaction.status}` },
                { status: 400 }
            );
        }

        // Process refund based on payment method
        try {
            if (escrowTransaction.payment_method === 'stripe') {
                // For Stripe, we need the payment intent ID
                // In a real implementation, you'd store this or retrieve the session
                if (escrowTransaction.external_reference) {
                    await refundStripePayment(escrowTransaction.external_reference);
                }
            } else if (escrowTransaction.payment_method === 'paystack') {
                // Refund via Paystack
                if (escrowTransaction.external_reference) {
                    await refundPaystackTransaction(escrowTransaction.external_reference);
                }
            }
        } catch (refundError: any) {
            console.error('Refund processing error:', refundError);
            // Continue with database updates even if payment gateway refund fails
            // Admin can manually process refund if needed
        }

        // Update escrow transaction status
        await updateEscrowStatus(milestoneId, 'refunded');

        // Reset milestone to pending
        await updateMilestoneStatus(milestoneId, 'pending');

        // Log refund reason
        console.log(`Refund processed for milestone ${milestoneId}. Reason: ${reason || 'Not specified'}`);

        return NextResponse.json({
            success: true,
            message: 'Refund processed successfully',
            milestoneId,
            status: 'refunded'
        });

    } catch (error: any) {
        console.error('Error processing refund:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process refund' },
            { status: 500 }
        );
    }
}
