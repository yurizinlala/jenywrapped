"use client";
import { useContext, useEffect } from "react";
import type { Scene } from "@/data/jeny";
import { StoryAudioContext } from "./StoryAudio";

let context: AudioContext | null = null;

// Unlock inside a click/touch handler so mobile browsers allow later cues.
export function unlockSoundEffects() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume().catch(() => {});
  } catch {
    // The visual experience also works in browsers without Web Audio.
  }
}

type Cue = { notes: number[]; wave: OscillatorType; length: number };
const gentle: Cue = {
  notes: [523.25, 659.25, 783.99],
  wave: "sine",
  length: 0.32,
};
const cues: Record<string, Cue> = {
  scan: { notes: [330, 440, 660], wave: "sine", length: 0.12 },
  effect: { notes: [220, 330, 440, 660], wave: "triangle", length: 0.12 },
  cinema: { notes: [392, 523, 659], wave: "triangle", length: 0.24 },
  updates: { notes: [440, 554, 659], wave: "sine", length: 0.14 },
  chaos: { notes: [294, 220, 294], wave: "triangle", length: 0.1 },
  blackout: { notes: [220, 110, 55], wave: "sine", length: 0.16 },
  pan: { notes: [880, 587, 440], wave: "triangle", length: 0.2 },
  trip: { notes: [392, 494, 587, 784], wave: "sine", length: 0.2 },
  truth: { notes: [392], wave: "sine", length: 0.55 },
  declaration: { notes: [523, 659], wave: "sine", length: 0.4 },
  letter: { notes: [659, 784], wave: "sine", length: 0.3 },
};

export function SceneSoundEffect({
  scene,
  beat,
}: {
  scene: Scene;
  beat: number;
}) {
  const { started, enabled, paused } = useContext(StoryAudioContext);
  useEffect(() => {
    if (!started || !enabled || paused || scene.track || !context) return;
    const audio = context;
    const cue = cues[scene.id] ?? gentle;
    const master = audio.createGain();
    master.gain.value = 0.075;
    master.connect(audio.destination);
    const nodes: OscillatorNode[] = [];
    let disposed = false;
    const play = () => {
      if (disposed || audio.state !== "running") return;
      cue.notes.forEach((frequency, i) => {
        const tone = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + i * cue.length * 0.65;
        tone.type = cue.wave;
        tone.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.65, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + cue.length);
        tone.connect(gain);
        gain.connect(master);
        tone.onended = () => {
          tone.disconnect();
          gain.disconnect();
        };
        tone.start(start);
        tone.stop(start + cue.length + 0.02);
        nodes.push(tone);
      });
    };
    void audio
      .resume()
      .then(play)
      .catch(() => {});
    return () => {
      disposed = true;
      master.disconnect();
      nodes.forEach((node) => {
        node.stop();
        node.disconnect();
      });
    };
  }, [scene.id, scene.track, beat, started, enabled, paused]);
  return null;
}
