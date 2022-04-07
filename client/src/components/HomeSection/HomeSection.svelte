<script>
    import Course from "./Course.svelte";
    import {Link} from "svelte-navigator";
    import {onMount} from "svelte";

    export let title;
    export let url;

    let courses = [];

    onMount(async () => {
        const response = await fetch(url);
        const data = await response.json();
        courses = data.data;
    });
</script>

<div class="header">{title}</div>

<div class="container">
    {#each courses as course}
        <Link to={`/courses/${course.id}`}>
            <div class="course">
                <Course {course}/>
            </div>
        </Link>
    {/each}
</div>


<style>
    .container {
        background-color: white;
        display: flex;
        white-space: nowrap;
        overflow: scroll;
    }

    .course {
        margin: 0 20px;
    }

    .header {
        background-color: #FF0000;
        color: white;
        height: 32px;
        margin: 10px 0 0 0;
        padding: 0 10px;
        display: flex;
        align-items: center;
        font-size: 1.1em;

    }
</style>