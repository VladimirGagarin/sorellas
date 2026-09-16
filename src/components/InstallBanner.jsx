// InstallBanner.jsx — helps visitors keep the garden close:
// - Android/Chrome (PWA): triggers the native install prompt.
// - iOS Safari: shows the Share → "Add to Home Screen" gesture.
// - Desktop: bookmark hint (Ctrl/Cmd+D) + copy-link button.
import { useEffect, useState } from "react";
import {
  FaDownload,
  FaPlus,
  FaBookmark,
  FaLink,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import "./InstallBanner.css";

const DISMISS_KEY = "cot-save-banner-dismissed";
const SHOW_DELAY = 3500;

const computeInitialMode = () => {
  let isStandalone = false;
  try {
    isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
  } catch {
    /* ignore */
  }
  if (isStandalone) return "none";

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isIOS || isAndroid) return "ios";
  return "bookmark";
};

export default function InstallBanner() {
  const { language } = useLanguage();
  const [mode, setMode] = useState(computeInitialMode);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setMode("install");
    };

    const onInstalled = () => {
      if (active) {
        setMode("none");
        setDismissed(true);
        try {
          sessionStorage.setItem(DISMISS_KEY, "true");
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const timer = setTimeout(() => {
      if (active) setVisible(true);
    }, SHOW_DELAY);

    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        setMode("none");
        setDismissed(true);
      }
    } catch {
      /* prompt unavailable */
    }
    setDeferredPrompt(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (mode === "none" || dismissed || !visible) return null;

  const t = {
    iosTitle:
      language === "en" ? "Add us to your Home Screen" : "Aggiungici alla Home",
    iosText:
      language === "en"
        ? "Tap the Share icon  then choose “Add to Home Screen”"
        : "Tocca l’icona Condividi  e scegli “Aggiungi alla Home”",
    installTitle:
      language === "en" ? "Install the Garden app" : "Installa l’app del Giardino",
    installText:
      language === "en"
        ? "Add Fiori Di Preghiera to your device with one tap"
        : "Aggiungi Fiori Di Preghiera al tuo dispositivo con un tocco",
    installBtn: language === "en" ? "Install" : "Installa",
    bookmarkTitle:
      language === "en" ? "Keep a bookmark in your heart" : "Tieni un segnalibro nel cuore",
    bookmarkText:
      language === "en"
        ? "Press Ctrl+D (or Cmd+D) to save this page, or copy the link"
        : "Premi Ctrl+D (o Cmd+D) per salvare questa pagina, oppure copia il link",
    copyBtn: language === "en" ? "Copy link" : "Copia link",
    copied: language === "en" ? "Copied!" : "Copiato!",
    close: language === "en" ? "Dismiss" : "Chiudi",
  };

  const icon =
    mode === "install" ? <FaDownload /> : mode === "ios" ? <FaPlus /> : <FaBookmark />;
  const title =
    mode === "install" ? t.installTitle : mode === "ios" ? t.iosTitle : t.bookmarkTitle;
  const text = mode === "ios" ? t.iosText : mode === "install" ? t.installText : t.bookmarkText;

  return (
    <div
      className="save-banner-overlay"
      role="presentation"
      onClick={dismiss}
    >
      <aside
        className="save-banner glass"
        role="complementary"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
      <button
        className="save-banner-close"
        onClick={dismiss}
        aria-label={t.close}
      >
        <FaTimes />
      </button>
      <div className="save-banner-icon">{icon}</div>
      <div className="save-banner-body">
        <p className="save-banner-title">{title}</p>
        <p className="save-banner-text">{text}</p>
      </div>
      {mode === "install" ? (
        <button className="save-banner-btn" onClick={handleInstall}>
          <FaDownload />
          {t.installBtn}
        </button>
      ) : mode === "bookmark" ? (
        <button className="save-banner-btn" onClick={handleCopy}>
          {copied ? <FaCheck /> : <FaLink />}
          {copied ? t.copied : t.copyBtn}
        </button>
      ) : null}
      </aside>
    </div>
  );
}