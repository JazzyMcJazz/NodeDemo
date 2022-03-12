<script>
    export let title;
    export let message = '';
    const lastMessage = message;
</script>

<div>
    <p id="title">{title}</p>
    <p id="lastMessage">{lastMessage}</p>
</div>

<style>
    div {
        text-align: left;
        border: 1px solid black;
        border-radius: 12px;
        margin: 7px;
        padding: 5px;
    }

    #title {
        font-weight: bold;
    }
</style>