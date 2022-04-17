<script>

import {navigate} from "svelte-navigator";
</script>

<div>
    <h3>Authentication Required</h3>
    <p>Please <span on:click={() => navigate('/authentication')}>login</span> or <span on:click={() =>  navigate('/authentication?newaccount=true')}>create an account</span> to continue</p>
</div>


<style>
    div {
        text-align: center;
    }

    p {
        margin-top: calc(25vh - 21px);
        display: ruby;
    }

    span {
        color: rgb(0,100,200);
        text-decoration: underline;
    }

</style>