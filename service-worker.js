const CACHE_NAME = "medidor-site-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/arthur.gif",
  "/joaolucas.png",
  "/sixseven.jpg",
  "/Matheus .mov",
  "/67.mp3",
  "/Beat.mp3",
  "/Inst.mp3",
  "/PH.mp3",
  "/Queima.mp3",
  "/ai-meu-cxzinhx.mp3",
  "/giga-chad-theme.mp3",
  "/redline.mp3",
  "/ui.mp3",
  "/ze da manga.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});