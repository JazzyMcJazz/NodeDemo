import {readable} from "svelte/store";

export const base_url = readable(`${window.location.origin}/api`);
export const fallback_img = readable('/img/kea-logo.jpg');