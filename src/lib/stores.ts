import { writable } from 'svelte/store';
import type {Writable} from "svelte/store"

export const zoom = localStorageWritable("zoom", 12)

export const baseLevel = localStorageWritable("baseLevel", 1);


export function localStorageWrite (writable: Writable<number | string>,  name: string, value: string | number) {
  writable.set(value)
  localStorage.setItem(name, value.toString())
}

function localStorageWritable(name: string, defaultValue: any) {
  let storedValue:string | number = localStorage.getItem(name);
  if (parseInt(storedValue)) storedValue = parseInt(storedValue);
  return writable(storedValue || defaultValue)
}