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
  let finger1: HTMLDivElement;
  let finger2: HTMLDivElement;
  let finger3: HTMLDivElement;
  let finger4: HTMLDivElement;
  let finger5: HTMLDivElement;

  const start = async () => {
    await Tone.start();
    window.started = true;
    started = true;
    localStorage.setItem("used", "1");
  }
  const handleTouch = (e: TouchEvent) => {
    const fingers = [finger1, finger2, finger3, finger4, finger5];
    Array.from(e.touches).forEach((touch, i) => {
      const {clientX, clientY} = touch;
      fingers[i].classList.remove("hidden");
      fingers[i].style.left = `${clientX - 9}px`;
      fingers[i].style.top = `${clientY - 9}px`;
    })
  }
  const handleTouchEnd = (e: TouchEvent) => {
    const fingers = [finger1, finger2, finger3, finger4, finger5];
    const numberOfTouchRemaining = fingers.length - e.touches.length
    fingers.forEach((finger, i) => {
      if (i >= e.touches.length) {
        finger.classList.add("hidden");
        finger.style.top = `-1000px`;
      }
    });
  }
</script>

<main class="fixed top-0 flex flex-col items-center justify-center gap-4 h-screen relative select-none overflow-hidden" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleTouchEnd}>
  <div class="fixed top-0 left-0 w-[18px] h-[18px] bg-gray-200 z-50 rounded-full opacity-50 hidden" bind:this={finger1}></div>
  <div class="fixed top-0 left-0 w-[18px] h-[18px] bg-gray-200 z-50 rounded-full opacity-50 hidden" bind:this={finger2}></div>
  <div class="fixed top-0 left-0 w-[18px] h-[18px] bg-gray-200 z-50 rounded-full opacity-50 hidden" bind:this={finger3}></div>
  <div class="fixed top-0 left-0 w-[18px] h-[18px] bg-gray-200 z-50 rounded-full opacity-50 hidden" bind:this={finger4}></div>
  <div class="fixed top-0 left-0 w-[18px] h-[18px] bg-gray-200 z-50 rounded-full opacity-50 hidden" bind:this={finger5}></div>
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