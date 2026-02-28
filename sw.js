// SmartPMO.ai Service Worker — B-45
// Network-first for HTML, cache-first for versioned assets
const CACHE_VERSION = 'smartpmo-v2';
const STATIC_CACHE = CACHE_VERSION + '-static';
const API_CACHE = CACHE_VERSION + '-api';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles-core.css',
  '/styles-v2.css',
  '/hero.css',
  '/header-styles.css',
  '/section-cards.css',
  '/section-votes.css',
  '/mobile-fixes.css',
  '/hero-barista-small.jpg',
  '/hero-barista.jpg',
  '/favicon.svg',
  '/fire-logo.svg'
];

// Install: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
            .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: route by request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests (except fonts/CDN)
  if (event.request.method !== 'GET') return;

  // API/JSON: network-first with cache fallback
  if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  // HTML pages (navigation): network-first so deploys are always fresh
  if (event.request.mode === 'navigate' ||
      url.pathname === '/' ||
      url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(event.request, STATIC_CACHE));
    return;
  }

  // Static assets (same-origin CSS/JS/images): cache-first
  // CSS cache-busting via ?v=SHA ensures fresh versions on deploy
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // Google Fonts / CDN: cache-first
  if (url.origin.includes('fonts.googleapis.com') ||
      url.origin.includes('fonts.gstatic.com') ||
      url.origin.includes('unpkg.com')) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (fresh data preferred, cache fallback)
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('{"error":"offline"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
