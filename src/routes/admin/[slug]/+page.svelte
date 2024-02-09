<script>
  export let data;
  let hrdata = data.hr;
</script>

<p class='mb-4'>
  <a href="/admin" class="text-teal-700 hover:underline">Back to admin panel</a>
</p>
<div class='text-sm font-mono text-stone-700 break-all'>
    {JSON.stringify(hrdata)}
</div>
