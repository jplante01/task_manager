// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Add debug logging
// console.log('Supabase URL:', supabaseUrl);
// // Log partial key for debugging (first 8 chars only)
// console.log('Supabase Key starts with:', supabaseAnonKey?.substring(0, 8));

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(`Missing Supabase environment variables:
//     URL: ${supabaseUrl ? 'Present' : 'Missing'}
//     Key: ${supabaseAnonKey ? 'Present' : 'Missing'}`);
// }

// // Validate URL format before creating client
// try {
//   new URL(supabaseUrl);
// } catch (e) {
//   throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// In your Supabase configuration file (e.g., src/supabaseClient.js)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'SUPABASE_URL_PLACEHOLDER'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUPABASE_KEY_PLACEHOLDER'

export const supabase = createClient(supabaseUrl, supabaseKey)
