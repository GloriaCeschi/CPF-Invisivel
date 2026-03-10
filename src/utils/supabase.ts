
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tjndokqdquortfjofvhy.supabase.co"
const supabaseKey = "sb_publishable_7Vc1b6AvxvgJfs8P6HhpkA_dfDKaeKF"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
        
