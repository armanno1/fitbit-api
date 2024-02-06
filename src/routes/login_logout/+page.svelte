<script>
  export let form;
</script>

<form class="space-y-4" method="POST" action="?/login">
  <div>
    <label
      for="email"
      class="block mb-2 text-sm font-medium text-gray-900"
      >Your email</label
    >
    <input
      type="text"
      name="email"
      placeholder="Email"
      value={form?.email ?? ""}
      required
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
    />
  </div>
  <div>
    <label
      for="password"
      class="block mb-2 text-sm font-medium text-gray-900"
      >Password</label
    >
    <input
      type="password"
      name="password"
      placeholder="••••••••"
      required
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
    />
  </div>
  <button
    type="submit"
    class="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >Sign in</button
  >
</form>

{#if form?.invalid}<mark>{form?.message}!</mark>{/if}
