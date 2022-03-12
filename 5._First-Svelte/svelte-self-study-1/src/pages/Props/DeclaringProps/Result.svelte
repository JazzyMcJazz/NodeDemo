<script>
    export let answer = '';

    let result = '';
    $: result = answer === '' ? '' : load();

    function load() {
        setTimeout( ( )=> result = answer === 'True' ? 'Correct!' : 'Incorrect', 1000);
        return '💭';
    }
</script>

<p>{result}</p>

