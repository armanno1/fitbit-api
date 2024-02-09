import { supabase } from "$lib/server/supabaseClient.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals: { getSession } }) {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/");
  }

  const { data: approvedResearchIDs, approvedError } = await supabase
    .from("research_ids")
    .select("*")
    .eq("granted_permission", true);

  const { data: unapprovedResearchIDs, unapprovedError } = await supabase
    .from("research_ids")
    .select("research_id")
    .eq("granted_permission", false);

  if (approvedError || unapprovedError) {
    throw new Error(); //could write a function here to return any error's message I guess
  }

  return { approvedResearchIDs, unapprovedResearchIDs };
}
