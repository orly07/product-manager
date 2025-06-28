// src/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase'; // use relative path if needed

const supabaseUrl = 'https://zrvmxreyvgxwokimxtfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpydm14cmV5dmd4d29raW14dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODY3NDAsImV4cCI6MjA2NjE2Mjc0MH0.lKRbrwHwPrAGIQv5V-qAp-p7ZdSFvwnVhvfaItX7rcc';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
