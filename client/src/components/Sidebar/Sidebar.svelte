<script>
    import MdArrowForward from 'svelte-icons/md/MdArrowForward.svelte'
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {Link} from "svelte-navigator";
    import {expireCookie, jwtToken} from "../../stores/cookie-store";

    export let open = false;
    $: opaque = open;

    $: isAuthenticated = !!$jwtToken;

    const close = () => open = false;

    let categories = [];

    onMount(async () => {
       const response = await fetch(`${$base_url}/categories`);
       const data = await response.json();
       categories = data.data;
    });

    // ensure the bottom elements in the sidebar don't get hidden behind
    // browser interface
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    $: open ? disableScroll() : enableScroll();

    function disableScroll() {
        // Get the current page scroll position
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
    }

    function enableScroll() {
        window.onscroll = function() {};
    }
</script>

<aside id="sidebar" class:open>
    <div class="container">
        <div>
            <div class="title">
                <Link to="/" on:click={close}>
                    <div class="left white">
                        <span class="line"></span>
                        <h3>KEA STORE</h3>
                    </div>
                </Link>
                <div class="right" on:click={close}>
                    <span class="cross1"></span>
                    <span class="cross2"></span>
                </div>
            </div>

            <div class="categories">
                <h4>Categories</h4>
                {#each categories as category}
                    <Link to={`/categories/${category.id}`} on:click={close}>
                        <div class="category">
                            <div class="cat-title">{category.title}</div>
                            <div class="icon"><MdArrowForward/></div>
                        </div>
                    </Link>
                    {#if categories.indexOf(category) !== categories.length-1}
                        <span class="separator"></span>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="auth">
            {#if isAuthenticated}
                <Link to="/profile" on:click={close}>
                    <div class="cat-title white">Profile</div>
                </Link>
                <br>
                <div on:click={() => {expireCookie('jwt')}} class="cat-title">Logout</div>
            {:else}
                <Link to="/profile" on:click={close}>
                    <div class="cat-title white">Login</div>
                </Link>
            {/if}
        </div>
    </div>

</aside>
<aside id="opaque" class:opaque on:click={close}></aside>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh; /* Fallback */
        height: calc(var(--vh, 1vh) * 100);
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
    }

    h3 {
        margin: 0;
    }

    aside {
        left: -100%;
        top: 0;
        z-index: 999;
        background-color: #1c1c1c;
        color: white;
        position: fixed;
        width: 50%;
        height: 100vh;
    }

    .open {
        left: 0 !important;
    }

    #sidebar {
        transition: left 0.3s ease-in-out;

    }

    .line {
        width: 3px;
        background-color: #FF0000;
        height: 0.98em;
        margin: -1px 5px 0 0;
    }

    .left, .right {
        display: flex;
        align-items: center;
    }

    .cross1 {
        transform: rotate(45deg);
    }

    .cross2 {
        transform: rotate(-45deg);
    }

    .categories {
        margin: 0 5px;
    }

    h4 {
        text-align: center;
        margin: 10px auto 5px auto;
    }

    .category {
        display: flex;
        height: 20px;
        object-fit: contain;
        justify-content: space-between;
        margin: 6px 0 6px 5px;
        color: white;
    }

    .icon {
        margin-right: 5px;
    }

    .cat-title {
        font-size: 0.8em;
    }

    .cat-title:hover {
        cursor: pointer;
    }

    .separator {
        background-color: white;
        height: 1px;
        width: calc(100% - 10px);
        margin-top: -3px;
        position: absolute;
    }

    .auth {
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }

    .white {
        color: white;
    }

    .opaque {
        left: 0;
        width: 100%;
        background-color: rgb(0, 0, 0, 0.5) !important;
        z-index: 998;
        overflow: hidden;
    }

    #opaque {
        background-color: rgb(0 ,0 , 0, 0);
        transition: background-color 0.3s ease-in-out;
    }

</style>