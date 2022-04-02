<script>
    import {Router, Link, Route} from "svelte-navigator";
    import {fade} from 'svelte/transition';
    import MdMenu from 'svelte-icons/md/MdMenu.svelte';
    import MdShoppingCart from 'svelte-icons/md/MdShoppingCart.svelte';
    import MdAccountBox from 'svelte-icons/md/MdAccountBox.svelte';
    import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte';
    import Home from './pages/Home/home.svelte'
    import Auth from "./pages/Auth/Auth.svelte";
    import Footer from "./components/Footer/Footer.svelte";
    import {jwtToken} from "./stores/cookie-store";

    let scrollY;
    const scrollTop = () => window.scrollTo({top: 0, left: 0, behavior: "smooth"});
</script>

<Router primary={false}>
    {#if scrollY > 250}
        <span id="auto-scroller" in:fade={{duration: 200}} out:fade on:click={scrollTop}><MdArrowDropUp/></span>
    {/if}
    <main>
        <nav id="nav" class="">
            <div class="nav-section left">
                <Link to="/"><div class="nav-icon"><MdMenu/></div></Link>
            </div>
            <div class="nav-section center">
                <Link to="/"><div class="logo"><div>Kea Store</div></div></Link>
            </div>
            <div class="nav-section right">
                <Link to="/"><div class="nav-icon"><MdShoppingCart/></div></Link>
                <Link to="/authentication"><div class="nav-icon"><MdAccountBox/></div></Link>
            </div>
        </nav>

        <Route path="/" component={Home}/>
        <Route path={"/authentication"} component={Auth}/>
    </main>

    <Footer/>
</Router>

<svelte:window bind:scrollY={scrollY}/>

<style>

    main {
        min-height: calc(100vh - 180px);
    }

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

    .left {justify-content: start}
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

    .logo div { height: fit-content }

    #auto-scroller {
        background-color: yellowgreen;
        color: white;
        width: 45px;
        height: 45px;
        position: fixed;
        right: 15px;
        bottom: 15px;
        border-radius: 25px;
        box-shadow: 0 2px 5px black;

    }

	/*@media (min-width: 640px) {  }*/
</style>