<script>
    import MdArrowForward from 'svelte-icons/md/MdArrowForward.svelte'
    import {useNavigate} from "svelte-navigator";

    const navigate = useNavigate();
</script>

<div on:click={() => navigate('/payment')} class="button">
    Checkout <div class="icon"><MdArrowForward/></div>
</div>

<style>
    .button {
        background-color: #00D115;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin: 0;
        padding: 0 3px;
        border-radius: 8px;
        font-weight: bold;
    }

    .button:hover {
        cursor: pointer;
    }

    .icon {
        width: 32px;
        height: 27px;
    }
</style>