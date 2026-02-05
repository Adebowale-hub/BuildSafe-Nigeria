export type UserRole = 'client' | 'builder' | 'admin';

export interface Profile {
    id: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    location?: string;
    created_at: string;
    updated_at: string;
}

export interface BuilderProfile extends Profile {
    bio?: string;
    cac_number?: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    specialties: string[];
    portfolio_urls: string[];
    rating: number;
    verified_at?: string;
}

export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Land {
    id: string;
    owner_id: string;
    title: string;
    description: string;
    location: string;
    price_per_plot: number;
    total_plots: number;
    available_plots: number;
    image_urls: string[];
    created_at: string;
}

export interface Project {
    id: string;
    client_id: string;
    builder_id?: string;
    land_id?: string;
    title: string;
    description: string;
    location: string;
    budget: number;
    currency: string;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
}

export type MilestoneStatus = 'pending' | 'funded' | 'submitted' | 'approved' | 'released';

export interface Milestone {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    order: number;
    percentage_allocation: number;
    amount: number;
    status: MilestoneStatus;
    evidence_urls: string[];
    evidence_submitted_at?: string;
    approved_at?: string;
    created_at: string;
}

export interface EscrowTransaction {
    id: string;
    milestone_id: string;
    amount: number;
    payment_method: 'paystack' | 'stripe';
    external_reference?: string;
    status: 'held' | 'released' | 'refunded';
    created_at: string;
}
