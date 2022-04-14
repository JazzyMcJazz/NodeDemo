<script>
    import {MdShoppingCart} from "svelte-icons/md";

    export let onclick

    export let isInBasket;

    $: text = isInBasket ? 'Remove from basket' : 'Add to basket'
</script>

<div on:click={onclick} class:isInBasket class="button">
    <div class="icon"><MdShoppingCart/></div> {text}
</div>

<style>
    .button {
        background-color: #00D115;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin: 0;
        padding: 5px;
        border-radius: 8px;
    }

    .isInBasket {
        background-color: #585858;
    }

    .button:hover {
        cursor: pointer;
    }

    .icon {
        width: 32px;
        height: 32px;
    }
</style>