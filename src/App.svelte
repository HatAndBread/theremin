<script lang="ts">
  import AudioRecorder from 'audio-recorder-polyfill'
  import PlayingArea from "./lib/PlayingArea.svelte"
  import SideAdjusters from "./lib/SideAdjusters.svelte"
  import Nav from "./lib/Nav.svelte"
  import Modals from "./lib/Modals.svelte"
  import * as Tone from "tone";

  if (!window.MediaRecorder) window.MediaRecorder = AudioRecorder

  let started = false;
  const start = async () => {
    await Tone.start();
    window.started = true;
    started = true;
  }
</script>

<main class="flex flex-col items-center justify-center gap-4 h-screen relative">
  <SideAdjusters />
  <PlayingArea started={started}/>
  {#if !started}
    <button on:click={start} class="btn btn-primary z-50">Start</button>
  {/if}
</main>
<Modals />

<style global lang="postcss">
</style>