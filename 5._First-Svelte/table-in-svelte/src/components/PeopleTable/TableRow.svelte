<script>
    export let data = [];
    export let pagination = {};

    $: start = pagination.pageNumber * pagination.itemsPerPage - pagination.itemsPerPage;
    $: end = pagination.pageNumber * pagination.itemsPerPage;
</script>

<tbody>
    {#each data.slice(start, end) as person}
        <tr>
            <td><img alt={`${person.name}'s avatar`} src={person.avatar}/></td>
            <td>{person.name}</td>
            <td>{person.email}</td>
        </tr>
    {/each}
</tbody>

<style>
    img {

        border-radius: 50px;
        width: 50px;
        margin: 0;
        display: block;
    }

    tr {
        height: 50px;
    }

    tr:nth-child(odd) {
        background-color: #999999;
    }

    tr:nth-child(odd):hover {
        background-color: #adaaaa;
    }

    tr:nth-child(even) {
        background-color: #666666;
    }

    tr:nth-child(even):hover {
        background-color: #7e7a7a;
    }

    td {
        border-radius: 50px;
    }

    td:first-child {
        width: 50px;
        height: 50px;
    }
</style>