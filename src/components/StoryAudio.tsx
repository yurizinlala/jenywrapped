"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/jeny";

type AudioState = {
  started: boolean;
  enabled: boolean;
  paused: boolean;
  activeTrack?: string;
};
export const StoryAudioContext = createContext<AudioState>({
  started: false,
  enabled: true,
  paused: false,
});
type Playback = {
  data: {
    isPaused: boolean;
    isBuffering: boolean;
    playingURI?: string;
    position?: number;
  };
};
type Controller = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: (event: string, callback: (event: Playback) => void) => void;
};
type SpotifyAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyAPI) => void;
  }
}
let apiPromise: Promise<SpotifyAPI> | null = null;
function loadSpotify() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      reject(new Error("Spotify indisponível"));
    }, 12000);
    window.onSpotifyIframeApiReady = (api) => {
      clearTimeout(timeout);
      resolve(api);
    };
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("Sem conexão com Spotify"));
    };
    document.body.appendChild(script);
  });
  return apiPromise;
}
export function SpotifyPlayer({ track }: { track: Track }) {
  const audioState = useContext(StoryAudioContext);
  const currentState = useRef(audioState);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "playing" | "paused" | "failed"
  >("loading");
  useEffect(() => {
    currentState.current = audioState;
    const c = controller.current;
    if (!c) return;
    if (
      !audioState.enabled ||
      audioState.paused ||
      audioState.activeTrack !== track.id
    )
      c.pause();
    else c.resume();
  }, [audioState, track.id]);
  useEffect(() => {
    if (!audioState.started || !host.current) return;
    let disposed = false;
    let own: Controller | null = null;
    const target = host.current;
    const element = document.createElement("div");
    target.appendChild(element);
    loadSpotify()
      .then((api) => {
        if (disposed) return;
        api.createController(
          element,
          {
            uri: `spotify:track:${track.spotifyTrackId}`,
            width: "100%",
            height: 80,
          },
          (c) => {
            if (disposed) {
              c.destroy();
              return;
            }
            own = c;
            controller.current = c;
            c.addListener("ready", () => {
              if (disposed) return;
              setStatus("ready");
              const state = currentState.current;
              if (
                state.enabled &&
                !state.paused &&
                state.activeTrack === track.id
              )
                c.play();
            });
            c.addListener("playback_update", (event) => {
              if (disposed) return;
              const state = currentState.current;
              if (
                !event.data.isPaused &&
                (!state.enabled ||
                  state.paused ||
                  state.activeTrack !== track.id)
              ) {
                c.pause();
                return;
              }
              setStatus(
                event.data.isPaused
                  ? "paused"
                  : event.data.isBuffering
                    ? "loading"
                    : "playing",
              );
            });
          },
        );
      })
      .catch(() => {
        if (!disposed) setStatus("failed");
      });
    return () => {
      disposed = true;
      own?.destroy();
      controller.current = null;
      target.replaceChildren();
    };
  }, [track.id, track.spotifyTrackId, audioState.started]);
  return (
    <div
      className="story-track"
      data-audio-status={status}
      aria-label={`${track.title}, ${track.artist}`}
    >
      <div className="track-heading">
        <span>♫ {track.artist}</span>
        {status === "playing" ? (
          <span className="playing-label">tocando agora</span>
        ) : status === "failed" ? (
          <span>toque no player abaixo</span>
        ) : (
          <button
            disabled={!audioState.enabled}
            onClick={() => controller.current?.play()}
            aria-label={`Tocar ${track.title}`}
          >
            {status === "loading" ? "conectando…" : "▶ tocar música"}
          </button>
        )}
      </div>
      <div
        ref={host}
        className="spotify-host"
        style={status === "failed" ? { display: "none" } : undefined}
      />
      {status === "failed" && (
        <iframe
          title={`${track.title} no Spotify`}
          src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}`}
          width="100%"
          height="80"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        />
      )}
      <a
        className="track-external"
        href={`https://open.spotify.com/track/${track.spotifyTrackId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {track.title} ↗
      </a>
    </div>
  );
}
function LocalPlayer({ track }: { track: Track }) {
  const state = useContext(StoryAudioContext);
  const audio = useRef<HTMLAudioElement>(null);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (
      !state.started ||
      !state.enabled ||
      state.paused ||
      state.activeTrack !== track.id
    ) {
      el.pause();
      return;
    }
    el.play().catch(() => setBlocked(true));
    return () => el.pause();
  }, [state, track.id]);
  return (
    <div className="story-track">
      <span className="track-heading">
        {track.title} · {track.artist}
      </span>
      <audio
        ref={audio}
        src={track.audioSrc}
        controls
        preload="none"
        onPlaying={() => setBlocked(false)}
      />
      {blocked && <small>Toque no play para ouvir.</small>}
    </div>
  );
}
export function StoryTrack({ track }: { track: Track }) {
  return track.audioSrc ? (
    <LocalPlayer track={track} />
  ) : (
    <SpotifyPlayer track={track} />
  );
}
