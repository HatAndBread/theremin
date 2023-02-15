<script lang="ts">
  import PlayingArea from "./lib/PlayingArea.svelte"
  import SideAdjusters from "./lib/SideAdjusters.svelte"
  import Nav from "./lib/Nav.svelte"
  import Modals from "./lib/Modals.svelte"
  import * as Tone from "tone";

  let started = false;
  const start = async () => {
    await Tone.start();
    window.started = true;
    started = true;
  }
</script>

<main class="flex flex-col items-center justify-center gap-4 h-[calc(100vh_-_64px)] relative">
  <SideAdjusters />
  <PlayingArea started={started}/>
  {#if !started}
    <button on:click={start} class="btn btn-primary z-50">Start</button>
  {/if}
</main>
<Nav />
<Modals />

<style global lang="postcss">
</style>