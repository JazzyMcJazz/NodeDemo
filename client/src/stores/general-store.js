import {writable} from "svelte/store";

export const base_url = writable(`${window.location.origin}/api`);
export const fallback_img = writable('/img/kea-logo.jpg');