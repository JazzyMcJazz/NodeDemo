<script>
	import PageContainer from "./pages/PageContainer.svelte";
	import HelloWorld from "./pages/Introduction/HelloWorld/HelloWorld.svelte";

	export let part;
	export let pages;
</script>

<main>
	<h1>Svelte self-study - Part {part}</h1>

	<PageContainer title={pages.introduction.title} topics={pages.introduction.topics}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #e91e63;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>