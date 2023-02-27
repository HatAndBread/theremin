<script lang="ts">
  import { getControls, getInstruments } from "../sound/sound";
  import SideAdjuster from "./SideAdjuster.svelte";
  import Dropdown from "./Dropdown.svelte";
  import EnvelopeAdjuster from "./EnvelopeAdjuster.svelte";
  import iconSrc from "../assets/instrument.svg";
  import { localStorageWrite, baseLevel, shift, attack, release, sustain, decay, currentInstrument } from "./stores";
  import samples from "../sound/samples";

  let recordBtn: HTMLButtonElement;
  let lowerBtn: HTMLButtonElement;
  let higherBtn: HTMLButtonElement;
  let stopRecordBtn: HTMLButtonElement;
  let isRecording = false;
  let isPlayingRecording = false;
  let recordingExists = false;
  const selectInstrument = (name: string) => {
    localStorageWrite(currentInstrument, "currentInstrument", name);
  };
  const focus = (btn: HTMLButtonElement) => {
    btn.classList.add("bg-primary-focus")
    setTimeout(() => {
      btn.classList.remove("bg-primary-focus")
    }, 60);
  }
  const lower = (e) => {
    if (e.cancelable) e.preventDefault();
    const { changeBaseLevel } = getControls();
    const newLevel = $baseLevel / 2;
    localStorageWrite(baseLevel, "baseLevel", newLevel);
    changeBaseLevel(newLevel);
    focus(lowerBtn);
  };
  const higher = (e) => {
    e.preventDefault();
    const { changeBaseLevel } = getControls();
    const newLevel = $baseLevel * 2;
    localStorageWrite(baseLevel, "baseLevel", newLevel);
    changeBaseLevel(newLevel);
    focus(higherBtn);
  };

  const stopRecord = (e?: TouchEvent) => {
    if (isRecording) {
      isPlayingRecording = true;
    } else if (recordingExists) {
      isPlayingRecording = !isPlayingRecording;
    } else if (!recordingExists) return
    isRecording = false;
    if (e?.cancelable) e.preventDefault();
    getControls()?.stopRecord();
    recordBtn.classList.remove("bg-primary-focus");
  };
  window.onblur = () => {
    if (isPlayingRecording) stopRecord();
    getInstruments().forEach((i) => {
      i.env.triggerRelease()
    })
  }
  const record = (e) => {
    if (isRecording) return;
    recordingExists = true;
    isRecording = !isRecording;
    e.preventDefault();
    getControls()?.record();
    recordBtn.classList.add("bg-primary-focus");
  };
  const adjustAttack = (v: number) => {
    localStorageWrite(attack, "attack", v);
  }
  const adjustRelease = (v: number) => {
    localStorageWrite(release, "release", v);
  }
  const adjustSustain = (v: number) => {
    localStorageWrite(sustain, "sustain", v);
  }
  const adjustDecay = (v: number) => {
    localStorageWrite(decay, "decay", v);
  }
</script>

<div class="absolute top-0 left-0 h-full w-[80px] bg-base-200">
  <a href="#my-modal-2" class="w-full p-0 flex justify-center mt-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </a>
  <div class="flex justify-center mt-2">
    <Dropdown
      buttonLabel={"Instrument"}
      items={Object.keys(samples)}
      onClick={selectInstrument}
      buttonClass="active:bg-primary mx-auto w-full flex justify-center h-full"
      >
      <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
</svg>
</Dropdown
    >
  </div>
  <SideAdjuster name="vibrato" switchColor="toggle toggle-primary toggle-sm" />
  <SideAdjuster name="delay" switchColor="toggle toggle-secondary toggle-sm" />
  <SideAdjuster name="distortion" switchColor="toggle toggle-accent toggle-sm" />
  <SideAdjuster name="shift" switchColor="toggle toggle-success toggle-sm" />
  <EnvelopeAdjuster name="attack" handleChange={adjustAttack} defaultValue={$attack}/>
  <EnvelopeAdjuster name="release" handleChange={adjustRelease} defaultValue={$release}/>
  <EnvelopeAdjuster name="sustain" handleChange={adjustSustain} defaultValue={$sustain}/>
  <EnvelopeAdjuster name="decay" handleChange={adjustDecay} defaultValue={$decay}/>
  <div class="w-full flex justify-center gap-2 mt-2">
    <button bind:this={lowerBtn} class="bg-primary p-1 rounded active:bg-primary-focus" on:touchstart={lower}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
    </button>
    <button bind:this={higherBtn} class="bg-primary p-1 rounded active:bg-primary-focus" on:touchstart={higher}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </button>
  </div>
  <div class="w-full flex justify-center gap-2 mt-2">
    <button
      on:touchstart={record}
      class="bg-primary p-1 rounded"
      bind:this={recordBtn}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
        />
      </svg>
    </button>
    <button id="play-button" bind:this={stopRecordBtn} on:touchstart={stopRecord} class="{isPlayingRecording ? "bg-primary-focus p-1 rounded" : "bg-primary p-1 rounded" }">
      {#if isRecording}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
          />
        </svg>
      {/if}
    </button>
  </div>
</div>
