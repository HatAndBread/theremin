import type Tone from "tone";

export type Instrument = {
  player: Tone.Player;
  oscillator: Tone.Oscillator;
  env: Tone.AmplitudeEnvelope;
  gain: Tone.Gain;
  timeSinceLastTouch: number;
  interval: null | ReturnType<typeof setInterval>;
  vibrato: Tone.Vibrato;
  delay: Tone.PingPongDelay;
  distortion: Tone.Distortion;
};

export type EffectNames = "vibrato" | "delay" | "distortion";