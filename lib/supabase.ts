// Supabase client — used in API routes (server-side only)
// The SERVICE ROLE key is used here so we can write to the database
// without requiring a logged-in user.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
    'Check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
