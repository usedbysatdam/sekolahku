# SekolahKu — Sistem Manajemen Sekolah

Web app HTML, CSS, dan JavaScript dengan database Supabase.

## Jalankan

Buka `index.html` di browser, atau:

```bash
npx --yes serve -l 5173 .
```

Tanpa konfigurasi Supabase, aplikasi berjalan dalam **mode demo** (data tersimpan di `localStorage`).

### Akun demo

| Peran | Email | Kata sandi |
|---|---|---|
| Siswa | siswa@sekolah.id | siswa123 |
| Guru | guru@sekolah.id | guru123 |
| Pihak sekolah | sekolah@sekolah.id | sekolah123 |

## Hubungkan Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Jalankan `sql/schema.sql` di SQL Editor (sudah termasuk tabel `push_subscriptions` + Realtime untuk `notifications`).
3. Authentication → Users → tambah 3 user (siswa, guru, sekolah).
4. Salin UUID masing-masing user, lalu isi tabel `profiles` (contoh ada di akhir `schema.sql`).
5. Isi `js/config.js`:

```js
window.APP_CONFIG = {
  supabaseUrl: "https://xxxx.supabase.co",
  supabaseAnonKey: "eyJ...",
  schoolName: "SekolahKu",
  schoolSubtitle: "Sistem Manajemen Sekolah",
};
```

6. Muat ulang halaman. Login memakai email/password user Auth, bukan akun demo.

## Push notification ke HP (FCM / OneSignal + Realtime)

Aplikasi punya 3 lapis notifikasi:

1. **In-app** — toast + halaman Notifikasi (jalan di mode demo maupun Supabase).
2. **Realtime Supabase** — insert ke tabel `notifications` langsung muncul sebagai toast tanpa reload (perlu Supabase + Realtime aktif, sudah di `schema.sql`).
3. **Push ke HP saat aplikasi tertutup** — via Firebase Cloud Messaging (FCM, gratis) dan/atau OneSignal.

### Opsi A — FCM (disarankan, gratis)

1. Buka [console.firebase.google.com](https://console.firebase.google.com) → buat project → Add Web App → salin config.
2. Project Settings → Cloud Messaging → Web Push certificates → Generate key pair → salin **VAPID key**.
3. Isi `js/config.js`:

```js
window.APP_CONFIG = {
  supabaseUrl: "...",
  supabaseAnonKey: "...",
  firebase: {
    apiKey: "...",
    authDomain: "xxx.firebaseapp.com",
    projectId: "xxx",
    storageBucket: "xxx.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123...:web:...",
  },
  fcmVapidKey: "BG...",
};
```

4. Isi config yang sama di `firebase-messaging-sw.js` (ganti string kosong di `CONFIG`).
5. Deploy Edge Function `supabase/functions/send-push-notification`:
   - Set secrets: `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY` (dari service account Firebase → Project Settings → Service Accounts → Generate key).
   - Opsional: `ONESIGNAL_APP_ID`, `ONESIGNAL_API_KEY` jika pakai OneSignal juga.
6. User buka halaman Notifikasi/Profil → klik **Aktifkan Sekarang** → izinkan notifikasi di browser/HP.
7. Kirim push otomatis: panggil Edge Function setiap ada event (laporan baru, status berubah):

```bash
curl -X POST https://xxx.supabase.co/functions/v1/send-push-notification \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<uuid>","title":"Materi baru","message":"Materi baru sudah tersedia","type":"info"}'
```

Untuk otomatis penuh, tambahkan Database Webhook (Supabase → Database → Webhooks) → trigger `INSERT` di `notifications` → panggil Edge Function di atas.

### Opsi B — OneSignal (paling mudah, ada dashboard)

1. Daftar di [onesignal.com](https://onesignal.com) → buat app Web Push → salin **App ID**.
2. Isi `js/config.js`: `oneSignalAppId: "xxxx-xxxx"`.
3. User klik **Aktifkan Sekarang** → OneSignal prompt muncul.
4. Kirim dari dashboard OneSignal atau via Edge Function yang sama (sudah mendukung OneSignal).

### Catatan HP

- **Android (Chrome)** — full support FCM + background push. Install sebagai PWA (Add to Home Screen) agar seperti aplikasi native.
- **iPhone (iOS 16.4+)** — wajib install sebagai PWA (Share → Add to Home Screen), buka dari ikon home screen, baru push jalan.
- Wajib **HTTPS** (localhost OK untuk testing). `npx serve` di HP perlu via HTTPS/tunnel.
