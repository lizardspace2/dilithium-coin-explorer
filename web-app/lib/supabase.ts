import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ugetaqllizziswruqdvm.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZXRhcWxsaXp6aXN3cnVxZHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTc3OTUsImV4cCI6MjA4MzA3Mzc5NX0.UGICecbE7UxgnirMpPb6m3nGsRpVUZSJPg0UGWIhG_o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
