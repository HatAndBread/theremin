<script lang="ts">
  import {setEffectAdjusters} from "../sound/effect-adjusters";
  import type {EffectNames} from "./types"

  export let name: EffectNames;
  let div: HTMLDivElement;
  let guide: HTMLDivElement;
  let rect: DOMRect;
  $: {
    rect = div?.getBoundingClientRect();
  }
  const handleTouch = (e: TouchEvent) => {
    const touch = Array.from(e.touches).find((t) => t.target === div);
    if (!touch || touch.clientX < 0 || touch.clientY < 0 || touch.clientX > rect.right || touch.clientY > rect.bottom) return handleTouchEnd();

    const x = touch.clientX / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    guide.style.left = `${touch.clientX - 6}px`
    guide.style.top = `${touch.clientY - 6}px`
    setEffectAdjusters(name, {x, y});
  }
  const handleTouchEnd = () => {
    const endOnTouch = ["vibrato"];
    if (!endOnTouch.includes(name)) return;
    setEffectAdjusters(name, {x: 0, y: 0});
    guide.style.left = `0px`
    guide.style.top = `0px`
  }
</script>

<div bind:this={div} class="w-full h-[80px] bg-green-100 text-xs text-center select-none border border-accent" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleTouchEnd}>
  <div bind:this={guide} class="absolute w-[12px] h-[12px] rounded-full bg-primary pointer-events-none"></div>
  {name}
</div>