# BAB II — E. OPERASIONAL

> **Educrazy** — Platform belajar & kuis multiplayer dunia virtual **EC Games**, dibuka **langsung ke pengguna individual** (siswa, guru/tutor, komunitas belajar, bimbel kecil).
> Bagian ini menjelaskan **proses menjalankan bisnis**, **sumber daya yang dibutuhkan**, serta **proses produksi/penyediaan jasa**, sesuai struktur proposal Pitch-It (target: **B2C langsung**, self-service — tanpa kontrak sekolah).
> Seluruh angka bertanda **[target]/[asumsi]** perlu divalidasi, bukan data nyata.

---

## 1. Proses Menjalankan Bisnis

### 1.1 Model Operasi

| Aspek | Keterangan |
|---|---|
| Bentuk layanan | Produk digital konsumen: PWA (install ke HP via Chrome, tanpa app store) — pengguna daftar & bermain sendiri |
| Basis operasi | Tim kecil remote + komunitas daring (Discord/WA) |
| Pola pendapatan | Freemium: main gratis → langganan Pro individu + koin (in-app) + paket komunitas untuk bimbel/les |
| Selebaran pengguna | Konten viral (TikTok/IG/YouTube), kode room yang mudah dibagikan antar teman, turnamen komunitas — **word of mouth siswa adalah mesin pertumbuhan** |
| Akses produk | Join room via kode tanpa install; mode demo berjalan tanpa backend → siap dicoba kapan pun |

### 1.2 Alur Operasi Bisnis

Pola periodik: **tarik pengguna → uji pengalaman gratis → upgrade → pertahankan via event.**

| Tahap | Kegiatan |
|---|---|
| **1. Tarik pengguna** | Video konten main EC Games, challenge kuis viral, kolaborasi kreator edukasi → pengguna masuk lewat kode room dari teman |
| **2. Uji gratis** | Daftar sendiri, buat kuis/host room (batas paket gratis), progres & streak tercatat |
| **3. Upgrade** | Batas gratis tercapai (jumlah pemain, mode premium, wardrobe) → pembayaran in-app via QRIS/e-wallet [target] |
| **4. Pertahankan** | Streak harian, XP/level, paket konten + dunia baru, **turnamen mingguan berhadiah** |
| **5. Anatomi harian tim** | Moderasi konten pengguna, pantau retensi & latensi realtime, kelola komunitas, rilis konten terjadwal |

### 1.3 Operasional Harian di Dalam Aplikasi

```
KREATOR/TUTOR (guru, bimbel, siswa pro) ──buat kuis──────────► BANK SOAL & MATERI
        │                                                        │
        └─host room via kode──► PEMAIN (teman/siswa) bermain realtime di dunia 2D
                                   │
                                   ├─► XP/koin/wardrobe/streak (retensi)
                                   └─► pembayaran upgrade / beli koin
```

- **Buat kuis (UGC):** pengguna membuat soal PG/essay sendiri; hasil publik dimoderasi.
- **EC Games:** kuis multiplayer realtime dunia virtual 2D — mode Zona ABCD, Rebutan Kelinci, Balapan; aturan Survival/Tim/Ronde; join kode room tanpa install.
- **Konten resmi:** paket kuis & modul belajar visual/audio yang diterbitkan tim (berbayar/mikanon per paket [target]).
- **Gamifikasi** — XP/koin/hint & streak harian mendorong kembali; notifikasi tiga lapis (in-app + realtime + push FCM/OneSignal) mengingatkan sesi belajar.
- **Komunitas & event:** turnamen mingguan terjadwal (join tanpa risiko, gratis).

### 1.4 Dukungan & Pelayanan Pelanggan (self-service)

| Item | Ketentuan [target] |
|---|---|
| Onboarding | 100% self-service: daftar → main → upgrade tanpa kode undangan |
| Support | Ticket in-app + DM sosial; SLA ≤ 24 jam |
| FAQ/panduan | Panduan in-app + video tutorial untuk host room |
| Moderasi UGC | Filter kata otomatis + moderasi manusia untuk konten publik |
| Pembayaran | QRIS/e-wallet via gateway lokal (Midtrans/Xendit) [target]; barang digital = tidak refund manual (kebijakan jelas) |

---

## 2. Sumber Daya yang Dibutuhkan

### 2.1 SDM (tim minimum)

| Peran | Tanggung jawab | Kebutuhan |
|---|---|---|
| Founder / product lead | Roadmap, monetisasi, kemitraan kreator | 1 orang |
| Developer game & realtime | EC Games (dunia 2D, lagensi kuis realtime) | 1–2 orang |
| Backend/infra + payments | Supabase, skala realtime, integrasi pembayaran | 1 orang |
| Konten kurikulum | Paket kuis/modul (topik populer: SNBT, b. Inggris, pengetahuan umum) | 1–2 (paruh waktu) |
| Sosial media & community | Konten viral, turnamen mingguan, grup Discord/WA | 1 orang |
| Moderator UGC | Moderasi konten publik (rotasi part-time) | 1 orang (part-time) |
| Desainer seni | Sprites/peta/wardrobe pixel-art asli | freelance per dunia baru |

### 2.2 Sumber Daya Teknologi (sudah dibangun pada basis kode ini)

| Item | Sumber / Keterangan |
|---|---|
| Supabase (Postgres + Auth + Realtime + Storage) | Infrastruktur data; queue realtime kuis multiplayer, 20+ tabel (`profiles`, `quizzes`, `quiz_attempts`, `reward_transactions`, `chat_messages`, `offline_queue`, dll. — `sql/schema.sql`) |
| Hosting statis (Netlify/Vercel) | PWA ringan tanpa server backend khusus |
| Gateway pembayaran lokal (Midtrans/Xendit) | QRIS/VA/e-wallet untuk upgrade & koin [belum terpasang — rencana] |
| Firebase Cloud Messaging / OneSignal | Push notifikasi (gratis), Edge Function `send-push-notification` siap deploy |
| Domain + HTTPS, alat analitik | Syarat PWA; dashboard retensi & latensi |
| Alat desain (Aseprite/Figma) | Produksi aset pixel-art |

### 2.3 Sumber Daya Legal & Finansial

- **Legal:** badan usaha + izin konten digital; merek & copyright aset original; kepatuhan **UU PDP No. 27/2022** — fokus khusus **data anak**: persetujuan orang tua untuk pengguna < 18, minimisasi data tanpa SKIP sedikit seadanya; kebijakan privasi + moderasi konten pengguna.
- **Finansial (estimasi [target]):** Supabase Pro ~USD 25/bln saat skala naik, gateway pembayaran (persentase per transaksi ~2–3%), tim produksi konten & aset, biaya hadiah turnamen. Biaya marjinal per pemain sangat rendah; investasi terbesar = **konten & aset game + komunitas**.

---

## 3. Proses Produksi / Penyediaan Jasa

Tiga jalur produksi paralel:

### 3.1 Jalur A — Produksi & Pemeliharaan Produk (siklus 4–8 minggu)

1. Perencanaan rilis berdasar data pemakaian (retensi, drop-off, feedback komunitas).
2. Pengembangan PWA + Supabase; **offline-first** — antrian `offline_queue` menyelamatkan pengguna dengan jaringan lemah.
3. Pengujian mode demo (localStorage, tanpa backend) + uji lintas peran.
4. Deploy tanpa downtime; push notifikasi untuk announce fitur/event.

### 3.2 Jalur B — Produksi Konten & Aset Game (berulang)

| Sekali/bulan [target] | Kegiatan |
|---|---|
| 1 | Produksi paket kuis baru per topik/tren ujian (SNBT, AKM, b. Inggris, umum) |
| 2 | Rilis dunia 2D & wardrobe baru (seasonal) |
| 3 | Turnamen mingguan berhadiah koin/wardrobe |
| 4 | A/B testing hadiah & harga paket |

### 3.3 Jalur C — Pipeline Konten Pengguna (UGC)

1. Pengguna membuat kuis → pengecekan otomatis (filter kata, spam).
2. Kuis publik masuk antrean moderasi manusia → approve/tolak.
3. Kuis viral → dikurvasi menjadi "Featured" (reward koin bagi pembuat [target]).

### 3.4 SOP Pelayanan Jasa (self-service)

1. Pengguna daftar & main (gratis, tanpa perjanjian apa pun).
2. Upgrade in-app saat batas tercapai; pembayaran via QRIS/e-wallet.
3. Reminder berhenti berlangganan tersedia 1-klik (dibangun kepercayaan).
4. Refund kebijakan digital goods tertulis; layanan pelanggan 24 jam [target].

---

## 4. Risiko Operasional & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Biaya akuisisi pengguna (CAC) tinggi | Konten viral EC Games + kode room word-of-mouth + turnamen komunitas — distribusi berbasis komunitas, bukan iklan besar |
| Churn pengguna remaja tinggi | Streak harian, XP/level, drop konten rutin (dunia & wardrobe), turnamen rutin |
| Data anak & privasi (UU PDP) | Persetujuan orang tua < 18, minimisasi data, kebijakan privasi jelas, RLS aktif |
| Konten pengguna berbahaya (UGC) | Filter kata otomatis + antrean moderasi + tombol lapor + ban perangkat |
| Fraude/lag realtime saat ramai | Supabase scale + monitoring latensi (Key Metric), kapasitas room dengan queue sederhana |
| Efek jaringan lambat pemain baru | Mode demo offline + join tanpa install (PWA) menurunkan hambatan masuk |

---

## Catatan Keterbukaan (untuk juri)

- Modul inti **sudah terimplementasi** dan bisa didemokan langsung: 3 peran, notifikasi 3 lapis, offline-first, bank soal + EC Games, mode demo tanpa internet.
- Gap yang diakui terbuka: **gateway pembayaran belum terpasang** (rencana Midtrans/Xendit), **pipeline moderasi UGC baru perlu dibangun**, dan **UI Zoom Live sebagian belum tampil penuh** — semua masuk rencana operasional di atas.
- Jalur sekolah/yayasan (kontrak B2B) **tidak ditutup** — bisa menjadi fase selanjutnya setelah basis pengguna individual tumbuh; namun fase ini fokus pada jalur **B2C langsung**.
- Semua angka harga/target adalah **[target]/[asumsi]** dan divalidasi dari data pengguna awal.
