<script lang="ts">
  import {setEffectAdjusters} from "../sound/effect-adjusters";
  import type {EffectNames} from "./types"

  export let name: EffectNames;
  export let switchColor: string;
  export let looper = false;
  let div: HTMLDivElement;
  let guide: HTMLDivElement;
  let checkbox: HTMLInputElement;

  const guideToStart = () => {
    const {top, left} = div?.getBoundingClientRect();
    guide.style.left = `0px`
    guide.style.top = `0px`
  }

  const getName = () => {
    if (!looper) return name;
    return `looper_${name}`;
  }
  const getOnOffStatus = () => !!window.localStorage.getItem(getName())
  let on = getOnOffStatus();
  const setOnOffStatus = (status: boolean) => {
    if (status) {
      window.localStorage.setItem(getName(), "1");
    } else {
      window.localStorage.removeItem(getName());
      guideToStart();
    }
    on = status;
  }
  const handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    const {top, left, right, bottom, width, height} = div?.getBoundingClientRect();
    const touch = Array.from(e.touches).find((t) => t.target === div);
    if (!touch || touch.clientX < left || touch.clientY < top || touch.clientX > right || touch.clientY > bottom) return handleTouchEnd();

    const x = (touch.clientX - left) / width;
    const y = (touch.clientY - top) / height;
    guide.style.left = `${touch.clientX - left - 6}px`
    guide.style.top = `${touch.clientY - top - 6}px`
    setEffectAdjusters(name, {x, y}, looper);
  }
  const handleTouchEnd = () => {
    if (on) return;
    setEffectAdjusters(name, {x: 0, y: 0}, looper);
    guideToStart()
  }

  const toggle = (e) => {
    const target = e.currentTarget as HTMLInputElement;
    target.checked = !target.checked;
    setEffectAdjusters(name, {x: 0, y: 0}, looper);
    setOnOffStatus(target.checked);
  }
</script>

<div class="form-control">
  <label class="cursor-pointer label flex flex-col">
    <input type="checkbox" class={switchColor} checked={on} bind:this={checkbox} on:touchstart={toggle} on:click={(e) => e.preventDefault()}/>
  </label>
</div>
<div bind:this={div} class="relative w-[72px] h-[56px] mx-auto bg-secondary text-[10px] text-center select-none border border-accent text-secondary-content touch-none" on:touchmove={handleTouch} on:touchstart={handleTouch} on:touchend={handleTouchEnd}>
  <div bind:this={guide} class="absolute w-[12px] h-[12px] rounded-full bg-primary pointer-events-none"></div>
  {name}
</div>