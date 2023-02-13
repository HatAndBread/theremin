import * as Tone from "tone";
import { justIntonation } from "./just-intonation";
import { equalTempered } from "./equal-tempered";


const allInstruments: {sine: Tone.Oscillator, triangle: Tone.Oscillator, env: Tone.AmplitudeEnvelope, gain: Tone.Gain, sampler: Tone.Sampler}[] = []
for (let i = 0; i < 5; i++) {
  const gain = new Tone.Gain(0).toDestination()
  const env = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.8,
  }).connect(gain);
  const sine = new Tone.Oscillator({type: "sine"}).connect(env).start()
  const triangle = new Tone.Oscillator({type: "triangle"}).connect(env).start()
  const sampler = new Tone.Sampler().toDestination();
  allInstruments.push({sine, triangle, env, gain, sampler})
}

const startFrequency = 132;
const scale = justIntonation;


export const instrument = {start, stop, play}

const updateFrequency = (frequency: number, touchNumber: number, firstTouch?: true) => {
  if (firstTouch) {
    allInstruments[touchNumber].sine.frequency.value = frequency;
    allInstruments[touchNumber].triangle.frequency.value = frequency;
    return;
  }
  allInstruments[touchNumber].sine.frequency.rampTo(frequency, .05)
  allInstruments[touchNumber].triangle.frequency.rampTo(frequency, .05)
}

const updateVolume = (volume: number, touchNumber: number) => {
  allInstruments[touchNumber].gain.gain.rampTo(volume, .05)
}

function start(touchNumber: number) {
  allInstruments[touchNumber].env.triggerAttack(Tone.now())
}

function stop(touchNumber: number) {
  allInstruments[touchNumber].env.triggerRelease(Tone.now())
}

function play (noteNumber: number, offset: number, touchNumber: number, volume: number, firstTouch?: true) {
  if (!window.started) return;
  const baseFrequency = frequencyForNoteNumber(noteNumber);
  const nextFrequency = frequencyForNoteNumber(noteNumber + 1);
  const diff = nextFrequency - baseFrequency
  const frequency = baseFrequency + (diff * offset)

  updateVolume(volume, touchNumber);
  updateFrequency(frequency, touchNumber, firstTouch);
}

function doubleXTimes(n: number, x: number) {
  for (let i = 1; i < x; i ++){
    n *= 2
  }
  return n;
};

function frequencyForNoteNumber(noteNumber: number) {
  const octave = Math.floor(noteNumber / 12) + 1;
  const note = noteNumber % 12;
  const octaveStart = doubleXTimes(startFrequency, octave)
  return (scale[note] * octaveStart);
}