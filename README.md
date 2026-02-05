# BuildSafe Nigeria MVP - Deployment & Setup Guide

## Tech Stack
- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Framer Motion
- **Backend/Auth**: Supabase
- **Payments**: Paystack (NGN) + Stripe (USD)

## Prerequisites
1. **Supabase Account**: Create a project and get API keys.
2. **Paystack/Stripe Accounts**: Obtain test/public keys.
3. **Vercel Account**: For deployment.

## Local Setup
1. Clone the repository.
2. Copy `.env.example` to `.env.local` and fill in your keys.
3. Run `npm install`.
4. Run `npm run dev`.

## Supabase Schema
Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor. This will:
- Create `profiles`, `builders`, `projects`, `milestones`, and `escrow_transactions` tables.
- Enable Row Level Security (RLS) policies.
- Set up a trigger to automatically create profiles for new auth users.

## Deployment to Vercel
1. Push code to GitHub.
2. Connect repository to Vercel.
3. Add environment variables from `.env.local` to Vercel dashboard.
4. Deploy!

## Phase 1 Features
- [x] **Hero Landing**: High-conversion landing page with Nigerian branding.
- [x] **Builder Directory**: Searchable, filtered list of verified professionals.
- [x] **Project Flow**: Multi-step project posting for diaspora clients.
- [x] **Trust Dashboard**: Visual milestone tracking and financial transparency.
- [x] **Escrow Bridges**: Ready-to-use hooks for Paystack and Stripe.
