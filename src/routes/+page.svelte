<script>
  import { onMount } from "svelte";
  import { sha256, base64urlencode, dec2hex } from "$lib/helpers";
  import { PUBLIC_CLIENT_ID } from "$env/static/public";

  let TOSchecked = false;
  let PISchecked = false;
  let codeVerifier, codeChallenge;
  let responseType = "code";
  let clientID = PUBLIC_CLIENT_ID;
  export let data;
  $: fitbitData = data;

  onMount(() => {
    if (data.isRSIDvalid) {
      localStorage.setItem("research_id", data.rsid);
    }
    if (data.authCode && !fitbitData.error) {
      getToken();
    }
  });

  async function getToken() {
    try {
      const response = await fetch(
        `/api?authCode=${data.authCode}&codeVerifier=${localStorage.getItem(
          "code_verifier"
        )}&researchID=${localStorage.getItem("research_id")}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      fitbitData = responseData;
    } catch (error) {
      console.log(error);
    }
  }

  function generateCodeVerifier() {
    var array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    const code_verifier = Array.from(array, dec2hex).join("");
    localStorage.setItem("code_verifier", code_verifier);
    return code_verifier;
  }

  async function generateCodeChallenge(codeVerifier) {
    var hashed = await sha256(codeVerifier);
    var base64encoded = base64urlencode(hashed);
    return base64encoded;
  }

  function generateCodeAndURL() {
    codeVerifier = generateCodeVerifier();
    generateCodeChallenge(codeVerifier).then((challenge) => {
      codeChallenge = challenge;
      initiateFitbitAuthorization();
    });
  }

  async function initiateFitbitAuthorization() {
    try {
      // use the generated codeVerifier and codeChallenge to construct the authorization URL
      const requestURL =
        "https://www.fitbit.com/oauth2/authorize?client_id=" +
        clientID +
        "&response_type=" +
        responseType +
        "&code_challenge=" +
        codeChallenge +
        "&code_challenge_method=S256" +
        "&scope=activity%20heartrate%20profile%20";
      window.location.href = requestURL;
    } catch (error) {
      console.log(error);
    }
  }
</script>

{#if fitbitData.error}
  <p class="text-center text-red-700 mb-4 font-light">
    {fitbitData.error}
  </p>
{/if}

{#if fitbitData.user}
  <p class="text-xl font-light text-stone-700 mb-4">
    Thanks! You have successfully granted the SEvERe-PTS research team access to
    your heart rate and step count data. Please do not refresh the page.
  </p>
  <p class="text-xl font-light text-stone-700">
    You can now safely close this window.
  </p>
{:else if !data.authCode && (!data.rsid || !data.isRSIDvalid)}
  <!-- This just makes sure the callback url doesn't flash this error -->
  <p class="text-stone-700 text-xl font-light break-all">
    Unfortunately the link you have used is invalid. Please check the linked
    provided to you by email or contact <a
      href="mailto:ehsanul.choudhury@gstt.nhs.uk"
      class="text-teal-700 hover:underline">ehsanul.choudhury@gstt.nhs.uk</a
    >.
  </p>
{:else if data.authCode && !fitbitData.error}
  <!-- Loading spinner -->
  <div class="text-center">
    <div role="status" class="text-center">
      <svg
        aria-hidden="true"
        class="w-12 h-12 text-gray-100 animate-spin fill-teal-600 mx-auto"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  </div>
  <!-- End loading spinner -->
{:else}
  <p class="text-xl font-light text-stone-700">
    We need permission to access your FitBit data. This will allow us to look at
    your heart rate and step count for the study period.
  </p>
  <div class="mt-8">
    <div class="flex items-center mb-2">
      <input
        id="default-checkbox"
        type="checkbox"
        bind:checked={PISchecked}
        class="w-4 h-4 shrink-0 text-teal-600 bg-gray-100 border-gray-300 rounded"
      />
      <label for="default-checkbox" class="text-sm text-stone-500 ms-3"
        >I have read the <a href="/" class="text-teal-700 hover:underline"
          >Participant Information Sheet</a
        ></label
      >
    </div>
    <div class="flex items-center">
      <input
        id="TOS-checkbox"
        type="checkbox"
        bind:checked={TOSchecked}
        class="w-4 h-4 shrink-0 text-teal-600 bg-gray-100 border-gray-300 rounded"
      />
      <label for="TOS-checkbox" class="text-sm text-stone-500 ms-3">
        I agree to the <a href="/terms" class="text-teal-700 hover:underline"
          >Terms of Service</a
        >
        and
        <a href="/privacy" class="text-teal-700 hover:underline"
          >Privacy Policy</a
        ></label
      >
    </div>
  </div>
  <div class="text-center my-8 mb-0">
    <button
      class="bg-teal-600 rounded-full hover:bg-teal-700 text-lg text-white py-4 px-8 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border disabled:text-gray-500 disabled:border-gray-400/40"
      on:click={generateCodeAndURL}
      disabled={!(TOSchecked && PISchecked)}
    >
      Allow access to my Fitbit data
    </button>
  </div>
{/if}

