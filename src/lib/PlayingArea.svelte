<script lang="ts">
  import {instrument} from "../sound/sound"
  export let started:boolean;
  let pointerDown = false;
  let priorNumberOfTouches = 0;
  const fingerGuides: {[key: string]: null | HTMLDivElement} = {
    fingerGuide1: null,
    fingerGuide2: null,
    fingerGuide3: null,
    fingerGuide4: null,
    fingerGuide5: null,
  }
  const notes = [...Array(64)].map((_, i) => i)
  const moveFingerGuide = (touch: Touch, finger: number) => {
    const guide = fingerGuides[`fingerGuide${finger + 1}`];
    guide.classList.remove("hidden");
    guide.style.top = `${touch.clientY}px`
  }
  const handleTouchStart = (e: TouchEvent) => {
    if (!started) return;
    e.preventDefault();
    pointerDown = true;
    handleTouchMove(e, true);
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (!started) return;
    pointerDown = false;
    notes.forEach((n) => {
      const el = document.getElementById(`note-${n}`)
    })
    handleTouchMove(e)
  }
  const handleTouchMove = (e: TouchEvent, firstTouch?: true) => {
    if (!started) return;
    const inactiveNotes = [...notes]
    const touches = Array.from(e.touches)
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
      const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement;
      const note = element?.dataset?.note;
      if (typeof note !== "string") return;

      moveFingerGuide(touch, i);
      inactiveNotes[note] = null;
      let {top, bottom, height} = element.getClientRects()[0]
      const percentage = (height - (bottom - touch.clientY)) / height;
      const target = e.currentTarget as HTMLDivElement;
      const volume = touch.clientX / target.getBoundingClientRect().width
      instrument.play(parseInt(note), percentage, i, volume, firstTouch)
    })
    priorNumberOfTouches = touches.length;
  }
</script>

<div class="absolute top-0 w-full h-full flex flex-col" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd} on:touchmove={handleTouchMove}>
  {#each [...Array(5)] as _, i}
    <div bind:this={fingerGuides[`fingerGuide${i + 1}`]} class="fixed w-screen h-[4px] bg-primary hidden"/>
  {/each}
  {#each notes as note (note)}
  {#if !((note%12)%12)}
    <div class={`border-t border-error border-t-[5px] text-accent text-[20px] flex items-center notes`} data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {:else if ((note%12) === 4) || (note%12 === 2)}
    <div class={`border-t border-accent border-t-[2px] text-accent text-[20px] flex items-center notes`} data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {:else if !((note%12)%7)}
    <div class={`border-t border-info border-t-[3px] text-accent text-[20px] flex items-center notes`} data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {:else if !((note%12)%5)}
    <div class={`border-t border-success border-t-[2px] text-accent text-[20px] flex items-center notes`} data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {:else}
    <div class={`border-t border-warning border-t-[1px] text-accent text-[20px] flex items-center notes`} data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {/if}
  {/each}
</div>