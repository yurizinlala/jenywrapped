"use client";
import {
  useCallback,
  useEffect,
  useReducer,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { jenyWrapped, scenes } from "@/data/jeny";
import { motionPresets, timing } from "@/lib/motion";
import { nextPosition, previousPosition } from "@/lib/story.mjs";
import { SceneContent } from "./Scenes";
import { StoryAudioContext, StoryTrack } from "./StoryAudio";
import { SceneSoundEffect, unlockSoundEffects } from "./SoundEffects";
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const readMotionPreference = () => window.matchMedia(motionQuery).matches;
const serverMotionPreference = () => false;
type Position = { index: number; beat: number; entering: boolean };
type Action =
  | { type: "next" | "previous" }
  | { type: "entered"; index: number }
  | { type: "jump"; index: number };
function reducer(s: Position, a: Action): Position {
  if (a.type === "entered")
    return a.index === s.index ? { ...s, entering: false } : s;
  if (a.type === "jump")
    return {
      index: Math.max(0, Math.min(scenes.length - 1, a.index)),
      beat: 0,
      entering: true,
    };
  const p =
    a.type === "next"
      ? nextPosition(s.index, s.beat, scenes)
      : previousPosition(s.index, s.beat, scenes);
  return { ...p, entering: p.index !== s.index };
}
export function StoryEngine() {
  const [position, dispatch] = useReducer(reducer, {
    index: 0,
    beat: 0,
    entering: false,
  });
  const [started, setStarted] = useState(false);
  const [sound, setSound] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [debug, setDebug] = useState(false);
  const down = useRef<{ x: number; y: number; time: number } | null>(null);
  const reduced = useSyncExternalStore(
    subscribeMotionPreference,
    readMotionPreference,
    serverMotionPreference,
  );
  const scene = scenes[position.index];
  const track = jenyWrapped.songs.find((t) => t.id === scene.track);
  const audioState = useMemo(
    () => ({
      started,
      enabled: sound,
      paused: hidden,
      activeTrack: scene.track,
      activeScene: scene.id,
    }),
    [started, sound, hidden, scene.track, scene.id],
  );
  const isPaused = hidden;
  const status = position.entering
    ? "entering"
    : isPaused
      ? "paused"
      : "waiting";
  const next = useCallback(() => {
    setStarted(true);
    unlockSoundEffects();
    dispatch({ type: "next" });
  }, []);
  const previous = useCallback(() => {
    unlockSoundEffects();
    dispatch({ type: "previous" });
  }, []);
  const jump = useCallback((index: number) => {
    setStarted(index > 0);
    unlockSoundEffects();
    dispatch({ type: "jump", index });
  }, []);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).get("debug") === "1"
    ) {
      queueMicrotask(() => setDebug(true));
    }
  }, []);
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("button,a,input,select,textarea,dialog")
      )
        return;
      if (e.key === "ArrowRight" || e.code === "Space") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        previous();
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [next, previous]);
  const pointerDown = (e: PointerEvent<HTMLElement>) => {
    if (
      e.button !== 0 ||
      (e.target as HTMLElement).closest(
        "button,a,dialog,select,input,audio,iframe",
      )
    )
      return;
    down.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const pointerUp = (e: PointerEvent<HTMLElement>) => {
    if (!down.current) return;
    const start = down.current;
    down.current = null;
    const dx = e.clientX - start.x,
      dy = e.clientY - start.y;
    if (Math.abs(dx) > timing.swipe && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else previous();
      return;
    }
    if (
      performance.now() - start.time < timing.hold &&
      Math.abs(dx) < 15 &&
      Math.abs(dy) < 15 &&
      position.index > 0
    ) {
      const bounds = e.currentTarget.getBoundingClientRect();
      if (e.clientX - bounds.left < bounds.width * 0.32) previous();
      else if (position.index < scenes.length - 1) next();
    }
  };
  return (
    <MotionConfig reducedMotion="user">
      <StoryAudioContext.Provider value={audioState}>
        <SceneSoundEffect scene={scene} beat={position.beat} />
        {track && (
          <StoryTrack key={scene.id} track={track} sceneId={scene.id} />
        )}
        <main className={`experience theme-${scene.theme}`}>
          <div className="desktop-frame" aria-hidden="true">
            <div className="desktop-brand">
              {jenyWrapped.author.toUpperCase()}
              <br />× {jenyWrapped.person.nickname.toUpperCase()}
              <span>{jenyWrapped.year}</span>
            </div>
            <div className="desktop-type">
              UMA
              <br />
              PESSOA.
              <br />
              <em>TODAS</em>
              <br />
              AS CORES.
            </div>
            <span className="desktop-foot">
              RETROSPECTIVA PESSOAL / VOL. 01
            </span>
            <div className="desktop-right">
              <span>MEMÓRIAS EM ALTA ROTAÇÃO.</span>
              <div className="side-rings" />
              <small>
                FEITO COM CARINHO.
                <br />E UM POUCO DE EXAGERO.
              </small>
            </div>
          </div>
          <section
            className={`story-stage ${isPaused ? "is-paused" : ""}`}
            aria-label={`${jenyWrapped.person.nickname} Wrapped, retrospectiva interativa`}
            data-scene={scene.id}
            data-status={status}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerCancel={() => {
              down.current = null;
            }}
            onLostPointerCapture={() => {
              down.current = null;
            }}
          >
            <header className="story-header">
              <div
                className="story-progress"
                aria-label={`História ${position.index + 1} de ${scenes.length}`}
              >
                {scenes.map((s, i) => (
                  <span
                    key={s.id}
                    className={`progress-segment ${i < position.index ? "complete" : ""}`}
                  >
                    <span
                      style={{
                        transform: `scaleX(${i < position.index ? 1 : i === position.index ? (position.beat + 1) / (scene.beats?.length ?? 1) : 0})`,
                      }}
                    />
                  </span>
                ))}
              </div>
              <div className="story-toolbar">
                <span className="mini-brand">
                  {jenyWrapped.person.nickname.charAt(0)}
                  <span>✳</span>W{" "}
                  <i>/ {String(position.index).padStart(2, "0")}</i>
                </span>
                {track && (
                  <span
                    className="music-indicator"
                    data-muted={!sound}
                    role="status"
                    aria-label={
                      sound
                        ? "Este story tem música"
                        : "Este story tem música. Som desativado"
                    }
                  >
                    <span aria-hidden="true">♫</span>
                    {sound ? "música" : "música · mudo"}
                  </span>
                )}
                <div className="toolbar-actions">
                  <button
                    aria-label={sound ? "Desativar som" : "Ativar som"}
                    aria-pressed={sound}
                    onClick={() => {
                      unlockSoundEffects();
                      setSound((v) => !v);
                      if (!sound)
                        window.dispatchEvent(new Event("jeny:retry-audio"));
                    }}
                  >
                    {sound ? "♫" : "♩"}
                  </button>
                  <button
                    onClick={() => jump(0)}
                    aria-label="Recomeçar do início"
                  >
                    ↺
                  </button>
                </div>
              </div>
            </header>
            <div className="scene-viewport">
              <AnimatePresence mode="sync" initial={false}>
                <motion.article
                  key={scene.id}
                  className={`scene theme-${scene.theme} scene-${scene.id}`}
                  {...motionPresets[reduced ? "soft" : scene.transition]}
                  transition={{
                    duration: reduced ? 0.15 : timing.transition,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() =>
                    dispatch({ type: "entered", index: position.index })
                  }
                  aria-label={scene.chapter}
                >
                  <SceneContent
                    key={scene.id}
                    scene={scene}
                    beat={position.beat}
                    onStart={() => jump(1)}
                    onReplay={() => jump(0)}
                  />
                </motion.article>
              </AnimatePresence>
            </div>
            {position.index > 0 && position.index < scenes.length - 1 && (
              <footer className="story-footer">
                <button onClick={previous} aria-label="História anterior">
                  ←
                </button>
                <span>
                  {scene.beats
                    ? `${position.beat + 1} / ${scene.beats.length} · toque para continuar`
                    : "toque para continuar"}
                </span>
                <button onClick={next} aria-label="Próxima história">
                  →
                </button>
              </footer>
            )}
            <p className="sr-only" aria-live="polite">
              {scene.chapter}. {scene.beats?.[position.beat] ?? scene.title}
            </p>
          </section>
          {debug && (
            <aside className="debug-panel">
              <strong>{jenyWrapped.author.toUpperCase()} LABS / DEBUG</strong>
              <select
                aria-label="Ir para história"
                value={position.index}
                onChange={(e) => jump(Number(e.target.value))}
              >
                {scenes.map((s, i) => (
                  <option key={s.id} value={i}>
                    {i}. {s.id}
                  </option>
                ))}
              </select>
              <span>
                {scene.id} / {status}
              </span>
            </aside>
          )}
        </main>
      </StoryAudioContext.Provider>
    </MotionConfig>
  );
}
