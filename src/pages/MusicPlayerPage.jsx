// pages/MusicPlayerPage.jsx
// "Songs of the Sisters" — the deck rests on the left, the roll of voices on
// the right. Tap a sister's portrait to hear her song; portraits still waiting
// for a recording (or whose file failed to load) stay quiet and unpressable.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import SisterPhoto from "../components/SisterPhoto.jsx";
import { getSisterSongUrl, getSistersAudioUrl } from "../components/Utils.js";
import { useLanguage } from "../contexts/useLanguage.js";
import { SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaImage,
  FaInfinity,
  FaListUl,
  FaMusic,
  FaPause,
  FaPlay,
  FaRecordVinyl,
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
  const deckRef = useRef(null);
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
  // One source of truth for what the deck is doing. As two independent booleans
  // these could both be true at once, which is why "loading" used to surface as
  // "now singing": the readout asked isPlaying || isLoading. A shared link
  // arrives mid-gesture, so it opens on "loading" rather than on silence.
  const [playback, setPlayback] = useState(() =>
    songId && playable.some((track) => track.id === songId) ? "loading" : "idle",
  );
  const isPlaying = playback === "playing";
  const isLoading = playback === "loading";
  const [isLooping, setIsLooping] = useState(false);
  // Two ways to look at the same sister: the record on its turntable, or her
  // portrait filling the deck. The two are never both wanted at once — a disc
  // in front of a face hides the face — so this chooses which one is present.
  const [portraitMode, setPortraitMode] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShared, setIsShared] = useState(false);
  // A shared link arrives with its song already in hand. The page tries to
  // start it as it opens, and a browser that refuses (autoplay needs a gesture
  // of the visitor's own) turns that refusal into a question rather than an
  // error — this holds the song id waiting for an answer, or null.
  const [autoplayPrompt, setAutoplayPrompt] = useState(null);
  const autoplayAsked = useRef(false);

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
      loadingLabel: language === "en" ? "Loading" : "Caricamento",
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
      verse:
        language === "en"
          ? "“Aeternum Floreamus — Let us bloom forever”"
          : "«Aeternum Floreamus — Fioriamo per sempre»",
      autoplayEyebrow:
        language === "en"
          ? "A song was sent to you"
          : "Un canto è stato dedicato a te",
      autoplayQuestion:
        language === "en" ? "Would you like to hear it?" : "Vuoi ascoltarlo?",
      autoplayText:
        language === "en"
          ? "Your browser waits for a tap before it lets the music begin."
          : "Il tuo browser attende un tocco prima di far partire la musica.",
      autoplayPlay: language === "en" ? "Play the song" : "Riproduci il canto",
      autoplayLater: language === "en" ? "Not now" : "Non ora",
      showPortrait:
        language === "en" ? "Her portrait" : "Il suo ritratto",
      showRecord: language === "en" ? "The record" : "Il disco",
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

  // Audio events also fire for the metadata-only fetch on page load, and a seek
  // can stall the element while it is paused. Neither is something a visitor
  // would call "loading", so both are filtered out before the state changes.
  const markLoading = useCallback(() => {
    const el = audioRef.current;
    if (!hasPressedPlay.current) return;
    if (el && el.paused) return;
    setPlayback("loading");
  }, []);

  // Choosing a new song resets the readout here, at the moment of the choice,
  // and writes the song's own address into the URL so it can be shared or
  // bookmarked. The back button is left alone — this is a replace, not a push.
  const selectIndex = useCallback((nextIndex) => {
    setIndex(nextIndex);
    setElapsed(0);
    setDuration(0);
    setPlayback("loading");
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
      setPlayback("loading");
      const attempt = el.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => setPlayback("idle"));
      }
    } else {
      el.pause();
      setPlayback("paused");
    }
  }, [current]);

  // When the chosen sister changes, swap the source and — only if the visitor
  // already pressed play — start her song. A keyed element is mounted fresh
  // with its src already in place, which loads on its own; calling load() here
  // as well would start a second fetch of the same recording.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (!hasPressedPlay.current) return;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setPlayback("idle"));
    }
  }, [currentId, current]);

  // Opening a shared link means "here is a song for you" — so ask the deck to
  // play it straight away. Only once: the URL is rewritten as the visitor moves
  // between songs, and each of those is an ordinary choice, not an autoplay.
  useEffect(() => {
    const el = audioRef.current;
    if (!songId || !current || autoplayAsked.current || !el) return;
    autoplayAsked.current = true;
    hasPressedPlay.current = true;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch((error) => {
        // Refused for want of a gesture: nothing has played, so nothing needs
        // rewinding — only the deck's claim that it is loading.
        hasPressedPlay.current = false;
        setPlayback("idle");
        if (error && error.name === "NotAllowedError") {
          setAutoplayPrompt(current.id);
        }
      });
    }
  }, [songId, current]);

  // Escape is the same answer as "not now", so a keyboard is never trapped here.
  useEffect(() => {
    if (!autoplayPrompt) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setAutoplayPrompt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoplayPrompt]);

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
    // On a phone the deck sits above the list, so choosing a sister would play
    // her song somewhere off the fold. Walk the page back up to the turntable.
    // Wider screens show the deck beside the list, so there is nothing to do.
    const deck = deckRef.current;
    if (deck && window.matchMedia("(max-width: 900px)").matches) {
      deck.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // The tap on "play the song" is the gesture the browser was waiting for, so
  // this call is allowed through and needs no second question.
  const acceptAutoplay = () => {
    setAutoplayPrompt(null);
    const el = audioRef.current;
    if (!el || !current) return;
    hasPressedPlay.current = true;
    setPlayback("loading");
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setPlayback("idle"));
    }
  };

  // "Not now" leaves the song chosen and silent — the visitor can still press
  // play on the deck whenever they are ready.
  const declineAutoplay = () => setAutoplayPrompt(null);

  const replay = () => {
    const el = audioRef.current;
    if (!el || !current) return;
    hasPressedPlay.current = true;
    el.currentTime = 0;
    setElapsed(0);
    setPlayback("loading");
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setPlayback("idle"));
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `${name} — ${t.queueTitle}`,
          url,
        });
        return;
      } catch (error) {
        // Closing the share sheet is a choice, not a failure — falling through
        // here would copy the link behind their back and claim it was shared.
        if (error && error.name === "AbortError") return;
        // Anything else means the browser refused, so try the clipboard below.
      }
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

  return (
    <div className="mp-page">
      <Header />

      {/* Keyed by the song it is playing, so choosing another sister builds a
          fresh element instead of re-pointing this one at a new file. Media
          events belong to the element that raised them, so the previous song
          can no longer report a position into the new song's progress bar. */}
      <audio
        key={currentId || "no-song"}
        ref={audioRef}
        src={current ? current.audioUrl : undefined}
        preload="metadata"
        // Waiting for audio: a fresh source, a stall, a re-buffer after a seek,
        // or the moment play() is called but no sound is flowing yet. Progress
        // and suspend are deliberately absent — progress fires while a playing
        // song keeps receiving data, and suspend usually means fully buffered.
        onLoadStart={markLoading}
        onStalled={markLoading}
        onWaiting={markLoading}
        onSeeking={markLoading}
        // Audio is actually moving. `playing` — not canplay — is the honest
        // signal: canplay only means the browser is ready, not that it started.
        onPlaying={() => setPlayback("playing")}
        // Paused by the visitor, so the readout falls back to paused rather than
        // to silence. A pause raised while loading keeps the loading state.
        onPause={() =>
          setPlayback((prev) => (prev === "playing" ? "paused" : prev))
        }
        onTimeUpdate={(event) =>
          setElapsed(event.currentTarget.currentTime || 0)
        }
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onEnded={() => {
          setElapsed(0);
          // With loop on, the song simply begins again; otherwise the deck
          // moves on, wrapping round to the first voice.
          if (isLooping) replay();
          else if (playable.length > 1) step(1);
          else replay();
        }}
        onError={() => {
          setPlayback("idle");
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
        <div className="mp-player-col" ref={deckRef}>
          <div className={`mp-deck ${portraitMode ? "portrait" : ""}`}>
            {/* Her portrait as the deck's own backdrop. It replaces the record
                rather than sitting behind it — the disc would cover it. */}
            {portraitMode && (
              <div className="mp-deck-portrait" aria-hidden="true">
                <SisterPhoto
                  photo={current ? current.photo : null}
                  name={current ? trackName(current, language) : ""}
                  className="mp-deck-portrait-img"
                  monogramClassName="mp-deck-portrait-img mp-photo-monogram"
                />
              </div>
            )}

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
              </div>
            </div>

            <div className="mp-now">
              {/* Announced politely, so a screen reader hears the change from
                  silence to singing, or from singing to waiting. */}
              <span className="mp-now-label" role="status" aria-live="polite">
                {playback === "loading"
                  ? t.loadingLabel
                  : playback === "playing"
                    ? t.nowPlaying
                    : playback === "paused"
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

                {/* The record and her portrait are two views of one deck: this
                    trades one for the other, never showing both. */}
                <button
                  type="button"
                  className={`mp-btn ghosts ${portraitMode ? "on" : ""}`}
                  onClick={() => setPortraitMode((prev) => !prev)}
                  aria-pressed={portraitMode}
                  aria-label={portraitMode ? t.showRecord : t.showPortrait}
                  title={portraitMode ? t.showRecord : t.showPortrait}
                >
                  {portraitMode ? <FaRecordVinyl /> : <FaImage />} {portraitMode ? t.showRecord : t.showPortrait}
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

          <p className="mp-credit">An Aeternum Floreamus Production</p>
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
                {allSisters.map((track) => {
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
        </div>
      </section>

      <footer className="mp-footer">
        <span aria-hidden="true">✦ ❁ ✦</span>
        <p>Aeternum Floreamus</p>
      </footer>

      {/* Asked only when the browser turned down the autoplay. The song stays
          chosen either way — declining is silence, not a different song. */}
      {autoplayPrompt && (
        <div
          className="mp-autoplay-overlay"
          role="presentation"
          onClick={declineAutoplay}
        >
          <div
            className="mp-autoplay-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="mp-autoplay-question"
            aria-describedby="mp-autoplay-text"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mp-autoplay-disc" aria-hidden="true">
              <FaMusic />
            </div>

            <p className="mp-autoplay-eyebrow">{t.autoplayEyebrow}</p>

            <h2 className="mp-autoplay-question" id="mp-autoplay-question">
              {t.autoplayQuestion}
            </h2>

            <p className="mp-autoplay-song">
              {current ? trackName(current, language) : ""}
            </p>

            <p className="mp-autoplay-text" id="mp-autoplay-text">
              {t.autoplayText}
            </p>

            <div className="mp-autoplay-actions">
              <button
                type="button"
                className="mp-autoplay-btn ghost"
                onClick={declineAutoplay}
              >
                {t.autoplayLater}
              </button>
              <button
                type="button"
                className="mp-autoplay-btn primary"
                onClick={acceptAutoplay}
                autoFocus
              >
                <FaPlay className="mp-play-icon" />
                {t.autoplayPlay}
              </button>
            </div>

            <p className="mp-autoplay-footnote">Aeternum Floreamus</p>
          </div>
        </div>
      )}
    </div>
  );
}
