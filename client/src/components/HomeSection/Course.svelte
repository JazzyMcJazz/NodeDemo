<script>
    import {fallback_img} from "../../stores/general-store";

    export let course = {};
    if (!course.image_url) course.image_url = $fallback_img;
</script>

<main>
    <div class="img-container">
        <input type="image" src={course.image_url} alt="Course image"/>
    </div>
    <div>{course.title}</div>
    <div class="price">{Number(course.price).toLocaleString()} <span class="currency">DKK</span></div>
</main>

<style>
    main {
        margin: 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: black;
        font-size: 0.8em;
    }
    .currency {
        font-size: 0.6em;
    }

    input {
        width: 155px;
        height: 155px;
        object-fit: cover;
        border-radius: 12px;
    }
</style>