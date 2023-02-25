const CACHE_NAME = "cache-v1";

const FILES_TO_CACHE = [
  "/index.html",
  "/friend.webp",
  "/organ.wav",
  "/harmonium.mp3",
  "/tambura.mp3",
  "/singing.mp3",
  "/voice.mp3",
  "/tuba.wav",
  "/radioBuzz.mp3",
  "/static.mp3",
  "/glitch.mp3"
];

const cacheFiles = () => {
  return new Promise(async (resolve, reject) => {
    const cache = await caches.open(CACHE_NAME);
    let total = 0;
    FILES_TO_CACHE.forEach((file) => {
      cache.add(file)
        .then(() => {
          total += 1;
          if (total === FILES_TO_CACHE.length) resolve(true);
        })
        .catch((e) => {
          console.log(e, file);
          reject(e)
        });
    })
  });
}
self.addEventListener("install", async () => {
  await cacheFiles();

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