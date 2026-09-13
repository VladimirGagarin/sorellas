import { useEffect } from "react";

export const SITE_NAME = "Fiori Di Preghiera";
export const SITE_URL = "https://vladimirgagarin.github.io/sorellas/";
export const SITE_IMAGE_URL = `${SITE_URL}og-image.png`;

export const DEFAULT_SEO = {
  title: "Fiori Di Preghiera ✦ Flowers Of Prayer",
  description:
    "Prayers, quotes and words of wisdom from the Sisters of Saint Joseph Cottolengo – a garden of faith shared to inspire.",
  url: SITE_URL,
  image: SITE_IMAGE_URL,
};

const META_TAGS = [
  { attr: "name", key: "description" },
  { attr: "property", key: "og:description" },
  { attr: "name", key: "twitter:description" },
];

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function applySeo(seo) {
  const meta = { ...DEFAULT_SEO, ...seo };
  const absUrl = (u) => new URL(u, window.location.href).href;

  document.title = meta.title;
  setMeta("property", "og:title", meta.title);
  setMeta("name", "twitter:title", meta.title);

  if (meta.description) {
    META_TAGS.forEach(({ attr, key }) => setMeta(attr, key, meta.description));
  }
  setMeta("property", "og:url", absUrl(meta.url));
  setMeta("name", "twitter:url", absUrl(meta.url));
  setMeta("property", "og:image", absUrl(meta.image));
  setMeta("name", "twitter:image", absUrl(meta.image));
}

export function useSeo(seo) {
  const { title, description, url, image } = seo || {};
  useEffect(() => {
    applySeo({ title, description, url, image });
    return () => applySeo(DEFAULT_SEO);
  }, [title, description, url, image]);
}