<script>
    import Message from "./Message.svelte";

    function playAudio(event) {
        event.detail.audio.play();
    }
</script>

<Message on:play={playAudio}/>