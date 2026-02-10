import { NextRequest, NextResponse } from 'next/server';
import { createEscrowTransaction, updateMilestoneStatus } from '@/services/escrow';
import { createEscrowCheckoutSession } from '@/lib/payments/stripe';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import { createClient } from '@supabase/supabase-js';

// Admin client for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { milestoneId, paymentMethod } = await req.json();

        if (!milestoneId || !paymentMethod) {
            return NextResponse.json(
                { error: 'Missing required fields: milestoneId, paymentMethod' },
                { status: 400 }
            );
        }

        if (paymentMethod !== 'paystack' && paymentMethod !== 'stripe') {
            return NextResponse.json(
                { error: 'Invalid payment method. Must be paystack or stripe' },
                { status: 400 }
            );
        }

        // Fetch milestone details
        const { data: milestone, error: milestoneError } = await supabaseAdmin
            .from('milestones')
            .select('*, project:projects(*)')
            .eq('id', milestoneId)
            .single();

        if (milestoneError || !milestone) {
            return NextResponse.json(
                { error: 'Milestone not found' },
                { status: 404 }
            );
        }

        // Check if milestone is already funded
        if (milestone.status !== 'pending') {
            return NextResponse.json(
                { error: `Milestone is already ${milestone.status}. Only pending milestones can be funded.` },
                { status: 400 }
            );
        }

        // Get client details
        const { data: client, error: clientError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', milestone.project.client_id)
            .single();

        if (clientError || !client) {
            return NextResponse.json(
                { error: 'Client profile not found' },
                { status: 404 }
            );
        }

        const clientEmail = await getClientEmail(milestone.project.client_id);

        let paymentUrl: string;
        let reference: string;

        // Process payment based on method
        if (paymentMethod === 'stripe') {
            // Stripe for USD
            if (milestone.project.currency !== 'USD') {
                return NextResponse.json(
                    { error: 'Stripe is only available for USD payments' },
                    { status: 400 }
                );
            }

            const session = await createEscrowCheckoutSession(
                milestoneId,
                milestone.amount,
                'usd'
            );

            paymentUrl = session.url!;
            reference = session.id;

            // Create escrow transaction record
            await createEscrowTransaction({
                milestoneId,
                amount: milestone.amount,
                paymentMethod: 'stripe',
                externalReference: reference
            });

        } else {
            // Paystack for NGN
            if (milestone.project.currency !== 'NGN') {
                return NextResponse.json(
                    { error: 'Paystack is only available for NGN payments' },
                    { status: 400 }
                );
            }

            const result = await initializePaystackTransaction(
                clientEmail,
                milestone.amount,
                milestoneId
            );

            paymentUrl = result.authorization_url;
            reference = result.reference;

            // Create escrow transaction record
            await createEscrowTransaction({
                milestoneId,
                amount: milestone.amount,
                paymentMethod: 'paystack',
                externalReference: reference
            });
        }

        return NextResponse.json({
            success: true,
            paymentUrl,
            reference,
            paymentMethod
        });

    } catch (error: any) {
        console.error('Error funding milestone:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initiate payment' },
            { status: 500 }
        );
    }
}

// Helper function to get client email
async function getClientEmail(clientId: string): Promise<string> {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(clientId);

    if (error || !data.user) {
        throw new Error('Could not retrieve client email');
    }

    return data.user.email || 'noreply@buildsafe.ng';
}
