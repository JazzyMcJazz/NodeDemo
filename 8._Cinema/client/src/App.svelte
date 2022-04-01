<script>
	import {onMount} from "svelte";
	import {baseURL} from "./stores/api-store";

	let movies = [];

	// onMount executes
	onMount(async () => {
		const response = await fetch($baseURL + '/movies');
		const { data } = await response.json();
		movies = data;
		console.log(movies)
	});
</script>

<main>
	<img src="https://www.naturepaysage.photo/wp-content/uploads/cours_photo_pose_longue-2.jpg"/>
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
	©{new Date().getFullYear()}
	About
	Contact
</footer>

<style>
	main {
		text-align: center;
		padding: 0;
		max-width: 240px;
		margin: 0 auto;
		min-height: calc(100vh - 50px);
	}

	footer {
		height: 50px;
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