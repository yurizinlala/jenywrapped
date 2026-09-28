"use client";
import { useEffect, useRef } from "react";
import { jenyWrapped } from "@/data/jeny";
import { Burst } from "./Primitives";
export function MusicDialog({
  selected,
  onClose,
  onSelect,
}: {
  selected: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track =
    jenyWrapped.songs.find((t) => t.id === selected) ?? jenyWrapped.songs[0];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => previous?.focus();
  }, []);
  const validId = /^[a-zA-Z0-9]{22}$/.test(track.spotifyTrackId);
  return (
    <dialog
      ref={dialog}
      className="music-dialog"
      aria-labelledby="music-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="music-inner">
        <header>
          <small>A TRILHA DE NÓS DOIS</small>
          <button onClick={onClose} aria-label="Fechar músicas">
            ×
          </button>
        </header>
        <h2 id="music-title">
          5 músicas.
          <br />
          Sempre você.
        </h2>
        <div className="music-list">
          {jenyWrapped.songs.map((song, i) => (
            <button
              key={song.id}
              aria-pressed={song.id === track.id}
              onClick={() => onSelect(song.id)}
            >
              <span>0{i + 1}</span>
              <span>
                <strong>{song.title}</strong>
                <small>{song.artist}</small>
              </span>
              <span aria-hidden="true">{song.id === track.id ? "●" : "↗"}</span>
            </button>
          ))}
        </div>
        {validId ? (
          <iframe
            key={track.id}
            title={`${track.title} no Spotify`}
            src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : track.audioSrc ? (
          <audio key={track.id} controls src={track.audioSrc} />
        ) : (
          <a
            className="music-link"
            href={`https://open.spotify.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Burst /> Buscar {track.title} no Spotify ↗
          </a>
        )}
        <p>Uma música de cada vez. As memórias continuam quando você voltar.</p>
      </div>
    </dialog>
  );
}
