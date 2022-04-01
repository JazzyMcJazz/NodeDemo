<script>
    import {Router, Link, Route} from "svelte-navigator";
    import {fade} from 'svelte/transition';
    import MdMenu from 'svelte-icons/md/MdMenu.svelte';
    import MdShoppingCart from 'svelte-icons/md/MdShoppingCart.svelte';
    import MdAccountBox from 'svelte-icons/md/MdAccountBox.svelte';
    import MdEmail from 'svelte-icons/md/MdEmail.svelte';
    import MdPhone from 'svelte-icons/md/MdPhone.svelte';
    import MdWatchLater from 'svelte-icons/md/MdWatchLater.svelte';
    import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte';

    import Home from './pages/Home/home.svelte'
    import Auth from "./pages/Auth/Auth.svelte";

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
                <Link to="/login"><div class="nav-icon"><MdAccountBox/></div></Link>
            </div>
        </nav>

        <Route path="/" component={Home}/>
        <Route path="/login" component={Auth}/>
    </main>

    <footer>
        <div class="grid-box">
            <table>
                <thead><tr><th>Contact</th></tr></thead>
                <tbody>
                    <tr><td><div class="footer-icon"><MdEmail/></div>keastore@riel.expert</td></tr>
                    <tr><td><div class="footer-icon"><MdPhone/></div>+45 1234 5678</td></tr>
                </tbody>
            </table>
        </div>

        <div class="grid-box">
            <table>
                <thead><tr><th colspan="2">Opening Hours</th></tr></thead>
                <tbody>
                <tr>
                    <td>
                        <div class="footer-icon"><MdWatchLater/></div>
                        <div>Mon-Fri:</div>
                    </td>
                    <td>10-18</td>
                </tr>
                <tr>
                    <td>
                        <div class="footer-icon"></div>
                        <div>Sat:</div>
                    </td>
                    <td>10-16</td>
                </tr>
                <tr>
                    <td>
                        <div class="footer-icon"></div>
                        <div>Sun:</div>
                    </td>
                    <td>Closed</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="full-width">©{new Date().getFullYear()} Kea Store</div>
    </footer>
</Router>

<svelte:window bind:scrollY={scrollY}/>

<style>

    main {
        min-height: calc(100vh - 180px - 45px);
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

    footer {
        background-color: #383838;
        height: 180px;
        display: grid;
        grid-template-columns: 50% 50%;
        color: white;
        font-size: 0.85em;
    }

    table {
        text-align: left;
    }

    tr, td {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-icon {
        height: 16px;
        width: 16px;
        margin-right: 5px;
    }

    .grid-box {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .full-width {
        grid-column: span 2;
        text-align: center;
    }

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