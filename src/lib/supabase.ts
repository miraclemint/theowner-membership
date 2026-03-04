import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjbzinqawlwrdfqwerfm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYnppbnFhd2x3cmRmcXdlcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzYyNjUsImV4cCI6MjA4ODExMjI2NX0.Uoz9ep1PlXL4EEAJWPQDP6HLysRmvFHSme-YECEs_gc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
