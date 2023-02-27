<script lang="ts">
  import SideAdjuster from "./SideAdjuster.svelte";
  import EnvelopeAdjuster from "./EnvelopeAdjuster.svelte";
  import {localStorageWrite, loopVol} from "./stores";
  import {getLooper} from "../sound/sound";
  let ref: HTMLDivElement;
  let indicator: HTMLDivElement;
  const handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.targetTouches[0];
    const {pitchShift} = getLooper()
    if (!pitchShift || !ref) return;

    const {height, top} = ref.getBoundingClientRect();
    const middle = height / 2;
    const note = (touch.clientY - middle - top) / 4
    console.log(note)
    pitchShift.pitch = note;
    indicator.style.top = `${touch.clientY}px`;
  }
  const handleEnd = (e: TouchEvent) => {
    const {pitchShift} = getLooper();
    if (!pitchShift || !ref) return;
    pitchShift.pitch = 0;
    indicator.style.top = `50%`;
  } 
  const handleVolume = (v) => {
    localStorageWrite(loopVol, "loopVol", v);
  }
</script>

<div class="fixed top-0 right-0 h-full w-[80px] bg-base-200">
  <div bind:this={ref} class="absolute top-0 right-0 h-[20%] w-[72px] bg-secondary mr-[4px] mt-[4px] border-accent border" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleEnd}>
    <div class="relative text-[9px] text-center w-[72px] text-secondary-content z-10">Looper Pitch</div>
    <div bind:this={indicator} class="h-2 w-full bg-primary absolute top-[50%]"></div>
  </div>
  <div class="absolute top-[20%] flex flex-col items-center">
    <div class="w-full">
      <EnvelopeAdjuster name="Loop Vol" handleChange={handleVolume} defaultValue={$loopVol}/>
    </div>
    <div class="mx-1">
      <SideAdjuster name="vibrato" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    </div> 
    <SideAdjuster name="delay" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    <SideAdjuster name="distortion" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
    <SideAdjuster name="shift" switchColor="toggle toggle-success toggle-sm" looper={true}></SideAdjuster>
  </div>
</div>