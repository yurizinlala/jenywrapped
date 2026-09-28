"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { jenyWrapped, type Scene } from "@/data/jeny";
import {
  Burst,
  ShapeField,
  KineticText,
  PhotoFrame,
  Counter,
  BeatText,
  SoundRings,
} from "./Primitives";
import { ShareCard } from "./ShareCard";
export function SceneContent({
  scene,
  beat,
  onStart,
  onReplay,
}: {
  scene: Scene;
  beat: number;
  onStart: () => void;
  onReplay: () => void;
}) {
  const [egg, setEgg] = useState(0);
  const common = (
    <>
      <div className="scene-kicker">{scene.kicker}</div>
      <KineticText text={scene.title} />
    </>
  );
  switch (scene.id) {
    case "cover":
      return (
        <div className="cover-composition">
          <h1 className="sr-only">
            {jenyWrapped.person.nickname} Wrapped {jenyWrapped.year}
          </h1>
          <div className="cover-label">
            <span>ESPECIALMENTE FEITO PRA</span>
          </div>
          <div className="cover-word">
            <span>{jenyWrapped.person.nickname.toUpperCase()}</span>
            <Burst className="cover-burst" />
          </div>
          <div className="wrapped-word">WRAPPED</div>
          <div className="cover-art" aria-hidden="true">
            <div className="cover-orbit" />
            <div className="cover-disc">
              <span>
                100%<small>VOCÊ</small>
              </span>
            </div>
            <Burst className="cover-star" />
            <span className="cover-year">
              {String(jenyWrapped.year).slice(0, 2)}
              <br />
              {String(jenyWrapped.year).slice(2)}
            </span>
            <div className="cover-capsule" />
          </div>
          <div className="cover-bottom">
            <p>{jenyWrapped.intro}</p>
            <button className="start-button" onClick={onStart}>
              <span>começar maluquice</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      );
    case "scan":
      return (
        <div className="scene-content scan-content">
          <div className="memory-reel">
            <span>SE EU VOLTAR NESSE ANO…</span>
            {[
              "as caronas.",
              "os biscoitos de Nutella.",
              "as músicas.",
              "as risadas idiotas.",
            ].map((s, i) => (
              <p key={s} style={{ animationDelay: `${i * 0.65}s` }}>
                <span>↗</span>
                {s}
              </p>
            ))}
          </div>
          <div className="scan-result">
            <Burst />
            {common}
            <small>{scene.note}</small>
          </div>
        </div>
      );
    case "effect":
      return (
        <div className="scene-content effect-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <div className="effect-number">
            <Burst />
            <Counter value={Number.parseInt(scene.title, 10)} suffix="%" />
          </div>
          <div className="chart-bars">
            {scene.rows?.map(([label, value], i) => (
              <div key={label}>
                <span>{label}</span>
                <i style={{ width: `${28 - i * 8}%` }} />
                <small>{value}</small>
              </div>
            ))}
            <div className="broken-bar">
              <span>você</span>
              <i />
              <small>↗∞</small>
            </div>
          </div>
          <p className="footnote">{scene.note}</p>
        </div>
      );
    case "cinema":
      return (
        <div className="scene-content cinema-content">
          <div className="film-strip" aria-hidden="true" />
          {common}
          <PhotoFrame id="cinema" />
          <p className="pill-note">{scene.note}</p>
        </div>
      );
    case "updates":
      return (
        <div className="scene-content updates-content">
          {common}
          <div className="update-list">
            {scene.rows?.map(([symbol, label], i) => (
              <motion.div
                key={label}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.12 }}
              >
                <b>{symbol}</b>
                {label}
              </motion.div>
            ))}
          </div>
          <div className="stamp">aiai.</div>
          <small>carrapato não tem pai.</small>
        </div>
      );
    case "nickname":
      return (
        <div className="scene-content nickname-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <Burst className="nickname-burst" />
          <div className="nickname-card">
            <span>✦ apelido nº 999.014.179</span>
            <KineticText text={scene.title} />
            <small>{scene.note}</small>
          </div>
          <p>picuinha minha. coisa nossa.</p>
        </div>
      );
    case "chaos":
      return (
        <div className="scene-content chaos-content">
          <div className="hazard" />
          {common}
          <button
            className="warning-button"
            onClick={() => setEgg(1)}
            aria-label="Investigar nível de caos"
          >
            <Burst />
            <span>!</span>
          </button>
          {egg > 0 && (
            <div className="warning-eggs" aria-label="Alerta: caos confirmado">
              ! ! !
            </div>
          )}
          <div className="report-rows">
            {scene.rows?.map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <b>{b}</b>
              </div>
            ))}
          </div>
          <p className="footnote">{scene.note}</p>
        </div>
      );
    case "blackout":
      return (
        <div className="scene-content blackout-content">
          <div className="blackout-grid" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.11}s` }} />
            ))}
          </div>
          <div className="incident-rows">
            {scene.rows?.map(([a, b]) => (
              <p key={a}>
                <span>{a}</span>
                {b}
              </p>
            ))}
          </div>
          <KineticText text={scene.title} />
          <p>{scene.kicker}</p>
          <small>{scene.note}</small>
        </div>
      );
    case "pan":
      return (
        <div className="scene-content pan-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <motion.div
            layoutId="music-disc"
            className="pan-symbol"
            aria-hidden="true"
          >
            <div />
          </motion.div>
          <KineticText text={scene.title} />
          <p>{scene.note}</p>
          <small>
            ★ 21/08/2026
            <br />✞ 15/09/2026
          </small>
        </div>
      );
    case "music":
      return (
        <div className="scene-content music-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <div className="orbit-records" aria-hidden="true">
            {jenyWrapped.songs.slice(0, 5).map((s, i) => (
              <motion.div
                layoutId={i === 2 ? "music-disc" : undefined}
                key={s.id}
                style={{
                  background: s.color,
                  rotate: `${(i - 2) * 18}deg`,
                  left: `${i * 13}%`,
                  top: `${Math.abs(i - 2) * 14}%`,
                }}
              >
                <span className="record" />
              </motion.div>
            ))}
          </div>
          <KineticText text={scene.title} />
          <p>{scene.note}</p>
        </div>
      );
    case "anjos":
      return (
        <div className="scene-content song-content anjos-content">
          <SoundRings />
          <ShapeField kind="arches" />
          <span className="scene-kicker">&quot;SINTO COMO OS...&quot;</span>
          <KineticText text={scene.title} />
          <BeatText text={scene.beats?.[beat] ?? ""} />
        </div>
      );
    case "secret":
      return (
        <div className="scene-content secret-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <div className="secret-record">
            <SoundRings />
            <span className="record" />
            <Burst />
          </div>
          <div className="secret-confession">
            <KineticText text={scene.title} />
          </div>
          <BeatText text={scene.note ?? ""} />
        </div>
      );
    case "azul":
      return (
        <div className="scene-content song-content azul-content">
          <SoundRings />
          <motion.div layoutId="blue-landscape" className="blue-landscape">
            <ShapeField />
          </motion.div>
          <div className="color-swatches" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className="scene-kicker">
            &quot;UM DIZER ASSIM, O AMOR É...&quot;
          </span>
          <KineticText text={scene.title} />
          <BeatText text={scene.beats?.[beat] ?? ""} />
        </div>
      );
    case "trip":
      return (
        <div className="scene-content trip-content">
          <motion.div
            layoutId="blue-landscape"
            className="route-art"
            aria-hidden="true"
          >
            <svg viewBox="0 0 400 700">
              <path d="M300 -20 C20 120 480 240 190 330 S20 510 320 750" />
            </svg>
          </motion.div>
          {common}
          <PhotoFrame id="trip" />
          <div className="route-labels">
            <span>NATAL</span>
            <span>JOÃO PESSOA</span>
            <span>SANTA RITA</span>
          </div>
          <p>{scene.note}</p>
        </div>
      );
    case "firsts":
      return (
        <div className="scene-content firsts-content">
          <ShapeField kind="lines" />
          {common}
          <div className="firsts-list">
            {scene.rows?.map(([a, b]) => (
              <div key={b}>
                <strong>{a}</strong>
                <p>{b}</p>
              </div>
            ))}
          </div>
          <p>{scene.note}</p>
        </div>
      );
    case "tripstats":
      return (
        <div className="scene-content tripstats-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <KineticText text={scene.title} />
          <div className="trip-stats">
            {scene.rows?.map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <strong>{b}</strong>
              </div>
            ))}
          </div>
          <small>{scene.note}</small>
        </div>
      );
    case "alignment":
      return (
        <div className="scene-content song-content alignment-content">
          <SoundRings />
          <div className="alignment-orbits" aria-hidden="true">
            <i />
            <i />
            <span />
          </div>
          <span className="scene-kicker">{scene.note}</span>
          <KineticText text={scene.title} />
          <BeatText text={scene.beats?.[beat] ?? ""} />
        </div>
      );
    case "candy":
      return (
        <div className="scene-content candy-content">
          <SoundRings />
          <span className="scene-kicker">{scene.kicker}</span>
          <motion.button
            className="candy"
            aria-label="Dar um pulinho no chocolate"
            onClick={() => setEgg(egg + 1)}
            animate={{ rotate: egg % 2 ? 18 : -12, y: egg % 2 ? -24 : 0 }}
            transition={{ type: "spring", bounce: 0.7 }}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </motion.button>
          <small>{scene.note}</small>
          <KineticText text={scene.title} />
        </div>
      );
    case "top":
      return (
        <div className="scene-content top-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <div className="top-number">
            <Burst />
            <span>#1</span>
          </div>
          <motion.div
            animate={{ x: egg % 2 ? 12 : 0, rotate: egg % 2 ? -3 : 0 }}
          >
            <KineticText text={scene.title} />
          </motion.div>
          <div className="ranking">
            {scene.rows?.map(([a, b]) => (
              <button key={a} onClick={() => setEgg(egg + 1)}>
                {a}
                <span>{b}</span>
                <span>↗</span>
              </button>
            ))}
          </div>
          <p>{egg ? "ninguém nem chegou perto." : scene.note}</p>
        </div>
      );
    case "year":
      return (
        <div className="scene-content year-content">
          <span className="scene-kicker">{scene.kicker}</span>
          <KineticText text={scene.title} />
          <div className="year-grid">
            {scene.rows?.map(([a, b]) => (
              <div key={b}>
                <strong>{a}</strong>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <small>{scene.note}</small>
        </div>
      );
    case "truth":
    case "declaration":
      return (
        <div className={`scene-content quiet-content ${scene.id}`}>
          <span className="scene-kicker">{scene.chapter}</span>
          <motion.h1
            key={beat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {scene.beats?.[beat]}
          </motion.h1>
          <motion.div layoutId="sign-off" className="quiet-footer">
            <span>{jenyWrapped.author.charAt(0)}</span>
            <i />
            <span>{jenyWrapped.person.nickname.charAt(0)}</span>
          </motion.div>
        </div>
      );
    case "letter":
      return (
        <div className="scene-content letter-content">
          <span className="scene-kicker">CARTA FINAL</span>
          <h1>{scene.title}</h1>
          <motion.p
            className="letter-text"
            key={beat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {scene.beats?.[beat]}
          </motion.p>
          <motion.div layoutId="sign-off" className="letter-signature">
            <span>
              com carinho,
              <br />
              <strong>{jenyWrapped.author}.</strong>
            </span>
            <span>
              {String(beat + 1).padStart(2, "0")} / {scene.beats?.length}
            </span>
          </motion.div>
        </div>
      );
    case "share":
      return <ShareCard onReplay={onReplay} />;
    default:
      return <div className="scene-content">{common}</div>;
  }
}
