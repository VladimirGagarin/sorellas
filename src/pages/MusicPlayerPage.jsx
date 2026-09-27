// pages/MusicPlayerPage.jsx
// "Songs of the Sisters" — the deck rests on the left, the roll of voices on
// the right. Tap a sister's portrait to hear her song; portraits still waiting
// for a recording (or whose file failed to load) stay quiet and unpressable.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import SisterPhoto from "../components/SisterPhoto.jsx";
import { getSisterSongUrl, getSistersAudioUrl } from "../components/Utils.js";
import { useLanguage } from "../contexts/useLanguage.js";
import { SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaHeart,
  FaInfinity,
  FaListUl,
  FaMusic,
  FaPause,
  FaPlay,
  FaRedo,
  FaSeedling,
  FaShareAlt,
  FaWaveSquare,
} from "react-icons/fa";
import "./MusicPlayerPage.css";

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// A sister's own name never changes with the language; a song's title does.
function trackName(track, language) {
  return track.names?.[language] || track.names?.en || "";
}

// What a search engine and a link preview should read for one song: her own
// words if she has them, otherwise a plain invitation to listen and share.
function seoDescription(track, name, language) {
  const message =
    typeof track.message === "string"
      ? track.message
      : (track.message?.[language] ?? track.message?.en);
  const own = typeof message === "string" ? message.trim() : "";
  const base =
    own ||
    (language === "en"
      ? `Listen to “${name}” from the Sisters of Saint Joseph Cottolengo, and share it with whoever you love.`
      : `Ascolta «${name}» delle Suore di San Giuseppe Cottolengo e condividila con chi ami.`);
  return base.length > 200 ? `${base.slice(0, 197).trimEnd()}…` : base;
}

export default function MusicPlayerPage() {
  const { language } = useLanguage();
  // The song lives in the address itself: /thankyou/giovanna/
  const { songId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const hasPressedPlay = useRef(false);
  const sharedTimer = useRef(null);

  // The congregation's two songs open the list; the sisters follow in a fresh
  // random order, each carrying her song or her silence.
  const [allSisters] = useState(() => {
    const tracks = getSistersAudioUrl();
    return [
      ...tracks.filter((track) => track.kind === "song"),
      ...shuffle(tracks.filter((track) => track.kind === "sister")),
    ];
  });
  // Ids whose recording exists in code but failed to play — locked like the rest.
  const [broken, setBroken] = useState(() => new Set());

  const withAudio = useMemo(
    () => allSisters.filter((track) => track.hasAudio),
    [allSisters],
  );
  const playable = useMemo(
    () => withAudio.filter((track) => !broken.has(track.id)),
    [withAudio, broken],
  );

  // A shared link arrives as /thankyou/<id> and opens on that song, ready to play.
  const [index, setIndex] = useState(() => {
    const found = songId
      ? playable.findIndex((track) => track.id === songId)
      : -1;
    return found >= 0 ? found : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const current =
    playable.length > 0 ? playable[index % playable.length] : null;
  const currentId = current ? current.id : null;
  const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;
  const isSilent = playable.length === 0;

  const t = useMemo(
    () => ({
      eyebrow: language === "en" ? "Songs of the Sisters" : "Canti delle Suore",
      title: language === "en" ? "We Say Thank You" : "Diciamo Grazie",
      subtitle:
        language === "en"
          ? "Every voice in the sisterhood is a song. Choose a portrait on the left and let it play — the ones still waiting for a recording rest in silence."
          : "Ogni voce della sorellanza è un canto. Scegli un ritratto a sinistra e lascialo suonare — quelle che attendono ancora una registrazione restano in silenzio.",
      nowPlaying: language === "en" ? "Now singing" : "Ora canta",
      pausedLabel: language === "en" ? "Paused" : "In pausa",
      silence: language === "en" ? "Silence" : "Silenzio",
      queueTitle: "DEO GRATIAS",
      queueHint:
        language === "en"
          ? "Shuffled for you — tap a portrait to play her song"
          : "Ordine casuale — tocca un ritratto per ascoltare il suo canto",
      recorded:
        language === "en" ? "songs ready to play" : "canti pronti all'ascolto",
      waiting:
        language === "en"
          ? "recordings still to come"
          : "registrazioni in arrivo",
      noRecording:
        language === "en" ? "No recording yet" : "Ancora nessuna registrazione",
      unavailable:
        language === "en"
          ? "Recording unavailable"
          : "Registrazione non disponibile",
      forEveryone: language === "en" ? "For all of us" : "Per tutte noi",
      play: language === "en" ? "Play" : "Riproduci",
      pause: language === "en" ? "Pause" : "Pausa",
      previous: language === "en" ? "Previous song" : "Brano precedente",
      next: language === "en" ? "Next song" : "Brano successivo",
      loop: language === "en" ? "Repeat this song" : "Ripeti il brano",
      loopOn: language === "en" ? "Repeating" : "In ripetizione",
      share: language === "en" ? "Share this song" : "Condividi il brano",
      shared: language === "en" ? "Link copied" : "Link copiato",
      empty:
        language === "en"
          ? "No recordings have been added yet — come back soon and the garden will be full of song."
          : "Non è ancora stato aggiunto nessun brano — torna presto e il giardino sarà pieno di canto.",
      showAll: language === "en" ? "Show all sisters" : "Mostra tutte",
      showLess: language === "en" ? "Show fewer" : "Mostra meno",
      verse:
        language === "en"
          ? "“Aeternum Floreamus — Let us bloom forever”"
          : "«Aeternum Floreamus — Fioriamo per sempre»",
      meetSisters:
        language === "en"
          ? "Meet the sisters behind every song"
          : "Incontra le suore dietro ogni canto",
    }),
    [language],
  );

  // Each song carries its own name, address and description, so a link handed
  // to a friend reads as a song rather than as a page of a list.
  const songName = current ? trackName(current, language) : "";
  useSeo({
    title: current
      ? `${songName} — ${t.title} | ${SITE_NAME}`
      : `${t.title} | ${SITE_NAME}`,
    description: current
      ? seoDescription(current, songName, language)
      : t.subtitle,
    url: current ? current.sisterSongUrl : getSisterSongUrl(""),
    image: SITE_IMAGE_URL,
  });

  // Choosing a new song resets the readout here, at the moment of the choice,
  // and writes the song's own address into the URL so it can be shared or
  // bookmarked. The back button is left alone — this is a replace, not a push.
  const selectIndex = useCallback((nextIndex) => {
    setIndex(nextIndex);
    setElapsed(0);
    setDuration(0);
    setIsLoading(true);
  }, []);

  // Keep the address in step with the deck — without it, the song on the turntable
  // is the only one with an address of its own. A replace, so the visitor's back
  // button still walks pages rather than every song they ever played.
  useEffect(() => {
    if (!currentId || currentId === songId) return;
    navigate(`/thankyou/${encodeURIComponent(currentId)}/`, { replace: true });
  }, [currentId, songId, navigate]);

  const step = useCallback(
    (delta) => {
      if (playable.length === 0) return;
      selectIndex((index + delta + playable.length) % playable.length);
    },
    [index, playable.length, selectIndex],
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (el.paused) {
      hasPressedPlay.current = true;
      setIsLoading(true);
      const attempt = el.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    } else {
      el.pause();
    }
  }, [current]);

  // When the chosen sister changes, swap the source and — only if the visitor
  // already pressed play — start her song.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    el.load();
    if (!hasPressedPlay.current) return;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [currentId, current]);

  useEffect(() => {
    return () => {
      if (sharedTimer.current) clearTimeout(sharedTimer.current);
    };
  }, []);

  // Hand the transport keys to the phone's lock screen and headphone buttons.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return undefined;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: trackName(current, language),
      artist: t.queueTitle,
      album: "Fiori Di Preghiera",
    });
    const actions = {
      play: () => togglePlay(),
      pause: () => togglePlay(),
      previoustrack: () => step(-1),
      nexttrack: () => step(1),
    };
    Object.entries(actions).forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        /* unsupported action on this browser */
      }
    });
    return () => {
      Object.keys(actions).forEach((action) => {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* unsupported action on this browser */
        }
      });
    };
  });

  const chooseTrack = (id) => {
    const next = playable.findIndex((track) => track.id === id);
    if (next < 0) return;
    hasPressedPlay.current = true;
    selectIndex(next);
  };

  const replay = () => {
    const el = audioRef.current;
    if (!el || !current) return;
    hasPressedPlay.current = true;
    el.currentTime = 0;
    setElapsed(0);
    setIsLoading(true);
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };

  const seekTo = (value) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(duration) || duration <= 0) return;
    const next = Math.min(Math.max(value, 0), 1) * duration;
    el.currentTime = next;
    setElapsed(next);
  };

  // Hand the current song to whoever is listening — the address it already has
  // in the URL bar, so what is shared opens straight onto that song.
  const share = useCallback(async () => {
    if (!current) return;
    const url = current.sisterSongUrl;
    const name = trackName(current, language);
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `${name} — ${t.queueTitle}`,
          url,
        });
        return;
      }
    } catch {
      // The visitor dismissed the share sheet, or the browser refused it.
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsShared(true);
      if (sharedTimer.current) clearTimeout(sharedTimer.current);
      sharedTimer.current = setTimeout(() => setIsShared(false), 2600);
    } catch {
      window.prompt(t.share, url);
    }
  }, [current, language, t.queueTitle, t.share]);

  const lockedSisters = allSisters.filter(
    (track) => track.kind === "sister" && !track.hasAudio,
  );
  const visibleSisters = showAll
    ? allSisters
    : [
        ...allSisters.filter((track) => track.hasAudio),
        ...lockedSisters.slice(0, 12),
      ];

  return (
    <div className="mp-page">
      <Header />

      {/* One element drives every control; the state lives above it. */}
      <audio
        ref={audioRef}
        src={current ? current.audioUrl : undefined}
        preload="metadata"
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onTimeUpdate={(event) =>
          setElapsed(event.currentTarget.currentTime || 0)
        }
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setElapsed(0);
          // With loop on, the song simply begins again; otherwise the deck
          // moves on, wrapping round to the first voice.
          if (isLooping) replay();
          else if (playable.length > 1) step(1);
          else replay();
        }}
        onError={() => {
          setIsPlaying(false);
          setIsLoading(false);
          setElapsed(0);
          setDuration(0);
          if (currentId) {
            setBroken((prev) => new Set(prev).add(currentId));
          }
        }}
      />

      {/* Hero */}
      <section className="mp-hero">
        <span className="mp-eyebrow">
          <FaMusic /> {t.eyebrow}
        </span>
        <h1 className="mp-title">{t.title}</h1>
        <p className="mp-subtitle">{t.subtitle}</p>
        <div className="mp-hero-meta">
          <span>
            <FaWaveSquare /> {playable.length} {t.recorded}
          </span>
          <span>
            <FaSeedling /> {lockedSisters.length} {t.waiting}
          </span>
        </div>
        <p className="mp-verse">{t.verse}</p>
      </section>

      {/* The roll of voices on the left, the deck standing watch on the right */}
      <section className="mp-stage">
        <div className="mp-player-col">
          <div className="mp-deck">
            <span className="mp-deck-ornament" aria-hidden="true">
              ❁
            </span>

            <div
              className={`mp-disc-stage ${isPlaying ? "spinning" : ""} ${
                isLoading ? "loading" : ""
              }`}
              style={{ "--progress": `${progress * 360}deg` }}
            >
              <div className="mp-disc-halo" aria-hidden="true" />
              <div className="mp-disc-ring" aria-hidden="true" />
              <div className="mp-disc">
                <div className="mp-disc-grooves" aria-hidden="true" />
                <div className="mp-disc-face">
                  <SisterPhoto
                    photo={current ? current.photo : null}
                    name={current ? trackName(current, language) : ""}
                    className="mp-disc-photo"
                    monogramClassName="mp-disc-photo mp-photo-monogram"
                  />
                </div>
                {<span className="mp-disc-pin" aria-hidden="true" />}
              </div>
            </div>

            <div className="mp-now">
              <span className="mp-now-label">
                {isPlaying || isLoading
                  ? t.nowPlaying
                  : elapsed > 0
                    ? t.pausedLabel
                    : t.silence}
              </span>
              <h2 className="mp-now-name">
                {current ? trackName(current, language) : t.queueTitle}
              </h2>
              
                <div className="mp-controls">
                <button
                  type="button"
                  className={`mp-btn ghosts ${isLooping ? "on" : ""}`}
                  onClick={() => setIsLooping((prev) => !prev)}
                  disabled={isSilent}
                  aria-pressed={isLooping}
                  aria-label={isLooping ? t.loopOn : t.loop}
                  title={isLooping ? t.loopOn : t.loop}
                >
                  {isLooping ? <FaMusic/> : <FaInfinity/>} {isLooping ? (language==="en" ? "Once" : "Una volta") : (language==="en" ? "Repeat" : "Ripeti")}
                </button>

                <button
                  type="button"
                  className={`mp-btn ghosts ${isShared ? "on" : ""}`}
                  onClick={share}
                  disabled={isSilent}
                  aria-label={t.share}
                  title={t.share}
                >
                  <FaShareAlt /> {language==="en" ? "Share" : "Condividi"}
                </button>
                </div>
              

              {/* Progress */}
              <div className="mp-progress">
                <input
                  type="range"
                  className="mp-range"
                  min="0"
                  max="1000"
                  step="1"
                  value={Math.round(progress * 1000)}
                  onChange={(event) =>
                    seekTo(Number(event.target.value) / 1000)
                  }
                  disabled={isSilent || duration <= 0}
                  aria-label={t.nowPlaying}
                  style={{ "--fill": `${progress * 100}%` }}
                />
                <div className="mp-times">
                  <span>{formatTime(elapsed)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Transport — previous, play, next, loop, and share on the right */}
              <div className="mp-controls">
                <button
                  type="button"
                  className="mp-btn ghost"
                  onClick={() => step(-1)}
                  disabled={playable.length < 2}
                  aria-label={t.previous}
                  title={t.previous}
                >
                  <FaAngleLeft />
                </button>

                <button
                  type="button"
                  className="mp-btn primary"
                  onClick={togglePlay}
                  disabled={isSilent}
                  aria-label={isPlaying ? t.pause : t.play}
                  title={isPlaying ? t.pause : t.play}
                >
                  {isLoading ? (
                    <span className="mp-spinner" aria-hidden="true" />
                  ) : isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay className="mp-play-icon" />
                  )}
                </button>

                <button
                  type="button"
                  className="mp-btn ghost"
                  onClick={() => step(1)}
                  disabled={playable.length < 2}
                  aria-label={t.next}
                  title={t.next}
                >
                  <FaAngleRight />
                </button>

                
              </div>

              <span className="mp-share-note" role="status" aria-live="polite">
                {isShared ? t.shared : ""}
              </span>
            </div>
          </div>

          <Link to="/come-and-see" className="mp-link">
            <FaHeart /> {t.meetSisters}
          </Link>
        </div>

        <div className="mp-queue-col">
          <div className="mp-queue-head">
            <span className="mp-queue-icon">
              <FaListUl />
            </span>
            <div>
              <h2 className="mp-queue-title">{t.queueTitle}</h2>
              <p className="mp-queue-hint">{t.queueHint}</p>
            </div>
          </div>

          {playable.length === 0 ? (
            <p className="mp-empty">{t.empty}</p>
          ) : (
            <div className="mp-queue-scroll">
              <ul className="mp-list">
                {visibleSisters.map((track) => {
                  const name = trackName(track, language);
                  const isCurrent = Boolean(current && track.id === current.id);
                  const isLocked = !track.hasAudio || broken.has(track.id);
                  const state = !track.hasAudio
                    ? t.noRecording
                    : broken.has(track.id)
                      ? t.unavailable
                      : isCurrent
                        ? t.nowPlaying
                        : t.play;
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        className={`mp-track ${isCurrent ? "current" : ""} ${
                          isLocked ? "locked" : ""
                        }`}
                        onClick={() => chooseTrack(track.id)}
                        disabled={isLocked}
                        aria-disabled={isLocked}
                        aria-current={isCurrent ? "true" : undefined}
                        title={isLocked ? state : name}
                      >
                        <span className="mp-track-photo">
                          <SisterPhoto
                            photo={track.photo}
                            name={name}
                            className="mp-track-img"
                            monogramClassName="mp-track-img mp-photo-monogram"
                          />
                          {!isLocked && (
                            <span className="mp-track-play" aria-hidden="true">
                              {isCurrent && isPlaying ? (
                                <FaPause />
                              ) : (
                                <FaPlay className="mp-play-icon" />
                              )}
                            </span>
                          )}
                        </span>
                        <span className="mp-track-body">
                          <span className="mp-track-name">{name}</span>
                          <span className="mp-track-state">
                            {isLocked
                              ? state
                              : track.kind === "song"
                                ? t.forEveryone
                                : state}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {allSisters.length > visibleSisters.length && (
            <button
              type="button"
              className="mp-more"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? t.showLess : `${t.showAll} (${allSisters.length})`}
            </button>
          )}
        </div>
      </section>

      <footer className="mp-footer">
        <span aria-hidden="true">✦ ❁ ✦</span>
        <p>Aeternum Floreamus</p>
      </footer>
    </div>
  );
}
