import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Table In Svelte',
	}
});

export default app;