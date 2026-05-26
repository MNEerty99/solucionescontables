/* -------------------------------------------------------------
   VMP Studio Contable - Supabase Integration Client
   ------------------------------------------------------------- */

// Load credentials securely from Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseKey !== '';

export const supabase = isSupabaseConfigured && window.supabase
  ? window.supabase.createClient(supabaseUrl, supabaseKey)
  : null;

if (isSupabaseConfigured) {
  console.log("Supabase client initialized successfully!");
} else {
  console.log("Supabase credentials not configured. Falling back to local sandbox (localStorage).");
}
