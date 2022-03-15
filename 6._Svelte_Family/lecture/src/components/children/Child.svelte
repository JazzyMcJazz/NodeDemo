<script>
    import { supermarket } from "../../store/supermarket";

    export let name;
    export let isGirl = false;
    export let stereotype;
    export let onCallMeeting;

    function eatCereal() {
        supermarket.update(value => {
            value.cereal -= 1;
            return value;
        })
    }
</script>

<h3 on:click={() => onCallMeeting(name)} class:girl={isGirl} class={stereotype || 'no-stereotype'}>I am {name}, child of someone</h3>
<div>Amount of cereal: {$supermarket.cereal}</div>
<button on:click={eatCereal}>Eat Cereal</button>

<style>
    .girl {
        color: deeppink;
    }

    .black-sheep {
        background-color: black;
        color: white;
    }
</style>