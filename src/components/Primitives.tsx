"use client";
import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { jenyWrapped, type Track } from "@/data/jeny";

export function Burst({
  className = "",
  petals = 16,
}: {
  className?: string;
  petals?: number;
}) {
  const points = Array.from({ length: petals * 2 }, (_, i) => {
    const a = (i * Math.PI) / petals;
    const r = i % 2 ? 35 : 50;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg
      className={`burst ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <polygon points={points} fill="currentColor" />
    </svg>
  );
}
export function ShapeField({ kind = "rings" }: { kind?: string }) {
  return (
    <div className={`shape-field ${kind}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}
export function KineticText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  let index = 0;
  return (
    <h1
      className={"kinetic-text " + className}
      aria-label={text.replaceAll("\n", " ")}
    >
      {text.split("\n").map((line, i) => (
        <span className="kinetic-line" aria-hidden="true" key={i}>
          {line.split(" ").map((word, w) => (
            <span className="kinetic-word" key={w}>
              {Array.from(word).map((letter, l) => (
                <span
                  className="kinetic-letter"
                  style={{ "--letter": index++ } as CSSProperties}
                  key={l}
                >
                  {letter}
                </span>
              ))}
              {w < line.split(" ").length - 1 ? "\u00a0" : ""}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
export function BeatText({
  text,
  className = "song-beat",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p key={text} className={className + " beat-text"} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          aria-hidden="true"
          key={i}
          style={{ "--word": i } as CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
export function SoundRings() {
  return (
    <div className="sound-rings" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}
export function PhotoFrame({ id }: { id: string }) {
  const photo = jenyWrapped.photos[id as keyof typeof jenyWrapped.photos];
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`photo-frame photo-${id}`}>
      <div className="photo-art">
        {photo.src && !failed ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 600px) 70vw, 310px"
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <ShapeField kind="arches" />
            <span className="photo-monogram" aria-hidden="true">
              Y<span>×</span>J
            </span>
            <span className="photo-caption">{photo.label}</span>
          </>
        )}
      </div>
      <figcaption>
        {photo.label}
        <span>↗</span>
      </figcaption>
    </figure>
  );
}
export function TrackCard({
  track,
  onOpen,
}: {
  track: Track;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      className="track-card"
      onClick={() => onOpen(track.id)}
      aria-label={`Ouvir ${track.title}, ${track.artist}`}
    >
      <span
        className="track-art"
        style={{ "--track": track.color } as CSSProperties}
      >
        <span className="record" />
      </span>
      <span className="track-info">
        <strong>{track.title}</strong>
        <small>{track.artist}</small>
      </span>
      <span className="track-play" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}
export function Equalizer() {
  return (
    <span className="equalizer" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      if (element.current) element.current.textContent = String(value);
      return;
    }
    const animation = animate(0, value, {
      duration: 1.8,
      ease: [0.12, 0.7, 0.22, 1],
      onUpdate: (latest) => {
        if (element.current)
          element.current.textContent = String(Math.round(latest));
      },
    });
    return () => animation.stop();
  }, [value, reduced]);
  return (
    <h1 aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        <span ref={element}>{value}</span>
        {suffix}
      </span>
    </h1>
  );
}
