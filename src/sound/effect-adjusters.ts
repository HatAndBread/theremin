import type {EffectNames} from "../lib/types";
import { getInstruments } from "./sound";

export const setEffectAdjusters = (name: EffectNames, values: {x: number, y: number}) => {
  const {x, y} = values;
  getInstruments().forEach((instrument) => {
    const effect = instrument[name]
    if (name === "vibrato") {
      effect.depth.value = x / 1.5;
      effect.frequency.value = y * 10;
    }
  })
}