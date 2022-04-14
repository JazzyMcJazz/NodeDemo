<script>
    import {fallback_img} from "../../stores/general-store";
    import {addToBasket, getBasket, removeFromBasket} from "../../stores/cookie-store";
    import AddToBasketButton from "../Buttons/AddToBasketButton.svelte";
    import {useNavigate} from "svelte-navigator";

    export let course;

    const navigate = useNavigate();

    let isInBasket = getBasket().includes(course.id.toString());
    function handleBasketButton() {
        isInBasket
            ? isInBasket = removeFromBasket(course.id)
            : isInBasket = addToBasket(course.id);
    }

    let imgHeight;
    $: document.documentElement.style.setProperty('--ih', `${imgHeight}px`);
</script>

<div class="course-wrapper">
    <h3 on:click={() => navigate(`/courses/${course.id}`)}>{course.title}</h3>
    <div class="img-wrapper" bind:clientHeight={imgHeight} on:click={() => navigate(`/courses/${course.id}`)}>
        <img src={course.image_url ? course.image_url : $fallback_img} alt="course"/>
    </div>
    <div class="description" on:click={() => navigate(`/courses/${course.id}`)}>{course.description}</div>
    <div class="price">{course.price.toLocaleString()} <span>DKK</span></div>
    <div class="basket-button"><AddToBasketButton {isInBasket} onclick={handleBasketButton}/></div>
</div>

<style>
    .course-wrapper {
        display: grid;
        grid-template:
            'title title'
            'image description'
            'price basket-button';
        grid-template-columns: 50% 50%;
        grid-column-gap: 10px;
        background-color: white;
        text-align: center;
        align-items: center;
        margin: 10px 0;
        padding: 10px 0;
    }

    .course-wrapper:first-of-type {
        margin: 10px 0 5px 0;
    }

    h3 {
        grid-area: title;
        margin: 0 0 10px 0;
    }

    .img-wrapper {
        height: fit-content;
        object-fit: contain;
        padding: 0 5px 0 10px;
        grid-area: image;
    }

    img {
        border-radius: 20px;
        object-fit: contain;
        width: 100%;
    }

    .description {
        /*width: 100%;*/
        margin: 0;
        padding: 0 10px 0 5px;
        height: var(--ih);
        font-size: 0.9em;
        overflow: hidden;
        text-align: left;
        grid-area: description;
    }

    .price {
        grid-area: price;
        font-size: 1.7em;
    }

    span {
        font-size: 0.5em;
    }

    .basket-button {
        grid-area: basket-button;
        width: 100%;
        transform: scale(0.7);
    }
</style>