<script>

    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";

    let isAuthenticated = false;
    let hasLoaded = false;

    onMount(async () => {
       const response = await fetch(`${$base_url}/auth`);

        response.status === 200 ? isAuthenticated = true : isAuthenticated = false;
        hasLoaded = true;
    });

</script>
    {#if hasLoaded}

        {#if !isAuthenticated}
            <
        {:else }
            <h3>Payment Information</h3>
        {/if}
    {/if}
<style>

</style>