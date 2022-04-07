<script>

    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import NotFound from "../../components/NotFound/NotFound.svelte";
    import AddToBasketButton from "../../components/Buttons/AddToBasketButton.svelte";
    import {basket, getCookie} from "../../stores/cookie-store";

    const path = window.location.pathname;
    const id = path.substring(path.lastIndexOf('/') + 1);

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
        image_url = course.image_url;

        isFetched = true;
    })


    function addToBasket() {

        let items = [];
        if (!!$basket) items = $basket.split(',')

        for (let i in items) {
            let item = items[i].split('x');
            if (item[0] == id) {
                item[1] = Number.parseInt(item[1]) + 1;
                items[i] = `${item[0]}x${item[1]}`;
                document.cookie = `basket=${items}`;
                basket.set(getCookie('basket'));
                window.location.assign('/basket');
                return;
            }
        }

        items.push(`${id}x${1}`);
        document.cookie = `basket=${items}`;
        basket.set(getCookie('basket'));
        window.location.assign('/basket');
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
            <p class="price">{price.toLocaleString()}</p>
            <AddToBasketButton onclick={addToBasket}/>
        </div>
    {/if}
{/if}
<style>
    .content {
        text-align: center;
    }

    h3 {
        margin: 10px 0;
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
</style>