import type {Vibrato, PingPongDelay, Distortion, FrequencyShifter} from "tone"
import type {EffectNames} from "../lib/types";
import { getInstruments } from "./sound";

export const setEffectAdjusters = (name: EffectNames, values: {x: number, y: number}) => {
  let {x, y} = values;
  const effect = getInstruments()[0][name];
  if (name === "vibrato") {
    const e = effect as Vibrato;
    e.depth.rampTo(x / 1.5, 0.2)
    e.frequency.rampTo(y * 10, 0.2);
  } else if (name === "delay") {
    const e = effect as PingPongDelay;
    e.delayTime.rampTo(x, 0.2);
    e.feedback.rampTo(y, 0.2);
  } else if (name === "distortion") {
    const e = effect as Distortion;
    e.distortion = x * 3;
    e.wet.value = y;
  } else if (name === "shift") {
    const e = effect as FrequencyShifter;
    e.frequency.rampTo(x * 500, 0.1)
    e.wet.value = y;
  } else {
    throw new Error("Unimplemented effect")
  }
}

export const getEffect = (name: EffectNames) => getInstruments()[0][name]