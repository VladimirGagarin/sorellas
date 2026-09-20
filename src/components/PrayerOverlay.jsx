// components/PrayerOverlay.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaShareAlt,
  FaSeedling,
  FaClock,
  FaSave,
} from "react-icons/fa";
import "./PrayerOverlay.css";

const WATERMARK = "Aeternum Floreamus";

/* Load an image and resolve once it is fully decoded */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });

/* Wrap a string into lines that fit a given canvas width */
const wrapCanvasText = (ctx, text, maxWidth) => {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const canvasToBlob = (canvas) =>
  new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

/*
 * Build an art canvas: flower photo dimly behind, prayer text on top,
 * finished with the "Aeternum Floreamus" watermark.
 */
const buildFlowerCardCanvas = async (flower, lang) => {
  const img = await loadImage(flower.image);

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  /* Cover-fit the flower image */
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

  /* Dim overlay so the prayer reads clearly */
  const dim = ctx.createLinearGradient(0, 0, 0, H);
  dim.addColorStop(0, "rgba(7, 14, 9, 0.58)");
  dim.addColorStop(0.45, "rgba(7, 14, 9, 0.48)");
  dim.addColorStop(1, "rgba(7, 14, 9, 0.88)");
  ctx.fillStyle = dim;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  /* Vertical centre — the bold watermark lives here so trimming never cuts it */
  const watermarkY = H / 2;

  /* Ornament */
  ctx.fillStyle = "rgba(168, 224, 160, 0.95)";
  ctx.font = "30px Georgia, serif";
  ctx.fillText("❁", W / 2, 226);

  /* Eyebrow */
  const eyebrow = lang === "en" ? "Sacred Flowers" : "Fiori Sacri";
  ctx.fillStyle = "rgba(188, 212, 182, 0.95)";
  ctx.font = "22px Georgia, serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "8px";
  ctx.fillText(eyebrow.toUpperCase(), W / 2, 302);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

  /* Flower name */
  ctx.fillStyle = "#f3f0e6";
  ctx.font = "700 64px Georgia, 'Times New Roman', serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 16;
  ctx.fillText(flower.name[lang], W / 2, 422);
  ctx.shadowBlur = 0;

  /* Day time */
  ctx.fillStyle = "rgba(243, 233, 210, 0.85)";
  ctx.font = "24px Georgia, serif";
  ctx.fillText(
    flower.DayTime[lang] +
      "  ·  " +
      (lang === "en" ? "Prayer of the day" : "Preghiera del giorno"),
    W / 2,
    488,
  );

  /* Divider */
  ctx.fillStyle = "rgba(168, 224, 160, 0.65)";
  ctx.fillRect(W / 2 - 100, 538, 200, 2);

  /* Bold, centred watermark */
  ctx.fillStyle = "rgba(243, 233, 210, 0.85)";
  ctx.font = "700 40px Georgia, serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "12px";
  ctx.fillText(WATERMARK, W / 2, watermarkY);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

  /* Prayer text — shrink to fit, centred in the lower half */
  const textTop = watermarkY + 110;
  const textBottom = H - 110;
  let fontPx = 36;
  while (fontPx > 20) {
    ctx.font = `italic ${fontPx}px Georgia, serif`;
    const lines = wrapCanvasText(ctx, flower.prayer[lang], 780);
    const block = lines.length * fontPx * 1.55;
    if (block <= textBottom - textTop) break;
    fontPx -= 2;
  }
  ctx.fillStyle = "#f3f0e6";
  const lines = wrapCanvasText(ctx, flower.prayer[lang], 780);
  const startY =
    textTop + (textBottom - textTop - lines.length * fontPx * 1.55) / 2;
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += fontPx * 1.55;
  }

  return canvas;
};

export default function PrayerOverlay({ flowers, language }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [prayerData, setPrayerData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);

  // Parse the pray query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prayParam = params.get("pray");

    if (prayerData && !prayParam) {
      // If prayerData exists but pray param is gone, close overlay
      setIsClosing(true);
      setTimeout(() => {
        setPrayerData(null);
        setIsClosing(false);
        setCopied(false);
      }, 300);
      return;
    }

    if (prayParam) {
      const [flowerId, lang] = prayParam.split("_");
      const flower = flowers.find((f) => f.id === flowerId);

      if (flower) {
        setPrayerData({
          flower,
          language: lang || language,
        });
      }
    } else {
      setPrayerData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, flowers, language]);

  // Close the overlay
  const closeOverlay = () => {
    // Remove pray parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete("pray");

    // Get the base URL without search params
    const baseUrl = location.pathname;
    const newUrl = params.toString()
      ? `${baseUrl}?${params.toString()}`
      : baseUrl;

    navigate(newUrl, { replace: true });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && prayerData) {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerData]);

  if (!prayerData) return null;

  const { flower, language: overlayLanguage } = prayerData;
  const actualLanguage = overlayLanguage || language;

  const t = {
    prayer: actualLanguage === "en" ? "A Prayer" : "Una Preghiera",
    copy: actualLanguage === "en" ? "Copy" : "Copia",
    copied: actualLanguage === "en" ? "Copied" : "Copiato",
    print: actualLanguage === "en" ? "Print" : "Stampa",
    share: actualLanguage === "en" ? "Share" : "Condividi",
    save: actualLanguage === "en" ? "Save Image" : "Salva Immagine",
    preparing: actualLanguage === "en" ? "Saving…" : "Salvo…",
    close: actualLanguage === "en" ? "Close prayer" : "Chiudi la preghiera",
    symbolism: actualLanguage === "en" ? "Meaning" : "Significato",
    shareImg:
      actualLanguage === "en"
        ? "Sharing the artwork with the watermark"
        : "Condivisione dell'immagine con la filigrana",
  };

  const slugify = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(flower.prayer[actualLanguage]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(actualLanguage === "en" ? "Could not copy" : "Impossibile copiare");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Share the watermarked artwork when supported, fallback to text share
  const handleShare = async () => {
    let blob = null;
    try {
      const canvas = await buildFlowerCardCanvas(flower, actualLanguage);
      blob = await canvasToBlob(canvas);
    } catch {
      blob = null;
    }

    if (blob) {
      const file = new File(
        [blob],
        `${slugify(flower.name[actualLanguage])}_prayer.png`,
        { type: "image/png" },
      );
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${flower.name[actualLanguage]} · ${t.shareImg}`,
          });
          return;
        } catch {
          // user dismissed the share sheet
        }
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${flower.name[actualLanguage]} - Spiritual Garden`,
          text: flower.prayer[actualLanguage],
        });
        return;
      } catch {
        // user dismissed the share sheet
      }
    }
    handleCopy();
  };

  // Save the watermarked artwork as an image
  const handleSaveImage = async () => {
    if (capturing) return;
    setCapturing(true);
    try {
      const canvas = await buildFlowerCardCanvas(flower, actualLanguage);
      const blob = await canvasToBlob(canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(flower.name[actualLanguage])}_prayer.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch {
      alert(
        actualLanguage === "en"
          ? "Could not generate the image"
          : "Impossibile generare l'immagine",
      );
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className={`prayer-overlay ${isClosing ? "closing" : ""}`}>
      <div className="prayer-overlay-backdrop" onClick={closeOverlay} />

      <div className="prayer-modal">
        {/* Modal Header */}
        <div className="prayer-modal-header">
          <div className="prayer-header-left">
            <div className="flower-icon-header">
              <FaSeedling />
            </div>
            <div className="prayer-title-section">
              <span className="prayer-eyebrow">{t.prayer}</span>
              <h2 className="prayer-flower-name">
                {flower.name[actualLanguage]}
              </h2>
              <div className="prayer-subtitle">
                <span className="flower-daytime">
                  <FaClock /> {flower.DayTime[actualLanguage]}
                </span>
              </div>
            </div>
          </div>
          <button
            className="close-prayer-btn"
            onClick={closeOverlay}
            aria-label={t.close}
            title={t.close}
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <div className="prayer-modal-content">
          {/* Prayer Text */}
          <div className="prayer-text-container">
            <div className="prayer-text-body">
              <p className="prayer-text">{flower.prayer[actualLanguage]}</p>
            </div>

            <div className="prayer-symbolism">
              <span className="prayer-symbolism-label">{t.symbolism}</span>
              {flower.description[actualLanguage]}
            </div>
          </div>

          {/* Flower Image */}
          <div className="prayer-flower-column">
            <div className="image-container">
              <img
                className="prayer-flower-img"
                src={flower.image}
                alt={flower.name[actualLanguage]}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer — grouped action menu */}
        <div className="prayer-menu">
          <button
            className="prayer-menu-btn"
            onClick={handleShare}
            title={t.share}
          >
            <FaShareAlt />
            <span>{t.share}</span>
          </button>
          <button
            className="prayer-menu-btn primary"
            onClick={handleSaveImage}
            title={t.save}
            disabled={capturing}
          >
            <FaSave />
            <span>{capturing ? t.preparing : t.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
