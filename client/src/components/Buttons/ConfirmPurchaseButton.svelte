<script>
    export let onclick;
</script>

<div class="button" on:click={onclick}>
    Confirm Purchase
</div>

<style>
    .button {
        background-color: #00D115;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin: 0;
        padding: 0 3px;
        border-radius: 8px;
        font-weight: bold;
    }

    .button:hover {
        cursor: pointer;
    }

    .icon {
        width: 32px;
        height: 27px;
    }
</style>

