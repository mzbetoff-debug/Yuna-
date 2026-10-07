const CACHE = 'yuna-v1';
const URLS = [
  '/Yuna-/',
  '/Yuna-/index.html',
  '/Yuna-/home.html',
  '/Yuna-/login.html',
  '/Yuna-/perfil.html',
  '/Yuna-/musica.html',
  '/Yuna-/educacao.html',
  '/Yuna-/animes.html',
  '/Yuna-/favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});