<script>
    import "../app.css";
    import { enhance } from '$app/forms';
    export let data
</script>

<a href="/">Home</a>   

<span>
    {#if !data.session}
        <a href="/login_logout">login</a>
    {:else}
        <form action="/login_logout?/logout" method="POST" use:enhance>
            <button type="submit">Logout</button>
        </form>
    {/if}
</span>

<slot />
