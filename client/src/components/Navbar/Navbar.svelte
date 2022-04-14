<script>
    import {Link} from "svelte-navigator";
    import {MdAccountBox, MdMenu, MdShoppingCart} from "svelte-icons/md";
    import {jwtToken} from "../../stores/cookie-store";
    import Sidebar from "../Sidebar/Sidebar.svelte";

    $: isAuthorized = !!$jwtToken;

    export let open = false;
</script>

<Sidebar bind:open/>

<nav id="nav" class="">
    <div class="nav-section left">
        <div on:click={() => open = !open} class="nav-icon"><MdMenu/></div>
    </div>
    <div class="nav-section center">
        <Link to="/"><div class="logo"><div>Kea Store</div></div></Link>
    </div>
    <div class="nav-section right">
        <Link to="/basket"><div class="nav-icon"><MdShoppingCart/></div></Link>
        <Link to={isAuthorized ? '/profile' : '/authentication'}>
            <div class="nav-icon green"><MdAccountBox/></div>
        </Link>
    </div>
</nav>

<style>
    nav {
        background-color: #FF0000;
        top: 0;
        padding: 0 5px;
        display: grid;
        grid-template-columns: 33% 33% 33%;
        height: 45px;
        align-content: center;
    }

    .nav-icon {
        display: contents;
        color: white;
    }

    .nav-section {
        display: flex;
        justify-items: center;
        width: 100%;
        padding: 5px 0;
        object-fit: contain;
        max-height: 35px;
    }

    .left {justify-content: start; width: fit-content}
    .center {justify-content: center}
    .right {justify-content: end}

    .logo {
        font-size: 1.5em;
        font-family: Consolas,serif;
        color: white;
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
</style>