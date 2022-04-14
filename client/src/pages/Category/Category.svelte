<script>
    import {base_url} from "../../stores/general-store";
    import NotFound from "../../components/NotFound/NotFound.svelte";
    import Course from "../../components/Category/Course.svelte";

    export let id;

    let courses;
    let is401 = false;

    $: onUpdate(id);

    async function onUpdate(id) {
        courses = []; // for a better user experience when id changes

        const response = await fetch(`${$base_url}/courses/category/${id}`);
        const data = await response.json();

        if (data.error) {
            is401 = true;
            return;
        }

        courses = data.data;
    }
</script>
{#if is401}
    <NotFound/>
{:else}
    <div class="content">
        {#each courses as course}
            <Course {course}/>
        {/each}
    </div>
{/if}