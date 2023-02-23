import type { Oscillator, Sampler, ToneAudioBuffer } from "tone";
import type { Instrument, TheLooper } from "../lib/types";
import { justIntonation } from "./just-intonation";
import { equalTempered } from "./equal-tempered";
import { loopVol, attack, release, sustain, decay, currentInstrument } from "../lib/stores";
import samples from "./samples";

const allInstruments: Instrument[] = [];
export const getInstruments = () => allInstruments;
let controls;
export const getControls = () => controls

let buffers: { [key: string]: ToneAudioBuffer } = {};
let baseLevel = 1;
let currentBuffer = localStorage.getItem("currentInstrument") || "sine";
let theLooper: TheLooper;

attack.subscribe((value)=> {
  getInstruments().forEach((instrument) => {
    instrument.env.attack = value;
  });
})
release.subscribe((value)=> {
  getInstruments().forEach((instrument) => {
    instrument.env.release = value;
  });
})
sustain.subscribe((value)=> {
  getInstruments().forEach((instrument) => {
    instrument.env.sustain = value;
  });
})
decay.subscribe((value)=> {
  getInstruments().forEach((instrument) => {
    instrument.env.decay = value;
  });
})
loopVol.subscribe((value) => {
  if (!theLooper) return;
  const newVolume = (value * 20) - 10;
  console.log(newVolume)
  theLooper.looper.volume.rampTo(newVolume)
})
export const getLooper = () => theLooper;

type OscillatorTypes = "sine" | "triangle" | "sawtooth" | "square"
const nonPlayers = ["sine", "triangle", "sawtooth", "square"]

const setBuffer = (b: string) => {
  currentBuffer = b;
  if (nonPlayers.includes(b)) {
    getInstruments().forEach((instrument) => {
      if (instrument.player.state === "started") instrument.player.stop();
      instrument.oscillator.type = b as OscillatorTypes;
      if (instrument.oscillator.state === "stopped") instrument.oscillator.start()
    })
    return;
  }
  getInstruments().forEach((instrument) => {
    if (instrument.oscillator.state === "started") instrument.oscillator.stop();
    instrument.player.stop()
    instrument.player.buffer = buffers[b]
    instrument.player.start()
  })
}
currentInstrument.subscribe((b: string) => setBuffer(b));

export const s = import("tone").then((Tone) => {
  const loadBuffers = () => {
    return new Promise((resolve, reject) => {
      Object.entries(samples).forEach((e) => {
        const [key, url] = e;
        const buffer = new Tone.Buffer(url);
        buffer.onload = () => {
          buffers[key] = buffer;
          if (Object.keys(buffers).length === Object.keys(samples).length) {
            resolve(true);
          }
        };
      });
    });
  };
  return loadBuffers().then(() => {
    const recorder = new Tone.Recorder();
    const multiband = new Tone.MultibandCompressor({
      lowFrequency: 200,
      highFrequency: 1300,
      low: {
        threshold: -12,
      },
    }).connect(recorder).toDestination();
    const delay = new Tone.PingPongDelay(0, 0).connect(multiband);
    const shift = new Tone.FrequencyShifter(0).connect(delay);
    const distortion = new Tone.Distortion(0).connect(shift);
    const vibrato = new Tone.Vibrato(0, 0).connect(distortion);
    const loopDelay = new Tone.PingPongDelay(0, 0).connect(multiband);
    const loopShift = new Tone.FrequencyShifter(0).connect(loopDelay);
    const loopDistortion = new Tone.Distortion(0).connect(loopShift);
    const loopVibrato = new Tone.Vibrato(0, 0).connect(loopDistortion);
    const looper = new Tone.GrainPlayer({detune: 0}).connect(loopVibrato);
    theLooper = {looper, delay: loopDelay, shift: loopShift, distortion: loopDistortion, vibrato: loopVibrato};
    for (let i = 0; i < 5; i++) {
      const gain = new Tone.Gain(0).connect(vibrato);
      const env = new Tone.AmplitudeEnvelope({
        attack: localStorage.getItem("attack") || 0.3,
        decay: localStorage.getItem("decay") || 0.2,
        sustain: parseFloat(localStorage.getItem("sustain")) || 0.5,
        release: parseFloat(localStorage.getItem("release")) || 0.8,
      }).connect(gain);
      const oscillator = new Tone.Oscillator().connect(env);
      const player = new Tone.Player().connect(env);
      player.loop = true;
      setBuffer(currentBuffer);
      allInstruments.push({
        env,
        shift,
        gain,
        player,
        oscillator,
        timeSinceLastTouch: 0,
        vibrato,
        delay,
        distortion,
        frequency: null,
        interval: null,
      });
    }

    const startFrequency = 132;
    const scale = justIntonation;

    const updateFrequency = (
      frequency: number,
      instrument: Instrument,
      firstTouch?: true
    ) => {
      instrument.frequency = frequency;
      if (firstTouch) {
        instrument.player.restart();
        instrument.player.playbackRate = ((frequency * baseLevel) / startFrequency);
        instrument.oscillator.frequency.rampTo(frequency * baseLevel, 0.1)
        return;
      }
      instrument.player.playbackRate = ((frequency * baseLevel) / (startFrequency));
      instrument.oscillator.frequency.rampTo(frequency * baseLevel, 0.1)
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
      resetTime(instrument);
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
      firstTouch: true | undefined,
      bl: number
    ) {
      baseLevel = bl;
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
          updateFrequency(
            offset < 0.5 ? baseFrequency : nextFrequency,
            instrument
          );
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

    function record() {
      recorder.start();
    }

    async function stopRecord() {
      if (looper.state === "started" && recorder.state !== "started") {
        looper.stop();
        return;
      }
      if (recorder.state !== "started") {
        if (looper.loaded) looper.start();
        return;
      }
      const recording = await recorder.stop();
      const url = URL.createObjectURL(recording);
      const buff = new Tone.ToneAudioBuffer(url, () => {
        looper.stop();
        looper.buffer = buff;
        looper.loop = true;
        looper.start();
      });
    }

    function changeBaseLevel(newLevel: number) {
      baseLevel = newLevel;
      getInstruments().forEach((instrument) => {
        if (typeof instrument.frequency !== "number") return;
        updateFrequency(instrument.frequency, instrument);
      })
    }

    controls = { start, stop, play, record, stopRecord, changeBaseLevel};
    return controls;
  });
});
