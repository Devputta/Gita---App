import type { Verse, Chapter } from "@/types/gita";

export function publicBaseUrl() {
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_SITE_URL) return process.env.EXPO_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
export function verseUrl(chapter: number, verse: number) { return `${publicBaseUrl()}/gita/chapter/${chapter}/verse/${verse}`; }
export function chapterUrl(chapter: number) { return `${publicBaseUrl()}/gita/chapter/${chapter}`; }
export function verseSeo(verse: Verse, chapterNumber: number) {
  return { title: `Bhagavad Gita — Chapter ${chapterNumber}, Verse ${verse.verseNumber}`, description: `Read Bhagavad Gita Chapter ${chapterNumber}, Verse ${verse.verseNumber} in Sanskrit and available verified translations.`, canonical: verseUrl(chapterNumber, verse.verseNumber), image: `${publicBaseUrl()}/og-verse-card.svg` };
}
export function chapterSeo(chapter: Chapter) {
  return { title: `Bhagavad Gita — Chapter ${chapter.chapterNumber}`, description: `Read Chapter ${chapter.chapterNumber} of the Bhagavad Gita with verse-by-verse Sanskrit reading and available translations.`, canonical: chapterUrl(chapter.chapterNumber) };
}

export function applyWebSeo(meta: {title:string; description:string; canonical:string; type?: string; image?: string; structuredData?: unknown}) {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  const set = (name:string, content:string, attr="name") => { let el=document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement|null; if(!el){el=document.createElement("meta");el.setAttribute(attr,name);document.head.appendChild(el);} el.content=content; };
  set("description", meta.description);
  set("og:title", meta.title); set("og:description", meta.description); set("og:type", meta.type || "article"); if(meta.image) set("og:image", meta.image);
  set("twitter:card", "summary"); set("twitter:title", meta.title); set("twitter:description", meta.description);
  let link=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null; if(!link){link=document.createElement("link");link.rel="canonical";document.head.appendChild(link);} link.href=meta.canonical;
  const id="gita-structured-data"; document.getElementById(id)?.remove(); if(meta.structuredData){const s=document.createElement("script");s.id=id;s.type="application/ld+json";s.textContent=JSON.stringify(meta.structuredData);document.head.appendChild(s);}
}
