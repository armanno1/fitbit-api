<script>
    import { onMount } from 'svelte';
    import { sha256, base64urlencode, generateKeyValueHtml, dec2hex } from '$lib/helpers';

    let codeVerifier;
    let codeChallenge;
    let responseType = "code";
    let clientID = "23RFDV";
    export let data;
    $: fitbitData = data;
    $: error = null

    onMount(() => {
      if (data.authCode && !fitbitData.error) {
        getToken();
      }
    });

    async function getToken() {
      try {
        const response = await fetch(`/api?authCode=${data.authCode}&codeVerifier=${localStorage.getItem('code_verifier')}`, {
          method: 'GET'
        });
        const responseData = await response.json();
        fitbitData = responseData;
      } catch (error) {
        console.log(error)
      }
    }
  
    function generateCodeVerifier() {
      var array = new Uint32Array(56 / 2);
      window.crypto.getRandomValues(array);
      const code_verifier = Array.from(array, dec2hex).join("");
      localStorage.setItem("code_verifier", code_verifier);
      return code_verifier;
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
        console.log(error);
      }
    }
  </script>

  {#if fitbitData.error}
  <div class='text-center text-teal-800 text-sm p-4 -mb-14'>
    <p>Uh oh! There's been an error ({fitbitData.error})</p>
  </div>
  {/if}
  <div class="container px-4 py-10 text-center w-full lg:w-1/2 2xl:w-1/3 mx-auto">
    <div class="border border-stone-300/75 rounded-xl text-left p-14 my-6 mb-2 bg-white text-stone-900">
      {#if fitbitData.user}
        <h1 class="text-5xl font-bold font-serif">Thanks {fitbitData.user.firstName}!</h1>
        <p class="text-2xl font-light text-stone-500 my-7">You're all set!</p>
        <p class='text-stone-800 font-bold font-mono text-small'>Just as a preview Ehsanul, we get a lot of user metadata as you can see below.</p>
        <div class='my-4 text-left font-mono break-words'>
        {@html generateKeyValueHtml(fitbitData.user)}
      </div>
      {:else if data.authCode && !fitbitData.error}
        <div class='items-center'>
          <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-100 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>        
      </div>
      {:else}
      <h1 class="text-6xl font-bold font-serif">Hello!</h1>
      <p class="text-2xl font-light text-stone-500 my-7">We need permission to use your fitbit data for research. <a href="#" class='text-teal-700 hover:underline'>Find out more →</a></p>
      <p class='text-stone-800'><strong>Can put some more information for user here or some terms to agree to etc... </strong>Nunc in nisl auctor, convallis urna sit amet, tincidunt velit. Mauris tempor purus augue, vitae tristique tellus cursus eget. Aenean neque tortor, porttitor in pulvinar condimentum, cursus quis sapien.
      </p>
      <div class="text-center my-8 mb-0">
        <button
          class="bg-teal-600 rounded-full hover:bg-teal-700 text-lg text-white py-4 px-8"
          on:click={generateCodeAndURL}
        >
          Allow access to my Fitbit data
        </button>
      </div>
      {/if}
    </div>
    <p class='text-neutral-500'>Contact us at ehsanul@something.com. Privacy policy. Blah...</p>
  </div>