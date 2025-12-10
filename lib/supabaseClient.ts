import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if credentials are present
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials (SUPABASE_URL, SUPABASE_KEY) are missing. Database operations will fail.');
}

// Initialize the Supabase client
// We provide fallback values to prevent the 'supabaseUrl is required' error during initialization
// if the environment variables are not set.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
