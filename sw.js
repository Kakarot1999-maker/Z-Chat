const V = 'zchat-v4';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
));
// network-first: دايمًا يجيب آخر نسخة من السيرفر (من غير كاش المتصفح)، والكاش احتياطي لو مفيش نت
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then((r) => {
    const c = r.clone(); caches.open(V).then((ch) => ch.put(e.request, c)); return r;
  }).catch(() => caches.match(e.request)));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then((l) => (l.length ? l[0].focus() : clients.openWindow('./'))));
});
