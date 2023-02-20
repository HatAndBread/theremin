import { writable } from 'svelte/store';
import type {Writable} from "svelte/store"

export const zoom = localStorageWritable("zoom", 12)

export const baseLevel = localStorageWritable("baseLevel", 1);

export const attack = localStorageWritable("attack", 0.3);
export const release = localStorageWritable("release", 0.8);
export const sustain = localStorageWritable("sustain", 0.5);
export const decay = localStorageWritable("decay", 0.2);

export const style = localStorageWritable("style", "cyberpunk");

export function localStorageWrite (writable: Writable<number | string>,  name: string, value: string | number) {
  writable.set(value)
  localStorage.setItem(name, value.toString())
}

function localStorageWritable(name: string, defaultValue: any) {
  let storedValue:string | number = localStorage.getItem(name);
  if (parseInt(storedValue)) storedValue = parseInt(storedValue);
  return writable(storedValue || defaultValue)
}