import type { Oscillator, Sampler, ToneAudioBuffer } from "tone";
import type { Instrument, TheLooper } from "../lib/types";
import { noteFrequencyMap } from "./note-frequency-map";
import { equalTempered } from "./equal-tempered";
import { loopVol, attack, release, sustain, decay, currentInstrument, baseNote } from "../lib/stores";
import samples from "./samples";

const allInstruments: Instrument[] = [];
export const getInstruments = () => allInstruments;
let controls;
export const getControls = () => controls

let buffers: { [key: string]: ToneAudioBuffer } = {};
let baseLevel = 1;
let currentBuffer = localStorage.getItem("currentInstrument") || "sine";
let theLooper: TheLooper;

let startFrequency = parseFloat(localStorage.getItem("baseNote")) || noteFrequencyMap.C3;
const scale = equalTempered;

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
const valueToLoopVol = ( value: number) => (value * 20) - 10;
loopVol.subscribe((value) => {
  if (!theLooper) return;
  const newVolume = valueToLoopVol(value);
  theLooper.looper.players.forEach((looper) => {
    looper.volume.rampTo(newVolume)
  })
});
baseNote.subscribe((value) => {
  startFrequency = parseFloat(value);
});

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
    distortion.wet.value = 0;
    distortion.distortion = 0;
    const vibrato = new Tone.Vibrato(0, 0).connect(distortion);
    const loopDelay = new Tone.PingPongDelay(0, 0).connect(multiband);
    const loopShift = new Tone.FrequencyShifter(0).connect(loopDelay);
    const loopDistortion = new Tone.Distortion(0).connect(loopShift);
    const loopVibrato = new Tone.Vibrato(0, 0).connect(loopDistortion);
    const pitchShift = new Tone.PitchShift(0).connect(loopVibrato)
    let isLoop1 = true
    const looper1 = new Tone.Player().connect(pitchShift);
    const looper2 = new Tone.Player().connect(pitchShift);
    const newLooper = {
      stop: () => {
        [looper1, looper2].forEach((l) => l.stop());
        Tone.Transport.stop()
        Tone.Transport.cancel();
      },
      isStarted: () => looper1.state === "started" || looper2.state === "started",
      players: [looper1, looper2],
      pitchShift
    }
    theLooper = {looper: newLooper, delay: loopDelay, shift: loopShift, distortion: loopDistortion, vibrato: loopVibrato, pitchShift};
    theLooper.looper.players.forEach((looper) => {
      looper.volume.value = valueToLoopVol(parseFloat(localStorage.getItem("loopVol")) || 0.5)
    })
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

    const updateFrequency = (
      frequency: number,
      instrument: Instrument,
      firstTouch?: true
    ) => {
      instrument.frequency = frequency;
      if (firstTouch) {
        instrument.player.restart();
        instrument.player.playbackRate = ((frequency * baseLevel) / startFrequency);
        instrument.oscillator.frequency.value = frequency * baseLevel;
        return;
      }
      instrument.player.playbackRate = ((frequency * baseLevel) / (startFrequency));
      instrument.oscillator.frequency.rampTo(frequency * baseLevel, 0.1)
    };

    const updateVolume = (volume: number, instrument: Instrument, firstTouch: true | undefined) => {
      if (firstTouch) {
        instrument.gain.gain.value = volume;
      } else {
        instrument.gain.gain.rampTo(volume, 0.05);
      }
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
      if (!window.started) return;
      
      baseLevel = bl;
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

      updateVolume(volume, instrument, firstTouch);
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

    const startTransport = () => {
      looper1.fadeIn = .2
      looper1.fadeOut = .2
      looper2.fadeIn = .2
      looper2.fadeOut = .2
      Tone.Transport.scheduleRepeat((time) => {
        const toStart = isLoop1 ? looper1 : looper2;
        toStart.start()
        isLoop1 = !isLoop1
      }, looper1.buffer.duration - 0.2);
      Tone.Transport.start()
    }
    async function stopRecord() {
      if (newLooper.isStarted() && recorder.state !== "started") {
        newLooper.stop();
        return;
      }
      if (recorder.state !== "started") {
        newLooper.stop()
        startTransport()
        return;
      }
      const recording = await recorder.stop();
      const url = URL.createObjectURL(recording);
      const buff = new Tone.ToneAudioBuffer(url, () => {
        newLooper.stop();
        looper1.buffer = buff;
        looper2.buffer = buff;
        startTransport();
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
