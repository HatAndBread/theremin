<script lang="ts">
  import type {TheLooper} from "./types";
  import SideAdjuster from "./SideAdjuster.svelte";
  import {getLooper} from "../sound/sound";
  let ref: HTMLDivElement;
  let indicator: HTMLDivElement;
  const handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.targetTouches[0];
    const {looper} = getLooper()
    if (!looper || !ref) return;

    const {height} = ref.getBoundingClientRect();
    const middle = height / 2;
    const note = touch.clientY - middle;
    indicator.style.top = `${touch.clientY}px`;
    looper.grainSize = 0.1
    looper.overlap = 0.1
    looper.detune = note * 10;
  }
  const handleEnd = (e: TouchEvent) => {
    const {looper} = getLooper();
    if (!looper || !ref) return;
    looper.detune = 0;
    looper.grainSize = 0.1
    looper.overlap = 0.1
    indicator.style.top = `50%`;
  } 
</script>

<div class="fixed top-0 right-0 h-full w-[80px] bg-base-200">
  <div bind:this={ref} class="absolute top-0 right-0 h-[30%] w-[72px] bg-secondary mr-[4px] mt-[4px] border-accent border" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleEnd}>
    <div class="relative text-[9px] text-center w-[72px] text-secondary-content z-10">Looper Pitch</div>
    <div bind:this={indicator} class="h-2 w-full bg-primary absolute top-[30%]"></div>
  </div>
  <div class="absolute top-[30%] flex flex-col items-center">
    <div class="mx-1">
      <SideAdjuster name="vibrato" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    </div> 
    <SideAdjuster name="delay" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    <SideAdjuster name="distortion" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    <SideAdjuster name="shift" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
  </div>
</div>