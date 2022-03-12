<script>
    export let title;
    export let topics = [];

    let showTopic = topics[0].title;
</script>

<div id="container">
    <div id="page">
        <h1>{title}</h1>
        <div id="topics">
            <div id="buttons">
                {#each topics as topic}
                    <button on:click={() => showTopic = topic.title}>{topic.title}</button>
                {/each}
            </div>

            {#each topics as topic}
                {#if (showTopic === topic.title)}
                    <div class="topic">
                        <h3>Topic: {topic.title}</h3>
                        <svelte:component this={topic.component}/>
                        <a class="source" target="_blank" href={topic.src}>source</a>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>

    button {
        margin: 10px;
    }

    #container {
        width: 100%;
        justify-content: center;
    }

    #buttons {
        width: 100%;
    }

    #page {
        background-color: pink;
        padding: 20px;
        border-radius: 12px;
    }

    #topics {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .topic {
        height: fit-content;

        background-color: cadetblue;
        padding: 5px;
        margin: 5px;
        border-radius: 12px;
    }

    .source {
        flex: 1 1 100%;
    }
</style>