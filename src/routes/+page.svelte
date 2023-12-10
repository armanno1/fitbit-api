<script>
    let codeVerifier;
    let codeChallenge;
    let responseType = "code";
    let clientID = "23RFDV";
    export let data;
    $: fitbitData = data;

    async function getToken() {
      try {
        const response = await fetch('/api?authCode=' + data.authCode + '&codeVerifier=' + localStorage.getItem('code_verifier'), {
          method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          fitbitData = data
        })
      } catch (error) {
        console.error(error);
      }
    }

    function generateKeyValueHtml(jsonData) {
        let html = '';

        // Iterate over each key/value pair in the JSON object
        for (const [key, value] of Object.entries(jsonData)) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }

        return html;
    }


    // generate code verifier
    function dec2hex(dec) {
      return ("0" + dec.toString(16)).substr(-2);
    }
  
    function generateCodeVerifier() {
      var array = new Uint32Array(56 / 2);
      window.crypto.getRandomValues(array);
      const code_verifier = Array.from(array, dec2hex).join("");
      localStorage.setItem("code_verifier", code_verifier);
      return code_verifier;
    }
  
    function sha256(plain) {
      // returns promise ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest("SHA-256", data);
    }
  
    function base64urlencode(a) {
      var str = "";
      var bytes = new Uint8Array(a);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
  
    async function generateCodeChallengeFromVerifier(v) {
      var hashed = await sha256(v);
      var base64encoded = base64urlencode(hashed);
      return base64encoded;
    }
  
    function generateCodeAndURL() {
      codeVerifier = generateCodeVerifier();
      generateCodeChallengeFromVerifier(codeVerifier).then((challenge) => {
        codeChallenge = challenge;
        initiateFitbitAuthorization();
      });
    }
  
    async function initiateFitbitAuthorization() {
      try {
        // Use the generated codeVerifier and codeChallenge to construct the authorization URL
        const requestURL =
          "https://www.fitbit.com/oauth2/authorize?client_id=" +
          clientID +
          "&response_type=" +
          responseType +
          "&code_challenge=" +
          codeChallenge +
          "&code_challenge_method=S256" +
          "&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight";
  
        // Redirect the user to the Fitbit authorization URL
        window.location.href = requestURL;
      } catch (error) {
        console.error(error);
      }
    }
  </script>
  
  <div class="container mx-auto px-4 py-10 text-center">
    <h1 class="text-3xl text-bold">Fitbit API (test)</h1>
    <div class="w-1/2 mx-auto border border-neutral-300 rounded-xl shadow-md text-left p-6 my-6 bg-white">
      {#if fitbitData.user}
        Hello {fitbitData.user.firstName}, we've successfully managed to sync your fitbit data!
      {:else if data.authCode && !fitbitData.error}
        <div class='text-center'>
            <button class="bg-green-500 rounded-md hover:bg-green-400 text-lg text-white py-3 px-6 shadow-md border border-green-600/50" on:click={getToken}>
                Success! Please click here to continue...
            </button>
        </div>
      {:else}
      <p>
        This app is designed to grant researchers access to your fitbit data. If
        you are happy to allow access, please click on the link below.
      </p>
      <div class="text-center my-8 mb-0">
        <button
          class="bg-blue-500 rounded-md hover:bg-blue-400 text-lg text-white py-3 px-6 shadow-md border border-blue-600/50"
          on:click={generateCodeAndURL}
        >
          Allow access to my Fitbit data
        </button>
      </div>
      {/if}
      <div class='my-4 text-left'>
        {#if fitbitData.user}
        {@html generateKeyValueHtml(fitbitData.user)}
        {/if}
      </div>
    </div>
  </div>
  
  <!-- <div class="font-mono">
    <p>Code Verifier = {codeVerifier}</p>
    <p>Code Challenge = {codeChallenge}</p>
    {data.authCode}<br />
    Fetch token
  </div> -->