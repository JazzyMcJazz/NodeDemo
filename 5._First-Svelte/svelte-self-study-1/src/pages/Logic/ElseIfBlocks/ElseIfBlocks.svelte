<script>
    let x = 0;
    $: x = x == null ? 0 : x;
</script>

<form>
    <input type="number" bind:value={x}>
</form>

{#if x > 10}
    <p>{x} is greater than 10</p>
{:else if 5 > x}
    <p>{x} is less than 5</p>
{:else}
    <p>{x} is between 5 and 10</p>
{/if}

<style>
    input {
        width: 60px;
        border-radius: 12px;
    }
</style>