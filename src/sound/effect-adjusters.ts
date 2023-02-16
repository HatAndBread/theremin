import type {EffectNames} from "../lib/types";
import { getInstruments } from "./sound";

export const setEffectAdjusters = (name: EffectNames, values: {x: number, y: number}) => {
  const {x, y} = values;
  getInstruments().forEach((instrument) => {
    const effect = instrument[name]
    if (name === "vibrato") {
      effect.depth.rampTo(x / 1.5, 0.2)
      effect.frequency.rampTo(y * 10, 0.2);
    } else {
      throw new Error("Unimplemented effect")
    }
  })
}

export const getEffect = (name: EffectNames) => getInstruments()[0][name]