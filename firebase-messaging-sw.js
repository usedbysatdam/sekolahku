importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const CONFIG = {
  apiKey: 'AIzaSyChi49IQEhH80KCjChgF1nAIbqB40L1YIi',
  authDomain: 'sekolahku-b9528.firebaseapp.com',
  projectId: 'sekolahku-b9528',
  storageBucket: 'sekolahku-b9528.firebasestorage.app',
  messagingSenderId: '437490024020',
  appId: '1:437490024020:web:1443bfab33764df28bf7c1',
};

firebase.initializeApp(CONFIG);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || 'SekolahKu';
  const body = n.body || d.body || 'Ada pembaruan baru';
  const icon = n.icon || d.icon || '/icons/icon-192.png';
  const options = {
    body,
    icon,
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200],
    tag: d.type || 'sekolahku',
    data: { url: d.url || '#', ...d },
    actions: [{ action: 'open', title: 'Buka' }, { action: 'dismiss', title: 'Tutup' }],
    requireInteraction: true,
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});