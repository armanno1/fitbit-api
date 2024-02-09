<script>
  export let data;
</script>

<div>
  <table
    class="table-auto w-full text-sm text-left rtl:text-right text-gray-500"
  >
    <thead
      class="text-gray-700
    "
    >
      <tr>
        <th class="px-6 py-2 border-b border-gray-200">Research ID</th>
        <th class="px-6 py-2 border-b border-gray-200">Granted Access?</th>

      </tr>
    </thead>
    <tbody>
      {#each data.approvedResearchIDs as rid}
        <tr>
          <td class="px-6 py-2 border-b border-gray-100">
            <a
              href="/admin/{rid.research_id}"
              class="font-bold text-teal-700 hover:underline mb-2"
              >{rid.research_id}</a
            >
          </td>
          <td class='px-6 py-2 border-b border-gray-100'>
            Yes
          </td>
        </tr>
      {/each}
      {#each data.unapprovedResearchIDs as id}
        <tr>
          <td class="px-6 py-2 border-b border-gray-100">
            {id.research_id}
          </td>
          <td class='px-6 py-2 border-b border-gray-100'>
            No
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
