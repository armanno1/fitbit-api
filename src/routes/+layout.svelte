<script>
  import "../app.css";
  import guys from "$lib/assets/guys.png";
  import kcl from "$lib/assets/kcl.svg";
  export let data;
</script>

{#if data.session}
  <div class="text-right py-3 px-4 bg-white border-b border-stone-300/75">
    <div class='flex flex-row-reverse items-center justify-between'>
      <div class='flex'>
        <form action="/login_logout?/logout" method="POST">
          <button
            type="submit"
            class="rounded-md py-1.5 px-3 text-white text-sm bg-teal-600 hover:bg-teal-700"
            >Logout</button
          >
        </form>
      </div>
      <div class='text-sm text-stone-500 flex'>Logged in as {data.session.user.email}</div>
    </div>
  </div>
{/if}

<div class="container px-4 py-6 text-center w-full lg:w-1/2 2xl:w-1/3 mx-auto">
  <div class="flex flex-row items-center">
    <div class="flex text-2xl text-stone-600">
      <div>
        <strong>SEvERe-PTS:</strong> Structured Exercise vs Endovascular Reconstruction
        in Post Thrombotic Syndrome.
      </div>
    </div>
    <div class="flex shrink-0 ml-4">
      <img src={kcl} class="w-24 shrink-0" alt="Kings College London logo" />
    </div>
  </div>
  <div
    class="border border-stone-300/75 rounded-xl text-left p-14 my-6 mb-2 bg-white text-stone-900 shadow-xl shadow-stone-300/25"
  >
    <slot />
  </div>
  <div class="flex justify-center mt-6">
    <img
      src={guys}
      class="w-[200px]"
      alt="Guys and St Thomas Hospital NHS logo"
    />
  </div>
</div>

{#if !data.session}
  <div class="text-center text-teal-700 text-sm hover:underline">
    <a href="/login_logout">Researcher Login</a>
  </div>
{/if}
