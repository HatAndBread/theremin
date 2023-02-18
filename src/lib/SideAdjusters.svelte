<script lang="ts">
  import {getControls} from "../sound/sound";
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
    const {changeBaseLevel} = getControls();
    const newLevel = $baseLevel / 2
    localStorageWrite(baseLevel, "baseLevel", newLevel)
    changeBaseLevel(newLevel);
  }
  const higher = () => {
    const {changeBaseLevel} = getControls();
    const newLevel = $baseLevel * 2
    localStorageWrite(baseLevel, "baseLevel", newLevel)
    changeBaseLevel(newLevel);
  }

  const record = () => {
    getControls()?.record();
  }
  const stopRecord = () => {
    getControls()?.stopRecord();
  }
</script>

<div class="absolute top-0 left-0 h-[calc(100vh_-_64px)] w-[80px] bg-base-200">
  <Dropdown buttonLabel={"Instrument"} items={Object.keys(samples)} onClick={selectInstrument} buttonClass="btn btn-primary"><img src={iconSrc} slot="icon" alt="Instrument"/></Dropdown>
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
  <div class="w-full flex justify-center gap-1 mt-2">
    <button on:touchstart={record} class="bg-primary p-1 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    </button>
    <button on:touchstart={stopRecord} class="bg-primary p-1 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
      </svg>
    </button>
  </div>
</div>