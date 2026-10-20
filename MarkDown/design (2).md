# DESIGN.md --- Website UI Design System

## 1. Tujuan Desain

Dokumen ini menjadi acuan implementasi UI website berdasarkan tiga
referensi visual yang diberikan:

-   **Task dashboard mobile:** navigasi sederhana, daftar tugas
    berbentuk kartu berwarna, pemilihan tanggal, dan bottom navigation.
-   **Link-saving dashboard:** headline besar, input URL sebagai aksi
    utama, serta koleksi dalam grid kartu.
-   **Neo-Brutalism UI Library:** garis tebal, bayangan hitam keras,
    warna cerah, bentuk geometris, dan komponen dengan state yang jelas.

Arah desain akhir adalah **Neo-Brutalism yang tetap rapi dan mudah
digunakan**. Gunakan karakter visual dari referensi ketiga, struktur
konten yang jelas dari referensi pertama dan kedua, serta responsivitas
agar desain berfungsi di desktop maupun mobile. Jangan menyalin layar
referensi secara mentah; adaptasikan pola visualnya ke identitas dan
kebutuhan website yang sudah ada.

## 2. Prinsip Visual

1.  **Bold, bukan berantakan.** Garis dan bayangan tegas menjadi ciri
    utama, tetapi hierarki konten tetap jelas.
2.  **Warna untuk membedakan fungsi.** Warna kartu membantu
    mengelompokkan konten, bukan sekadar dekorasi.
3.  **Aksi utama mudah ditemukan.** Tombol utama dan input penting harus
    terlihat tanpa pengguna perlu mencarinya.
4.  **Komponen konsisten.** Radius, ketebalan border, shadow, spacing,
    dan gaya ikon digunakan secara konsisten.
5.  **Mobile-first.** Semua fitur inti harus nyaman digunakan pada layar
    kecil dan tetap proporsional di layar besar.
6.  **Jangan menggunakan efek glassmorphism sebagai gaya utama.**
    Referensi lebih dekat ke neo-brutalism: permukaan solid, border
    tebal, dan hard shadow.

## 3. Design Tokens

Gunakan CSS variables berikut sebagai fondasi. Warna dapat disesuaikan
dengan branding website, tetapi pertahankan kontras yang kuat.

``` css
:root {
  /* Surfaces */
  --color-bg: #FFF7ED;
  --color-surface: #FFFCF8;
  --color-surface-muted: #F1EAE2;
  --color-ink: #151515;
  --color-muted: #68645F;

  /* Accent palette */
  --color-yellow: #FFD629;
  --color-pink: #FF5D8F;
  --color-green: #39D353;
  --color-teal: #43D0C4;
  --color-purple: #8A63F6;
  --color-blue: #3998F4;
  --color-coral: #FF7569;

  /* Semantic */
  --color-success: #159A70;
  --color-warning: #E9AD24;
  --color-danger: #E94B50;
  --color-focus: #1769D2;

  /* Borders and shadows */
  --border-width: 2px;
  --border-strong: 3px solid var(--color-ink);
  --shadow-hard: 5px 5px 0 var(--color-ink);
  --shadow-hard-sm: 3px 3px 0 var(--color-ink);
  --shadow-hard-lg: 7px 7px 0 var(--color-ink);

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-pill: 999px;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Typography */
  --font-sans: Inter, "Plus Jakarta Sans", system-ui, sans-serif;
}
```

### Warna dan penggunaan

-   **Background krem:** halaman utama dan area kosong agar warna aksen
    lebih menonjol.
-   **Putih hangat:** panel, modal, input, dan kartu yang memerlukan
    keterbacaan.
-   **Hitam pekat:** teks utama, border, ikon, dan hard shadow.
-   **Kuning:** aksi utama atau kartu yang perlu mendapat perhatian.
-   **Pink, hijau, teal, ungu, biru, coral:** variasi kategori, status,
    label, dan elemen pendukung.

Jangan memberi warna aksen berbeda pada setiap elemen tanpa alasan.
Tetapkan warna berdasarkan kategori atau status dan gunakan secara
konsisten.

## 4. Tipografi

Gunakan font sans-serif yang tegas dan mudah dibaca, misalnya **Inter**
atau **Plus Jakarta Sans**.

  ---------------------------------------------------------------------------
  Elemen                Ukuran desktop        Ukuran mobile Gaya
  --------------- -------------------- -------------------- -----------------
  Hero heading               48--64 px            34--42 px Bold/ExtraBold,
                                                            line-height
                                                            1.0--1.1

  Page heading               32--40 px            28--34 px Bold

  Section heading            22--28 px            20--24 px Bold

  Card title                 18--22 px            17--20 px Semibold/Bold

  Body                           16 px            15--16 px Regular

  Metadata                   12--14 px            12--13 px Medium
  ---------------------------------------------------------------------------

Batasi lebar headline agar mudah dipindai. Gunakan font weight tinggi
untuk judul, tetapi hindari semua teks dibuat bold. Metadata harus tetap
terbaca dan memiliki kontras yang cukup.

## 5. Layout dan Grid

### Desktop

-   Gunakan container dengan `max-width: 1200px` hingga `1280px`.
-   Padding horizontal halaman: `32px` sampai `48px`.
-   Gunakan grid 12 kolom atau CSS Grid yang setara.
-   Jarak antarbagian utama: `40px` sampai `64px`.
-   Untuk dashboard, pertimbangkan sidebar di kiri dan konten utama di
    kanan jika navigasi memiliki banyak item.
-   Untuk halaman koleksi, gunakan grid 2--3 kolom sesuai lebar kartu.

### Tablet

-   Padding horizontal: `24px`.
-   Gunakan 2 kolom untuk daftar kartu jika masih nyaman dibaca.
-   Sidebar dapat dipadatkan atau diubah menjadi navigasi ringkas.

### Mobile

-   Padding horizontal: `16px` sampai `20px`.
-   Gunakan satu kolom untuk daftar tugas dan kartu yang membutuhkan
    banyak informasi.
-   Grid koleksi boleh menggunakan 2 kolom hanya jika judul dan metadata
    tetap terbaca; jika tidak, gunakan satu kolom.
-   Tombol dan kontrol sentuh memiliki tinggi minimal sekitar `44px`.
-   Jika memakai bottom navigation, sisakan padding bawah agar konten
    tidak tertutup.

Contoh breakpoint:

``` css
/* Base: mobile-first */
.page-container {
  width: min(100% - 32px, 1280px);
  margin-inline: auto;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1024px) {
  .collection-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .page-container {
    width: min(100% - 32px, 1280px);
  }

  .collection-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

Sesuaikan breakpoint dan jumlah kolom dengan struktur website yang
benar-benar diimplementasikan.

## 6. Komponen Inti

### 6.1 Button

**Gaya:** permukaan solid, border hitam 2--3 px, radius 10--14 px, dan
bayangan keras.

Varian: - **Primary:** kuning dengan teks hitam. - **Secondary:**
putih/krem dengan border hitam. - **Accent:** biru, teal, pink, atau
ungu untuk aksi sekunder yang sesuai konteks. - **Danger:** merah/coral,
khusus aksi yang berisiko.

Perilaku: - Hover: bergeser sedikit ke kiri-atas atau shadow berkurang,
dengan transisi singkat. - Active: tombol bergeser ke arah bayangan
sehingga terasa ditekan. - Disabled: kontras diturunkan secukupnya dan
aksi tidak dapat dijalankan. - Loading: tampilkan indikator dan cegah
pengiriman berulang.

``` css
.button {
  min-height: 44px;
  padding: 12px 18px;
  border: 2px solid var(--color-ink);
  border-radius: 12px;
  background: var(--color-yellow);
  color: var(--color-ink);
  box-shadow: var(--shadow-hard-sm);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.button:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--shadow-hard);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 var(--color-ink);
}

.button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
```

### 6.2 Input dan Search

-   Gunakan background putih hangat.
-   Border hitam 2--3 px.
-   Tinggi input ideal `48–56px`.
-   Ikon diletakkan di dalam input jika membantu pemahaman.
-   Placeholder singkat dan jelas.
-   Label tetap terlihat di luar input; jangan mengandalkan placeholder
    sebagai label.
-   Tampilkan state focus, error, dan success.
-   Untuk input URL, sediakan aksi utama terpisah yang jelas.

### 6.3 Cards

Kartu merupakan komponen penting pada referensi task dashboard dan
koleksi link.

-   Border hitam `2–3px`.
-   Radius `16–22px`.
-   Hard shadow `4–6px`.
-   Padding `18–24px`.
-   Judul berada di area yang mudah ditemukan.
-   Metadata lebih kecil dan tidak bersaing dengan judul.
-   Gunakan warna solid sesuai kategori.
-   Pastikan teks kontras; gunakan teks gelap pada warna terang dan teks
    putih hanya jika kontrasnya memadai.

Kartu interaktif harus menunjukkan affordance melalui hover/focus dan
memiliki area klik yang masuk akal. Jangan menjadikan seluruh kartu
clickable jika di dalamnya ada tombol aksi yang saling bertentangan.

### 6.4 Collection / Category Card

Untuk halaman yang mengelompokkan item atau tautan:

-   Tampilkan ikon kategori dalam kotak kecil ber-border tebal.
-   Tampilkan nama koleksi dengan maksimal 2 baris.
-   Tampilkan jumlah item sebagai metadata.
-   Gunakan strip atau tab warna di bagian atas kartu jika cocok dengan
    branding.
-   Sediakan menu tindakan yang mudah ditemukan, misalnya edit, pindah,
    atau hapus.
-   Gunakan warna aksen berbeda untuk kategori, tetapi jaga pola layout
    tetap konsisten.

### 6.5 Task / List Item

Untuk dashboard yang memuat tugas:

-   Pisahkan judul, waktu, kategori, dan status secara hierarkis.
-   Gunakan badge atau indikator status yang konsisten.
-   Checkbox harus memiliki label yang dapat diakses.
-   Jangan hanya membedakan status berdasarkan warna; sertakan teks atau
    ikon.
-   Kelompokkan daftar berdasarkan status atau tanggal jika sesuai
    kebutuhan produk.

### 6.6 Modal / Dialog

Terinspirasi dari panel "Create Task" pada referensi pertama.

-   Background putih hangat.
-   Border hitam 2--3 px.
-   Radius `18–22px`.
-   Hard shadow jelas.
-   Header berisi judul dan tombol tutup.
-   Footer berisi tombol utama dan opsi sekunder.
-   Pada mobile, modal dapat menjadi bottom sheet dengan radius besar di
    sudut atas.
-   Sediakan label form, validasi, dan pesan error yang spesifik.
-   Tutup dialog dengan tombol yang jelas; dukung Escape jika sesuai
    pola aplikasi.

### 6.7 Navigation

**Desktop:** gunakan top navigation atau sidebar sesuai kompleksitas
website.

**Mobile:** bottom navigation dapat digunakan untuk maksimal 3--5 tujuan
utama. Gunakan ikon sederhana, label pendek, dan state aktif yang mudah
dibedakan. Beri ruang di bawah konten agar navigasi tidak menutupi
elemen terakhir.

Navigasi harus mempertahankan posisi aktif saat halaman berubah. Jangan
menggunakan ikon tanpa label untuk tujuan yang tidak umum.

### 6.8 Tabs, Badges, Toggles, dan Dropdown

-   **Tabs:** border hitam, radius pill atau sudut membulat; tab aktif
    memakai warna aksen.
-   **Badge:** bentuk pill atau label kotak kecil; gunakan untuk status,
    kategori, atau penanda baru.
-   **Toggle:** tampilkan track dan knob yang kontras, dengan label yang
    menjelaskan fungsinya.
-   **Dropdown:** border tebal, surface solid, dan shadow; item
    fokus/terpilih harus terlihat.
-   **Checkbox/radio:** ukuran cukup besar, state checked jelas, dan
    label dapat diklik.

## 7. Ikon dan Ilustrasi

-   Gunakan satu keluarga ikon secara konsisten, misalnya Lucide.
-   Pilih ikon sederhana dengan bentuk jelas.
-   Ukuran umum: `18–24px`; ikon pada tombol besar dapat mencapai
    `28px`.
-   Hindari mencampur ikon outline, filled, dan 3D tanpa sistem yang
    jelas.
-   Ornamen seperti lingkaran, bintang, kotak kecil, dan bentuk
    geometris boleh digunakan untuk memperkuat gaya neo-brutalism,
    tetapi jangan mengganggu konten atau aksesibilitas.

## 8. Motion dan Interaction

Animasi harus singkat dan mendukung respons interaksi, bukan menjadi
fokus utama.

-   Transisi hover/active: `100–160ms`.
-   Perubahan panel atau modal: `180–240ms`.
-   Hindari parallax, animasi berulang, dan gerakan dekoratif yang
    berlebihan.
-   Dukung `prefers-reduced-motion`.
-   Jangan mengandalkan hover saja; semua aksi harus dapat digunakan
    melalui sentuhan dan keyboard.

``` css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 9. Aksesibilitas

-   Pastikan rasio kontras teks memenuhi WCAG AA bila memungkinkan.
-   Gunakan struktur heading berurutan.
-   Semua input mempunyai label yang terlihat dan terhubung secara
    semantik.
-   Semua kontrol dapat dioperasikan dengan keyboard.
-   Fokus keyboard harus jelas dan tidak dihilangkan.
-   Tombol ikon wajib memiliki accessible name.
-   Jangan menyampaikan status hanya dengan warna.
-   Gunakan teks alternatif untuk gambar informatif.
-   Validasi form harus menjelaskan cara memperbaiki kesalahan.
-   Pastikan layout tetap dapat digunakan pada zoom browser 200%.

## 10. Halaman dan Pola Layout

Pilih pola yang relevan dengan fitur website yang sudah ada. Ini adalah
rekomendasi pola, bukan kewajiban untuk menambahkan fitur baru.

### A. Dashboard

1.  Header dengan sapaan atau judul halaman.
2.  Aksi utama di area header.
3.  Filter tanggal, kategori, atau status bila diperlukan.
4.  Section konten dengan judul dan jumlah item.
5.  Kartu/list dengan metadata dan status.
6.  Navigasi utama yang konsisten.

### B. Halaman Koleksi / Kategori

1.  Page heading dan deskripsi singkat.
2.  Aksi utama, misalnya tambah koleksi.
3.  Search atau filter jika jumlah item cukup banyak.
4.  Grid koleksi dengan warna aksen.
5.  Empty state yang menawarkan aksi berikutnya.

### C. Form Tambah / Edit

1.  Judul dialog yang spesifik.
2.  Input dengan label dan helper text bila diperlukan.
3.  Validasi di dekat field yang bermasalah.
4.  Tombol utama yang menjelaskan aksi.
5.  Opsi batal atau tutup yang mudah ditemukan.

### D. UI Library / Komponen

Jika website memiliki halaman dokumentasi komponen, tampilkan setiap
komponen dalam section terpisah dengan contoh default, hover, active,
disabled, dan error. Beri nama token dan contoh penggunaan agar
implementasi konsisten.

## 11. Empty, Loading, Error, dan Success States

-   **Empty:** ikon sederhana, judul singkat, penjelasan apa yang bisa
    dilakukan, dan satu CTA.
-   **Loading:** skeleton atau indikator yang tidak menyebabkan layout
    meloncat.
-   **Error:** pesan jelas, bahasa manusia, dan opsi untuk mencoba lagi
    jika relevan.
-   **Success:** konfirmasi singkat; gunakan warna dan ikon sebagai
    pendukung, bukan satu-satunya penanda.
-   **Destructive action:** minta konfirmasi jika tindakan sulit
    dibatalkan.

Setiap state harus memiliki desain yang konsisten dengan sistem border
dan shadow tanpa membuat tampilan terlalu ramai.

## 12. Struktur Implementasi yang Disarankan

Jika project sudah memiliki framework dan struktur folder, ikuti pola
project yang ada. Jangan mengganti framework hanya demi mengikuti
dokumen ini.

Contoh pemisahan komponen:

``` text
src/
  components/
    ui/
      Button
      Input
      Card
      Badge
      Checkbox
      Dialog
      Tabs
      Dropdown
    layout/
      AppHeader
      Sidebar
      BottomNavigation
      PageContainer
  styles/
    tokens.css
    globals.css
    components.css
  pages/
    Dashboard
    Collections
    Settings
```

Prinsip implementasi: - Simpan token warna, spacing, radius, dan shadow
dalam satu tempat. - Buat komponen reusable untuk elemen yang muncul
berulang. - Pisahkan data dan logika dari tampilan. - Gunakan semantic
HTML. - Jangan menambahkan dependency jika CSS dan komponen yang sudah
tersedia cukup. - Pertahankan fitur dan alur kerja website yang sudah
ada.

## 13. Checklist Sebelum Selesai

### Visual

-   [ ] Border dan hard shadow konsisten.
-   [ ] Palet warna tidak digunakan secara acak.
-   [ ] Hierarki judul, isi, dan metadata jelas.
-   [ ] Kartu dan tombol memiliki spacing yang cukup.
-   [ ] Ornamen tidak mengganggu konten utama.

### Responsive

-   [ ] Tidak ada horizontal overflow pada mobile.
-   [ ] Form dan tombol nyaman disentuh.
-   [ ] Grid berubah sesuai lebar layar.
-   [ ] Modal tidak terpotong.
-   [ ] Navigasi tidak menutupi konten.

### Functional

-   [ ] Tombol melakukan aksi yang benar.
-   [ ] Form memiliki validasi dan feedback.
-   [ ] Dropdown, tabs, checkbox, dan dialog bekerja.
-   [ ] State loading, error, success, dan empty tersedia jika
    diperlukan.

### Accessibility

-   [ ] Fokus keyboard terlihat.
-   [ ] Label input dan tombol ikon tersedia.
-   [ ] Kontras warna memadai.
-   [ ] Informasi tidak disampaikan hanya melalui warna.
-   [ ] Reduced motion dihormati.

## 14. Instruksi untuk Developer / AI Coding Agent

Implementasikan desain ini ke dalam website yang sudah ada dengan
ketentuan:

1.  **Periksa struktur project terlebih dahulu** dan identifikasi
    framework, routing, komponen, serta styling yang telah digunakan.
2.  Pertahankan fitur, data, dan alur pengguna yang sudah berjalan.
    Jangan menghapus fungsi lama hanya untuk menyederhanakan desain.
3.  Terapkan token desain secara terpusat dan bangun komponen reusable.
4.  Gunakan gaya neo-brutalism yang konsisten: background krem, warna
    aksen cerah, border hitam tegas, dan hard shadow.
5.  Ambil pola layout dari referensi sesuai kebutuhan halaman, bukan
    menyalin semua elemen dari ketiga referensi sekaligus.
6.  Pastikan tampilan responsif, accessible, dan berfungsi di browser
    desktop maupun mobile.
7.  Hindari tampilan generik yang penuh gradient, blur, glass effect,
    atau animasi dekoratif yang tidak terdapat pada arah visual
    referensi.
8.  Jangan menampilkan data contoh sebagai data nyata. Jika perlu dummy
    data untuk preview, beri penanda dan pisahkan dari data produksi.
9.  Setelah implementasi, jalankan pemeriksaan atau build yang tersedia
    di project, lalu perbaiki error yang muncul.
10. Utamakan kualitas, keterbacaan, konsistensi, dan fungsi di atas
    dekorasi.

**Hasil yang diharapkan:** website yang terasa modern, berkarakter,
playful, dan tegas seperti referensi neo-brutalism, dengan layout yang
terstruktur, komponen reusable, serta pengalaman yang tetap nyaman
digunakan.
