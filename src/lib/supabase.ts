import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kwynkskxvspobuoprhvw.supabase.co';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eW5rc2t4dnNwb2J1b3ByaHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODAwNDcsImV4cCI6MjA4ODA1NjA0N30.YuX59I1pCbNklfHrFGwNVdoC4s7A5jNiFS7BQh2EZxk';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.warn('Supabase URL is missing or placeholder. Please check your environment variables.');
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
