<script>
    export let title;
    export let top_title;
    export let topics;
</script>

<div id="container">
    <div id="page">
        <h1>{title}</h1>
        <div id="topics">
            {#each topics as topic}
                <div class="topic">
                    <h3>Topic: {topic.title}</h3>
                    <svelte:component this={topic.component}/>
                </div>
                <a href={topic.src}>source</a>
            {/each}
        </div>
    </div>
</div>

<style>

    #container {
        width: 100%;
        justify-content: center;
    }

    #page {
        background-color: pink;
        padding: 20px;
    }

    #topics {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .topic {
        height: fit-content;
        background-color: burlywood;
        padding: 5px;
        margin: 5px;
    }
</style>