<script lang="ts">
  import type {GrainPlayer} from "tone"
  import {getLooper} from "../sound/sound";
  let ref: HTMLDivElement;
  let indicator: HTMLDivElement;
  const handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.targetTouches[0];
    const looper = getLooper() as GrainPlayer;
    if (!looper || !ref) return;

    const {height} = ref.getBoundingClientRect();
    const middle = height / 2;
    const note = touch.clientY - middle;
    indicator.style.top = `${touch.clientY}px`;
    console.log(note)
    looper.grainSize = 0.1
    looper.overlap = 0.1;
    looper.detune = note * 10;
  }
  const handleEnd = (e: TouchEvent) => {
    const looper = getLooper() as GrainPlayer;
    if (!looper || !ref) return;
    looper.detune = 0;
    indicator.style.top = `50%`;
  } 
</script>

<div bind:this={ref} class="fixed top-0 right-0 h-full w-[80px] bg-base-200" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleEnd}>
  <div bind:this={indicator} class="h-2 w-full bg-primary absolute top-[50%]"></div>
</div>