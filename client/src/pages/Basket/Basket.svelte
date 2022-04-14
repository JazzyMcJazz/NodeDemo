<script>
    import {getBasket, removeFromBasket} from "../../stores/cookie-store";
    import {base_url, fallback_img} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";
    import {onMount} from "svelte";
    import CheckoutButton from "../../components/Buttons/CheckoutButton.svelte";

    let basket = getBasket();

    let basketData = [];

    let total;

    onMount(async () => {
        const response = await fetch(`${$base_url}/courses/basket`);
        const data = await response.json();

        if (data.data) {
            basketData = data.data;
            updateTotal();
        }

    })

    function remove(id) {
        if (!removeFromBasket(id)) { // if false, the item is not in the basket
            basketData = basketData.filter(item => item.id !== id);
            updateTotal();
        }
    }

    function updateTotal() {
        let subtotal = 0;
        basketData.forEach(item => subtotal += item.price);
        total = subtotal.toLocaleString();
    }
</script>

<div class="content">
    <table>
        <thead>
        <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Remove</th>
        </tr>
        </thead>
        <tbody>
        {#each basketData as item}
            <tr>
                <td on:click={navigate(`/courses/${item.id}`)}><img src={item.image_url ? item.image_url : $fallback_img} alt={item.title}></td>
                <td on:click={navigate(`/courses/${item.id}`)}>{item.title}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>
                    <div class="remove-item" on:click={() => remove(item.id)}>
                        <span class="cross1"></span>
                        <span class="cross2"></span>
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

    <div class="total-and-checkout">
        <div class="total">Total: {total}</div>
        <div class="checkout"><CheckoutButton/></div>
    </div>
</div>

<style>

    .content {
        margin: 10px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        text-align: left;
        font-size: 0.8em;
        font-weight: normal;
        padding-bottom: 3px;
    }

    th:last-of-type, td:last-of-type {
        text-align: right;
        width: 1px;
        white-space: nowrap;
    }

    td {
        font-size: 0.9em;
        border-top: 1px solid rgb(0, 0, 0, 0.5);
        border-bottom: 1px solid rgb(0, 0, 0, 0.5);
        border-collapse: collapse;
    }

    td:last-of-type {

    }

    img {
        width: 35px;
        height: 35px;
        margin-top: 2px;
        object-fit: cover;
        border-radius: 12px;
    }

    .remove-item {
        position: relative;
        width: 100%;
    }

    .cross1, .cross2 {
        width: 1.2em;
        height: 3px;
        background-color: black;
        position: absolute;
        right: 35%;
        top: 50%;
    }

    .cross1 {
        transform: rotate(45deg);
    }

    .cross2 {
        transform: rotate(-45deg);
    }

    .total-and-checkout {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .total {
        font-size: 1.5em;
    }


</style>