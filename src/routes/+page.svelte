<script>
  import { onMount } from "svelte";
  import {
    sha256,
    base64urlencode,
    dec2hex,
  } from "$lib/helpers";
  import { PUBLIC_CLIENT_ID } from "$env/static/public";
  import guys from "$lib/assets/guys.png";
  import kcl from "$lib/assets/kcl.svg";

  let codeVerifier, codeChallenge;
  let responseType = "code";
  let clientID = PUBLIC_CLIENT_ID;

  export let data;
  $: fitbitData = data;

  onMount(() => {
    if (data.isRSIDvalid && !localStorage.getItem("research_id")) {
      localStorage.setItem("research_id", data.researchID);
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
        "&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight";
      // redirect the user to the Fitbit authorization URL
      window.location.href = requestURL;
    } catch (error) {
      console.log(error);
    }
  }
</script>

{#if fitbitData.error}
  <div class="text-center text-teal-800 text-sm p-4 -mb-10 w-full lg:w-1/2 2xl:w-1/3 mx-auto">
    <p>
      {fitbitData.error}
    </p>
  </div>
{/if}
<div class="container px-4 py-6 text-center w-full lg:w-1/2 2xl:w-1/3 mx-auto">
  <div class="text-2xl text-stone-600 mt-4">
    <strong>SEvERe-PTS:</strong> Structured Exercise vs Endovascular Reconstruction
    in Post Thrombotic Syndrome.
  </div>
  <div
    class="border border-stone-300/75 rounded-xl text-left p-14 my-6 mb-2 bg-white text-stone-900 shadow-xl shadow-stone-300/25"
  >
    {#if fitbitData.user}
      <h1 class="text-2xl font-bold font-serif">
        Thanks {fitbitData.user.firstName}!
      </h1>
      <p class="text-2xl font-light text-stone-500 my-7">You've successfully linked your fitbit account. You can now safely close this window.</p>
    {:else if data.authCode && !fitbitData.error}
      <div class="items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-100 animate-spin fill-blue-600"
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
    {:else}
      <p class="text-2xl font-light text-stone-500">
        We need your permission to access your FitBit data. This will allow us
        to capture your heart rate and step count for the study period.
      </p>
      <div class="mt-6">
        <div class="flex items-center">
          <input
            id="default-checkbox"
            type="checkbox"
            value=""
            class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded"
          />
          <label
            for="default-checkbox"
            class="ms-2 text-sm font-medium text-gray-900"
            >I have read the participant information sheet <a
              href="/"
              class="text-teal-700 hover:underline"
              >(click here if you haven't →)</a
            ></label
          >
        </div>
        <div class="flex items-center">
          <input
            id="TOS-checkbox"
            type="checkbox"
            value=""
            class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded"
          />
          <label
            for="TOS-checkbox"
            class="ms-2 text-sm font-medium text-gray-900"
          >
            I agree to the <a href="/" class="text-teal-700 hover:underline"
              >Terms of Service</a
            >
            and
            <a href="/" class="text-teal-700 hover:underline">Privacy Policy</a
            ></label
          >
        </div>
      </div>
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
  <p class="text-neutral-500">Contact us at ehsanul.choudhury@gstt.nhs.uk</p>
  <div class="flex flex-basis mt-8">
    <div class="flex basis-1/2 justify-center">
      <img src={guys} class="w-[210px] mr-4" alt="Guys and St Thomas Hospital NHS logo"/>
    </div>
    <div class="flex basis-1/2 justify-center">
      <img src={kcl} class="w-24" alt="Kings College London logo"/>
    </div>
  </div>
</div>
