<script>
    import ChatRoom from './ChatRoom.svelte';

    let chatRooms = [
        {id: 1, title: 'Peasant', message: `Hi, I'm a peasant`},
        {id: 2, title: 'Footman', message: `Hi, I'm a footman`},
        {id: 3, title: 'Knight', message: `Hi, I'm a knight`},
        {id: 4, title: 'Paladin', message: `Hi, I'm a paladin`},
    ]

    function handleClick() {
        chatRooms = chatRooms.slice(1);
    }
</script>

<button on:click={handleClick}>
    Remove First Chatroom
</button>

<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 1em">
    <div>
        <h2>Keyed</h2>
        <p>chatrooms</p>
        {#each chatRooms as chatRoom (chatRoom.id)}
            <ChatRoom {...chatRoom}/>
        {/each}
    </div>

    <div>
        <h2>Unkeyed</h2>
        <p>chatrooms</p>
        {#each chatRooms as chatRoom}
            <ChatRoom {...chatRoom}/>
        {/each}
    </div>
</div>

<style>
    p {
        margin-top: -20px;
    }
</style>
