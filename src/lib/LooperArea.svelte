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
    const {looper} = getLooper()
    if (!looper || !ref) return;

    const {height} = ref.getBoundingClientRect();
    const note = (touch.clientY / height) * 2
    console.log(note)
    indicator.style.top = `${touch.clientY}px`;
    looper.players.forEach((player) => {
      player.playbackRate = note;
    })
  }
  const handleEnd = (e: TouchEvent) => {
    const {looper} = getLooper();
    if (!looper || !ref) return;
    looper.players.forEach((player) => {
    })
    indicator.style.top = `50%`;
  } 
  const handleVolume = (v) => {
    localStorageWrite(loopVol, "loopVol", v);
  }
  const reverse = () => {
    const looper = getLooper()?.looper;
    if (!looper) return;
    looper.players.forEach((player) => {
      player.buffer.reverse = !player.buffer.reverse;
    })
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
    <button class="p-2 text-xs bg-primary w-[calc(100%_-_12px)] mx-auto mt-2 active:bg-primary-focus rounded" on:touchstart={reverse}>Reverse</button>
  </div>
</div>