<script lang="ts">
  import {zoom, localStorageWrite, style, baseNote} from "./stores"
  import {noteFrequencyMap} from "../sound/note-frequency-map";
  const handleZoomChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    localStorageWrite(zoom, "zoom", target.value)
  }
  const changeBaseNote = (e: Event) => {
    const {value} = e.currentTarget as HTMLSelectElement
    const b = noteFrequencyMap[value];
    localStorageWrite(baseNote, "baseNote", b)
  }
  const styles = ["cyberpunk", "cupcake", "emerald", "valentine", "forest", "dracula", "acid"]
  const changeStyle = (e: Event) => {
    const {value} = e.currentTarget as HTMLSelectElement
    localStorageWrite(style, "style", value)
    document.body.dataset.theme = value;
  }
</script>

<div class="modal" id="my-modal-2">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Settings</h3>
    <div class="modal-action flex flex-col items-end gap-2">
      <button class="btn w-full" on:click={()=>window.location.reload()}>Refresh</button>
      <select class="select w-full max-w-xs" on:change={changeBaseNote}>
        <option disabled selected>Base Note</option>
        {#each Object.keys(noteFrequencyMap) as note}
          <option>{note}</option>
        {/each}
      </select>
      <select class="select w-full max-w-xs" on:change={changeStyle}>
        <option disabled selected>Style</option>
        {#each styles as style}
          <option>{style}</option>
        {/each}
      </select>
      <label for="zoom">Zoom</label>
      <input type="range" min="4" max="22" value={$zoom} class="range range-xs" on:input={handleZoomChange} id="zoom"/> 
      <a href="#" class="btn w-fit">OK</a>
    </div>
  </div>
</div>