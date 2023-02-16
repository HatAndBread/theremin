<script lang="ts">
  import SideAdjuster from "./SideAdjuster.svelte"
</script>

<div class="absolute top-0 left-0 h-[calc(100vh_-_64px)] w-[80px] bg-base-200">
  <SideAdjuster name="vibrato" switchColor="toggle toggle-primary"/>
  <SideAdjuster name="delay" switchColor="toggle toggle-secondary"/>
  <SideAdjuster name="distortion" switchColor="toggle toggle-accent"/>
</div>