import App from './App.svelte';
import HelloWorld, {title as hw_title} from "./pages/Introduction/HelloWorld/HelloWorld.svelte";
import DynamicAttributes from "./pages/Introduction/DynamicAttributes/DynamicAttributes.svelte";
import Styling from "./pages/Introduction/Styling/Styling.svelte";

const app = new App({
	target: document.body,
	props: {
		part: 'I',
		pages: {
			introduction: {
				title: 'Introduction',
				topics: [
					{component: HelloWorld, title: 'Hello World',},
					{component: DynamicAttributes, title: 'Dynamic Attributes'},
					{component: Styling, title: 'Styling'},

				],
			}
		}
	}
});

export default app;