<script lang="ts">
  import {setEffectAdjusters} from "../sound/effect-adjusters";
  import type {EffectNames} from "./types"

  export let name: EffectNames;
  export let switchColor: string;
  let div: HTMLDivElement;
  let guide: HTMLDivElement;
  let checkbox: HTMLInputElement;
  let rect: DOMRect;
  $: {
    rect = div?.getBoundingClientRect();
  }
  const guideToStart = () => {
    guide.style.left = `${rect.left}px`
    guide.style.top = `${rect.top}px`
  }
  const getOnOffStatus = () => !!window.localStorage.getItem(name)
  let on = getOnOffStatus();
  const setOnOffStatus = (status: boolean) => {
    if (status) {
      window.localStorage.setItem(name, "1");
    } else {
      window.localStorage.removeItem(name);
      guideToStart();
    }
    on = status;
  }
  const handleTouch = (e: TouchEvent) => {
    const touch = Array.from(e.touches).find((t) => t.target === div);
    if (!touch || touch.clientX < 0 || touch.clientY < rect.top || touch.clientX > rect.right || touch.clientY > rect.bottom) return handleTouchEnd();

    const x = touch.clientX / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    guide.style.left = `${touch.clientX - 6}px`
    guide.style.top = `${touch.clientY - 6}px`
    setEffectAdjusters(name, {x, y});
  }
  const handleTouchEnd = () => {
    if (on) return;
    setEffectAdjusters(name, {x: 0, y: 0});
    guideToStart()
  }

  const toggle = (e) => {
    const target = e.currentTarget as HTMLInputElement;
    target.checked = !target.checked;
    setEffectAdjusters(name, {x: 0, y: 0});
    setOnOffStatus(target.checked);
  }
</script>

<div class="form-control">
  <label class="cursor-pointer label flex flex-col">
    <input type="checkbox" class={switchColor} checked={on} bind:this={checkbox} on:touchstart={toggle} on:click={(e) => e.preventDefault()}/>
  </label>
</div>
<div bind:this={div} class="w-[72px] h-[72px] mx-auto bg-secondary text-xs text-center select-none border border-accent" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleTouchEnd}>
  <div bind:this={guide} class="absolute w-[12px] h-[12px] rounded-full bg-primary text-primary-content pointer-events-none"></div>
  {name}
</div>