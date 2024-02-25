<script>
  export let data;

  async function handleDownload() {
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.hr),
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

<p class="mb-4">
  <a href="/admin" class="text-teal-700 hover:underline">Back to admin panel</a>
</p>
<div class="text-sm font-mono text-stone-700 break-all">
  {#await data.hr}
    Loading...
  {:then hr}
    {JSON.stringify(hr).slice(0, 130)}...<br /><br />
    <button on:click={handleDownload}>Download CSV</button>
  {/await}
</div>
