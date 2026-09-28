"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { publicAsset } from "@/lib/assets.mjs";
import type { Track } from "@/data/jeny";

type AudioState = {
  started: boolean;
  enabled: boolean;
  paused: boolean;
  activeTrack?: string;
  activeScene?: string;
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
    const fail = (message: string) => {
      clearTimeout(timeout);
      script.remove();
      window.onSpotifyIframeApiReady = undefined;
      apiPromise = null;
      reject(new Error(message));
    };
    const timeout = window.setTimeout(
      () => fail("Spotify indisponível"),
      12000,
    );
    window.onSpotifyIframeApiReady = (api) => {
      clearTimeout(timeout);
      resolve(api);
    };
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      fail("Sem conexão com Spotify");
    };
    document.body.appendChild(script);
  });
  return apiPromise;
}
type PlayerProps = { track: Track; sceneId: string };
export function SpotifyPlayer({ track, sceneId }: PlayerProps) {
  const audioState = useContext(StoryAudioContext);
  const [attempt, setAttempt] = useState(0);
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
      !audioState.started ||
      !audioState.enabled ||
      audioState.paused ||
      audioState.activeTrack !== track.id ||
      audioState.activeScene !== sceneId
    )
      c.pause();
    else c.resume();
  }, [audioState, track.id, sceneId]);
  useEffect(() => {
    if (!audioState.started || !host.current) return;
    let disposed = false;
    let own: Controller | null = null;
    const timeout = window.setTimeout(() => {
      disposed = true;
      clearTimeout(timeout);
      own?.destroy();
      controller.current = null;
      target.replaceChildren();
      setStatus("failed");
    }, 15000);
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
            const iframe = target.querySelector("iframe");
            if (iframe) {
              iframe.tabIndex = -1;
              iframe.loading = "eager";
              iframe.setAttribute("aria-hidden", "true");
            }
            c.addListener("ready", () => {
              if (disposed) return;
              clearTimeout(timeout);
              setStatus("ready");
              const state = currentState.current;
              if (
                state.started &&
                state.enabled &&
                !state.paused &&
                state.activeTrack === track.id &&
                state.activeScene === sceneId
              )
                c.play();
            });
            c.addListener("playback_update", (event) => {
              if (disposed) return;
              const state = currentState.current;
              if (
                !event.data.isPaused &&
                (!state.started ||
                  !state.enabled ||
                  state.paused ||
                  state.activeTrack !== track.id ||
                  state.activeScene !== sceneId)
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
        clearTimeout(timeout);
        if (!disposed) {
          disposed = true;
          own?.destroy();
          controller.current = null;
          target.replaceChildren();
          setStatus("failed");
        }
      });
    return () => {
      clearTimeout(timeout);
      disposed = true;
      own?.destroy();
      controller.current = null;
      target.replaceChildren();
    };
  }, [track.id, track.spotifyTrackId, audioState.started, sceneId, attempt]);
  useEffect(() => {
    const retry = () => {
      if (status === "failed") {
        setStatus("loading");
        setAttempt((n) => n + 1);
      }
    };
    window.addEventListener("online", retry);
    window.addEventListener("jeny:retry-audio", retry);
    return () => {
      window.removeEventListener("online", retry);
      window.removeEventListener("jeny:retry-audio", retry);
    };
  }, [status]);
  return (
    <div
      className="story-track"
      hidden
      aria-hidden="true"
      data-audio-status={status}
      data-track={track.id}
    >
      <div ref={host} />
    </div>
  );
}

function LocalPlayer({ track, sceneId }: PlayerProps) {
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
      state.activeTrack !== track.id ||
      state.activeScene !== sceneId
    ) {
      el.pause();
      return;
    }
    el.play().catch(() => setBlocked(true));
    return () => el.pause();
  }, [state, track.id, sceneId]);
  return (
    <div
      className="story-track"
      hidden
      aria-hidden="true"
      data-track={track.id}
    >
      <audio
        ref={audio}
        src={publicAsset(track.audioSrc ?? "")}
        muted={
          !state.enabled ||
          state.paused ||
          !state.started ||
          state.activeScene !== sceneId
        }
        onPlay={(e) => {
          if (
            !state.enabled ||
            state.paused ||
            !state.started ||
            state.activeScene !== sceneId
          )
            e.currentTarget.pause();
        }}
        tabIndex={-1}
        preload="none"
        onPlaying={() => setBlocked(false)}
      />
      {blocked && <small>Toque no play para ouvir.</small>}
    </div>
  );
}
export function StoryTrack({ track, sceneId }: PlayerProps) {
  return track.audioSrc ? (
    <LocalPlayer track={track} sceneId={sceneId} />
  ) : (
    <SpotifyPlayer track={track} sceneId={sceneId} />
  );
}
