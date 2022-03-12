<script>
    let count = 0;

    function handleClick() {
        count += 1;
    }
</script>

<div>
    <button on:click={handleClick}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
</div>

<style>
    div {
        width: 100%;
    }
</style>
