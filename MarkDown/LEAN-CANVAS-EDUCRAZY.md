# Lean Canvas — Educrazy (EC Games)

> Platform belajar & kuis multiplayer dunia virtual **EC Games**, dibuka **langsung ke pengguna individual** (siswa, guru/tutor/kreator, komunitas belajar, bimbel kecil).
> Disusun untuk keperluan lomba. Semua angka bertanda **[target]/[asumsi]** perlu divalidasi lewat data pengguna awal, bukan data nyata.

| Atribut | Keterangan |
|---|---|
| Nama Produk | Educrazy (basis kode: SekolahKu) |
| Bentuk | Web app PWA (install ke HP, tanpa app store), mobile-first, online + offline |
| Pengguna | Siswa, guru/tutor/kreator, komunitas belajar, bimbel kecil |
| Teknologi | HTML/CSS/JS, Supabase (Auth + Postgres + Realtime + Storage), push FCM/OneSignal, PWA/service worker |
| Modul Inti | Kuis multiplayer (EC Games), Bank Soal (UGC + konten resmi), Materi visual/audio, Gamifikasi (XP/poin/hint/streak), Asisten Belajar, Notifikasi, Tugas & Studi Kasus, Jadwal, Komunitas, Info Lomba |
| Model Bisnis | Freemium B2C langsung → langganan Pro individu + koin + paket komunitas (sekolah/yayasan = fase berikutnya) |

---

## 0. Isi Produk (inventaris modul) — konteks kanvas

**Peran & akses:**
- **Siswa** — Dashboard, Materi, Quiz/EC Games, Tugas, Jadwal, Komunitas, Info Lomba, Notifikasi, Profil.
- **Guru/Tutor/Kreator** — semua menu siswa + kemampuan membuat/mengelola konten (materi, bank soal, tugas, jadwal, sesi live).
- **Pihak sekolah/yayasan** — fase berikutnya: dashboard & monitoring multi-kelas (bukan fokus canvas ini).

**Daftar fitur/modul:**

| Modul | Isi & fungsi |
|---|---|
| **EC Games** | Kuis multiplayer realtime di dunia virtual 2D: mode Zona ABCD, Rebutan Kelinci, Balapan; aturan Survival/Tim/Ronde; karakter + wardrobe; join via kode room tanpa install. |
| **Quiz** | Bank kuis tipe game & studi kasus; soal PG/essay, poin, durasi, status draft/publish/tutup; nilai otomatis + feedback. |
| **Materi (Pembelajaran)** | Modul belajar visual & audio, progres belajar, rekomendasi modul sesuai preferensi siswa. |
| **Tugas & Studi Kasus** | Buat tugas, kumpulkan jawaban, penilaian + feedback, tingkat kesulitan, hadiah XP/poin/petunjuk, batas waktu. |
| **Gamifikasi** | Level, XP, poin, saldo petunjuk, streak harian, reward dari kuis/tugas/aktivitas. |
| **Asisten Belajar** | Chatbot bantuan bertahap (menuntun langkah, tidak memberi jawaban akhir); mode belajar vs penilaian. |
| **Jadwal** | Jadwal personal + tampilan grid; sesi live terjadwal. |
| **Komunitas** | Tautan grup (WhatsApp/Telegram/Discord). |
| **Info Lomba** | Daftar kompetisi (terbuka/tutup/arsip) + deadline + poster. |
| **Notifikasi** | In-app (toast + halaman) + realtime (Supabase) + push ke HP (FCM/OneSignal). |
| **Platform** | Auth, preferensi, offline-first (antrean sinkron), PWA install, mode demo lokal. |

---

## 1. Problem

1. **Belajar membosankan & sulit diukur.** Siswa menghabiskan waktu di aplikasi pasif (baca/tonton) atau game kuis asing yang tidak terhubung ke materi/nilai. Tidak ada cara cepat melihat kemajuan belajar.
2. **Kuis interaktif terasa seperti game, tapi terpisah dari belajar.** Platform game kuis populer (Kahoot/Zep Quiz/dsb.) tidak terhubung ke bank soal, tugas, atau progres siswa — guru harus merangkai sendiri.
3. **Kreator/guru/bimbel sulit punya "rumah" sendiri.** Membuat konten kuis interaktif biasanya butuh akun asing, tidak ada branding, tidak ada data pemain, dan sulit dibagikan antar teman.

**Alternatif yang ada:** WhatsApp + YouTube + Kahoot/Quizizz + Excel. Semua terpisah, sebagian berbayar, berbahasa asing, dan data tidak nyambung.

---

## 2. Customer Segments

**Pengguna & pembayar (B2C langsung):**
- **Siswa** SD/SMP/SMA/SMK — pemain utama & penggerak word-of-mouth.
- **Guru/tutor/kreator edukasi** — pembuat konten, host kuis, pembimbing les.
- **Komunitas belajar & bimbel kecil** — kelompok 10–100 pemain dengan kebutuhan paket.

**Pengambil keputusan lanjutan (bukan fokus fase ini):**
- Pihak sekolah/yayasan, dinas pendidikan, sponsor kuis.

**Early adopters:** siswa SMA/SMK yang aktif di media sosial, guru penggerak/kreator edukasi, komunitas belajar, bimbel lokal.

---

## 3. Unique Value Proposition

> **"Belajar sambil berebutan main: kuis multiplayer dunia virtual dalam satu platform, dari bikin soal sampai nilai."**

**Tagline:** *Bikin kuis, ajak teman, mainkan — dalam satu aplikasi ringan tanpa install.*

**Pernyataan posisi:** Untuk siswa dan kreator yang ingin belajar interaktif tanpa aplikasi terpisah, Educrazy menyatukan bank soal, materi, tugas, gamifikasi, dan kuis game multiplayer berbahasa Indonesia — bukan tumpukan aplikasi asing yang tidak saling terhubung.

---

## 4. Solution

Enam kelompok solusi (satu produk):

1. **Kuis multiplayer EC Games.** Dunia virtual 2D, tiga mode + aturan liga, karakter & wardrobe, join dengan kode room; hasil bisa kembali ke tugas/nilai.
2. **Bank soal & konten.** Kreator membuat soal PG/essay sendiri (UGC) + konten resmi per topik; tersedia paket topik populer (SNBT, b. Inggris, pengetahuan umum).
3. **Gamifikasi & motivasi.** Level, XP, poin, saldo petunjuk, streak harian yang mendorong kembali bermain.
4. **Materi & tugas kontekstual.** Modul visual/audio, tugas & studi kasus dengan penilaian + feedback, jadwal personal.
5. **Asisten belajar.** Chatbot yang menuntun langkah tanpa membocorkan jawaban, dengan mode penilaian.
6. **Aksesibel & andal.** PWA install ke HP, offline-first, notifikasi in-app + push, komunitas & info lomba.

---

## 5. Channels

- **Konten viral & word-of-mouth:** kode room mudah dibagikan antar teman; video main EC Games di TikTok/IG/YouTube; kolaborasi kreator edukasi.
- **Komunitas:** grup Discord/WhatsApp, MGMP, komunitas belajar.
- **Demo & event:** turnamen mingguan berhadiah, pameran/lomba, webinar/workshop kreator.
- **Rujukan:** paket komunitas dari bimbel/komunitas → pengguna individual.

---

## 6. Revenue Streams

Model **freemium B2C langsung:**

| Paket | Isi | Harga [target] |
|---|---|---|
| **Gratis** | Main kuis, buat soal dasar, host room terbatas (mis. ≤ 20 pemain), mode dasar | Rp0 |
| **Pro Individual** | Room tak terbatas, semua mode & aturan, wardrobe eksklusif, analitik hasil | Rp29.000/bln atau Rp290.000/thn [target] |
| **Koin Educrazy** | Add-on untuk petunjuk, wardrobe, item kosmetik | Rp6.000–50.000 per pembelian [target] |
| **Paket Komunitas** | Lisensi kelompok 30–100 pemain, branding grup, konten khusus | Rp199.000/bln [target] |
| **Sponsor & event** | Sponsor turnamen, konten bertema, kerja sama bimbel | Per event/kemitraan |

Pelengkap (fase berikutnya): lisensi sekolah/yayasan (B2B), white-label, dan sponsor liga antar-komunitas.

---

## 7. Cost Structure

**Variabel:** hosting realtime & bandwidth (Supabase), biaya push notification, gateway pembayaran (persentase per transaksi), hadiah turnamen, akuisisi konten/kreator.

**Tetap:** pengembangan produk (web + game), desain & aset seni (sprite/peta/wardrobe), kurasi konten, community management, moderasi konten.

**Sifat biaya:** produk digital dengan **biaya marjinal per pemain rendah**; investasi utama pada **konten (bank soal/materi/aset dunia)** dan **distribusi komunitas/kreator** — bukan iklan besar-besaran.

---

## 8. Key Metrics

- **Aktivasi:** pengguna yang menyelesaikan kuis/room pertama (target time-to-first-game ≤ 5 menit [target]).
- **Keterlibatan:** pemain aktif harian/mingguan, panjang streak, modul selesai, partisipasi kuis.
- **Viralitas:** kode room dibagikan, k-factor, rasio pemain baru dari undangan.
- **Retensi:** retensi D7/D30, sesi mingguan per pengguna.
- **Monetisasi:** konversi gratis → Pro, ARPU, churn, nilai transaksi koin.
- **Kualitas teknis:** latensi realtime kuis, tingkat sinkron aktivitas offline, keberhasilan push.

---

## 9. Unfair Advantage

1. **EC Games sebagai pembeda.** Dunia virtual multiplayer 2D berbahasa Indonesia yang **langsung terhubung ke bank soal & konten** — tidak dimiliki LMS global (Moodle/Classroom) maupun game kuis global (Kahoot/Zep Quiz).
2. **Satu ekosistem, bukan aplikasi terpisah.** Soal, materi, tugas, gamifikasi, dan komunitas dalam satu sistem data.
3. **Konten lokal & siap pakai.** Bank soal/materi berbahasa Indonesia yang menyesuaikan kurikulum & tren ujian.
4. **Aset & identitas original.** Dunia pixel-art, karakter, dan wardrobe eksklusif yang membangun keterikatan.
5. **Efek jaringan komunitas.** Kode room dan paket kuis mudah dibagikan; nilai bertambah seiring bertambahnya pengguna.
6. **Offline-first + PWA.** Cocok untuk jaringan sekolah terbatas — keunggulan teknis di konteks lokal.

---

## Ringkasan Satu Halaman (untuk slide)

| Blok | Inti |
|---|---|
| **Problem** | Belajar membosankan & tidak terukur; kuis interaktif terpisah dari materi/nilai; kreator tak punya rumah sendiri. |
| **Segmen** | Siswa, guru/tutor/kreator, komunitas belajar, bimbel kecil (B2C langsung). |
| **UVP** | Belajar sambil berebutan main: kuis multiplayer dunia virtual dalam satu platform. |
| **Solution** | EC Games, bank soal & konten, gamifikasi, materi & tugas, asisten belajar, PWA offline-first. |
| **Channels** | Konten viral & kode room, komunitas, demo & turnamen, rujukan bimbel. |
| **Revenue** | Freemium B2C: Gratis → Pro Individual + koin → Paket Komunitas → sponsor/event. |
| **Cost** | Hosting realtime, gateway, pengembangan & aset seni, konten, komunitas, moderasi. |
| **Metrics** | Aktivasi, keterlibatan & streak, viralitas kode room, retensi D7/D30, konversi & ARPU. |
| **Unfair Adv.** | EC Games terhubung konten, ekosistem terpadu, konten lokal, aset original, efek jaringan, offline-first. |

---

## Lampiran A — Daftar Tabel Data (ringkas)

`profiles` (pengguna & peran), `classes` (kelas), `notifications` (notifikasi), `learning_modules` (materi visual/audio), `quizzes` + `quiz_questions` + `quiz_attempts` (kuis & nilai), `assignments` + `submissions` (tugas/studi kasus), `schedules_personal` (jadwal), `zoom_sessions` (kelas live), `community_links` (komunitas), `competitions` (lomba), `student_preferences` (preferensi), `reward_transactions` + `student_streaks` + `lesson_progress` (gamifikasi & progres), `chat_sessions` + `chat_messages` (asisten belajar), `push_subscriptions` (push), `offline_queue` (sinkron offline).

## Lampiran B — Status implementasi (untuk jujur ke juri)

- Modul inti **sudah berfungsi** dan dapat didemokan: materi, tugas & studi kasus, quiz (PG auto-score + nilai essay), jadwal, notifikasi in-app + realtime, profil, PWA.
- **EC Games** terpisah sebagai halaman `zep-game/` dan terhubung lewat tombol "Main/Host EC Games".
- **Belum lengkap/konsisten antar-mode:** gamifikasi (XP/poin/streak) penuh hanya di mode demo; chatbot cerdas penuh hanya di mode demo; offline-first penuh hanya di mode demo; Zoom, komunitas & info lomba hanya jalan di Supabase.
- **Belum ada untuk B2C:** registrasi publik/self-service, peran kreator/individu, kelas/grup mandiri, gateway pembayaran, dan moderasi konten pengguna.
- Risiko utama: adopsi & retensi (butuh konten & event rutin), data anak (butuh persetujuan orang tua, UU PDP No. 27/2022), dan moderasi konten pengguna.
- Semua harga/persentase di dokumen ini adalah **[target]/[asumsi]**.
