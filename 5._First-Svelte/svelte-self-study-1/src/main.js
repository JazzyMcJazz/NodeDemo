import App from './App.svelte';
import HelloWorld, {title as hw_title} from "./pages/Introduction/HelloWorld/HelloWorld.svelte";
import DynamicAttributes from "./pages/Introduction/DynamicAttributes/DynamicAttributes.svelte";
import Styling from "./pages/Introduction/Styling/Styling.svelte";
import NestedComponents from "./pages/Introduction/NestedComponents/NestedComponents.svelte";
import HtmlTags from "./pages/Introduction/HtmlTags/HtmlTags.svelte";

const app = new App({
	target: document.body,
	props: {
		part: 'I',
		pages: {
			introduction: {
				title: 'Introduction',
				topics: [
					{component: HelloWorld, title: 'Hello World', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HelloWorld'},
					{component: DynamicAttributes, title: 'Dynamic Attributes', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/DynamicAttributes'},
					{component: Styling, title: 'Styling', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/Styling'},
					{component: NestedComponents, title: 'Nested Components', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/NestedComponents'},
					{component: HtmlTags, title: 'Html Tags', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HtmlTags'}
				],
			}
		}
	}
});

export default app;