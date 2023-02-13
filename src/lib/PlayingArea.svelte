<script lang="ts">
  import {instrument} from "../sound/sound"
  export let started:boolean;
  let pointerDown = false;
  let priorNumberOfTouches = 0;
  const notes = [...Array(64)].map((_, i) => i)
  const setInactive = (el: HTMLElement) => {
    el.classList.remove("bg-accent")
  }
  const handleTouchStart = (e: TouchEvent) => {
    if (!started) return;
    e.preventDefault();
    pointerDown = true;
    handleTouchMove(e);
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (!started) return;
    pointerDown = false;
    notes.forEach((n) => {
      const el = document.getElementById(`note-${n}`)
      setInactive(el);
    })
    handleTouchMove(e)
  }
  const handleTouchMove = (e: TouchEvent) => {
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
      }
    }
    touches.forEach((touch, i) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement;
      const note = element?.dataset?.note;
      if (typeof note !== "string") return;
      element.classList.add("bg-accent")
      inactiveNotes[note] = null;
      let {top, bottom, height} = element.getClientRects()[0]
      const percentage = (height - (bottom - touch.clientY)) / height;
      console.log(touch.radiusY)
      instrument.play(parseInt(note), percentage, i, touch.radiusY)
    })
    inactiveNotes.filter((n) => n).forEach((n) => setInactive(document.getElementById(`note-${n}`)))
    priorNumberOfTouches = touches.length;
  }
  const letters = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "A", "B"]
</script>

<div class="absolute top-0 w-full h-full flex flex-col" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd} on:touchmove={handleTouchMove}>
  {#each notes as note (note)}
    <div class="border-t border-secondary h-[12px] text-accent text-[10px] flex items-center active:bg-accent notes" data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {/each}
</div>