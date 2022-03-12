import App from './App.svelte';
import HelloWorld from "./pages/Introduction/HelloWorld/HelloWorld.svelte";
import DynamicAttributes from "./pages/Introduction/DynamicAttributes/DynamicAttributes.svelte";
import Styling from "./pages/Introduction/Styling/Styling.svelte";
import NestedComponents from "./pages/Introduction/NestedComponents/NestedComponents.svelte";
import HtmlTags from "./pages/Introduction/HtmlTags/HtmlTags.svelte";
import ReactiveAssignments from "./pages/Reactivity/ReactiveAssignments/ReactiveAssignments.svelte";
import ReactiveDeclarations from "./pages/Reactivity/ReactiveDeclarations/ReactiveDeclarations.svelte";
import ReactiveStatements from "./pages/Reactivity/ReactiveStatements/ReactiveStatements.svelte";
import DeclaringProps from "./pages/Props/DeclaringProps/DeclaringProps.svelte";
import DefaultValues from "./pages/Props/DefaultValues/DefaultValues.svelte";
import SpreadProps from "./pages/Props/SpreadProps/SpreadProps.svelte";
import If_Blocks from "./pages/Logic/IfBlocks/If_Blocks.svelte";
import ElseBlocks from "./pages/Logic/ElseBlocks/ElseBlocks.svelte";
import ElseIfBlocks from "./pages/Logic/ElseIfBlocks/ElseIfBlocks.svelte";
import EachBlocks from "./pages/Logic/EachBlocks/EachBlocks.svelte";
import KeyedEachBlocks from "./pages/Logic/KeyedEachBlocks/KeyedEachBlocks.svelte";
import DOMEvents from "./pages/Events/DOMEvents/DOMEvents.svelte";
import InlineHandlers from "./pages/Events/InlineHandlers/InlineHandlers.svelte";
import EventModifiers from "./pages/Events/EventModifiers/EventModifiers.svelte";
import ComponentEvents from "./pages/Events/ComponentEvents/ComponentEvents.svelte";
import EventForwarding from "./pages/Events/EventForwarding/EventForwarding.svelte";

const app = new App({
	target: document.body,
	props: {
		part: 'I',
		pages: {
			Introduction: {
				title: 'Introduction',
				topics: [
					{component: HelloWorld, title: 'Hello World', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HelloWorld'},
					{component: DynamicAttributes, title: 'Dynamic Attributes', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/DynamicAttributes'},
					{component: Styling, title: 'Styling', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/Styling'},
					{component: NestedComponents, title: 'Nested Components', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/NestedComponents'},
					{component: HtmlTags, title: 'Html Tags', src: 'https://github.com/JazzyMcJazz/NodeDemo/tree/main/5._First-Svelte/svelte-self-study-1/src/pages/Introduction/HtmlTags'}
				],
			},
			Reactivity: {
				title: 'Reactivity',
				topics: [
					{component: ReactiveAssignments, title: 'Reactive Assignments', src: ''},
					{component: ReactiveDeclarations, title: 'Reactive Declarations', src: ''},
					{component: ReactiveStatements, title: 'Reactive Statements', src: ''},

				]
			},
			Props: {
				title: 'Props',
				topics: [
					{component: DeclaringProps, title: 'Declaring Props', src: ''},
					{component: DefaultValues, title: 'Default Values', src: ''},
					{component: SpreadProps, title: 'Spread Props', src: ''},
				]
			},
			Logic: {
				title: 'Logic',
				topics: [
					{component: If_Blocks, title: 'If Blocks', src: ''},
					{component: ElseBlocks, title: 'Else Blocks', src: ''},
					{component: ElseIfBlocks, title: 'Else-If Blocks', src: ''},
					{component: EachBlocks, title: 'Each Blocks', src: ''},
					{component: KeyedEachBlocks, title: 'Keyed Each Blocks', src: ''}
				]
			},
			Events: {
				title: 'Events',
				topics: [
					{component: DOMEvents, title: 'DOM Events', src: ''},
					{component: InlineHandlers, title: 'Inline Handlers', src: ''},
					{component: EventModifiers, title: 'Event Modifiers', src: ''},
					{component: ComponentEvents, title: 'Component Events', src: ''},
					{component: EventForwarding, title: 'Event Forwarding', src: ''},
				]
			}
		}
	}
});

export default app;