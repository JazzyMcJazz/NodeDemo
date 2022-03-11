<script>
    import Apple from './Apple.svelte';

    let apples = ["🍏", "🍎", "🍏", "🍎", "🍎", "🍏"];

    function pickApples() {
        apples.pop();
        apples = apples;
    }
</script>

<div id="tree">
    <h2>I'm a tree</h2>

    {#each apples as apple}
        <Apple apple={apple}/>
    {/each}

    <button on:click={pickApples}>Pick an apple</button>
</div>

<div id="trunk"></div>

<style>
    #tree {
        background-color: lightgreen;
    }

    #trunk {
        height: 200px;
        width: 50px;
        background-color: burlywood;
    }
</style>