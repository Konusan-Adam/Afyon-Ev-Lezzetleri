// Afyon Ev Lezzetleri — Arka Plan Bildirim & Servis İşçisi (Service Worker)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Arka planda gelen bildirimleri işletim sistemi düzeyinde göster & Canlı tut
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KALP_ATISI') {
    // Service Worker arka plan canlılık sinyali
    return;
  }
  if (event.data && event.data.type === 'BILDIRIM_GOSTER') {
    const { baslik, detay, icon, tag } = event.data;
    event.waitUntil(
      self.registration.showNotification(baslik, {
        body: detay,
        icon: icon || '/favicon.png',
        badge: '/favicon.png',
        tag: tag || 'afyon-bildirim',
        vibrate: [200, 100, 200],
        renotify: true,
      })
    );
  }
});

// Bildirime tıklandığında uygulamayı öne getir
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
