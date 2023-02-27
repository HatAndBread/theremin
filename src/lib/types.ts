import type Tone from "tone";

export type Instrument = {
  player: Tone.Player;
  oscillator: Tone.Oscillator;
  env: Tone.AmplitudeEnvelope;
  shift: Tone.FrequencyShifter;
  gain: Tone.Gain;
  timeSinceLastTouch: number;
  interval: null | ReturnType<typeof setInterval>;
  vibrato: Tone.Vibrato;
  frequency: null | number;
  delay: Tone.PingPongDelay;
  distortion: Tone.Distortion;
};

export type EffectNames = "vibrato" | "delay" | "distortion" | "shift";

type Looper = {
  stop: () => void;
  isStarted: () => boolean;
  players: Tone.Player[];
  pitchShift: Tone.PitchShift;
}
export type TheLooper = {
  looper: Looper;
  distortion: Tone.Distortion;
  vibrato: Tone.Vibrato;
  shift: Tone.FrequencyShifter;
  delay: Tone.PingPongDelay;
  pitchShift: Tone.PitchShift;
}
