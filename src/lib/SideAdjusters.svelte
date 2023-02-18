<script lang="ts">
  import SideAdjuster from "./SideAdjuster.svelte"
  import Dropdown from "./Dropdown.svelte";
  import iconSrc from "../assets/instrument.svg"
  import {setBuffer} from "../sound/sound";
  import {localStorageWrite, baseLevel} from "./stores";
  import samples from "../sound/samples"

  const selectInstrument = (name: string) => {
    setBuffer(name);
  }
  const lower = () => {
    localStorageWrite(baseLevel, "baseLevel", $baseLevel / 2)
  }
  const higher = () => {
    localStorageWrite(baseLevel, "baseLevel", $baseLevel * 2)
  }
</script>

<div class="absolute top-0 left-0 h-[calc(100vh_-_64px)] w-[80px] bg-base-200">
  <Dropdown buttonLabel={"Instrument"} items={Object.keys(samples)} onClick={selectInstrument} buttonClass="btn !bg-accent"><img src={iconSrc} slot="icon" alt="Instrument"/></Dropdown>
  <SideAdjuster name="vibrato" switchColor="toggle toggle-primary"/>
  <SideAdjuster name="delay" switchColor="toggle toggle-secondary"/>
  <SideAdjuster name="distortion" switchColor="toggle toggle-accent"/>
  <div class="w-full flex justify-center gap-1 mt-2">
    <button class="bg-primary p-1 rounded" on:touchstart={lower}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </button>
    <button class="bg-primary p-1 rounded" on:touchstart={higher}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>
</div>