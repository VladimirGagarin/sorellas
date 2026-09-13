// components/CaptureCard.jsx
import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { FaDownload, FaImage, FaShare, FaTimes } from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import "./CaptureCard.css";

const slug = (value) =>
  String(value || "card")
    .replace(/\s+/g, "-")
    .toLowerCase();

export default function CaptureCard({
  cardRef,
  title,
  subtitle,
  fileName,
  shareUrl,
  shareText,
  buttonLabel,
  buttonClassName = "quotes-action share",
}) {
  const { language } = useLanguage();
  const [snapShotCaptured, setSnapShotCaptured] = useState(null);

  const t = {
    savePhoto: language === "en" ? "Save Photo" : "Salva Foto",
    sharePhoto: language === "en" ? "Share Photo" : "Condividi Foto",
    close: language === "en" ? "Close" : "Chiudi",
  };

  // Lock page scroll while the preview is open.
  useEffect(() => {
    if (!snapShotCaptured) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [snapShotCaptured]);

  const capture = async () => {
    if (!cardRef?.current) return;
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: isDark ? "#141a26" : "#fffdf6",
        pixelRatio: 2,
      });
      setSnapShotCaptured(dataUrl);
    } catch {
      /* image capture unavailable */
    }
  };

  const download = () => {
    if (!snapShotCaptured) return;
    const anchor = document.createElement("a");
    anchor.href = snapShotCaptured;
    anchor.download = `${slug(fileName)}.png`;
    anchor.click();
  };

  const share = async () => {
    if (!snapShotCaptured) return;
    try {
      const blob = await (await fetch(snapShotCaptured)).blob();
      const file = new File([blob], `${slug(fileName)}.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text: shareText,
        });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      if (shareUrl) await navigator.clipboard.writeText(shareUrl());
    } catch {
      /* clipboard unavailable */
    }
  };

  const close = () => setSnapShotCaptured(null);

  return (
    <>
      <button
        className={buttonClassName}
        onClick={capture}
        title={buttonLabel}
        aria-label={buttonLabel}
      >
        <FaImage />
        {buttonLabel}
      </button>

      {snapShotCaptured && (
        <div className="image-preview-overlay">
          <div className="image-overlay-content">
            <div className="header-content">
              <div className="title">
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
              </div>
              <div className="close-overlay" onClick={close}>
                <span>
                  <FaTimes />
                </span>
              </div>
            </div>
            <div className="image-preiview-main">
              <img src={snapShotCaptured} alt={title} />
            </div>

            <div className="image-preview-footer">
              <button className="quotes-action share" onClick={download}>
                <FaDownload /> {t.savePhoto}
              </button>
              <button className="quotes-action share" onClick={share}>
                <FaShare /> {t.sharePhoto}
              </button>
              <button className="quotes-action share" onClick={close}>
                <FaTimes /> {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}