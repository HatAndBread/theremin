<script lang="ts">
  import {currentInstrument} from "./stores";
  export let buttonLabel: any;
  export let items: string[];
  export let buttonClass: string;
  export let onClick: (name: string) => any;

  let ref: HTMLButtonElement;
  let ulRef: HTMLUListElement;
  const dropDown = (e: TouchEvent) => {
    if (ulRef.classList.contains("!hidden")) {
      ulRef.classList.remove("!hidden")
    } else {
      ulRef.classList.add("!hidden")
    }
  };
  const select = (e) => {
    const target = e.currentTarget as HTMLLIElement;
    const { name } = target.dataset;
    //@ts-ignore
    setTimeout(() => {
      ulRef.classList.add("!hidden")
    }, 200);
    onClick(name);
  };
</script>

<div class="dropdown w-full flex justify-center">
  <button class={buttonClass} on:touchstart={dropDown} bind:this={ref}
    >
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      {buttonLabel}
    {/if}
    </button
  >
  <ul
    class="menu shadow bg-base-100 rounded-box w-52 !fixed text-xs z-50 !hidden"
    bind:this={ulRef}
  >
    {#each items as item, i}
      <li on:touchstart={select} data-name={item} class="{$currentInstrument === item ? "bg-primary-focus text-primary-content" : ""}">
        <a href="#">{item.charAt(0).toUpperCase() + item.substring(1, item.length)}</a>
      </li>
    {/each}
  </ul>
</div>
