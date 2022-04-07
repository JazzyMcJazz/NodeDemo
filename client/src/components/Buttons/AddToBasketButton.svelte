<script>
    import {MdShoppingCart} from "svelte-icons/md";

    export let onclick
</script>

<div on:click={onclick} class="button"><div class="icon"><MdShoppingCart/></div> Add to basket</div>

<style>
    .button {
        width: 150px;
        height: 45px;
        background-color: #00D115;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin: auto;
        border-radius: 8px;
    }

    .button:hover {
        cursor: pointer;
    }

    .icon {
        width: 32px;
        height: 32px;
    }
</style>