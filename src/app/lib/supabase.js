import { createClient } from '@supabase/supabase-js'

// आपका प्रोजेक्ट URL जो मैंने स्क्रीनशॉट से लिया है
const supabaseUrl = 'https://hictqciyglfersswgkuy.supabase.co'

// आपकी Anon / Publishable Key जो आपने भेजी है
const supabaseAnonKey = 'sb_publishable_tyLQzIMNF5UffsEUqlquPA_7AkAo7G6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)