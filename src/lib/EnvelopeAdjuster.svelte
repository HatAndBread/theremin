<script lang="ts">
  export let name: string; 
  export let handleChange: (value: number) => void;
  export let defaultValue: number;
  let ref: HTMLDivElement;
  let startPos = 0;
  $: {
    if (ref) {
      const {width} = ref.getBoundingClientRect();
      startPos = defaultValue * width;
    }
  }
  let guide: HTMLDivElement;
  const handleTouch = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const {width, left} = target.getBoundingClientRect();
    const {clientX} = e.targetTouches[0];
    if (clientX > width + left || clientX < left) return;

    guide.style.left = `${clientX - left}px`
    handleChange((clientX -left) / width);
  }
</script>

<div bind:this={ref} class="w-[calc(100%_-_16px)] select-none bg-secondary mx-auto my-2 text-[10px] text-center relative rounded border border-primary" on:touchstart={handleTouch} on:touchmove={handleTouch}>
  <div bind:this={guide} class="absolute h-full w-[10px] rounded-full bg-primary text-secondary-content pointer-events-none translate-x-[-5px]" style={`left: ${startPos}px;`}></div>
  <span>{name}</span>
</div>