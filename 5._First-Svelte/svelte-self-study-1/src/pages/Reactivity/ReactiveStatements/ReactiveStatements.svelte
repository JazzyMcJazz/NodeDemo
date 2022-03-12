<script>
    const src = '/img/footman.gif';
    const alt = 'Warcraft 2 Footman';

    let sentences = [
        new Audio('/sounds/awaiting-orders.wav'),
        new Audio('/sounds/your-command.wav'),
        new Audio('/sounds/yes-sire.wav'),
        new Audio('/sounds/my-lord.wav'),
        new Audio('/sounds/i-do-have-work.wav'),
        new Audio('/sounds/are-you-still-touching-me.wav'),
    ];

    // Disregard the absolute redundancy of this
    let i = -1;
    $: if (i === 0) sentences[0].play();
    else if (i === 1) sentences[1].play();
    else if (i === 2) sentences[2].play();
    else if (i === 3) sentences[3].play();
    else if (i === 4) sentences[4].play();
    else if (i === 5) sentences[5].play();
</script>

<img {src} {alt} on:click={() => i = i >= 5 ? 0 : ++i}/>
<p>Click the Footman</p>

<style>
    img {
        max-width: 50px;
    }

    p {
        font-size: 0.8em;
        font-style: italic;
    }
</style>

