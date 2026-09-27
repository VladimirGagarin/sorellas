// SisterPhoto.jsx — resolves a portrait to a bundled asset URL, falling back
// to the default portrait of the congregation (and then to a warm monogram)
// when the photograph is missing.
import { useEffect, useState } from "react";
import { DEFAULT_PHOTO, resolvePrayerPhoto } from "./Utils.js";

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !/^(sr|suor|sor|madre|ma|fr|miss)\.?$/i.test(word));
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function SisterPhoto({
  photo,
  name,
  className = "",
  monogramClassName = "",
  fallbackPhoto = DEFAULT_PHOTO,
}) {
  // The url is remembered alongside the portrait it belongs to, so a change of
  // photo never shows the previous face while the new one loads.
  const [loaded, setLoaded] = useState({ key: null, url: null });
  const wanted = photo || fallbackPhoto;

  useEffect(() => {
    let active = true;
    const loader = wanted ? resolvePrayerPhoto(wanted) : null;
    if (!loader) return undefined;
    loader()
      .then((mod) => {
        if (active) setLoaded({ key: wanted, url: mod.default || mod });
      })
      .catch(() => {
        if (active) setLoaded({ key: wanted, url: null });
      });
    return () => {
      active = false;
    };
  }, [wanted]);

  const photoUrl = loaded.key === wanted ? loaded.url : null;

  if (photoUrl) {
    return (
      <img className={className} src={photoUrl} alt={name} loading="lazy" />
    );
  }

  return (
    <span
      className={`${className} ${monogramClassName}`.trim()}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
