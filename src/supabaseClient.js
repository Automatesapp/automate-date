import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qstzsazsxlrmgqovagea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdHpzYXpzeGxybWdxb3ZhZ2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTkyMTAsImV4cCI6MjA5MDMzNTIxMH0.i4-TtsVyy7Tkt2430Ewda4UnsR_QxAjdV9dQ-Wdtkc4';
export const supabase = createClient(supabaseUrl, supabaseKey);
