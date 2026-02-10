import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { EscrowTransaction } from '@/types';

// Create admin client with service role for secure operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export interface CreateEscrowParams {
    milestoneId: string;
    amount: number;
    paymentMethod: 'paystack' | 'stripe';
    externalReference?: string;
}

/**
 * Create a new escrow transaction record
 */
export async function createEscrowTransaction(params: CreateEscrowParams) {
    const { milestoneId, amount, paymentMethod, externalReference } = params;

    const { data, error } = await supabaseAdmin
        .from('escrow_transactions')
        .insert({
            milestone_id: milestoneId,
            amount,
            payment_method: paymentMethod,
            external_reference: externalReference,
            status: 'held'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating escrow transaction:', error);
        throw new Error(`Failed to create escrow transaction: ${error.message}`);
    }

    return data as EscrowTransaction;
}

/**
 * Update escrow transaction status
 */
export async function updateEscrowStatus(
    milestoneId: string,
    status: 'held' | 'released' | 'refunded',
    externalReference?: string
) {
    const updateData: any = { status };
    if (externalReference) {
        updateData.external_reference = externalReference;
    }

    const { data, error } = await supabaseAdmin
        .from('escrow_transactions')
        .update(updateData)
        .eq('milestone_id', milestoneId)
        .select()
        .single();

    if (error) {
        console.error('Error updating escrow status:', error);
        throw new Error(`Failed to update escrow status: ${error.message}`);
    }

    return data as EscrowTransaction;
}

/**
 * Get escrow transaction by milestone ID
 */
export async function getEscrowByMilestone(milestoneId: string) {
    const { data, error } = await supabaseAdmin
        .from('escrow_transactions')
        .select('*')
        .eq('milestone_id', milestoneId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching escrow transaction:', error);
        throw new Error(`Failed to fetch escrow transaction: ${error.message}`);
    }

    return data as EscrowTransaction | null;
}

/**
 * Get all escrow transactions for a project
 */
export async function getEscrowHistory(projectId: string) {
    // First get all milestones for the project
    const { data: milestones, error: milestonesError } = await supabaseAdmin
        .from('milestones')
        .select('id')
        .eq('project_id', projectId);

    if (milestonesError) {
        console.error('Error fetching milestones:', milestonesError);
        throw new Error(`Failed to fetch milestones: ${milestonesError.message}`);
    }

    if (!milestones || milestones.length === 0) {
        return [];
    }

    const milestoneIds = milestones.map(m => m.id);

    const { data, error } = await supabaseAdmin
        .from('escrow_transactions')
        .select('*')
        .in('milestone_id', milestoneIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching escrow history:', error);
        throw new Error(`Failed to fetch escrow history: ${error.message}`);
    }

    return data as EscrowTransaction[];
}

/**
 * Update milestone status
 */
export async function updateMilestoneStatus(
    milestoneId: string,
    status: 'pending' | 'funded' | 'submitted' | 'approved' | 'released'
) {
    const updateData: any = { status };

    // Set timestamps based on status
    if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
        .from('milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .select()
        .single();

    if (error) {
        console.error('Error updating milestone status:', error);
        throw new Error(`Failed to update milestone status: ${error.message}`);
    }

    return data;
}
