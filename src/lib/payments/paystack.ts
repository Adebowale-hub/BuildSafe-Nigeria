/**
 * Paystack Integration for NGN Payments
 * Complete integration with Paystack API for milestone escrow payments
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        status: string;
        reference: string;
        amount: number;
        currency: string;
        paid_at: string;
        channel: string;
    };
}

/**
 * Initialize a Paystack transaction for milestone funding
 * @param email - Client's email address
 * @param amount - Amount in Naira (will be converted to kobo)
 * @param milestoneId - Milestone ID for reference
 * @returns Authorization URL to redirect user to
 */
export async function initializePaystackTransaction(
    email: string,
    amount: number,
    milestoneId: string
) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key not configured');
    }

    // Convert amount to kobo (Paystack expects smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    const payload = {
        email,
        amount: amountInKobo,
        reference: `milestone_${milestoneId}_${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/project/success`,
        metadata: {
            milestone_id: milestoneId,
            payment_type: 'escrow_funding'
        }
    };

    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result: PaystackInitializeResponse = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to initialize Paystack transaction');
        }

        return {
            status: 'success',
            authorization_url: result.data.authorization_url,
            reference: result.data.reference,
            access_code: result.data.access_code
        };
    } catch (error: any) {
        console.error('Paystack initialization error:', error);
        throw new Error(`Paystack initialization failed: ${error.message}`);
    }
}

/**
 * Verify a Paystack transaction
 * @param reference - Transaction reference from initialization
 * @returns Transaction details and status
 */
export async function verifyPaystackTransaction(reference: string) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key not configured');
    }

    try {
        const response = await fetch(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const result: PaystackVerifyResponse = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to verify transaction');
        }

        return {
            status: 'success',
            data: {
                status: result.data.status,
                amount: result.data.amount / 100, // Convert back to Naira
                reference: result.data.reference,
                paid_at: result.data.paid_at
            }
        };
    } catch (error: any) {
        console.error('Paystack verification error:', error);
        throw new Error(`Paystack verification failed: ${error.message}`);
    }
}

/**
 * Refund a Paystack transaction
 * @param reference - Transaction reference
 * @param amount - Optional partial refund amount in Naira
 * @returns Refund confirmation
 */
export async function refundPaystackTransaction(reference: string, amount?: number) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key not configured');
    }

    const payload: any = { transaction: reference };
    if (amount) {
        payload.amount = Math.round(amount * 100); // Convert to kobo
    }

    try {
        const response = await fetch(`${PAYSTACK_BASE_URL}/refund`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!result.status) {
            throw new Error(result.message || 'Failed to process refund');
        }

        return {
            status: 'success',
            data: result.data
        };
    } catch (error: any) {
        console.error('Paystack refund error:', error);
        throw new Error(`Paystack refund failed: ${error.message}`);
    }
}
