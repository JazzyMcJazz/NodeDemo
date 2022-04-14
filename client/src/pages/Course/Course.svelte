<script>

    import {onMount} from "svelte";
    import {base_url, fallback_img} from "../../stores/general-store";
    import NotFound from "../../components/NotFound/NotFound.svelte";
    import AddToBasketButton from "../../components/Buttons/AddToBasketButton.svelte";
    import {addToBasket, getBasket, removeFromBasket} from "../../stores/cookie-store";

    export let id;

    let isFetched = false;
    let is404 = false;

    let title, description, price, image_url;

    onMount(async () => {
        const response = await fetch(`${$base_url}/courses/id/${id}`);

        const data = await response.json();

        if (response.status !== 200)
            is404 = true; // not necessarily true, but this is the error handling for now..

        const course = data.data;

        title = course.title;
        description = course.description;
        price = course.price;
        image_url = course.image_url ? course.image_url : $fallback_img;

        isFetched = true;
    });

    let isInBasket = getBasket().includes(id.toString());
    function handleBasketButton() {
        isInBasket
            ? isInBasket = removeFromBasket(id) // remove from basket
            : isInBasket = addToBasket(id);
    }
</script>

{#if isFetched}
    {#if is404}
        <NotFound/>
    {:else }
        <div class="content">
            <h3>{title}</h3>
            <img src={image_url} alt="course"/>
            <div class="description">
                <p>{description}</p>
            </div>
            <p class="price">{price.toLocaleString()} <span>DKK</span></p>
            <div class="basket-button"><AddToBasketButton {isInBasket} onclick={handleBasketButton}/></div>
        </div>
    {/if}
{/if}
<style>
    .content {
        text-align: center;
        background-color: white;
        margin: 10px 0 10px 0;
        padding: 5px 0 20px 0;
    }

    h3 {
        margin: 0;
        padding: 0 0 10px 0;
    }

    img {
        width: 100%
    }

    .description {
        width: 100%;
        text-align: left;
    }

    p {
        margin: 0 10px;
    }

    .price {
        font-size: 1.8em;
        font-weight: bold;
        margin-top: 50px;
    }

    span {
        font-size: 0.5em;
    }

    .basket-button {
        display: flex;
        justify-content: center;
    }
</style>