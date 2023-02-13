<script lang="ts">
  import {instrument} from "../sound/sound"
  export let started:boolean;
  let pointerDown = false;
  const notes = [...Array(64)].map((_, i) => i)
  const setInactive = (el: HTMLElement) => {
    el.classList.remove("bg-accent")
  }
  const handleTouchStart = (e: TouchEvent) => {
    if (!started) return;
    e.preventDefault();
    pointerDown = true;
    instrument.start()
    handleTouchMove(e);
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (!started) return;
    pointerDown = false;
    notes.forEach((n) => {
      const el = document.getElementById(`note-${n}`)
      setInactive(el);
    })
    instrument.stop();
  }
  const handleTouchMove = (e: TouchEvent) => {
    if (!started) return;
    const inactiveNotes = [...notes]
    Array.from(e.touches).forEach((touch) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement;
      const note = element?.dataset?.note;
      if (typeof note !== "string") return;
      element.classList.add("bg-accent")
      inactiveNotes[note] = null;
      let {top, bottom, height} = element.getClientRects()[0]
      const percentage = (height - (bottom - touch.clientY)) / height;
      instrument.play(parseInt(note), percentage)
    })
    inactiveNotes.filter((n) => n).forEach((n) => setInactive(document.getElementById(`note-${n}`)))
  }
  const letters = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "A", "B"]
  console.log(notes)
</script>

<div class="absolute top-0 w-full h-full flex flex-col" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd} on:touchmove={handleTouchMove}>
  {pointerDown.toString()}
  {#each notes as note (note)}
    <div class="border-t border-secondary h-[12px] text-accent text-[10px] flex items-center active:bg-accent notes" data-note={note} id={`note-${note}`}>
      {note}
    </div>
  {/each}
</div>