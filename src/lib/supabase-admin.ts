import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE_ROLE_KEY, which bypasses RLS.
// Use this ONLY in server-side code (Route Handlers, Server Actions).
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
