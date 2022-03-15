<script>
    import { supermarket } from "../../store/supermarket";

    export let name;
    export let onCallMeeting;

</script>

<h2 on:click={() => onCallMeeting(name)}>Hi, my name is {name}</h2>
