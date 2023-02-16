<script lang="ts">
  import {setEffectAdjusters} from "../sound/effect-adjusters";
  import type {EffectNames} from "./types"

  export let name: EffectNames;
  let div: HTMLDivElement;
  let rect: DOMRect;
  $: {
    rect = div?.getBoundingClientRect();
  }
  const handleTouch = (e: TouchEvent) => {
    const touch = Array.from(e.touches).find((t) => t.target === div);
    if (!touch || touch.clientX < 0 || touch.clientY < 0 || touch.clientX > rect.right || touch.clientY > rect.bottom) return handleTouchEnd();

    const x = touch.clientX / rect.width;
    const y = touch.clientY / rect.height;
    setEffectAdjusters(name, {x, y});
  }
  const handleTouchEnd = () => {
    setEffectAdjusters(name, {x: 0, y: 0});
  }
</script>

<div bind:this={div} class="w-full h-[80px] bg-green-100 text-xs text-center select-none" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleTouchEnd}>
  {name}
</div>