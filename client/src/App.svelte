<script>
    import {Router, Link, Route} from "svelte-navigator";
    import MdMenu from 'svelte-icons/md/MdMenu.svelte';
    import MdShoppingCart from 'svelte-icons/md/MdShoppingCart.svelte';
    import MdAccountBox from 'svelte-icons/md/MdAccountBox.svelte';
    import Home from './pages/Home/home.svelte'
</script>

<Router primary={false}>
    <nav>
        <div class="nav-section left">
            <Link to="/"><div class="nav-icon"><MdMenu/></div></Link>
        </div>
        <div class="nav-section center">
            <Link to="/"><div class="logo"><div>Kea Store</div></div></Link>
        </div>
        <div class="nav-section right">
            <Link to="/"><div class="nav-icon"><MdShoppingCart/></div></Link>
            <Link to="/"><div class="nav-icon"><MdAccountBox/></div></Link>
        </div>
    </nav>

    <Route to="/" component={Home}/>
</Router>

<style>

	nav {
		background-color: #FF0000;
        padding: 0 5px;
        display: grid;
        grid-template-columns: 33% 33% 33%;
        max-height: 45px;
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

	@media (min-width: 640px) {

	}
</style>