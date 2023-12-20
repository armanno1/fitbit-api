import { supabase } from "$lib/server/supabaseClient.js";

const client_secret = "335b6e53dc10a9cd2c243fe0a38780e4";
const client_ID = "23RFDV";

export async function GET({ url }) {
  const authCode = url.searchParams.get("authCode");
  const codeVerifier = url.searchParams.get("codeVerifier");

  if (!(authCode && codeVerifier)) {
    return new Response(
      JSON.stringify({ missing: "missing authCode or codeVerifier" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${client_ID}:${client_secret}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "23RFDV",
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

    const { sb_error } = await supabase
      .from("fb_user_data")
      .upsert([
        {
          user_id: data.user_id,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          scope: data.scope,
          hr_data: {"test": "test"},
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
