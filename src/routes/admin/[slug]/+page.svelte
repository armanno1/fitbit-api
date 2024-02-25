<script>
  export let data;

  async function handleDownload() {
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.hr["HRdata"]),
    });

    if (response.ok) {
      const filename = response.headers
        .get("Content-Disposition")
        .split("filename=")[1];
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    }
  }
</script>

<div class="font-mono text-stone-700 break-all">
  <p class="text-xl">{data.researchID}</p>
  <p class="mb-4">
    <a href="/admin" class="text-teal-700 font-sans hover:underline"
      >Back to admin panel</a
    >
  </p>
  <p>
    {#await data.hr}
      Loading...
    {:then hr}
      <p class='text-sm mb-6'>
        {JSON.stringify(hr["HRdata"]).slice(0, 130)}...
      </p>
      <button
        on:click={handleDownload}
        class="rounded-md py-1.5 px-3 text-white text-sm font-sans bg-teal-600 hover:bg-teal-700"
        >Download heart rate data as CSV</button
      >
    {/await}
  </p>
</div>
