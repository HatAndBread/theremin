<script lang="ts">
  import {zoom} from "./stores"
  const handleZoomChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value)
    zoom.set(value)
    localStorage.setItem("zoom", target.value)
  }
</script>

<div class="modal" id="my-modal-2">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Settings</h3>
    <div class="modal-action flex flex-col items-end">
      <label for="zoom">Zoom</label>
      <input type="range" min="4" max="22" value={$zoom} class="range range-xs" on:input={handleZoomChange} id="zoom"/> 
      <a href="#" class="btn w-fit">OK</a>
    </div>
  </div>
</div>