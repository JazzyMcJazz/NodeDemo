<script>
    const banners = [
        {title: 'courses on offer', url: '/img/dummy-banner.png'},
        {},
        {},
    ]

</script>


<div class="container">

    <img src={banners[0].url} alt={banners[0].title}/>

    <div class="banner-selectors">
        {#each banners as banner}
            {#if banners.indexOf(banner) === 0}
                <span class={"selector"}></span>
            {:else }
                <span class="selector selected"></span>
            {/if}
        {/each}
    </div>
    <div class="note">NOTE: banner carousel is non-functional in this demo</div>

</div>

<style>

    .note {
        position: absolute;
        top: 10%;
        right: 5%;
        width: 100%;
        text-align: right;
        color: white;
        font-size: 0.6em;
    }

    .container {
        width: 100%;
        position: relative;
        display: flex;
        overflow: hidden;
    }

    img {
        width: 100%;
    }

    .banner-selectors {
        display: flex;
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    .selector {
        background-color: rgb(255, 255, 255, 1);
        width: 15px;
        height: 15px;
        border: 2px solid white;
        border-radius: 15px;
        margin: 0 5px;
    }

    .selected {
        background-color: rgb(255, 255, 255, 0) !important
    }
</style>