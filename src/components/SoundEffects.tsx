"use client";
import { useContext, useLayoutEffect } from "react";
import type { Scene } from "@/data/jeny";
import { StoryAudioContext } from "./StoryAudio";

let context: AudioContext | null = null;
export function unlockSoundEffects() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume().catch(() => {});
  } catch {
    // Audio is optional; navigation remains available without Web Audio.
  }
}

type Sound =
  | "word"
  | "count"
  | "complete"
  | "photo"
  | "row"
  | "sweep"
  | "impact"
  | "sparkle"
  | "paper"
  | "tap"
  | "dark";
export function emitStorySound(
  element: HTMLElement | null,
  kind: Sound,
  progress = 0,
) {
  element?.dispatchEvent(
    new CustomEvent("jeny:visual-sound", {
      bubbles: true,
      detail: { kind, progress },
    }),
  );
}

const animationSounds: Record<string, Sound> = {
  "word-reveal": "word",
  "memory-slide": "word",
  "photo-drop": "photo",
  "row-arrive": "row",
  "bar-in": "sweep",
  "draw-road": "sweep",
  "nickname-arrive": "sparkle",
  "pan-tumble": "impact",
  "album-fan": "row",
  "number-slam": "complete",
  "disc-arrive": "sweep",
  "lights-out": "dark",
  pop: "impact",
};
const sceneSounds: Record<string, Sound> = {
  scan: "sweep",
  effect: "sweep",
  cinema: "paper",
  updates: "tap",
  nickname: "sparkle",
  chaos: "impact",
  blackout: "dark",
  pan: "impact",
  music: "sweep",
  trip: "sweep",
  firsts: "sparkle",
  tripstats: "tap",
  top: "complete",
  year: "sparkle",
  truth: "paper",
  declaration: "sparkle",
  letter: "paper",
  share: "complete",
};

export function SceneSoundEffect({
  scene,
  beat,
}: {
  scene: Scene;
  beat: number;
}) {
  const { started, enabled, paused } = useContext(StoryAudioContext);
  useLayoutEffect(() => {
    if (!started || !enabled || paused || !context) return;
    const audio = context;
    const master = audio.createGain();
    // Music scenes and intimate passages keep a quieter layer of effects.
    const volume = scene.track
      ? 0.035
      : ["truth", "declaration", "letter"].includes(scene.id)
        ? 0.045
        : 0.08;
    master.gain.value = volume;
    master.connect(audio.destination);
    const voices = new Set<OscillatorNode | AudioBufferSourceNode>();
    const last = new Map<Sound, number>();
    let disposed = false;
    const tone = (
      frequency: number,
      endFrequency: number,
      length: number,
      delay = 0,
      wave: OscillatorType = "sine",
      level = 0.5,
    ) => {
      if (voices.size >= 12) return;
      const source = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + delay;
      source.type = wave;
      source.frequency.setValueAtTime(frequency, start);
      source.frequency.exponentialRampToValueAtTime(
        endFrequency,
        start + length,
      );
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(level, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, start + length);
      source.connect(gain);
      gain.connect(master);
      voices.add(source);
      source.onended = () => {
        voices.delete(source);
        source.disconnect();
        gain.disconnect();
      };
      source.start(start);
      source.stop(start + length + 0.01);
    };
    const noise = (length: number, frequency: number, delay = 0) => {
      if (voices.size >= 12) return;
      const buffer = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * length),
        audio.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = audio.createBufferSource();
      source.buffer = buffer;
      const filter = audio.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = frequency;
      const gain = audio.createGain();
      const start = audio.currentTime + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.5, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + length);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      voices.add(source);
      source.onended = () => {
        voices.delete(source);
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
      source.start(start);
      source.stop(start + length);
    };
    const play = (kind: Sound, progress = 0) => {
      if (
        disposed ||
        document.hidden ||
        audio.state !== "running" ||
        voices.size >= 9
      )
        return;
      const now = audio.currentTime;
      const interval = kind === "word" ? 0.09 : kind === "count" ? 0.075 : 0.12;
      if (now - (last.get(kind) ?? -Infinity) < interval) return;
      last.set(kind, now);
      switch (kind) {
        case "word":
          tone(520, 380, 0.045, 0, "triangle", 0.3);
          break;
        case "count": {
          const f = 340 + Math.max(0, Math.min(1, progress)) * 700;
          tone(f, f * 1.08, 0.04, 0, "sine", 0.4);
          break;
        }
        case "photo":
          noise(0.055, 2800);
          noise(0.09, 1400, 0.09);
          tone(180, 90, 0.08, 0, "triangle");
          break;
        case "row":
          tone(620, 850, 0.075, 0, "sine", 0.4);
          break;
        case "sweep":
          noise(0.3, 900);
          tone(160, 480, 0.22, 0, "sine", 0.25);
          break;
        case "impact":
          tone(180, 55, 0.2, 0, "triangle");
          noise(0.06, 1800);
          break;
        case "dark":
          tone(170, 45, 0.16, 0, "sine", 0.35);
          break;
        case "paper":
          noise(0.16, 1800);
          break;
        case "tap":
          tone(700, 350, 0.06, 0, "triangle");
          break;
        case "sparkle":
          tone(660, 660, 0.22);
          tone(990, 990, 0.25, 0.08);
          break;
        case "complete":
          [523, 659, 784].forEach((f, i) => tone(f, f, 0.25, i * 0.065));
          break;
      }
      window.dispatchEvent(
        new CustomEvent("jeny:sound-played", {
          detail: { kind, scene: scene.id, volume },
        }),
      );
    };
    const belongs = (target: EventTarget | null) =>
      target instanceof Element &&
      target.closest(".scene")?.classList.contains(`scene-${scene.id}`);
    const animation = (event: AnimationEvent) => {
      if (!belongs(event.target)) return;
      if (event.animationName === "letter-arrive") {
        // One cue per word rather than one per letter.
        if (
          event.target instanceof Element &&
          !event.target.previousElementSibling
        )
          play("word");
      } else {
        const kind = animationSounds[event.animationName];
        if (kind) play(kind);
      }
    };
    const visual = (event: Event) => {
      if (!belongs(event.target)) return;
      const { kind, progress } = (
        event as CustomEvent<{ kind: Sound; progress: number }>
      ).detail;
      play(kind, progress);
    };
    const click = (event: MouseEvent) => {
      if (!belongs(event.target) || !(event.target instanceof Element)) return;
      if (event.target.closest(".candy")) play("sparkle");
      else if (event.target.closest(".warning-button")) play("impact");
      else if (event.target.closest(".ranking button")) play("complete");
    };
    document.addEventListener("animationstart", animation);
    document.addEventListener("jeny:visual-sound", visual);
    document.addEventListener("click", click);
    void audio
      .resume()
      .then(() =>
        play(beat > 0 ? "paper" : (sceneSounds[scene.id] ?? "sparkle")),
      )
      .catch(() => {});
    return () => {
      disposed = true;
      document.removeEventListener("animationstart", animation);
      document.removeEventListener("jeny:visual-sound", visual);
      document.removeEventListener("click", click);
      master.disconnect();
      voices.forEach((source) => {
        source.stop();
        source.disconnect();
      });
      voices.clear();
    };
  }, [scene.id, scene.track, beat, started, enabled, paused]);
  return null;
}
