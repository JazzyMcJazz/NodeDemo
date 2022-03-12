<script>
	import PageContainer from "./pages/PageContainer.svelte";

	export let part;
	export let pages;

	let categories = ['Introduction', 'Reactivity', 'Props', 'Logic', 'Events']

	let showPage = categories[4];
</script>

<main>
	<h1>Svelte self-study - Part {part}</h1>

	<!-- BUTTONS -->
	{#each categories as cat}
		<button on:click={() => showPage = cat}>{cat}</button>
	{/each}

	<!-- PAGES -->
	{#each categories as cat}
		{#if showPage === cat}
			<PageContainer title={pages[cat].title} topics={pages[cat].topics}/>
		{/if}
	{/each}
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

	button {
		margin: 10px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>