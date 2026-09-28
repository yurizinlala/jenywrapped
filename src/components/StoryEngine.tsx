"use client";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { scenes } from "@/data/jeny";
import { motionPresets, timing } from "@/lib/motion";
import { nextPosition, previousPosition, phase } from "@/lib/story.mjs";
import { SceneContent } from "./Scenes";
import { MusicDialog } from "./MusicDialog";
import { StoryAudioContext } from "./StoryAudio";
import { Equalizer } from "./Primitives";
type Position = { index: number; beat: number; entering: boolean };
type Action =
  { type: "next" | "previous" | "entered" } | { type: "jump"; index: number };
function reducer(s: Position, a: Action): Position {
  if (a.type === "entered") return { ...s, entering: false };
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
    entering: true,
  });
  const [started, setStarted] = useState(false);
  const [sound, setSound] = useState(true);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [music, setMusic] = useState<string | null>(null);
  const [debug, setDebug] = useState(false);
  const elapsed = useRef(0);
  const progress = useRef<HTMLSpanElement>(null);
  const down = useRef<{ x: number; y: number; time: number } | null>(null);
  const reduced = useReducedMotion();
  const scene = scenes[position.index];
  const isPaused = paused || holding || hidden || music !== null;
  const status = position.entering ? "entering" : phase(scene.auto, isPaused);
  const next = useCallback(() => {
    setStarted(true);
    elapsed.current = 0;
    dispatch({ type: "next" });
  }, []);
  const previous = useCallback(() => {
    elapsed.current = 0;
    dispatch({ type: "previous" });
  }, []);
  const jump = useCallback((index: number) => {
    if (index > 0) setStarted(true);
    elapsed.current = 0;
    setPaused(false);
    setHolding(false);
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
        music ||
        (e.target instanceof HTMLElement &&
          e.target.closest("button,a,input,select,textarea,dialog"))
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
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [music, next, previous]);
  useEffect(() => {
    if (!scene.auto) {
      if (progress.current)
        progress.current.style.transform = `scaleX(${(position.beat + 1) / (scene.beats?.length ?? 1)})`;
      return;
    }
    if (status !== "playing") return;
    let frame = 0,
      last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, timing.maxDelta);
      last = now;
      if (progress.current)
        progress.current.style.transform = `scaleX(${Math.min(1, elapsed.current / scene.duration)})`;
      if (elapsed.current >= scene.duration) {
        next();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scene, position.beat, status, next]);
  const pointerDown = (e: PointerEvent<HTMLElement>) => {
    if (
      e.button !== 0 ||
      (e.target as HTMLElement).closest("button,a,dialog,select")
    )
      return;
    down.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    setHolding(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const pointerUp = (e: PointerEvent<HTMLElement>) => {
    setHolding(false);
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
      <StoryAudioContext.Provider
        value={{
          started,
          enabled: sound,
          paused: isPaused,
          activeTrack: scene.track,
        }}
      >
        <main className={`experience theme-${scene.theme}`}>
          <div className="desktop-frame" aria-hidden="true">
            <div className="desktop-brand">
              YURI
              <br />× JENY<span>2026</span>
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
            aria-label="Jeny Wrapped, retrospectiva interativa"
            data-scene={scene.id}
            data-status={status}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerCancel={() => {
              down.current = null;
              setHolding(false);
            }}
            onLostPointerCapture={() => {
              down.current = null;
              setHolding(false);
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
                      ref={i === position.index ? progress : undefined}
                      style={{
                        transform: `scaleX(${i < position.index ? 1 : 0})`,
                      }}
                    />
                  </span>
                ))}
              </div>
              <div className="story-toolbar">
                <span className="mini-brand">
                  J<span>✳</span>W{" "}
                  <i>/ {String(position.index).padStart(2, "0")}</i>
                </span>
                <span className="chapter-name">{scene.chapter}</span>
                <div className="toolbar-actions">
                  <button
                    aria-label={sound ? "Desativar som" : "Ativar som"}
                    aria-pressed={sound}
                    onClick={() => setSound((v) => !v)}
                  >
                    {sound ? "♫" : "♩"}
                  </button>
                  {position.index > 0 && (
                    <button
                      onClick={() => setPaused((v) => !v)}
                      aria-label={
                        paused
                          ? "Retomar retrospectiva"
                          : "Pausar retrospectiva"
                      }
                      aria-pressed={paused}
                    >
                      {paused ? "▶" : "Ⅱ"}
                    </button>
                  )}
                  <button
                    onClick={() => setMusic(scene.track ?? "anjos")}
                    aria-label="Abrir músicas"
                  >
                    <Equalizer />
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
              <AnimatePresence mode="sync">
                <motion.article
                  key={scene.id}
                  className={`scene theme-${scene.theme} scene-${scene.id}`}
                  {...motionPresets[reduced ? "soft" : scene.transition]}
                  transition={{
                    duration: reduced ? 0.15 : timing.transition,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() => dispatch({ type: "entered" })}
                  aria-label={scene.chapter}
                >
                  <SceneContent
                    key={scene.id}
                    scene={scene}
                    beat={position.beat}
                    onStart={() => jump(1)}
                    onMusic={setMusic}
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
                  {isPaused
                    ? "pausado · no seu tempo"
                    : scene.auto
                      ? "segure para pausar"
                      : `${position.beat + 1} / ${scene.beats?.length ?? 1} · toque para continuar`}
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
              <strong>YURI LABS / DEBUG</strong>
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
                {scene.id} / {status} / {scene.duration}ms
              </span>
              <button onClick={() => setPaused((v) => !v)}>
                {paused ? "Retomar" : "Pausar"}
              </button>
            </aside>
          )}
          {music && (
            <MusicDialog
              selected={music}
              onSelect={setMusic}
              onClose={() => setMusic(null)}
            />
          )}
        </main>
      </StoryAudioContext.Provider>
    </MotionConfig>
  );
}
