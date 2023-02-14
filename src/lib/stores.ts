import { writable } from 'svelte/store';

export const zoom = writable(parseInt(localStorage.getItem("zoom")) || 0)