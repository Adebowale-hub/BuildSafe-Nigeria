import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateMilestoneStatus, updateEscrowStatus } from '@/services/escrow';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            console.error('No Stripe signature provided');
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        if (!webhookSecret) {
            console.error('Stripe webhook secret not configured');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        console.log('Stripe webhook received:', event.type);

        // Handle checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const milestoneId = session.metadata?.milestoneId;

            if (!milestoneId) {
                console.error('No milestone ID in session metadata');
                return NextResponse.json({ received: true });
            }

            console.log(`Checkout completed for milestone ${milestoneId}`);

            try {
                // Update milestone status to funded
                await updateMilestoneStatus(milestoneId, 'funded');

                // Update escrow transaction with session ID
                await updateEscrowStatus(milestoneId, 'held', session.id);

                console.log(`Milestone ${milestoneId} funded successfully via Stripe`);
            } catch (dbError: any) {
                console.error('Database update error:', dbError);
                // Return success to Stripe to avoid retries
            }
        }

        // Handle payment_intent.succeeded event (alternative confirmation)
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment intent succeeded:', paymentIntent.id);
        }

        // Acknowledge receipt
        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Stripe webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
