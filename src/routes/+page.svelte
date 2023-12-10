<script>
    let codeVerifier
    let codeChallenge
    let responseType = "code"
    let clientID = "23RFDV"
    let fitbitData = null
    export let data

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

    $: requestURL = "https://www.fitbit.com/oauth2/authorize?client_id="
        + clientID
        + "&response_type="
        + responseType
        + "&code_challenge="
        + codeChallenge
        + "&code_challenge_method=S256"
        + "&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight"
            
    // generate code verifier
    function dec2hex(dec) {
      return ("0" + dec.toString(16)).substr(-2);
    }

    function generateCodeVerifier() {
      var array = new Uint32Array(56 / 2);
      window.crypto.getRandomValues(array);
      const code_verifier = Array.from(array, dec2hex).join("")
      localStorage.setItem("code_verifier", code_verifier)
      console.log(localStorage)
      return code_verifier
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

    async function getCodeChallenge() {
      try {
        codeChallenge = await generateCodeChallengeFromVerifier(
          codeVerifier
        )          
      } catch (error) {
          console.error(error)
        }
    }
    
</script>

<div class="container mx-auto px-4 py-10 text-center">
<h1 class='text-3xl text-bold'>Fitbit API (test)</h1>
<div class='w-1/2 mx-auto border rounded-xl shadow shadow-sm text-left p-4 my-4 bg-white'>
<p>App to grant researchers access to your fitbit data. If you are happy to allow access, please click on the link below.</p>
{#if fitbitData}
  <p class='mt-4'>Hello {fitbitData.fitbitApiData.user.firstName}!</p>
{:else}
  <p style="overflow-wrap: break-word;" class='mt-4'><a href={requestURL} class='hover:underline text-blue-500'>{requestURL}</a></p>
{/if}
</div>
</div>

<div class='font-mono'>
<p>Code Verifier = {codeVerifier}</p>
<button class="bg-blue-500 rounded-md hover:bg-blue-400 text-xs text-white p-1 px-2" on:click={() => codeVerifier = generateCodeVerifier()}>Regenerate Code Verifier</button>
<p>Code Challenge = {codeChallenge}</p>
<button class="bg-blue-500 rounded-md hover:bg-blue-400 text-xs text-white p-1 px-2" on:click={getCodeChallenge}>Generate Code Challenge from verifier</button>
{data.authCode}<br />
Fetch token
<button class="bg-blue-500 rounded-md hover:bg-blue-400 text-xs text-white p-1 px-2" on:click={getToken}>Get Token</button>
</div>
{JSON.stringify(fitbitData)}