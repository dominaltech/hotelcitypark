/* ═══════════════════════════════════════════════════════════════════
   Hotel City Park — User Website Service Worker (PWA)
   Enables: Offline support · Install to Home Screen · Fast load
═══════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'citypark-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './rooms.html',
  './dining.html',
  './contact.html',
  './booking.html',
  './pricing.html',
  './style.css',
  './theme.js',
  './manifest.json',
  './logo.png',
  './cityparkday.png',
  './cityparknight.png',
  './fort.jpg',
  './railwaystation.jpg',
  './temple.jpg',
];

// ── INSTALL: cache all static assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(err => {
      console.warn('[CityPark SW] Cache install partial fail:', err);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: network-first, fallback to cache ──
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Skip non-http(s) requests (e.g. chrome-extension://)
  if (!event.request.url.startsWith('http')) return;
  // Skip Supabase API calls — always go to network
  if (event.request.url.includes('supabase.co')) return;
  // Skip Google Fonts
  if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache successful responses for local assets
        if (response && response.ok && event.request.url.startsWith(self.location.origin)) {
          const cached = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cached));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback to index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
