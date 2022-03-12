<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function sayHello() {
        dispatch('play', {
            audio: new Audio('/sounds/hello.wav'),
        })
    }
</script>

<div>
    <button on:click={sayHello}>
        Click to say hello
    </button>
</div>
