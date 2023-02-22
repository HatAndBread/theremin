<script lang="ts">
  import AudioRecorder from 'audio-recorder-polyfill'
  import PlayingArea from "./lib/PlayingArea.svelte"
  import SideAdjusters from "./lib/SideAdjusters.svelte"
  import LooperArea from "./lib/LooperArea.svelte"
  import Nav from "./lib/Nav.svelte"
  import Modals from "./lib/Modals.svelte"
  import * as Tone from "tone";

  if (!window.MediaRecorder) window.MediaRecorder = AudioRecorder

  let started = false;
  const start = async () => {
    await Tone.start();
    window.started = true;
    started = true;
    localStorage.setItem("used", "1");
  }
</script>

<main class="flex flex-col items-center justify-center gap-4 h-screen relative select-none">
  <SideAdjusters />
  <PlayingArea started={started}/>
  <LooperArea />
  {#if !localStorage.getItem("used") && !started}
    <div class="bg-primary z-10 text-primary-content text-center m-4 flex flex-col items-center p-4 gap-4 translate-y-[-32px]">
      <span>NOTE: This application requires a touchscreen.</span>
      <button on:click={start} class="btn btn-secondary z-50 text-secondary-content">Start</button>
    </div>
  {:else if !started}
    <button on:click={start} class="btn btn-primary z-50">Start</button>
  {/if}
</main>
<Modals />

<style global lang="postcss">
</style>