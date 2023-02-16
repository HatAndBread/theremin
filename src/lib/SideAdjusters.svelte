<script lang="ts">
  import SideAdjuster from "./SideAdjuster.svelte"
</script>

<div class="absolute top-0 left-0 h-[calc(100vh_-_64px)] w-[80px] bg-secondary">
  <SideAdjuster name="vibrato"/>
  <SideAdjuster name="delay"/>
  <SideAdjuster name="distortion"/>
  <SideAdjuster name="crusher"/>
</div>