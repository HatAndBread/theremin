const CACHE_NAME = "cache-v1";

const FILES_TO_CACHE = [
  "./public/index.html",
  "./public/manifest.json",
  "./public/friend.webp",
  "./public/sine.mp3",
  "./public/triangle.mp3",
  "./public/square.mp3",
  "./public/sawtooth.mp3",
  "./public/organ.wav",
  "./public/harmonium.mp3",
  "./public/tambura.mp3",
  "./public/singing.mp3",
  "./public/voice.mp3",
  "./public/tuba.wav",
  "./public/radioBuzz.mp3",
  "./public/static.mp3",
  "./public/glitch.mp3"
];

self.addEventListener("install", async () => {
  const cache = await caches.open(CACHE_NAME);

  await cache.addAll(FILES_TO_CACHE);

  self.skipWaiting(); // move into the activate phase
});

self.addEventListener("activate", async () => {
  // Remove previous cached data from disk if the cache name changed
  const keyList = await caches.keys();
  await Promise.all(
    keyList.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })
  );
  self.clients.claim();
});

// Interceptor for all network requests
self.addEventListener("fetch", async (evt) => {
  const request = evt.request;

  // Using the cache-first strategy for simplicity.
  // You might want to consider other strategies such as stale-while-revalidate (see https://web.dev/stale-while-revalidate/)
  evt.respondWith(cacheFirst(request));
});

// Returns the cached response if available, or get the response from the network
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  cachedResponse = await cache.match(request);
  if (!!cachedResponse) {
    return cachedResponse;
  }

  return fetch(request);
}