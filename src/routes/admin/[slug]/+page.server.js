import { supabase } from "$lib/server/supabaseClient.js";
import { PUBLIC_CLIENT_ID } from "$env/static/public";
import { CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export async function load({ params, locals: { getSession } }) {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/");
  }

  const { data, error } = await supabase
    .from("decrypted_fb_data_en2")
    .select("user_id, decrypted_refresh_token, scope")
    .eq("research_id", params.slug);

  const refreshToken = await data[0].decrypted_refresh_token;
  const user_id = await data[0].user_id;

  try {
    const updatedAccessAndRefreshTokens = await fetch(
      "https://api.fitbit.com/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + btoa(`${PUBLIC_CLIENT_ID}:${CLIENT_SECRET}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      }
    );

    let tokenData = await updatedAccessAndRefreshTokens.json();

    const { rpcError } = await supabase.rpc("upsert_fb_data_en2", {
      p_research_id: params.slug,
      p_user_id: user_id,
      p_refresh_token: tokenData.refresh_token,
      p_scope: tokenData.scope,
    });

    if (rpcError) {
      throw new Error(error.message);
    }

    const data2 = await fetch(
      `https://api.fitbit.com/1/user/${user_id}/activities/heart/date/2023-01-01/2023-12-31.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const HRdata = await data2.json(); //tidy up these variable names!

    return { hr: HRdata, researchID: params.slug };
  } catch (error) {
    console.log(error.message)
  }
}
