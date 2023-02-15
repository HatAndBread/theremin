import * as Tone from "tone";
import { justIntonation } from "./just-intonation";
import { equalTempered } from "./equal-tempered";

type Instrument = {
  sine: Tone.Oscillator;
  triangle: Tone.Oscillator;
  env: Tone.AmplitudeEnvelope;
  gain: Tone.Gain;
  sampler: Tone.Sampler;
  timeSinceLastTouch: number;
  interval: null | ReturnType<typeof setInterval>;
  vibrato: Tone.Vibrato;
};
const allInstruments: Instrument[] = [];
for (let i = 0; i < 5; i++) {
  const gain = new Tone.Gain(0).toDestination();
  const vibrato = new Tone.Vibrato(8, 0.1).connect(gain);
  const env = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.8,
  }).connect(vibrato);
  const sine = new Tone.Oscillator({ type: "sine" }).connect(env).start();
  const triangle = new Tone.Oscillator({ type: "triangle" })
    .connect(env)
    .start();
  const sampler = new Tone.Sampler().toDestination();
  allInstruments.push({
    sine,
    triangle,
    env,
    gain,
    sampler,
    timeSinceLastTouch: 0,
    vibrato,
    interval: null
  });
}

const startFrequency = 132;
const scale = justIntonation;

export const instrument = { start, stop, play };

const updateFrequency = (
  frequency: number,
  instrument: Instrument,
  firstTouch?: true
) => {
  if (firstTouch) {
    instrument.sine.frequency.value = frequency;
    instrument.triangle.frequency.value = frequency;
    return;
  }
  instrument.sine.frequency.rampTo(frequency, 0.1);
  instrument.triangle.frequency.rampTo(frequency, 0.1);
};

const updateVolume = (volume: number, instrument: Instrument) => {
  instrument.gain.gain.rampTo(volume, 0.05);
};

function start(touchNumber: number) {
  const instrument = allInstruments[touchNumber];
  instrument.env.triggerAttack(Tone.now());
  instrument.timeSinceLastTouch = 0;
}

function stop(touchNumber: number) {
  const instrument = allInstruments[touchNumber];
  instrument.env.triggerRelease(Tone.now());
  resetTime(instrument)
}

function resetTime(instrument: Instrument) {
  clearInterval(instrument.interval);
  instrument.interval = null;
  instrument.timeSinceLastTouch = 0;
}

function play(
  noteNumber: number,
  offset: number,
  touchNumber: number,
  volume: number,
  firstTouch?: true
) {
  if (!window.started) return;
  const instrument = allInstruments[touchNumber];
  const baseFrequency = frequencyForNoteNumber(noteNumber);
  const nextFrequency = frequencyForNoteNumber(noteNumber + 1);
  const diff = nextFrequency - baseFrequency;
  const frequency = baseFrequency + diff * offset;
  resetTime(instrument);
  instrument.interval = setInterval(() => {
    instrument.timeSinceLastTouch += 1;
    if (instrument.timeSinceLastTouch > 30) {
      updateFrequency(offset < 0.5 ? baseFrequency : nextFrequency, instrument)
    }
  }, 1);

  updateVolume(volume, instrument);
  updateFrequency(frequency, instrument, firstTouch);
}

function doubleXTimes(n: number, x: number) {
  for (let i = 1; i < x; i++) {
    n *= 2;
  }
  return n;
}

function frequencyForNoteNumber(noteNumber: number) {
  const octave = Math.floor(noteNumber / 12) + 1;
  const note = noteNumber % 12;
  const octaveStart = doubleXTimes(startFrequency, octave);
  return scale[note] * octaveStart;
}
