import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

export const createEscrowCheckoutSession = async (
    milestoneId: string,
    amount: number,
    currency: string = 'usd'
) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: `BuildSafe Escrow: Milestone ${milestoneId}`,
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/project/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/project/cancel`,
        metadata: {
            milestoneId,
        },
    });

    return session;
};

/**
 * Retrieve checkout session details
 */
export const getCheckoutSession = async (sessionId: string) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error: any) {
        console.error('Error retrieving Stripe session:', error);
        throw new Error(`Failed to retrieve session: ${error.message}`);
    }
};

/**
 * Refund a Stripe payment
 */
export const refundStripePayment = async (paymentIntentId: string, amount?: number) => {
    try {
        const refundData: any = {
            payment_intent: paymentIntentId
        };

        if (amount) {
            refundData.amount = Math.round(amount * 100); // Convert to cents
        }

        const refund = await stripe.refunds.create(refundData);
        return refund;
    } catch (error: any) {
        console.error('Error processing Stripe refund:', error);
        throw new Error(`Failed to process refund: ${error.message}`);
    }
};
