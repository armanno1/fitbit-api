<script>
  export let data;
  let hrdata = data.hr;
</script>
<div class='flex flex-col text-sm'>
    {data.researchID}<br />
    {#if hrdata && hrdata['activities-heart']}
      {#each hrdata['activities-heart'] as activity (activity.dateTime)}
        <div class="flex items-center space-x-4">
          <div class="flex">
            <p class="">{activity.dateTime}</p>
          </div>
          {#if activity.value && activity.value.heartRateZones}
            <div class="bg-stone-200 px-2 py-1 rounded-sm overflow-x-scroll whitespace-nowrap leading-tight flex-grow">
              {#each activity.value.heartRateZones as zone (zone.name)}
                Zone: {zone.name}, Max: {zone.max}, Min: {zone.min}{#if zone !== activity.value.heartRateZones[activity.value.heartRateZones.length - 1]}, {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
</div>
