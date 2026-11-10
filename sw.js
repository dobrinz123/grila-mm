// Păstrează aplicația disponibilă offline; când există internet, aduce versiunea nouă în fundal.
const CACHE = "grila-mm-v12";
const FILES = ["./", "index.html", "style.css", "app.js", "exhibits.js", "questions.js", "cards.js", "reels.js", "story.js", "music.js", "feed.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
// `reload` ocolește cache-ul HTTP, ca o versiune nouă să nu pornească cu fișiere vechi.
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes("/audio/")) return;
  const same = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = (same ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
