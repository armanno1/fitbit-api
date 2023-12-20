import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SECRET_SERVICE_ROLE_KEY } from "$env/static/private";

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  SECRET_SERVICE_ROLE_KEY
);
