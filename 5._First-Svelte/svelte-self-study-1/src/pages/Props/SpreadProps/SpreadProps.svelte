<script>
    import Phrase from "./Phrase.svelte";

    const words = {
        these: 'These',
        words: 'words',
        are: 'are',
        spread: 'spread',
        props: 'props',
    }
</script>

<Phrase {...words}/>