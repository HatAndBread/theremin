import type {EffectNames} from "../lib/types";
import { getInstrument } from "./sound";

export const setEffectAdjusters = (name: EffectNames, values: {x: number, y: number}) => {
  const effect = getInstrument(0)[name]
  const {x, y} = values;
  if (name === "vibrato") {
    effect.depth.value = x / 1.5;
    effect.frequency.value = y * 10;
  }
}