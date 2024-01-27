import { supabase } from "$lib/server/supabaseClient.js";
import { CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_CLIENT_ID } from "$env/static/public";

export async function GET({ url }) {
  const authCode = url.searchParams.get("authCode");
  const codeVerifier = url.searchParams.get("codeVerifier");
  let researchID = url.searchParams.get("researchID")
  if (url.searchParams.get("researchID") === "null") {
    return new Response(JSON.stringify({ error: "No research ID associated with fitbit account. Please try again using the link you received by email. If you still experience issues please email ehsanul.choudhury@gstt.nhs.uk" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  } 

  if (!(authCode && codeVerifier)) {
    return new Response(
      JSON.stringify({ missing: "Missing authCode or codeVerifier" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${PUBLIC_CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: PUBLIC_CLIENT_ID,
        grant_type: "authorization_code",
        code: authCode,
        code_verifier: codeVerifier,
      }).toString(),
    });

    const data = await tokenResponse.json();

    if (data.errors) {
      console.log(data.errors[0].errorType);
      throw new Error(data.errors[0].errorType);
    }

    const { sb_error } = await supabase.from("fb_data_en").upsert([
      {
        research_id: researchID,
        user_id: data.user_id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        scope: data.scope,
        hr_data: null,
      },
    ]);

    if (sb_error) {
      throw new Error(sb_error.message);
    }

    if (!data.access_token) {
      throw new Error("Access token not found in response");
    }

    const userDataResponse = await fetch(
      `https://api.fitbit.com/1/user/${data.user_id}/profile.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const fitbitApiData = await userDataResponse.json();

    return new Response(JSON.stringify(fitbitApiData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "There's been a problem. Please try again using the link you received via email. If you still experience issues please email ehsanul.choudhury@gstt.nhs.uk" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}