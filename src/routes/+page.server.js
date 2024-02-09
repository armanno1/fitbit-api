import { supabase } from "$lib/server/supabaseClient.js";

const isResearchIDValid = async (rsid) => {
  const { data: rsids, error } = await supabase
    .from("research_ids")
    .select("research_id");
  return rsids.find((item) => item.research_id === rsid);
};

export async function load({ url }) {
  const rsid = url.searchParams.get("researchID");
  let isRSIDvalid = Boolean(await isResearchIDValid(rsid));
  return { rsid, isRSIDvalid };
}
