<script>
    let isClicked = false;
    $: clicked = isClicked ? 'Unclick' : 'Click';

    function handleClick() {
        isClicked = !isClicked
    }
</script>

<div>
    <button on:click={handleClick}>
        {clicked}
    </button>
</div>

<style>
    div {
        width: 100%;
    }
</style>
