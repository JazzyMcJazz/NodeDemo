<script>
	import {onMount} from "svelte";
	import {baseURL} from "./stores/api-store";

	let movies;

	onMount(async () => {
		const response = await fetch($baseURL + '/movies');
		const { data } = await response.json();
		movies = data;
		console.log(data)
	})
</script>

<main>
	<table>
		<thead>
			<tr>
				<td>Title</td>
				<td>Year</td>
			</tr>
		</thead>
		<tbody>
		{#each movies as movie}
			<tr>
				<td>{movie.title}</td>
				<td>{movie.year}</td>
			</tr>
		{/each}
		</tbody>
	</table>


</main>
<footer>
	Copywrite ASDF @ ASDF
</footer>

<style>
	main {
		min-height: calc(100vh);
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	footer {
		background-color: green;
	}

	h1 {
		color: #ff3e00;
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