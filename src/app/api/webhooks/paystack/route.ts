import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateMilestoneStatus, updateEscrowStatus } from '@/services/escrow';
import crypto from 'crypto';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

        if (!paystackSecret) {
            console.error('Paystack secret key not configured');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Verify webhook signature
        const signature = req.headers.get('x-paystack-signature');
        const body = await req.text();

        if (!signature) {
            console.error('No signature provided');
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        const hash = crypto
            .createHmac('sha512', paystackSecret)
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            console.error('Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse webhook payload
        const event = JSON.parse(body);
        console.log('Paystack webhook received:', event.event);

        // Handle charge.success event
        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            const status = event.data.status;
            const amount = event.data.amount / 100; // Convert from kobo to Naira

            console.log(`Payment successful: ${reference}, Amount: ₦${amount}`);

            // Extract milestone ID from reference
            // Reference format: milestone_{milestoneId}_{timestamp}
            const milestoneIdMatch = reference.match(/milestone_([a-f0-9-]+)_/);

            if (!milestoneIdMatch) {
                console.error('Could not extract milestone ID from reference:', reference);
                return NextResponse.json({ received: true });
            }

            const milestoneId = milestoneIdMatch[1];

            if (status === 'success') {
                try {
                    // Update milestone status to funded
                    await updateMilestoneStatus(milestoneId, 'funded');

                    // Update escrow transaction with external reference
                    await updateEscrowStatus(milestoneId, 'held', reference);

                    console.log(`Milestone ${milestoneId} funded successfully via Paystack`);
                } catch (dbError: any) {
                    console.error('Database update error:', dbError);
                    // Return success to Paystack to avoid retries, but log the error
                }
            }
        }

        // Acknowledge receipt
        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
