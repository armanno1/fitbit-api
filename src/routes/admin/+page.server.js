import { supabase } from "$lib/server/supabaseClient.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/");
  }

  const { data, error } = await supabase
    .from("fb_data_en2")
    .select("research_id");
  let researchIDs = await data;

  return { researchIDs };
}
