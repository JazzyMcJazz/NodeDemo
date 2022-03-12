<script>

    let text = 'Initial Text'

    let i = 0;

    function handleClick() {
        text = `I can only be changed ${++i} ${i === 1 ? 'time' : 'times'}`
    }
</script>

<button on:click|once={handleClick}>
    Click me
</button>
<p>{text}</p>