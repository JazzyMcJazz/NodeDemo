<script>
    import Parent from "../../components/parents/Parent.svelte";
    import Child from "../../components/children/Child.svelte";
    import { supermarket } from "../../store/supermarket";

    const parents = [{id: 1, name: 'Chris'},
        {id: 2, name: 'Peri'}
    ];
    const children = [
        {id: 1, name: 'Bobu', isGirl: false},
        {id: 2, name: 'Peri Jr.', isGirl: false, },
        {id: 3, name: 'Koppa', isGirl: true}
    ];

    function handleFamilyMeeting(name) {
        console.log(`A family meeting has been called by ${name}!`);
    }
</script>

<h1>Welcome to the YO MAMA'S BUTT</h1>

{#each parents as parent (parent.id)}
    <Parent onCallMeeting={handleFamilyMeeting} name={parent.name}/>
{/each}

<Child onCallMeeting={handleFamilyMeeting} name={children[0].name}/>
<Child onCallMeeting={handleFamilyMeeting} name={children[1].name}/>
<Child onCallMeeting={handleFamilyMeeting} isGirl={children[2].isGirl} name={children[2].name}/>

<div>{JSON.stringify($supermarket)}</div>


<style>

</style>
