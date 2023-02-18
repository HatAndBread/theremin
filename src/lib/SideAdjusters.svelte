<script lang="ts">
  import SideAdjuster from "./SideAdjuster.svelte"
  import Dropdown from "./Dropdown.svelte";
  import iconSrc from "../assets/instrument.svg"
  import {setBuffer} from "../sound/sound";
  import samples from "../sound/samples"

  let instrumentSelector: HTMLLabelElement;
  const dropDown = (e: PointerEvent) => {
    if (document.activeElement === instrumentSelector) {
      instrumentSelector.blur();
      e.preventDefault();
    }
  }
  const selectInstrument = (name: string) => {
    setBuffer(name);
    console.log(name)
  }
</script>

<div class="absolute top-0 left-0 h-[calc(100vh_-_64px)] w-[80px] bg-base-200">
  <Dropdown buttonLabel={"Instrument"} items={Object.keys(samples)} onClick={selectInstrument} buttonClass="btn !bg-accent"><img src={iconSrc} slot="icon" alt="Instrument"/></Dropdown>
  <SideAdjuster name="vibrato" switchColor="toggle toggle-primary"/>
  <SideAdjuster name="delay" switchColor="toggle toggle-secondary"/>
  <SideAdjuster name="distortion" switchColor="toggle toggle-accent"/>
</div>