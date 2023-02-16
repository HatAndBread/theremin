import type Tone from "tone";

export type Instrument = {
  sine: Tone.Oscillator;
  triangle: Tone.Oscillator;
  env: Tone.AmplitudeEnvelope;
  gain: Tone.Gain;
  sampler: Tone.Sampler;
  timeSinceLastTouch: number;
  interval: null | ReturnType<typeof setInterval>;
  vibrato: Tone.Vibrato;
};

export type EffectNames = "vibrato";