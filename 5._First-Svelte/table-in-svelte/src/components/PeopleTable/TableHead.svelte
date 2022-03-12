<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let alphabeticalByName = true;
    let alphabeticalByEmail = true;

    // dispatch functions could have been prop functions,
    // but I wanted to try and dispatch events
    function sortByName() {
        dispatch('sortByName', {
            sort: (data) => {
                let sorted;
                alphabeticalByName
                    ? sorted = data.sort((a, b) => a.name > b.name ? 1 : -1)
                    : sorted = data.sort((a, b) => a.name < b.name ? 1 : -1);
                alphabeticalByName = !alphabeticalByName;
                alphabeticalByEmail = true;
                return sorted;
            }
        })
    }
    function sortByEmail() {
        dispatch('sortByEmail', {
            sort: (data) => {
                let sorted;
                alphabeticalByEmail
                    ? sorted = data.sort((a, b) => a.email > b.email ? 1 : -1)
                    : sorted = data.sort((a, b) => a.email < b.email ? 1 : -1);
                alphabeticalByEmail = !alphabeticalByEmail;
                alphabeticalByName = true;
                return sorted;
            }
        })
    }

    export let paginationFunctions;
</script>

<thead>
    <tr>
        <th class="clickable pagination" on:click={paginationFunctions[0]} colspan="2">← Previous Page</th>
        <th class="clickable pagination" on:click={paginationFunctions[1]}>Next Page →</th>
    </tr>
    <tr class="empty"></tr>
    <tr>
        <th>Avatar</th>
        <th class="clickable" on:click={sortByName}>Name ⇅</th>
        <th class="clickable" on:click={sortByEmail}>Email ⇅</th>
    </tr>
</thead>

<style>
    .clickable {
        width: fit-content;
        text-decoration: underline;
    }

    .clickable:hover {
        cursor: pointer;
    }

    .pagination {
        font-size: 0.7em;
        text-decoration: none;
    }

    .empty {
        height: 15px;
    }
</style>