const client_secret = "335b6e53dc10a9cd2c243fe0a38780e4"
const client_ID = "23RFDV"

export async function GET({ url }) {
    let authCode = url.searchParams.get("authCode");
    let codeVerifier = url.searchParams.get("codeVerifier");
    if (!(authCode && codeVerifier)) {
        return new Response(JSON.stringify({ missing: "missing authCode or codeVerifier" }), { headers: { 'Content-Type': 'application/json' } });
    }
    try {
        const response = await fetch('https://api.fitbit.com/oauth2/token', {
            method: "POST",
            headers: {
                'Authorization': "Basic " + btoa(`${client_ID}:${client_secret}`),
                'Content-Type': 'application/x-www-form-urlencoded', //the API requires this, doesn't accept JSON
            },
            body: new URLSearchParams({
                'client_id': '23RFDV',
                'grant_type': 'authorization_code',
                'code': authCode,
                'code_verifier': codeVerifier,
            }).toString(),
        });

        // Await data containing access token
        const data = await response.json();

        // Check if  access token is in the response
        if (!data.access_token) {
            return new Response(JSON.stringify({ error: 'Access token not found in response' }), { headers: { 'Content-Type': 'application/json' } });
        }

        // Use access token to make second API call
        const fitbitApiResponse = await fetch(`https://api.fitbit.com/1/user/${data.user_id}/profile.json`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
            },
        });

        // Parse the response from the Fitbit API
        const fitbitApiData = await fitbitApiResponse.json();

        // Return new response object with API data
        return new Response(JSON.stringify(fitbitApiData), { headers: { 'Content-Type': 'application/json' } });

        // I could probably pop HR data into database here [todo]
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { headers: { 'Content-Type': 'application/json' } });
    }
}