<script>
  export let data;
</script>

<div>
  <table
    class="table-auto w-full text-sm text-left rtl:text-right text-gray-500"
  >
    <thead
      class="text-gray-700 uppercase
    "
    >
      <tr>
        <th class='px-6 py-2 border-b border-gray-200'>Research ID</th>
      </tr>
    </thead>
    <tbody>
      {#each data.researchIDs as rID}
        <tr>
          <td class='px-6 py-2 border-b border-gray-100'>
            <a
              href="/admin/{rID.research_id}"
              class="font-bold text-teal-700 hover:underline mb-2"
              >{rID.research_id}</a
            >
          </td>
        </tr>
      {/each}</tbody
    >
  </table>
</div>
