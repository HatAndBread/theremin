<script lang="ts">
  export let buttonLabel: any;
  export let items: string[];
  export let buttonClass: string;
  export let onClick: (name: string) => any;

  let ref: HTMLLabelElement;
  const dropDown = (e: PointerEvent) => {
    if (document.activeElement === ref) {
      ref.blur();
      e.preventDefault();
    }
  };
  const select = (e) => {
    const target = e.currentTarget as HTMLLIElement;
    const { name } = target.dataset;
    //@ts-ignore
    setTimeout(() => document.activeElement.blur(), 200);
    onClick(name);
  };
</script>

<div class="dropdown">
  <label tabindex="0" class={buttonClass} on:pointerdown={dropDown} bind:this={ref}
    >
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      {buttonLabel}
    {/if}
    </label
  >
  <ul
    tabindex="0"
    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
  >
    {#each items as item, i}
      <li on:click={select} data-name={item}>
        <a>{item.charAt(0).toUpperCase() + item.substring(1, item.length)}</a>
      </li>
    {/each}
  </ul>
</div>
