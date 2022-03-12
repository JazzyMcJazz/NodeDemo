<script>
    import faker from "@faker-js/faker";
    import TableHead from "./TableHead.svelte";
    import TableRow from "./TableRow.svelte";

    let fakeDatabase = [];
    let pagination = {
        pageNumber: 1,
        itemsPerPage: 10,
    }

    for (let i = 0; i < 143; i++) {
        const person = {
            avatar: faker.image.avatar(),
            name: faker.name.findName(),
            email: faker.internet.email(),
        }

        fakeDatabase.push(person);
    }

    function getSortedData(event) {
        fakeDatabase = event.detail.sort(fakeDatabase);
    }

    function previousPage() {
        if (pagination.pageNumber > 1) pagination.pageNumber--;
    }

    function nextPage() {
        if (pagination.pageNumber < fakeDatabase.length / pagination.itemsPerPage) pagination.pageNumber++;
    }

</script>

<div>
    <table>
        <TableHead
                on:sortByName={getSortedData}
                on:sortByEmail={getSortedData}
                paginationFunctions={[previousPage, nextPage]}
        />
        <TableRow data={fakeDatabase} {pagination}/>
    </table>
</div>

<style>
    div {
        display: flex;
        justify-content: center;
    }
    table {
        width: 80%;
    }
</style>
