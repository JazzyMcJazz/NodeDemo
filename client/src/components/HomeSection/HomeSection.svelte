<script>
    import Course from "./Course.svelte";
    import {Link} from "svelte-navigator";

    export let title;
    export let courses = [];
</script>

<div class="header">{title}</div>

<div class="container">
    {#each courses as course}
        <Link to={`/courses/${course.id}`}>
            <div class="course">
                <Course course={course}/>
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