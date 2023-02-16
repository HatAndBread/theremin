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
  delay: Tone.PingPongDelay;
  distortion: Tone.Distortion;
  crusher: Tone.BitCrusher;
};

export type EffectNames = "vibrato" | "delay" | "distortion" | "crusher";