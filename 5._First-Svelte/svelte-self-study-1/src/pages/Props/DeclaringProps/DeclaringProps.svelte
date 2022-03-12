<script>
    import Result from "./Result.svelte";

    let text;
    let answer;

    function handleSubmit(e) {
        e.preventDefault();
        answer = text;
    }

</script>

<p>Is Svelte cool?</p>
<form on:submit={handleSubmit}>
    <input placeholder="True or False" bind:value={text}>
</form>
<Result {answer}/>