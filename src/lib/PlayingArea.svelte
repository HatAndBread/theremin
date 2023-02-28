<script lang="ts">
  import {s} from "../sound/sound"
  import {noteFrequencyMap} from "../sound/note-frequency-map";
  import {zoom, baseLevel, baseNote} from "./stores"

  let instrument;
  s.then((i) => {
    instrument = i;
  });
  export let started:boolean;
  let priorNumberOfTouches = 0;
  const fingerGuides: {[key: string]: null | HTMLDivElement} = {
    fingerGuide1: null,
    fingerGuide2: null,
    fingerGuide3: null,
    fingerGuide4: null,
    fingerGuide5: null,
  }
  let currentNoteIndex;
  $: currentNoteIndex = Object.values(noteFrequencyMap).indexOf($baseNote);
  let noteNames = Object.keys(noteFrequencyMap).map((n) => n.replace(/[0-9]/g, ""));
  const notes = [...Array(96)].map((_, i) => i)
  const blur = () => {
    // @ts-ignore
    if (document.activeElement.blur) document.activeElement.blur();
  }
  const moveFingerGuide = (touch: Touch, finger: number) => {
    const guide = fingerGuides[`fingerGuide${finger + 1}`];
    guide.classList.remove("hidden");
    guide.style.top = `${touch.clientY}px`
  }
  const handleTouchStart = (e: TouchEvent) => {
    if (!started) return;
    e.preventDefault();
    blur();
    handleTouchMove(e, true);
  }

  const handleTouchMove = (e: TouchEvent, firstTouch?: true) => {
    if (!started) return;
    blur();
    e.preventDefault();
    const inactiveNotes = [...notes]
    const touches = Array.from(e.touches)
      .filter((t) => {
        const target = t.target as HTMLDivElement;
        return Array.from(target.classList).includes("notes");
      })
    if (touches.length > priorNumberOfTouches) {
      for (let i = priorNumberOfTouches; i < touches.length; i++)  {
        instrument.start(i);
      }
    }
    if (touches.length < priorNumberOfTouches) {
      for (let i = touches.length; i < priorNumberOfTouches; i++)  {
        instrument.stop(i);
        const guide = fingerGuides[`fingerGuide${i + 1}`];
        guide.classList.add("hidden")
      }
    }
    touches.forEach((touch, i) => {
      const element = Array.from(document.querySelectorAll(".notes")).find((el) => {
        const {top, bottom, left, right} = el.getBoundingClientRect();
        return touch.clientX > left && touch.clientX < right && touch.clientY < bottom && touch.clientY > top;
      }) as HTMLDivElement;
      const note = element?.dataset?.note;
      if (typeof note !== "string") return;

      moveFingerGuide(touch, i);
      inactiveNotes[note] = null;
      let {bottom, height, width, left} = element.getClientRects()[0]
      const percentage = (height - (bottom - touch.clientY)) / height;
      const volume = (touch.clientX - left) / width
      instrument.play(parseInt(note), percentage, i, volume, firstTouch, $baseLevel)
    })
    priorNumberOfTouches = touches.length;
  }
</script>

<div class="absolute top-0 left-[80px] w-[calc(100vw_-_160px)] h-full flex flex-col" on:touchstart={handleTouchStart} on:touchend={handleTouchMove} on:touchmove={handleTouchMove}>
  {#each [...Array(5)] as _, i}
    <div bind:this={fingerGuides[`fingerGuide${i + 1}`]} class="fixed w-screen h-[4px] bg-primary hidden"/>
  {/each}
  {#each notes as note (note)}
  {#if !((note%12)%12)}
    <div class={`border-t border-error border-t-[5px] text-error flex items-center notes`} data-note={note} id={`note-${note}`} style="font-size: {$zoom}px;">
      {noteNames[(note + currentNoteIndex) % 12] + "^"}
    </div>
  {:else if ((note%12) === 4) || (note%12 === 2)}
    <div class={`border-t border-accent border-t-[2px] text-accent flex items-center notes`} data-note={note} id={`note-${note}`} style="font-size: {$zoom}px;">
      {noteNames[(note + currentNoteIndex) % 12] + "^"}
    </div>
  {:else if !((note%12)%7)}
    <div class={`border-t border-info border-t-[3px] text-info flex items-center notes`} data-note={note} id={`note-${note}`} style="font-size: {$zoom}px;">
      {noteNames[(note + currentNoteIndex) % 12] + "^"}
    </div>
  {:else if ((note%12) === 5) || !((note%12)%9)}
    <div class={`border-t border-success border-t-[2px] text-success flex items-center notes`} data-note={note} id={`note-${note}`} style="font-size: {$zoom}px;">
      {noteNames[(note + currentNoteIndex) % 12] + "^"}
    </div>
  {:else}
    <div class={`border-t border-warning border-t-[1px] text-warning flex items-center notes`} data-note={note} id={`note-${note}`} style="font-size: {$zoom}px;">
      {noteNames[(note + currentNoteIndex) % 12] + "^"}
    </div>
  {/if}
  {/each}
</div>