<script>
  import "../app.css";
  import guys from "$lib/assets/guys.png";
  import kcl from "$lib/assets/kcl.svg";
  export let data;
</script>

{#if data.session}
  <div
    class="text-center py-2 border-b border-stone-300/50 bg-stone-200 text-stone-700 text-sm"
  >
    <form action="/login_logout?/logout" method="POST">
      <button
        type="submit"
        class="border border-stone-400/50 rounded-md py-1 px-2 bg-stone-300/25 hover:bg-stone-300"
        >Logout</button
      >
      /
      <a href="/" class="hover:underline">Home</a> /
      <a href="/admin" class="hover:underline">Admin</a>
    </form>
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
