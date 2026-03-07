import { createClient } from '@supabase/supabase-js';

const supabaseUrl2 = import.meta.env.VITE_SUPABASE_URL_2;
const supabaseKey2 = import.meta.env.VITE_SUPABASE_ANON_KEY_2;

export const supabase2 = createClient(supabaseUrl2, supabaseKey2);