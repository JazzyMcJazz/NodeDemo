<script>
    import {Router, Route} from "svelte-navigator";
    import {swipe} from 'svelte-gestures';
    import {fade} from 'svelte/transition';
    import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte';
    import Navbar from "./components/Navbar/Navbar.svelte";
    import Home from './pages/Home/Home.svelte'
    import Auth from "./pages/Auth/Auth.svelte";
    import Profile from "./pages/Profile/Profile.svelte";
    import Course from "./pages/Course/Course.svelte";
    import Footer from "./components/Footer/Footer.svelte";
    import Category from "./pages/Category/Category.svelte";
    import NotFound from "./components/NotFound/NotFound.svelte";
    import Basket from "./pages/Basket/Basket.svelte";
    import Checkout from "./pages/Checkout/Checkout.svelte";

    let scrollY;
    const scrollTop = () => window.scrollTo({top: 0, left: 0, behavior: "smooth"});

    let open = false; // sidebar

    // handles opening the sidebar by swiping
    const swipeOptions = {timeframe: 300, minSwipeDistance: 60, touchAction: 'pan-y'};
    function handleSwipe(e) {
        if (e.detail.direction === 'left') open = false;
        else if (e.detail.direction === 'right') open = true;
    }
</script>

<Router primary={false}>
    {#if scrollY > 250}
        <span id="auto-scroller" in:fade={{duration: 200}} out:fade on:click={scrollTop}><MdArrowDropUp/></span>
    {/if}

    <main use:swipe={swipeOptions} on:swipe={handleSwipe}>
        <Navbar bind:open/>
        <Route><NotFound/></Route>
        <Route path="/"><Home/></Route>
        <Route path="/authentication"><Auth/></Route>
        <Route path="/basket"><Basket/></Route>
        <Route path="/categories/:id" let:params><Category id={params.id}/></Route>
        <Route path="/courses/:id" let:params><Course id={params.id}/></Route>
        <Route path="/profile"><Profile/></Route>
        <Route path="/payment"><Checkout/></Route>
    </main>

    <Footer/>
</Router>

<svelte:window bind:scrollY={scrollY}/>

<style>

    main {
        min-height: calc(100vh - 180px);
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