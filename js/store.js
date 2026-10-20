(() => {
  const KEY = "sekolahku_db_v1";
  const SESSION = "sekolahku_session";
  const SCHEMA_VERSION = 9;
  const GAMIFICATION = { poinPerQuiz: 10, xpPerQuiz: 20, poinPerModule: 5, xpPerModule: 10, poinPerAssignment: 15, xpPerAssignment: 30, hintCost: 1, hintRewardCase: 2, xpPerLevel: 200 };

  const seed = () => ({
    schemaVersion: SCHEMA_VERSION,
    _demoFill: 3,
    users: [
      {
        id: "u-siswa",
        name: "Dammar Pratama",
        email: "siswa@sekolah.id",
        password: "siswa123",
        role: "siswa",
        class_name: "XI TKJ 4",
        nis_nip: "240411",
        phone: "081234567890",
        photo_url: "",
      },
      {
        id: "u-guru",
        name: "Andi Wijaya",
        email: "guru@sekolah.id",
        password: "guru123",
        role: "guru",
        class_name: "XI TKJ 4",
        nis_nip: "198812",
        phone: "081298765432",
        photo_url: "",
      },
      {
        id: "u-sekolah",
        name: "Sari Lestari",
        email: "sekolah@sekolah.id",
        password: "sekolah123",
        role: "sekolah",
        class_name: "",
        nis_nip: "197705",
        phone: "081211122233",
        photo_url: "",
      },
    ],
    students: [
      { id: "s1", name: "Ahmad Fauzi", class_name: "XI TKJ 4" },
      { id: "s2", name: "Budi Santoso", class_name: "XI TKJ 4" },
      { id: "s3", name: "Candra Putra", class_name: "XI TKJ 4" },
      { id: "s4", name: "Dimas Arya", class_name: "XI TKJ 4" },
      { id: "s5", name: "Eka Lestari", class_name: "XI TKJ 4" },
      { id: "u-siswa", name: "Dammar Pratama", class_name: "XI TKJ 4" },
      { id: "s6", name: "Farhan Malik", class_name: "XI TKJ 3" },
      { id: "s7", name: "Gita Nabila", class_name: "XI TKJ 3" },
    ],
    notifications: [
      { id: "nt1", user_id: "u-siswa", title: "Tugas dinilai", message: "Nilai tugasmu: 26 (Subnetting /24)", type: "tugas", is_read: false, created_at: new Date(Date.now()-7200000).toISOString() },
      { id: "nt2", user_id: "u-siswa", title: "Jadwal baru", message: "Praktik: Konfigurasi Mikrotik · hari ini 19.00 WIB", type: "jadwal", is_read: false, created_at: new Date(Date.now()-21600000).toISOString() },
      { id: "nt3", user_id: "u-siswa", title: "Quiz baru", message: "Quiz Game: Dasar Jaringan sudah dibuka.", type: "quiz", is_read: true, created_at: new Date(Date.now()-2*86400000).toISOString() },
    ],
    push_subscriptions: [],
    quizzes: [
      {
        id: "qz1",
        title: "Game: Dasar Jaringan",
        subject: "Teknologi Jaringan Kabel dan Nirkabel 11",
        class_name: "",
        description: "Kuis cepat 10 menit, pilihan ganda.",
        tipe: "game",
        duration: 10,
        status: "published",
        created_by: "u-guru",
        created_at: "2026-10-09T09:00:00.000Z",
        published_at: "2026-10-09T09:00:00.000Z",
      },
      {
        id: "qz2",
        title: "Studi Kasus: Troubleshooting LAN",
        subject: "Administrasi Sistem Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Analisis kasus LAN mati + essay.",
        tipe: "case",
        duration: 30,
        status: "published",
        created_by: "u-guru",
        created_at: "2026-10-08T10:00:00.000Z",
        published_at: "2026-10-08T10:00:00.000Z",
      },
    ],
    quiz_questions: [
      { id: "qq1", quiz_id: "qz1", question: "Topologi yang semua node terhubung ke hub/switch pusat?", qtype: "pg", options: ["Star","Ring","Bus","Mesh"], answer: "Star", points: 10, order_no: 0, created_at: "2026-10-09T09:00:00.000Z" },
      { id: "qq2", quiz_id: "qz1", question: "Perangkat untuk menghubungkan 2 segmen jaringan berbeda?", qtype: "pg", options: ["Hub","Router","Kabel","NIC"], answer: "Router", points: 10, order_no: 1, created_at: "2026-10-09T09:00:00.000Z" },
      { id: "qq3", quiz_id: "qz2", question: "Sebuah lab tidak bisa internet tapi LAN lokal jalan. Jelaskan 3 langkah diagnosa berurutan + alasannya.", qtype: "essay", options: [], answer: "", points: 30, order_no: 0, created_at: "2026-10-08T10:00:00.000Z" },
    ],
    quiz_attempts: [],
    schedules_personal: [
      { id: "sp1", student_id: "u-siswa", title: "Bimbingan: Persiapan LKS", tipe: "bimbingan", starts_at: new Date(new Date(Date.now()+86400000).setHours(15,30,0,0)).toISOString(), ends_at: new Date(new Date(Date.now()+86400000).setHours(16,30,0,0)).toISOString(), link: "https://zoom.us/j/123456789?pwd=demo", notes: "Bawa laptop + catatan troubleshooting.", color: "purple", created_by: "u-guru", created_at: new Date().toISOString() },
      { id: "sp2", student_id: "u-siswa", title: "Latihan Quiz Game", tipe: "quiz", starts_at: new Date(new Date(Date.now()+2*86400000).setHours(10,0,0,0)).toISOString(), ends_at: new Date(new Date(Date.now()+2*86400000).setHours(10,30,0,0)).toISOString(), link: "", notes: "Kerjakan Game: Dasar Jaringan.", color: "yellow", created_by: "u-guru", created_at: new Date().toISOString() },
      { id: "sp3", student_id: "u-siswa", title: "Praktik: Konfigurasi Mikrotik", tipe: "kelas", starts_at: new Date(new Date().setHours(19,0,0,0)).toISOString(), ends_at: new Date(new Date().setHours(20,0,0,0)).toISOString(), link: "https://zoom.us/j/123456789?pwd=demo", notes: "Bawa laptop, instal WinBox terlebih dahulu.", color: "pink", created_by: "u-guru", created_at: new Date().toISOString() },
      { id: "sp4", student_id: "u-siswa", title: "Zoom: Review Subnetting", tipe: "zoom", starts_at: new Date(new Date(Date.now()+3*86400000).setHours(15,0,0,0)).toISOString(), ends_at: new Date(new Date(Date.now()+3*86400000).setHours(16,0,0,0)).toISOString(), link: "https://zoom.us/j/123456789?pwd=demo", notes: "Latihan soal subnetting bareng.", color: "blue", created_by: "u-guru", created_at: new Date().toISOString() },
    ],
    zoom_sessions: [
      { id: "zs1", title: "Live: Routing Dinamis", subject: "TKJ 11", class_name: "", description: "Zoom bareng Pak Andi, bahas OSPF.", zoom_url: "https://zoom.us/j/123456789?pwd=demo", scheduled_at: new Date(Date.now()+86400000).toISOString(), duration: 60, status: "scheduled", created_by: "u-guru", created_at: new Date().toISOString() },
    ],
    community_links: [
      { id: "cl1", title: "Grup WA Kelas XI TKJ", link: "https://chat.whatsapp.com/placeholder", platform: "whatsapp", class_name: "", description: "Diskusi tugas & info lomba.", is_active: true, created_by: "u-guru", created_at: new Date().toISOString() },
    ],
    competitions: [
      { id: "cp1", title: "LKS Nasional 2026 — Network Admin", description: "Seleksi tingkat kabupaten. Daftar via sekolah.", link: "https://contoh.id/lks-2026", category: "LKS", deadline: new Date(Date.now()+30*86400000).toISOString(), poster_url: "", status: "open", created_by: "u-sekolah", created_at: new Date().toISOString() },
    ],
    learning_modules: [
      {
        id: "lm1",
        title: "Pengantar Jaringan Komputer",
        subject: "Teknologi Jaringan Kabel dan Nirkabel 11",
        class_name: "XI TKJ 4",
        description: "Video pengenalan topologi jaringan dan perangkat keras. Cocok untuk pembelajar visual.",
        type: "visual",
        media_url: "https://www.youtube.com/watch?v=3QhU9jd03a0",
        created_by: "u-guru",
        created_at: "2026-10-09T08:00:00.000Z",
      },
      {
        id: "lm2",
        title: "Podcast: Keamanan Jaringan Dasar",
        subject: "Keamanan Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Audio penjelasan ancaman siber, phishing, dan mitigasi untuk didengar sambil mencatat.",
        type: "audio",
        media_url: "",
        created_by: "u-guru",
        created_at: "2026-10-08T10:30:00.000Z",
      },
      {
        id: "lm3",
        title: "Konfigurasi VLAN di Switch",
        subject: "Teknologi Jaringan Kabel dan Nirkabel 11",
        class_name: "XI TKJ 4",
        description: "Video praktik membuat VLAN, trunking, dan verifikasi pengalamatan di switch.",
        type: "video",
        media_url: "https://www.youtube.com/watch?v=qiQR5rTSshw",
        created_by: "u-guru",
        created_at: "2026-10-10T08:30:00.000Z",
      },
      {
        id: "lm4",
        title: "Dasar Subnetting & CIDR",
        subject: "Administrasi Sistem Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Slide interaktif menghitung subnet, netmask, dan pembagian IP per divisi.",
        type: "visual",
        media_url: "",
        created_by: "u-guru",
        created_at: "2026-10-11T09:00:00.000Z",
      },
      {
        id: "lm5",
        title: "Praktik DHCP Server di Router",
        subject: "Administrasi Sistem Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Video langkah demi langkah membangun DHCP server lalu menguji klien.",
        type: "video",
        media_url: "https://www.youtube.com/watch?v=e6-TaH5bkjo",
        created_by: "u-guru",
        created_at: "2026-10-12T07:45:00.000Z",
      },
      {
        id: "lm6",
        title: "Podcast: Etika Profesi IT",
        subject: "Keamanan Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Audio santai tentang etika kerja di dunia IT lengkap dengan studi kasus nyata.",
        type: "audio",
        media_url: "",
        created_by: "u-guru",
        created_at: "2026-10-13T10:00:00.000Z",
      },
      {
        id: "lm7",
        title: "Dasar Pemrograman Web: HTML & CSS",
        subject: "Pemrograman Web dan Perangkat Bergerak 11",
        class_name: "XI TKJ 4",
        description: "Materi visual struktur HTML, selector CSS, dan latihan membuat kartu profil.",
        type: "visual",
        media_url: "",
        created_by: "u-guru",
        created_at: "2026-10-14T08:00:00.000Z",
      },
      {
        id: "lm8",
        title: "Video: Flexbox & Layout Responsif",
        subject: "Pemrograman Web dan Perangkat Bergerak 11",
        class_name: "XI TKJ 4",
        description: "Video praktik menyusun layout responsif dengan flexbox dan media query.",
        type: "video",
        media_url: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
        created_by: "u-guru",
        created_at: "2026-10-15T09:30:00.000Z",
      },
      {
        id: "lm9",
        title: "Firewall & ACL: Studi Kasus Lab",
        subject: "Keamanan Jaringan 11",
        class_name: "XI TKJ 4",
        description: "Slide studi kasus membatasi akses lab komputer menggunakan ACL dasar.",
        type: "visual",
        media_url: "",
        chapters: [
          { title: "Dasar Firewall", items: [
            { title: "Apa Itu Firewall", body: [
              "Firewall adalah sistem yang memeriksa, mengizinkan, atau menolak lalu lintas jaringan berdasarkan aturan yang sudah ditetapkan. Di lab sekolah, firewall biasanya aktif di router utama agar jaringan siswa hanya dapat mengakses sumber daya yang diizinkan.",
              "Prinsip kerjanya sederhana: setiap paket yang lewat dibandingkan dengan daftar aturan, lalu diteruskan (permit) atau dibuang (deny).",
            ] },
            { title: "Jenis-Jenis Firewall", body: [
              "- Stateless: memeriksa setiap paket secara terpisah tanpa mengingat koneksi sebelumnya.",
              "- Stateful: mencatat status koneksi sehingga balasan dari koneksi yang sah otomatis diizinkan.",
              "- Next-generation: menambahkan inspeksi aplikasi, deteksi intrusi (IDS/IPS), dan filter berbasis pengguna.",
            ] },
          ] },
          { title: "Access Control List (ACL)", items: [
            { title: "Konsep ACL dan Arah Trafik", body: [
              "ACL adalah daftar aturan berurutan yang menentukan paket diizinkan atau ditolak. Aturan dibaca dari atas ke bawah dan aturan pertama yang cocok langsung dipakai, jadi urutan sangat menentukan hasil.",
              "ACL standar hanya menyaring alamat sumber, sedangkan ACL extended dapat menyaring sumber, tujuan, protokol, dan port sekaligus.",
              "Arah in berarti trafik yang masuk ke interface, arah out berarti trafik yang keluar dari interface. Salah menentukan arah membuat aturan tidak bekerja.",
            ] },
            { title: "Menyusun Aturan yang Rapi", body: [
              "- Tempatkan aturan paling spesifik di bagian atas daftar.",
              "- Tambahkan komentar pada setiap baris agar mudah dibaca ulang.",
              "- Tutup daftar dengan penolakan eksplisit di akhir (implicit deny) dan aktifkan log untuk audit.",
            ] },
          ] },
          { title: "Studi Kasus Lab Komputer", items: [
            { title: "Skenario dan Topologi", body: [
              "Lab komputer XI TKJ memakai subnet 192.168.10.0/24. Siswa boleh mengakses server file dan internet, tetapi tidak boleh membuka halaman konfigurasi router.",
              "Ruang guru memakai subnet 192.168.20.0/24 dan diizinkan mengakses manajemen router.",
            ] },
            { title: "Menyusun Aturan ACL", body: [
              "- Identifikasi trafik yang perlu diizinkan dan ditolak.",
              "- Buat ACL extended dengan aturan berurutan dari yang paling spesifik.",
              "- Terapkan ACL pada interface yang tepat (masuk atau keluar).",
              "- Uji hasilnya dengan ping, traceroute, dan akses browser.",
            ] },
            { title: "Verifikasi dan Pengujian", body: [
              "Dari PC siswa: akses server file berhasil, akses halaman admin router gagal, dan akses internet berhasil.",
              "Periksa log firewall untuk memastikan paket yang ditolak tercatat dengan benar.",
            ] },
          ] },
          { title: "Penutup", items: [
            { title: "Rangkuman", body: [
              "Firewall mengendalikan trafik dengan aturan permit/deny. ACL adalah bentuk aturannya, dan urutan, arah, serta jenisnya sangat menentukan hasil.",
              "Studi kasus lab menunjukkan bagaimana aturan sederhana bisa membatasi akses tanpa mengganggu kegiatan belajar.",
            ] },
            { title: "Evaluasi Diri", body: [
              "- Sudah bisakah kamu menjelaskan perbedaan ACL standar dan extended?",
              "- Sudah bisakah kamu menyusun 3 aturan ACL untuk skenario lab di atas?",
              "- Jika belum, ulangi bagian 2.1 dan 3.2 sebelum menandai materi ini selesai.",
            ] },
          ] },
        ],
        created_by: "u-guru",
        created_at: "2026-10-16T08:15:00.000Z",
      },
    ],
    student_preferences: [],
    reward_transactions: [
      { id: "rt1", user_id: "u-siswa", type: "poin", amount: 30, balance_after: 30, source: "quiz", source_id: "qz1", metadata: {}, created_at: new Date(Date.now()-86400000).toISOString() },
      { id: "rt2", user_id: "u-siswa", type: "xp", amount: 60, balance_after: 60, source: "quiz", source_id: "qz1", metadata: {}, created_at: new Date(Date.now()-86400000).toISOString() },
      { id: "rt3", user_id: "u-siswa", type: "hint", amount: 2, balance_after: 2, source: "case_study", source_id: "qz2", metadata: {}, created_at: new Date(Date.now()-86400000).toISOString() },
    ],
    lesson_progress: [
      { id: "lp1", user_id: "u-siswa", module_id: "lm1", completed: true, progress_pct: 100, time_spent_seconds: 420, last_position: {}, completed_at: new Date(Date.now()-86400000).toISOString(), created_at: new Date(Date.now()-86400000).toISOString(), updated_at: new Date(Date.now()-86400000).toISOString() },
      { id: "lp2", user_id: "u-siswa", module_id: "lm3", completed: false, progress_pct: 60, time_spent_seconds: 300, last_position: {}, created_at: "2026-10-12T08:00:00.000Z", updated_at: "2026-10-16T08:00:00.000Z" },
      { id: "lp3", user_id: "u-siswa", module_id: "lm4", completed: true, progress_pct: 100, time_spent_seconds: 540, last_position: {}, completed_at: "2026-10-13T08:00:00.000Z", created_at: "2026-10-12T09:00:00.000Z", updated_at: "2026-10-13T08:00:00.000Z" },
      { id: "lp4", user_id: "u-siswa", module_id: "lm5", completed: false, progress_pct: 70, time_spent_seconds: 360, last_position: {}, created_at: "2026-10-14T08:00:00.000Z", updated_at: "2026-10-17T08:00:00.000Z" },
      { id: "lp5", user_id: "u-siswa", module_id: "lm7", completed: false, progress_pct: 40, time_spent_seconds: 210, last_position: {}, created_at: "2026-10-15T08:00:00.000Z", updated_at: "2026-10-17T08:30:00.000Z" },
      { id: "lp6", user_id: "u-siswa", module_id: "lm9", completed: false, progress_pct: 25, time_spent_seconds: 120, last_position: {}, created_at: "2026-10-16T08:30:00.000Z", updated_at: "2026-10-17T09:00:00.000Z" },
    ],
    student_streaks: [
      { id: "sk1", user_id: "u-siswa", current_streak: 3, longest_streak: 5, last_activity_date: new Date().toISOString().slice(0,10), timezone: "Asia/Jakarta", created_at: new Date(Date.now()-3*86400000).toISOString(), updated_at: new Date().toISOString() },
    ],
    assignments: [
      { id: "as1", title: "Studi Kasus: Diagnosis LAN Sekolah", subject: "TKJ 11", class_name: "XI TKJ 4", description: "Analisis LAN lab yang tidak bisa internet.", type: "case_study", instructions: "Tulis 3 langkah diagnosis + alasan, sertakan screenshot topologi.", difficulty: "medium", max_points: 50, max_xp: 80, hint_reward: 2, due_at: new Date(Date.now()+7*86400000).toISOString(), allow_hints: true, status: "published", created_by: "u-guru", created_at: new Date(Date.now()-86400000).toISOString(), published_at: new Date(Date.now()-86400000).toISOString() },
      { id: "as2", title: "Tugas: Subnetting /24", subject: "TKJ 11", class_name: "XI TKJ 4", description: "Hitung subnet untuk 4 departemen.", type: "assignment", instructions: "Tulis hasil perhitungan + tabel alokasi IP.", difficulty: "easy", max_points: 30, max_xp: 40, hint_reward: 1, due_at: new Date(Date.now()+3*86400000).toISOString(), allow_hints: true, status: "published", created_by: "u-guru", created_at: new Date().toISOString(), published_at: new Date().toISOString() },
      { id: "as3", title: "Tugas: Firewall & ACL Dasar", subject: "TKJ 11", class_name: "XI TKJ 4", description: "Buat aturan firewall + ACL sederhana di lab.", type: "assignment", instructions: "Unggah screenshot rule dan jelaskan tiap baris.", difficulty: "hard", max_points: 60, max_xp: 100, hint_reward: 2, due_at: new Date(Date.now()+10*86400000).toISOString(), allow_hints: true, status: "draft", created_by: "u-guru", created_at: new Date(Date.now()-3600000).toISOString(), published_at: "" },
    ],
    submissions: [
      { id: "sub1", assignment_id: "as2", user_id: "u-siswa", answer_text: "Departemen A: 192.168.1.0/26 (62 host), B: 192.168.1.64/26, C: 192.168.1.128/26, D: 192.168.1.192/26. Tabel alokasi terlampir di jawaban.", answer_files: [], status: "graded", score: 26, max_score: 30, feedback: "Rapi! Perhatikan penulisan broadcast address di tabel.", graded_by: "u-guru", submitted_at: new Date(Date.now()-2*86400000).toISOString(), graded_at: new Date(Date.now()-86400000).toISOString() },
      { id: "sub2", assignment_id: "as1", user_id: "u-siswa", answer_text: "1) Cek fisik kabel & indikator switch. 2) Tes ping gateway dari client. 3) Cek konfigurasi DHCP/VLAN di router.", answer_files: [], status: "submitted", score: null, max_score: 50, feedback: "", graded_by: "", submitted_at: new Date(Date.now()-86400000).toISOString(), graded_at: "" },
    ],
    chat_sessions: [],
    chat_messages: [],
    offline_queue: [],
    offline_saved: ["lm1"],
  });

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let migrated = false;
        if (!parsed.schemaVersion || parsed.schemaVersion < SCHEMA_VERSION) {
          delete parsed.schedules;
          delete parsed.duty;
          delete parsed.facility;
          delete parsed.history;
          parsed.schemaVersion = SCHEMA_VERSION;
          migrated = true;
        }
        if (!parsed.push_subscriptions || !Array.isArray(parsed.push_subscriptions)) {
          parsed.push_subscriptions = [];
          migrated = true;
        }
        if (!parsed.learning_modules || !Array.isArray(parsed.learning_modules)) {
          parsed.learning_modules = seed().learning_modules;
          migrated = true;
        }
        if (!parsed.zoom_sessions || !Array.isArray(parsed.zoom_sessions)) {
          const sd = seed();
          parsed.zoom_sessions = sd.zoom_sessions;
          parsed.community_links = sd.community_links;
          parsed.competitions = sd.competitions;
          migrated = true;
        }
        if (!parsed.community_links) { parsed.community_links = seed().community_links; migrated = true; }
        if (!parsed.competitions) { parsed.competitions = seed().competitions; migrated = true; }
        if (!parsed.quizzes || !Array.isArray(parsed.quizzes)) {
          const sd = seed();
          parsed.quizzes = sd.quizzes;
          parsed.quiz_questions = sd.quiz_questions;
          parsed.quiz_attempts = sd.quiz_attempts || [];
          migrated = true;
        }
        if (!parsed.quiz_questions) { parsed.quiz_questions = seed().quiz_questions; migrated = true; }
        if (!parsed.quiz_attempts) { parsed.quiz_attempts = []; migrated = true; }
        if (!parsed.schedules_personal || !Array.isArray(parsed.schedules_personal)) { parsed.schedules_personal = seed().schedules_personal; migrated = true; }
        if (!parsed.student_preferences || !Array.isArray(parsed.student_preferences)) { parsed.student_preferences = []; migrated = true; }
        if (!parsed.reward_transactions || !Array.isArray(parsed.reward_transactions)) { parsed.reward_transactions = []; migrated = true; }
        if (!parsed.lesson_progress || !Array.isArray(parsed.lesson_progress)) { parsed.lesson_progress = []; migrated = true; }
        if (!parsed.student_streaks || !Array.isArray(parsed.student_streaks)) { parsed.student_streaks = []; migrated = true; }
        if (!parsed.assignments || !Array.isArray(parsed.assignments)) { parsed.assignments = []; migrated = true; }
        if (!parsed.submissions || !Array.isArray(parsed.submissions)) { parsed.submissions = []; migrated = true; }
        if (!parsed.chat_sessions || !Array.isArray(parsed.chat_sessions)) { parsed.chat_sessions = []; migrated = true; }
        if (!parsed.chat_messages || !Array.isArray(parsed.chat_messages)) { parsed.chat_messages = []; migrated = true; }
        if (!parsed.offline_queue || !Array.isArray(parsed.offline_queue)) { parsed.offline_queue = []; migrated = true; }
        if (!parsed.offline_saved || !Array.isArray(parsed.offline_saved)) { parsed.offline_saved = []; migrated = true; }
        if (!parsed._demoFill || parsed._demoFill < 5) {
          const sd = seed();
          const addById = (arr, items) => {
            const ids = new Set(arr.map((x) => x.id));
            items.forEach((x) => { if (!ids.has(x.id)) arr.push(x); });
          };
          parsed.learning_modules = parsed.learning_modules || [];
          parsed.lesson_progress = parsed.lesson_progress || [];
          parsed.schedules_personal = parsed.schedules_personal || [];
          parsed.assignments = parsed.assignments || [];
          parsed.submissions = parsed.submissions || [];
          parsed.notifications = parsed.notifications || [];
          addById(parsed.learning_modules, sd.learning_modules);
          addById(parsed.lesson_progress, sd.lesson_progress);
          addById(parsed.schedules_personal, sd.schedules_personal);
          addById(parsed.assignments, sd.assignments);
          addById(parsed.submissions, sd.submissions);
          addById(parsed.notifications, sd.notifications);
          sd.schedules_personal.forEach((x) => {
            const cur = parsed.schedules_personal.find((y) => y.id === x.id);
            if (cur) { cur.starts_at = x.starts_at; cur.ends_at = x.ends_at; }
          });
          parsed._demoFill = 5;
          migrated = true;
        }
        if (migrated) localStorage.setItem(KEY, JSON.stringify(parsed));
        return parsed;
      }
    } catch (_) {}
    const data = seed();
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  };

  const save = (db) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {
      if (e && e.name === "QuotaExceededError") throw new Error("Penyimpanan penuh. Hapus foto atau laporan lama.");
      throw e;
    }
  };
  const uid = () => "id-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const today = () => new Date().toISOString().slice(0, 10);

  const configured = () => {
    const c = window.APP_CONFIG || {};
    return Boolean(c.supabaseUrl && c.supabaseAnonKey);
  };

  let client = null;
  const sb = () => {
    if (!configured()) return null;
    if (!client) {
      client = window.supabase.createClient(window.APP_CONFIG.supabaseUrl, window.APP_CONFIG.supabaseAnonKey);
    }
    return client;
  };

  const publicUser = (u) => {
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  };

  let _localNotCBs = [];
  let _pendingNotifDedup = new Map();
  const _emitLocal = (n) => {
    for (const [k, t] of _pendingNotifDedup) {
      if (Date.now() - t > 2000) _pendingNotifDedup.delete(k);
    }
    const dedupKey = String(n.id || "") + "|" + String(n.created_at || "");
    if (dedupKey && _pendingNotifDedup.has(dedupKey)) return;
    _pendingNotifDedup.set(dedupKey, Date.now());
    _localNotCBs.forEach((fn) => {
      try { fn(n); } catch (_) {}
    });
    try { window.dispatchEvent(new CustomEvent("sekolahku:notif", { detail: n })); } catch (_) {}
  };

  const mock = {
    mode: "demo",
    session() {
      const id = localStorage.getItem(SESSION);
      if (!id) return null;
      return publicUser(load().users.find((u) => u.id === id));
    },
    async login(email, password) {
      const u = load().users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
      if (!u) throw new Error("Email atau kata sandi salah.");
      localStorage.setItem(SESSION, u.id);
      return publicUser(u);
    },
    async logout() {
      localStorage.removeItem(SESSION);
    },
    async updateProfile(patch) {
      const db = load();
      const me = this.session();
      if (!me) throw new Error("Sesi berakhir. Silakan login ulang.");
      const i = db.users.findIndex((u) => u.id === me.id);
      if (i < 0) throw new Error("Pengguna tidak ditemukan.");
      db.users[i] = { ...db.users[i], ...patch };
      save(db);
      return publicUser(db.users[i]);
    },
    async changePassword(oldPw, newPw) {
      const db = load();
      const meId = localStorage.getItem(SESSION);
      const u = db.users.find((x) => x.id === meId);
      if (!u) throw new Error("Sesi berakhir. Silakan login ulang.");
      if (u.password !== oldPw) throw new Error("Kata sandi lama tidak sesuai.");
      u.password = newPw;
      save(db);
    },
    students(className) {
      return load().students.filter((s) => !className || s.class_name === className);
    },
    classes() {
      return [...new Set(load().students.map((s) => s.class_name))];
    },
    notifications() {
      const me = this.session();
      if (!me) return [];
      return load().notifications.filter((n) => n.user_id === me.id).sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    markRead(id) {
      const db = load();
      const n = db.notifications.find((x) => x.id === id);
      if (n) n.is_read = true;
      save(db);
    },
    markAllRead() {
      const me = this.session();
      const db = load();
      db.notifications.forEach((n) => {
        if (n.user_id === me.id) n.is_read = true;
      });
      save(db);
    },
    reporterName(id) {
      const u = load().users.find((x) => x.id === id);
      if (u) return u.name;
      const s = load().students.find((x) => x.id === id);
      return s ? s.name : "Pengguna";
    },
    async uploadPhoto(file) {
      if (!file) return "";
      if (file.size > 3 * 1024 * 1024) throw new Error("File terlalu besar, maksimal 3 MB.");
      const raw = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error("Gagal membaca file."));
        r.readAsDataURL(file);
      });
      try {
        const blob = await (async () => {
          const img = new Image();
          img.decoding = "async";
          const loaded = await new Promise((res, rej) => {
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = raw;
          });
          const maxSide = 960;
          let w = loaded.naturalWidth || loaded.width;
          let h = loaded.naturalHeight || loaded.height;
          if (!w || !h) return null;
          const scale = Math.min(1, maxSide / Math.max(w, h));
          const cw = Math.round(w * scale);
          const ch = Math.round(h * scale);
          const c = document.createElement("canvas");
          c.width = cw; c.height = ch;
          const ctx = c.getContext("2d");
          if (!ctx) return null;
          ctx.drawImage(loaded, 0, 0, cw, ch);
          const q = file.size > 1024 * 1024 ? 0.55 : 0.68;
          return c.toDataURL("image/jpeg", q);
        })();
        if (blob && typeof blob === "string" && blob.length < String(raw).length) return blob;
      } catch (_) {}
      return raw;
    },
    async savePushToken(provider, token) {
      const db = load();
      const me = this.session();
      if (!me) return;
      db.push_subscriptions = db.push_subscriptions || [];
      const exists = db.push_subscriptions.find((x) => x.token === token && x.user_id === me.id);
      if (!exists) {
        db.push_subscriptions.push({ id: uid(), user_id: me.id, provider, token, created_at: new Date().toISOString() });
        save(db);
      }
    },
    learningModules(filters = {}) {
      const me = this.session();
      if (!me) return [];
      let list = [...(load().learning_modules || [])];
      list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      if (filters.type) list = list.filter((m) => m.type === filters.type);
      if (filters.q) {
        const q = String(filters.q).toLowerCase();
        list = list.filter((m) => `${m.title} ${m.subject} ${m.description} ${m.class_name || ""}`.toLowerCase().includes(q));
      }
      return list;
    },
    createModule(payload) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru yang dapat menambah materi.");
      const { id, created_by, created_at, ...safe } = payload || {};
      if (!safe.title || !String(safe.title).trim()) throw new Error("Judul materi wajib diisi.");
      if (!["visual", "audio"].includes(safe.type)) throw new Error("Tipe materi harus visual atau audio.");
      const row = { ...safe, title: String(safe.title).trim(), id: uid(), created_by: me.id, created_at: new Date().toISOString() };
      db.learning_modules = db.learning_modules || [];
      db.learning_modules.unshift(row);
      save(db);
      return row;
    },
    async uploadFile(file) {
      if (!file) return "";
      return this.uploadPhoto(file);
    },
    quizzes(filters = {}) {
      const me = this.session();
      if (!me) return [];
      let list = [...(load().quizzes || [])];
      list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      if (me.role === "siswa") list = list.filter((q) => q.status === "published");
      if (filters.tipe) list = list.filter((q) => q.tipe === filters.tipe);
      if (filters.status) list = list.filter((q) => q.status === filters.status);
      if (filters.q) {
        const qq = String(filters.q).toLowerCase();
        list = list.filter((q) => ((q.title||"")+" "+(q.subject||"")+" "+(q.description||"")).toLowerCase().includes(qq));
      }
      return list;
    },
    quizById(id) {
      return (load().quizzes || []).find((q) => q.id === id) || null;
    },
    createQuiz(payload) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru yang dapat membuat quiz.");
      const { id, created_by, created_at, published_at, ...safe } = payload || {};
      if (!safe.title || !String(safe.title).trim()) throw new Error("Judul quiz wajib diisi.");
      if (!["game","case"].includes(safe.tipe)) throw new Error("Tipe quiz tidak valid.");
      const row = { ...safe, title: String(safe.title).trim(), duration: Math.max(1, Number(safe.duration)||15), status: safe.status || "draft", id: uid(), created_by: me.id, created_at: new Date().toISOString(), published_at: safe.status==="published" ? new Date().toISOString() : "" };
      db.quizzes = db.quizzes || [];
      db.quizzes.unshift(row);
      if (row.status === "published") {
        const targets = db.users.filter((u) => u.role === "siswa");
        targets.forEach((t) => {
          const n = { id: uid(), user_id: t.id, title: "Quiz baru", message: row.title+" sudah dibuka.", type: "quiz", is_read: false, created_at: new Date().toISOString() };
          db.notifications.push(n);
          _emitLocal(n);
        });
      }
      save(db);
      return row;
    },
    updateQuiz(id, patch) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru.");
      const row = (db.quizzes||[]).find((q) => q.id === id);
      if (!row) throw new Error("Quiz tidak ditemukan.");
      const was = row.status;
      Object.assign(row, patch);
      if (patch.status === "published" && was !== "published") row.published_at = new Date().toISOString();
      if (patch.status === "published" && was !== "published") {
        db.users.filter((u) => u.role === "siswa").forEach((t) => {
          const n = { id: uid(), user_id: t.id, title: "Quiz baru", message: row.title+" sudah dibuka.", type: "quiz", is_read: false, created_at: new Date().toISOString() };
          db.notifications.push(n);
          _emitLocal(n);
        });
      }
      save(db);
      return row;
    },
    deleteQuiz(id) {
      const db = load();
      db.quizzes = (db.quizzes||[]).filter((q) => q.id !== id);
      db.quiz_questions = (db.quiz_questions||[]).filter((q) => q.quiz_id !== id);
      save(db);
    },
    quizQuestions(quizId) {
      return (load().quiz_questions||[]).filter((q) => q.quiz_id === quizId).sort((a,b) => (a.order_no||0)-(b.order_no||0));
    },
    createQuestion(payload) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru.");
      if (!payload.quiz_id) throw new Error("quiz_id wajib.");
      if (!payload.question || !String(payload.question).trim()) throw new Error("Soal wajib diisi.");
      const row = { id: uid(), qtype: payload.qtype || "pg", options: payload.options || [], answer: payload.answer || "", points: Number(payload.points)||10, order_no: Number(payload.order_no)||0, question: String(payload.question).trim(), quiz_id: payload.quiz_id, created_at: new Date().toISOString() };
      db.quiz_questions = db.quiz_questions || [];
      db.quiz_questions.push(row);
      save(db);
      return row;
    },
    deleteQuestion(id) {
      const db = load();
      db.quiz_questions = (db.quiz_questions||[]).filter((q) => q.id !== id);
      save(db);
    },
    attempts(quizId) {
      const me = this.session();
      if (!me) return [];
      let list = [...(load().quiz_attempts||[])];
      if (quizId) list = list.filter((a) => a.quiz_id === quizId);
      if (me.role === "siswa") list = list.filter((a) => a.user_id === me.id);
      list.sort((a,b) => String(b.submitted_at).localeCompare(String(a.submitted_at)));
      return list;
    },
    myAttempt(quizId) {
      const me = this.session();
      return (load().quiz_attempts||[]).find((a) => a.quiz_id === quizId && a.user_id === (me && me.id)) || null;
    },
    submitAttempt(quizId, answers) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "siswa") throw new Error("Hanya siswa yang dapat mengerjakan.");
      const quiz = (db.quizzes || []).find((q) => q.id === quizId);
      const qs = (db.quiz_questions||[]).filter((q) => q.quiz_id === quizId);
      let score = 0; let max = 0; let hasEssay = false;
      qs.forEach((q) => {
        max += Number(q.points)||0;
        if (q.qtype === "essay") { hasEssay = true; return; }
        const given = (answers||{})[q.id];
        if (String(given||"").trim().toLowerCase() === String(q.answer||"").trim().toLowerCase()) score += Number(q.points)||0;
      });
      const row = { id: uid(), quiz_id: quizId, user_id: me.id, answers: answers || {}, score, max_score: max, status: hasEssay ? "pending" : "graded", feedback: "", graded_by: "", started_at: new Date().toISOString(), submitted_at: new Date().toISOString() };
      db.quiz_attempts = db.quiz_attempts || [];
      const ix = db.quiz_attempts.findIndex((a) => a.quiz_id === quizId && a.user_id === me.id);
      if (ix >= 0) db.quiz_attempts[ix] = row; else db.quiz_attempts.push(row);
      this._addReward(db, me.id, "poin", GAMIFICATION.poinPerQuiz, "quiz", quizId, { score });
      this._addReward(db, me.id, "xp", GAMIFICATION.xpPerQuiz, "quiz", quizId, { score });
      if (quiz && quiz.tipe === "case") this._addReward(db, me.id, "hint", GAMIFICATION.hintRewardCase, "case_study", quizId, {});
      this._touchStreak(db, me.id);
      const n = { id: uid(), user_id: "u-guru", title: "Jawaban masuk", message: me.name+" mengumpulkan quiz.", type: "quiz", is_read: false, created_at: new Date().toISOString() };
      db.notifications.push(n);
      _emitLocal(n);
      save(db);
      return row;
    },
    gradeAttempt(attemptId, score, feedback) {
      const db = load();
      const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru.");
      const row = (db.quiz_attempts||[]).find((a) => a.id === attemptId);
      if (!row) throw new Error("Attempt tidak ditemukan.");
      row.score = Number(score)||0;
      row.feedback = feedback || "";
      row.status = "graded";
      row.graded_by = me.id;
      const n = { id: uid(), user_id: row.user_id, title: "Nilai quiz keluar", message: "Quiz kamu sudah dinilai: "+row.score, type: "quiz", is_read: false, created_at: new Date().toISOString() };
      db.notifications.push(n);
      _emitLocal(n);
      save(db);
      return row;
    },
    mySchedules(filters={}) {
      const me=this.session(); if(!me) return [];
      let list=[...(load().schedules_personal||[])];
      if(me.role==="siswa") list=list.filter((x)=>x.student_id===me.id);
      if(filters.from) list=list.filter((x)=>String(x.starts_at)>=String(filters.from));
      if(filters.to) list=list.filter((x)=>String(x.starts_at)<=String(filters.to));
      if(filters.student_id) list=list.filter((x)=>x.student_id===filters.student_id);
      list.sort((a,b)=>String(a.starts_at).localeCompare(String(b.starts_at)));
      return list;
    },
    createSchedule(payload){
      const db=load(); const me=this.session();
      if(!me||me.role!=="guru") throw new Error("Hanya tutor/guru.");
      if(!payload.student_id) throw new Error("Pilih murid.");
      if(!payload.title||!String(payload.title).trim()) throw new Error("Judul wajib.");
      if(!payload.starts_at||!payload.ends_at) throw new Error("Jam mulai & selesai wajib.");
      if(new Date(payload.ends_at)<=new Date(payload.starts_at)) throw new Error("Jam selesai harus setelah mulai.");
      const row={ id: uid(), created_by: me.id, created_at: new Date().toISOString(), tipe: payload.tipe||"kelas", color: payload.color||"yellow", link: String(payload.link||"").trim(), notes: String(payload.notes||"").trim(), title: String(payload.title).trim(), student_id: payload.student_id, starts_at: new Date(payload.starts_at).toISOString(), ends_at: new Date(payload.ends_at).toISOString() };
      db.schedules_personal.unshift(row);
      const n={ id: uid(), user_id: row.student_id, title: "Jadwal baru: "+row.title, message: new Date(row.starts_at).toLocaleString("id-ID")+" · "+(row.tipe||""), type:"jadwal", is_read:false, created_at:new Date().toISOString() };
      db.notifications.push(n); _emitLocal(n);
      save(db); return row;
    },
    updateSchedule(id,patch){
      const db=load(); const me=this.session();
      if(!me||me.role!=="guru") throw new Error("Hanya tutor/guru.");
      const r=(db.schedules_personal||[]).find((x)=>x.id===id); if(!r) throw new Error("Tidak ditemukan");
      Object.assign(r,patch);
      if(patch.starts_at) r.starts_at=new Date(patch.starts_at).toISOString();
      if(patch.ends_at) r.ends_at=new Date(patch.ends_at).toISOString();
      save(db); return r;
    },
    deleteSchedule(id){ const db=load(); db.schedules_personal=(db.schedules_personal||[]).filter((x)=>x.id!==id); save(db); },
    zoomSessions(filters={}){
      let list=[...(load().zoom_sessions||[])];
      if(filters.status) list=list.filter((x)=>x.status===filters.status);
      list.sort((a,b)=>String(a.scheduled_at).localeCompare(String(b.scheduled_at)));
      return list;
    },
    createZoom(payload){
      const db=load(); const me=this.session();
      if(!me) throw new Error("Sesi berakhir. Silakan login ulang.");
      const { id, created_by, created_at, ...safe } = payload||{};
      if(!safe.title||!String(safe.title).trim()) throw new Error("Judul sesi wajib diisi.");
      if(!safe.zoom_url||!String(safe.zoom_url).trim()) throw new Error("Link Zoom wajib diisi.");
      const row={ ...safe, title:String(safe.title).trim(), duration:Math.max(1,Number(safe.duration)||60), status:safe.status||"scheduled", id:uid(), created_by:me.id, created_at:new Date().toISOString() };
      db.zoom_sessions=db.zoom_sessions||[]; db.zoom_sessions.unshift(row); save(db); return row;
    },
    updateZoom(id,patch){ const db=load(); const r=(db.zoom_sessions||[]).find((x)=>x.id===id); if(!r) throw new Error("Sesi tidak ditemukan."); Object.assign(r,patch); save(db); return r; },
    deleteZoom(id){ const db=load(); db.zoom_sessions=(db.zoom_sessions||[]).filter((x)=>x.id!==id); save(db); },
    communityLinks(filters={}){
      let list=[...(load().community_links||[])];
      if(filters.platform) list=list.filter((x)=>x.platform===filters.platform);
      list.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
      return list;
    },
    createCommunity(payload){
      const db=load(); const me=this.session();
      if(!me) throw new Error("Sesi berakhir. Silakan login ulang.");
      const { id, created_by, created_at, ...safe } = payload||{};
      if(!safe.title||!String(safe.title).trim()) throw new Error("Judul grup wajib diisi.");
      if(!safe.link||!String(safe.link).trim()) throw new Error("Link grup wajib diisi.");
      const row={ ...safe, title:String(safe.title).trim(), link:String(safe.link).trim(), platform:safe.platform||"whatsapp", is_active:safe.is_active!==false, id:uid(), created_by:me.id, created_at:new Date().toISOString() };
      db.community_links=db.community_links||[]; db.community_links.unshift(row); save(db); return row;
    },
    updateCommunity(id,patch){ const db=load(); const r=(db.community_links||[]).find((x)=>x.id===id); if(!r) throw new Error("Link komunitas tidak ditemukan."); Object.assign(r,patch); save(db); return r; },
    deleteCommunity(id){ const db=load(); db.community_links=(db.community_links||[]).filter((x)=>x.id!==id); save(db); },
    competitions(filters={}){
      let list=[...(load().competitions||[])];
      if(filters.status) list=list.filter((x)=>x.status===filters.status);
      if(filters.q){ const qq=String(filters.q).toLowerCase(); list=list.filter((x)=>String(x.title||"").toLowerCase().includes(qq)); }
      list.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
      return list;
    },
    createCompetition(payload){
      const db=load(); const me=this.session();
      if(!me) throw new Error("Sesi berakhir. Silakan login ulang.");
      const { id, created_by, created_at, ...safe } = payload||{};
      if(!safe.title||!String(safe.title).trim()) throw new Error("Judul lomba wajib diisi.");
      const row={ ...safe, title:String(safe.title).trim(), category:safe.category||"Lainnya", status:safe.status||"open", id:uid(), created_by:me.id, created_at:new Date().toISOString() };
      db.competitions=db.competitions||[]; db.competitions.unshift(row); save(db); return row;
    },
    updateCompetition(id,patch){ const db=load(); const r=(db.competitions||[]).find((x)=>x.id===id); if(!r) throw new Error("Lomba tidak ditemukan."); Object.assign(r,patch); save(db); return r; },
    deleteCompetition(id){ const db=load(); db.competitions=(db.competitions||[]).filter((x)=>x.id!==id); save(db); },
    getPreferences() {
      const me = this.session(); if (!me) return null;
      return (load().student_preferences || []).find((p) => p.user_id === me.id) || null;
    },
    savePreferences(payload) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      const clean = {
        favorite_subjects: Array.isArray(payload.favorite_subjects) ? payload.favorite_subjects.filter(Boolean).slice(0, 8) : [],
        preferred_methods: Array.isArray(payload.preferred_methods) ? payload.preferred_methods.filter((m) => ["visual","audio","video","quiz"].includes(m)) : [],
        learning_goals: String(payload.learning_goals || "").slice(0, 500),
      };
      const ix = (db.student_preferences || []).findIndex((p) => p.user_id === me.id);
      const row = { id: ix >= 0 ? db.student_preferences[ix].id : uid(), user_id: me.id, ...clean, created_at: ix >= 0 ? db.student_preferences[ix].created_at : new Date().toISOString(), updated_at: new Date().toISOString() };
      db.student_preferences = db.student_preferences || [];
      if (ix >= 0) db.student_preferences[ix] = row; else db.student_preferences.push(row);
      save(db); return row;
    },
    _balanceOf(db, userId, type) {
      return (db.reward_transactions || []).filter((t) => t.user_id === userId && t.type === type).reduce((s, t) => s + (Number(t.amount) || 0), 0);
    },
    _addReward(db, userId, type, amount, source, sourceId, metadata) {
      if (!amount) return this._balanceOf(db, userId, type);
      const dedup = (db.reward_transactions || []).find((t) => t.user_id === userId && t.type === type && t.source === source && String(t.source_id || "") === String(sourceId || ""));
      if (dedup && (source === "quiz" || source === "module" || source === "assignment" || source === "onboarding")) return this._balanceOf(db, userId, type);
      db.reward_transactions = db.reward_transactions || [];
      const balance = this._balanceOf(db, userId, type) + Number(amount);
      db.reward_transactions.push({ id: uid(), user_id: userId, type, amount: Number(amount), balance_after: balance, source, source_id: sourceId || "", metadata: metadata || {}, created_at: new Date().toISOString() });
      return balance;
    },
    wallet() {
      const me = this.session(); if (!me) return { poin: 0, xp: 0, hint: 0, level: 1, xpToNext: GAMIFICATION.xpPerLevel, transactions: [] };
      const db = load();
      const poin = this._balanceOf(db, me.id, "poin");
      const xp = this._balanceOf(db, me.id, "xp");
      const hint = this._balanceOf(db, me.id, "hint");
      const level = Math.floor(xp / GAMIFICATION.xpPerLevel) + 1;
      const xpToNext = level * GAMIFICATION.xpPerLevel - xp;
      const transactions = (db.reward_transactions || []).filter((t) => t.user_id === me.id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 20);
      return { poin, xp, hint, level, xpToNext, transactions };
    },
    spendHint(sourceId, cost) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      const c = cost == null ? GAMIFICATION.hintCost : Number(cost);
      const bal = this._balanceOf(db, me.id, "hint");
      if (bal < c) throw new Error("Saldo petunjuk tidak cukup. Selesaikan tugas/studi kasus untuk dapat petunjuk.");
      this._addReward(db, me.id, "hint", -c, "hint_spend", sourceId || ("" + Date.now()), {});
      save(db); return this.wallet();
    },
    myStreak() {
      const me = this.session(); if (!me) return { current_streak: 0, longest_streak: 0, last_activity_date: "" };
      return (load().student_streaks || []).find((s) => s.user_id === me.id) || { current_streak: 0, longest_streak: 0, last_activity_date: "" };
    },
    _touchStreak(db, userId) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const yd = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      db.student_streaks = db.student_streaks || [];
      let st = db.student_streaks.find((s) => s.user_id === userId);
      if (!st) { st = { id: uid(), user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: todayStr, timezone: "Asia/Jakarta", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.student_streaks.push(st); return st; }
      if (st.last_activity_date === todayStr) return st;
      if (st.last_activity_date === yd) st.current_streak = (Number(st.current_streak) || 0) + 1;
      else st.current_streak = 1;
      st.longest_streak = Math.max(Number(st.longest_streak) || 0, Number(st.current_streak) || 0);
      st.last_activity_date = todayStr; st.updated_at = new Date().toISOString();
      return st;
    },
    myProgress() {
      const me = this.session(); if (!me) return [];
      return (load().lesson_progress || []).filter((p) => p.user_id === me.id);
    },
    recordModuleProgress(moduleId, patch) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      db.lesson_progress = db.lesson_progress || [];
      let row = db.lesson_progress.find((p) => p.user_id === me.id && p.module_id === moduleId);
      const wasCompleted = row && row.completed;
      if (!row) { row = { id: uid(), user_id: me.id, module_id: moduleId, completed: false, progress_pct: 0, time_spent_seconds: 0, last_position: {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; db.lesson_progress.push(row); }
      if (patch.progress_pct != null) row.progress_pct = Math.max(0, Math.min(100, Number(patch.progress_pct) || 0));
      if (patch.time_spent_seconds != null) row.time_spent_seconds = (Number(row.time_spent_seconds) || 0) + Number(patch.time_spent_seconds || 0);
      if (patch.last_position) row.last_position = patch.last_position;
      if (patch.completed) { row.completed = true; row.progress_pct = 100; row.completed_at = new Date().toISOString(); }
      if (patch.completed === false) { row.completed = false; row.completed_at = ""; }
      row.updated_at = new Date().toISOString();
      if (row.completed && !wasCompleted) {
        this._addReward(db, me.id, "poin", GAMIFICATION.poinPerModule, "module", moduleId, {});
        this._addReward(db, me.id, "xp", GAMIFICATION.xpPerModule, "module", moduleId, {});
        this._touchStreak(db, me.id);
      }
      save(db); return row;
    },
    assignments(filters = {}) {
      const me = this.session(); if (!me) return [];
      let list = [...(load().assignments || [])];
      list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      if (me.role === "siswa") list = list.filter((a) => a.status === "published");
      if (filters.status) list = list.filter((a) => a.status === filters.status);
      if (filters.type) list = list.filter((a) => a.type === filters.type);
      if (filters.q) { const s = String(filters.q).toLowerCase(); list = list.filter((a) => ((a.title || "") + " " + (a.subject || "") + " " + (a.description || "")).toLowerCase().includes(s)); }
      return list;
    },
    assignmentById(id) { return (load().assignments || []).find((a) => a.id === id) || null; },
    createAssignment(payload) {
      const db = load(); const me = this.session();
      if (!me || !["guru", "sekolah"].includes(me.role)) throw new Error("Hanya guru/sekolah.");
      if (!payload.title || !String(payload.title).trim()) throw new Error("Judul tugas wajib.");
      const row = { id: uid(), title: String(payload.title).trim(), description: String(payload.description || ""), subject: String(payload.subject || ""), class_name: String(payload.class_name || ""), type: ["assignment", "case_study"].includes(payload.type) ? payload.type : "assignment", instructions: String(payload.instructions || ""), difficulty: ["easy", "medium", "hard"].includes(payload.difficulty) ? payload.difficulty : "medium", max_points: Math.max(0, Number(payload.max_points) || 0), max_xp: Math.max(0, Number(payload.max_xp) || 0), hint_reward: Math.max(0, Number(payload.hint_reward) || 0), due_at: payload.due_at ? new Date(payload.due_at).toISOString() : "", allow_hints: payload.allow_hints !== false, status: payload.status || "draft", created_by: me.id, created_at: new Date().toISOString(), published_at: payload.status === "published" ? new Date().toISOString() : "" };
      db.assignments = db.assignments || []; db.assignments.unshift(row);
      if (row.status === "published") {
        db.users.filter((u) => u.role === "siswa").forEach((t) => { const n = { id: uid(), user_id: t.id, title: "Tugas baru", message: row.title + " sudah dibuka.", type: "tugas", is_read: false, created_at: new Date().toISOString() }; db.notifications.push(n); _emitLocal(n); });
      }
      save(db); return row;
    },
    updateAssignment(id, patch) {
      const db = load(); const me = this.session();
      if (!me || !["guru", "sekolah"].includes(me.role)) throw new Error("Hanya guru/sekolah.");
      const row = (db.assignments || []).find((a) => a.id === id); if (!row) throw new Error("Tugas tidak ditemukan.");
      const was = row.status; Object.assign(row, patch);
      if (patch.status === "published" && was !== "published") row.published_at = new Date().toISOString();
      save(db); return row;
    },
    deleteAssignment(id) { const db = load(); db.assignments = (db.assignments || []).filter((a) => a.id !== id); db.submissions = (db.submissions || []).filter((s) => s.assignment_id !== id); save(db); },
    mySubmission(assignmentId) {
      const me = this.session(); if (!me) return null;
      return (load().submissions || []).find((s) => s.assignment_id === assignmentId && s.user_id === me.id) || null;
    },
    submissions(assignmentId) {
      const me = this.session(); if (!me) return [];
      let list = [...(load().submissions || [])];
      if (assignmentId) list = list.filter((s) => s.assignment_id === assignmentId);
      if (me.role === "siswa") list = list.filter((s) => s.user_id === me.id);
      list.sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)));
      return list;
    },
    submitAssignment(assignmentId, answerText, files) {
      const db = load(); const me = this.session();
      if (!me || me.role !== "siswa") throw new Error("Hanya siswa.");
      const a = (db.assignments || []).find((x) => x.id === assignmentId); if (!a) throw new Error("Tugas tidak ditemukan.");
      if (!answerText || !String(answerText).trim()) throw new Error("Jawaban wajib diisi.");
      const late = a.due_at && new Date() > new Date(a.due_at);
      db.submissions = db.submissions || [];
      const ix = db.submissions.findIndex((s) => s.assignment_id === assignmentId && s.user_id === me.id);
      const row = { id: ix >= 0 ? db.submissions[ix].id : uid(), assignment_id: assignmentId, user_id: me.id, answer_text: String(answerText), answer_files: files || [], status: late ? "late" : "submitted", score: null, max_score: a.max_points || 100, feedback: "", graded_by: "", submitted_at: new Date().toISOString(), graded_at: "" };
      if (ix >= 0) db.submissions[ix] = { ...db.submissions[ix], ...row }; else db.submissions.push(row);
      this._addReward(db, me.id, "poin", GAMIFICATION.poinPerAssignment, "assignment", assignmentId, {});
      this._addReward(db, me.id, "xp", GAMIFICATION.xpPerAssignment, "assignment", assignmentId, {});
      if (a.hint_reward) this._addReward(db, me.id, "hint", Number(a.hint_reward), "assignment", assignmentId, {});
      this._touchStreak(db, me.id);
      const n = { id: uid(), user_id: a.created_by || "u-guru", title: "Tugas masuk", message: me.name + " mengumpulkan: " + a.title, type: "tugas", is_read: false, created_at: new Date().toISOString() };
      db.notifications.push(n); _emitLocal(n);
      save(db); return row;
    },
    gradeSubmission(submissionId, score, feedback) {
      const db = load(); const me = this.session();
      if (!me || me.role !== "guru") throw new Error("Hanya guru.");
      const row = (db.submissions || []).find((s) => s.id === submissionId); if (!row) throw new Error("Tidak ditemukan.");
      row.score = Number(score) || 0; row.feedback = feedback || ""; row.status = "graded"; row.graded_by = me.id; row.graded_at = new Date().toISOString();
      const n = { id: uid(), user_id: row.user_id, title: "Tugas dinilai", message: "Nilai tugasmu: " + row.score, type: "tugas", is_read: false, created_at: new Date().toISOString() };
      db.notifications.push(n); _emitLocal(n);
      save(db); return row;
    },
    chatSession(contextType, contextId) {
      const me = this.session(); if (!me) return null;
      const db = load(); db.chat_sessions = db.chat_sessions || []; db.chat_messages = db.chat_messages || [];
      let sess = db.chat_sessions.find((s) => s.user_id === me.id && String(s.context_type || "") === String(contextType || "") && String(s.context_id || "") === String(contextId || "") && s.is_active);
      if (!sess) {
        let mode = "learning";
        if (contextType === "quiz") { const q = (db.quizzes || []).find((x) => x.id === contextId); const att = (db.quiz_attempts || []).find((a) => a.quiz_id === contextId && a.user_id === me.id); if (q && q.status === "published" && !att) mode = "assessment"; }
        if (contextType === "assignment") { const sub = (db.submissions || []).find((s) => s.assignment_id === contextId && s.user_id === me.id); if (!sub) mode = "assessment"; }
        sess = { id: uid(), user_id: me.id, context_type: contextType || "general", context_id: contextId || "", mode, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        db.chat_sessions.push(sess); save(db);
      }
      return sess;
    },
    chatHistory(sessionId) {
      return (load().chat_messages || []).filter((m) => m.session_id === sessionId).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    },
    chatSend(sessionId, text) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      const sess = (db.chat_sessions || []).find((s) => s.id === sessionId); if (!sess) throw new Error("Sesi chat tidak ditemukan.");
      const clean = String(text || "").trim().slice(0, 2000); if (!clean) throw new Error("Pesan kosong.");
      db.chat_messages = db.chat_messages || [];
      db.chat_messages.push({ id: uid(), session_id: sessionId, role: "user", content: clean, metadata: {}, created_at: new Date().toISOString() });
      const reply = this._botReply(db, sess, clean);
      db.chat_messages.push({ id: uid(), session_id: sessionId, role: "assistant", content: reply, metadata: {}, created_at: new Date().toISOString() });
      sess.updated_at = new Date().toISOString();
      save(db); return reply;
    },
    chatSessions(limit = 12) {
      const me = this.session(); if (!me) return [];
      return (load().chat_sessions || [])
        .filter((s) => s.user_id === me.id)
        .sort((a, b) => String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at)))
        .slice(0, limit);
    },
    chatNewSession(contextType, contextId) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      db.chat_sessions = db.chat_sessions || [];
      const now = new Date().toISOString();
      db.chat_sessions.forEach((s) => { if (s.user_id === me.id && s.is_active) { s.is_active = false; s.updated_at = now; } });
      const sess = { id: uid(), user_id: me.id, context_type: contextType || "general", context_id: contextId || "", mode: "learning", is_active: true, created_at: now, updated_at: now };
      db.chat_sessions.push(sess); save(db); return sess;
    },
    chatOpenSession(sessionId) {
      const db = load(); const me = this.session(); if (!me) throw new Error("Sesi berakhir.");
      db.chat_sessions = db.chat_sessions || [];
      const sess = db.chat_sessions.find((s) => s.id === sessionId && s.user_id === me.id);
      if (!sess) throw new Error("Sesi tidak ditemukan.");
      db.chat_sessions.forEach((s) => { if (s.user_id === me.id) s.is_active = s.id === sessionId; });
      sess.updated_at = new Date().toISOString();
      save(db); return sess;
    },
    _botReply(db, sess, text) {
      const lower = text.toLowerCase();
      if (sess.mode === "assessment") {
        if (/(jawab|kunci|jawaban akhir|isi quiz|kerjakan)/.test(lower)) return "Aku tidak bisa memberi jawaban akhir selama penilaian berlangsung. Coba jelaskan pemahamanmu dulu, nanti aku bantu arahkan langkahnya.";
        return "Mode penilaian aktif: aku bisa bantu ingatkan konsep dan langkah pengerjaan, tapi tidak memberi jawaban akhir. Tulis langkah yang sudah kamu coba, ya.";
      }
      let ctx = "";
      if (sess.context_type === "module") { const m = (db.learning_modules || []).find((x) => x.id === sess.context_id); if (m) ctx = ` Materi "${m.title}": ${m.description || ""}`; }
      if (sess.context_type === "quiz") { const q = (db.quizzes || []).find((x) => x.id === sess.context_id); if (q) ctx = ` Terkait kuis "${q.title}".`; }
      if (/(contoh|example)/.test(lower)) return "Contoh sederhananya: misal topologi star — semua PC ke switch pusat. Kalau satu kabel putus, hanya PC itu yang mati, sisanya tetap jalan." + ctx;
      if (/(apa itu|jelaskan|pengertian|maksud)/.test(lower)) return "Penjelasan singkatnya: pecah jadi 3 bagian — definisi, cara kerja, dan contoh nyata. Tulis ulang dengan bahasamu sendiri biar nempel." + ctx + " Mau aku buatkan 2 soal latihan ringan?";
      if (/(langkah|cara|bagaimana|gimana)/.test(lower)) return "Langkah yang aman: 1) pahami pertanyaan, 2) tulis yang diketahui, 3) coba satu langkah kecil, 4) cek ulang. Tulis langkah 1 versimu, aku koreksi.";
      if (/(latihan|soal|quiz)/.test(lower)) return "Siap! Buka halaman Quiz lalu kerjakan Game: Dasar Jaringan (10 menit). Setelah selesai, kembali ke sini dan aku bantu bedah yang salah.";
      return "Paham! Ceritakan bagian mana yang bikin bingung (definisi / langkah / contoh)?" + ctx + " Kalau mau, ketik 'jelaskan topologi star' atau 'beri contoh subnetting'.";
    },
    offlineSaved() { return load().offline_saved || []; },
    toggleOffline(moduleId) {
      const db = load(); db.offline_saved = db.offline_saved || [];
      const ix = db.offline_saved.indexOf(moduleId);
      if (ix >= 0) db.offline_saved.splice(ix, 1); else db.offline_saved.push(moduleId);
      save(db); return db.offline_saved;
    },
    queueOp(operation, payload) {
      const db = load(); const me = this.session();
      db.offline_queue = db.offline_queue || [];
      const row = { id: uid(), user_id: me ? me.id : "", operation, payload: payload || {}, status: navigator.onLine ? "synced" : "pending", retry_count: 0, last_error: "", created_at: new Date().toISOString(), synced_at: navigator.onLine ? new Date().toISOString() : "" };
      db.offline_queue.push(row); save(db); return row;
    },
    pendingQueue() {
      const me = this.session(); if (!me) return [];
      return (load().offline_queue || []).filter((q) => q.user_id === me.id && q.status === "pending").sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    },
    syncQueue() {
      const db = load(); const me = this.session(); if (!me) return 0;
      let n = 0;
      (db.offline_queue || []).forEach((q) => {
        if (q.user_id !== me.id || q.status !== "pending") return;
        try {
          if (q.operation === "module_progress") this.recordModuleProgress(q.payload.moduleId, q.payload.patch || {});
          else if (q.operation === "submit_attempt") this.submitAttempt(q.payload.quizId, q.payload.answers || {});
          q.status = "synced"; q.synced_at = new Date().toISOString(); n++;
        } catch (e) { q.retry_count = (q.retry_count || 0) + 1; q.last_error = e.message; }
      });
      save(db); return n;
    },
    recommendedModules() {
      const me = this.session(); if (!me) return [];
      const db = load();
      const pref = (db.student_preferences || []).find((p) => p.user_id === me.id);
      const doneIds = new Set((db.lesson_progress || []).filter((p) => p.user_id === me.id && p.completed).map((p) => p.module_id));
      let list = [...(db.learning_modules || [])].filter((m) => !doneIds.has(m.id));
      if (pref && pref.favorite_subjects && pref.favorite_subjects.length) {
        const fav = pref.favorite_subjects.map((s) => String(s).toLowerCase());
        list.sort((a, b) => {
          const as = fav.some((f) => String(a.subject || "").toLowerCase().includes(f)) ? 0 : 1;
          const bs = fav.some((f) => String(b.subject || "").toLowerCase().includes(f)) ? 0 : 1;
          return as - bs;
        });
      }
      if (pref && pref.preferred_methods && pref.preferred_methods.length) {
        const map = { visual: "visual", audio: "audio", video: "visual", quiz: "visual" };
        const want = pref.preferred_methods.map((m) => map[m] || m);
        const match = list.filter((m) => want.includes(m.type));
        if (match.length) list = [...match, ...list.filter((m) => !want.includes(m.type))];
      }
      return list.slice(0, 3);
    },
    subscribeNotifications(cb) {
      _localNotCBs.push(cb);
      return () => {
        _localNotCBs = _localNotCBs.filter((f) => f !== cb);
      };
    },
  };

  const remote = {
    mode: "supabase",
    _user: null,
    _profile: null,
    _realtimeChannel: null,
    async boot() {
      const { data } = await sb().auth.getSession();
      if (!data.session) {
        this._user = null;
        this._profile = null;
        return null;
      }
      this._user = data.session.user;
      const { data: p, error } = await sb().from("profiles").select("*").eq("id", this._user.id).single();
      if (error) throw error;
      this._profile = p;
      return this.session();
    },
    session() {
      if (!this._profile) return null;
      return {
        id: this._profile.id,
        name: this._profile.name,
        email: this._profile.email,
        role: this._profile.role,
        class_name: this._profile.class_name || "",
        nis_nip: this._profile.nis_nip || "",
        phone: this._profile.phone || "",
        photo_url: this._profile.photo_url || "",
      };
    },
    async login(email, password) {
      const { data, error } = await sb().auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      this._user = data.user;
      const { data: p, error: e2 } = await sb().from("profiles").select("*").eq("id", data.user.id).single();
      if (e2) throw new Error("Akun belum memiliki profil. Isi tabel profiles di Supabase.");
      this._profile = p;
      return this.session();
    },
    async logout() {
      if (this._realtimeChannel) {
        try { sb().removeChannel(this._realtimeChannel); } catch (_) {}
        this._realtimeChannel = null;
      }
      await sb().auth.signOut();
      this._user = null;
      this._profile = null;
    },
    async updateProfile(patch) {
      const me = this.session();
      const { data, error } = await sb().from("profiles").update(patch).eq("id", me.id).select().single();
      if (error) throw error;
      this._profile = data;
      return this.session();
    },
    async changePassword(_old, next) {
      const { error } = await sb().auth.updateUser({ password: next });
      if (error) throw error;
    },
    students(className) {
      const list = (this._studentsCache || []).filter((s) => s.role === "siswa");
      return className ? list.filter((s) => s.class_name === className) : list;
    },
    async loadStudents() {
      const { data, error } = await sb().from("profiles").select("id,name,class_name,role").eq("role", "siswa");
      if (error) throw error;
      this._studentsCache = data;
      return data;
    },
    classes() {
      return [...new Set((this._studentsCache || []).map((s) => s.class_name).filter(Boolean))];
    },
    async notifications() {
      const { data, error } = await sb().from("notifications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async markRead(id) {
      await sb().from("notifications").update({ is_read: true }).eq("id", id);
    },
    async markAllRead() {
      await sb().from("notifications").update({ is_read: true }).eq("user_id", this.session().id);
    },
    reporterName(id) {
      const s = (this._studentsCache || []).find((x) => x.id === id);
      if (s) return s.name;
      if (this._profile && this._profile.id === id) return this._profile.name;
      return "Pengguna";
    },
    async uploadPhoto(file) {
      if (!file) return "";
      const path = `${this.session().id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await sb().storage.from("report-photos").upload(path, file);
      if (error) throw error;
      const { data } = sb().storage.from("report-photos").getPublicUrl(path);
      return data.publicUrl;
    },
    async savePushToken(provider, token) {
      const me = this.session();
      if (!me) return;
      const { error } = await sb().from("push_subscriptions").upsert(
        { user_id: me.id, provider, token, updated_at: new Date().toISOString() },
        { onConflict: "user_id,token" }
      );
      if (error) console.warn("[push] save token gagal", error.message);
    },
    async learningModules(filters = {}) {
      let q = sb().from("learning_modules").select("*").order("created_at", { ascending: false });
      if (filters.type) q = q.eq("type", filters.type);
      if (filters.q) q = q.ilike("title", `%${filters.q}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async createModule(payload) {
      const me = this.session();
      const { error, data } = await sb().from("learning_modules").insert({ ...payload, created_by: me.id }).select().single();
      if (error) throw error;
      return data;
    },
    async quizzes(filters = {}) {
      let q = sb().from("quizzes").select("*").order("created_at", { ascending: false });
      if (filters.tipe) q = q.eq("tipe", filters.tipe);
      if (filters.status) q = q.eq("status", filters.status);
      if (filters.q) q = q.ilike("title", "%"+filters.q+"%");
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async quizById(id) {
      const { data, error } = await sb().from("quizzes").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    async createQuiz(payload) {
      const me = this.session();
      const { error, data } = await sb().from("quizzes").insert({ ...payload, created_by: me.id }).select().single();
      if (error) throw error;
      return data;
    },
    async updateQuiz(id, patch) {
      const { data, error } = await sb().from("quizzes").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    async deleteQuiz(id) {
      const { error } = await sb().from("quizzes").delete().eq("id", id);
      if (error) throw error;
    },
    async quizQuestions(quizId) {
      let q = sb().from("quiz_questions").select("*").order("order_no");
      if (quizId) q = q.eq("quiz_id", quizId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async createQuestion(payload) {
      const { error, data } = await sb().from("quiz_questions").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async deleteQuestion(id) {
      const { error } = await sb().from("quiz_questions").delete().eq("id", id);
      if (error) throw error;
    },
    async attempts(quizId) {
      let q = sb().from("quiz_attempts").select("*").order("submitted_at", { ascending: false });
      if (quizId) q = q.eq("quiz_id", quizId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async myAttempt(quizId) {
      const me = this.session();
      const { data, error } = await sb().from("quiz_attempts").select("*").eq("quiz_id", quizId).eq("user_id", me.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    async submitAttempt(quizId, answers) {
      const me = this.session();
      const qs = await this.quizQuestions(quizId);
      let score = 0; let max = 0; let hasEssay = false;
      qs.forEach((qq) => {
        max += Number(qq.points)||0;
        if (qq.qtype === "essay") { hasEssay = true; return; }
        if (String((answers||{})[qq.id]||"").trim().toLowerCase() === String(qq.answer||"").trim().toLowerCase()) score += Number(qq.points)||0;
      });
      const row = { quiz_id: quizId, user_id: me.id, answers, score, max_score: max, status: hasEssay ? "pending" : "graded" };
      const { data, error } = await sb().from("quiz_attempts").upsert(row, { onConflict: "quiz_id,user_id" }).select().single();
      if (error) throw error;
      return data;
    },
    async gradeAttempt(attemptId, score, feedback) {
      const { data, error } = await sb().from("quiz_attempts").update({ score, feedback, status: "graded", graded_by: this.session().id }).eq("id", attemptId).select().single();
      if (error) throw error;
      return data;
    },
    async zoomSessions(filters={}){ let q=sb().from("zoom_sessions").select("*").order("scheduled_at"); if(filters.status) q=q.eq("status",filters.status); const {data,error}=await q; if(error) throw error; return data||[]; },
    async createZoom(payload){ const me=this.session(); const {data,error}=await sb().from("zoom_sessions").insert({...payload,created_by:me.id}).select().single(); if(error) throw error; return data; },
    async updateZoom(id,patch){ const {data,error}=await sb().from("zoom_sessions").update(patch).eq("id",id).select().single(); if(error) throw error; return data; },
    async deleteZoom(id){ const {error}=await sb().from("zoom_sessions").delete().eq("id",id); if(error) throw error; },
    async communityLinks(filters={}){ let q=sb().from("community_links").select("*").order("created_at",{ascending:false}); if(filters.platform) q=q.eq("platform",filters.platform); const {data,error}=await q; if(error) throw error; return data||[]; },
    async createCommunity(payload){ const me=this.session(); const {data,error}=await sb().from("community_links").insert({...payload,created_by:me.id}).select().single(); if(error) throw error; return data; },
    async updateCommunity(id,patch){ const {data,error}=await sb().from("community_links").update(patch).eq("id",id).select().single(); if(error) throw error; return data; },
    async deleteCommunity(id){ const {error}=await sb().from("community_links").delete().eq("id",id); if(error) throw error; },
    async competitions(filters={}){ let q=sb().from("competitions").select("*").order("created_at",{ascending:false}); if(filters.status) q=q.eq("status",filters.status); if(filters.q) q=q.ilike("title","%"+filters.q+"%"); const {data,error}=await q; if(error) throw error; return data||[]; },
    async createCompetition(payload){ const me=this.session(); const {data,error}=await sb().from("competitions").insert({...payload,created_by:me.id}).select().single(); if(error) throw error; return data; },
    async updateCompetition(id,patch){ const {data,error}=await sb().from("competitions").update(patch).eq("id",id).select().single(); if(error) throw error; return data; },
    async deleteCompetition(id){ const {error}=await sb().from("competitions").delete().eq("id",id); if(error) throw error; },
    async mySchedules(filters={}){
      let q=sb().from("schedules_personal").select("*").order("starts_at");
      if(filters.from) q=q.gte("starts_at",filters.from);
      if(filters.to) q=q.lte("starts_at",filters.to);
      if(filters.student_id) q=q.eq("student_id",filters.student_id);
      const {data,error}=await q; if(error) throw error; return data||[];
    },
    async createSchedule(payload){ const me=this.session(); const {data,error}=await sb().from("schedules_personal").insert({...payload,created_by:me.id}).select().single(); if(error) throw error; return data; },
    async updateSchedule(id,patch){ const {data,error}=await sb().from("schedules_personal").update(patch).eq("id",id).select().single(); if(error) throw error; return data; },
    async deleteSchedule(id){ const {error}=await sb().from("schedules_personal").delete().eq("id",id); if(error) throw error; },
    async getPreferences() {
      let q = sb().from("student_preferences").select("*").eq("user_id", this.session().id).maybeSingle();
      const { data, error } = await q; if (error) throw error; return data;
    },
    async savePreferences(payload) {
      const me = this.session();
      const row = { user_id: me.id, favorite_subjects: payload.favorite_subjects || [], preferred_methods: payload.preferred_methods || [], learning_goals: payload.learning_goals || "" };
      const { data, error } = await sb().from("student_preferences").upsert(row, { onConflict: "user_id" }).select().single();
      if (error) throw error; return data;
    },
    async wallet() {
      const me = this.session(); const { data, error } = await sb().from("reward_transactions").select("*").eq("user_id", me.id).order("created_at", { ascending: false }).limit(40);
      if (error) throw error; const rows = data || [];
      const sum = (t) => rows.filter((r) => r.type === t).reduce((s, r) => s + (r.amount || 0), 0);
      const poin = sum("poin"), xp = sum("xp"), hint = sum("hint");
      const level = Math.floor(xp / GAMIFICATION.xpPerLevel) + 1; const xpToNext = level * GAMIFICATION.xpPerLevel - xp;
      return { poin, xp, hint, level, xpToNext, transactions: rows.slice(0, 20) };
    },
    async spendHint(sourceId, cost) {
      const c = cost == null ? GAMIFICATION.hintCost : Number(cost);
      const w = await this.wallet(); if (w.hint < c) throw new Error("Saldo petunjuk tidak cukup.");
      const { error } = await sb().from("reward_transactions").insert({ user_id: this.session().id, type: "hint", amount: -c, balance_after: w.hint - c, source: "hint_spend", source_id: sourceId || ("" + Date.now()), metadata: {} });
      if (error) throw error; return this.wallet();
    },
    async myStreak() {
      const { data, error } = await sb().from("student_streaks").select("*").eq("user_id", this.session().id).maybeSingle();
      if (error) throw error; return data || { current_streak: 0, longest_streak: 0, last_activity_date: "" };
    },
    async myProgress() {
      const { data, error } = await sb().from("lesson_progress").select("*");
      if (error) throw error; return data || [];
    },
    async recordModuleProgress(moduleId, patch) {
      const me = this.session();
      const payload = { user_id: me.id, module_id: moduleId, progress_pct: patch.progress_pct, time_spent_seconds: patch.time_spent_seconds, last_position: patch.last_position || {}, completed: patch.completed || false, completed_at: patch.completed ? new Date().toISOString() : null };
      const { data, error } = await sb().from("lesson_progress").upsert(payload, { onConflict: "user_id,module_id" }).select().single();
      if (error) throw error; return data;
    },
    async assignments(filters = {}) {
      let q = sb().from("assignments").select("*").order("created_at", { ascending: false });
      if (filters.status) q = q.eq("status", filters.status);
      if (filters.type) q = q.eq("type", filters.type);
      const { data, error } = await q; if (error) throw error; return data || [];
    },
    async assignmentById(id) { const { data, error } = await sb().from("assignments").select("*").eq("id", id).single(); if (error) throw error; return data; },
    async createAssignment(payload) { const { data, error } = await sb().from("assignments").insert({ ...payload, created_by: this.session().id }).select().single(); if (error) throw error; return data; },
    async updateAssignment(id, patch) { const { data, error } = await sb().from("assignments").update(patch).eq("id", id).select().single(); if (error) throw error; return data; },
    async deleteAssignment(id) { const { error } = await sb().from("assignments").delete().eq("id", id); if (error) throw error; },
    async mySubmission(aid) { const { data, error } = await sb().from("submissions").select("*").eq("assignment_id", aid).eq("user_id", this.session().id).maybeSingle(); if (error) throw error; return data; },
    async submissions(aid) { let q = sb().from("submissions").select("*").order("submitted_at", { ascending: false }); if (aid) q = q.eq("assignment_id", aid); const { data, error } = await q; if (error) throw error; return data || []; },
    async submitAssignment(aid, answerText, files) { const { data, error } = await sb().from("submissions").upsert({ assignment_id: aid, user_id: this.session().id, answer_text: answerText, answer_files: files || [] }, { onConflict: "assignment_id,user_id" }).select().single(); if (error) throw error; return data; },
    async gradeSubmission(sid, score, feedback) { const { data, error } = await sb().from("submissions").update({ score, feedback, status: "graded", graded_by: this.session().id, graded_at: new Date().toISOString() }).eq("id", sid).select().single(); if (error) throw error; return data; },
    async chatSession(ct, ci) { const me = this.session(); let q = sb().from("chat_sessions").select("*").eq("user_id", me.id).eq("is_active", true); if (ct) q = q.eq("context_type", ct); if (ci) q = q.eq("context_id", ci); const { data } = await q.maybeSingle(); if (data) return data; const { data: nd, error } = await sb().from("chat_sessions").insert({ user_id: me.id, context_type: ct || "general", context_id: ci || "", mode: "learning" }).select().single(); if (error) throw error; return nd; },
    async chatHistory(sid) { const { data, error } = await sb().from("chat_messages").select("*").eq("session_id", sid).order("created_at"); if (error) throw error; return data || []; },
    async chatSend(sid, text) { const { error: e1 } = await sb().from("chat_messages").insert({ session_id: sid, role: "user", content: text }); if (e1) throw e1; const reply = "Terima kasih — aku bantu jelaskan langkah pengerjaan tanpa memberi jawaban akhir. Tulis langkah yang sudah kamu coba."; const { error: e2 } = await sb().from("chat_messages").insert({ session_id: sid, role: "assistant", content: reply }); if (e2) throw e2; return reply; },
    async chatSessions(limit = 12) { const { data, error } = await sb().from("chat_sessions").select("*").eq("user_id", this.session().id).order("created_at", { ascending: false }).limit(limit); if (error) throw error; return data || []; },
    async chatNewSession(ct, ci) { const me = this.session(); await sb().from("chat_sessions").update({ is_active: false }).eq("user_id", me.id).eq("is_active", true); const { data, error } = await sb().from("chat_sessions").insert({ user_id: me.id, context_type: ct || "general", context_id: ci || "", mode: "learning", is_active: true }).select().single(); if (error) throw error; return data; },
    async chatOpenSession(sid) { const me = this.session(); await sb().from("chat_sessions").update({ is_active: false }).eq("user_id", me.id).eq("is_active", true); const { data, error } = await sb().from("chat_sessions").update({ is_active: true }).eq("id", sid).select().single(); if (error) throw error; return data; },
    async offlineSaved() { try { const { data } = await sb().from("offline_queue").select("*"); return (data || []).map((q) => q.payload && q.payload.moduleId).filter(Boolean); } catch (_) { return []; } },
    async toggleOffline(mid) { return []; },
    async queueOp(op, payload) { return { id: "tmp", operation: op, payload }; },
    async pendingQueue() { return []; },
    async syncQueue() { return 0; },
    async recommendedModules() { const mods = await this.learningModules({}); return mods.slice(0, 3); },
    async uploadFile(file) {
      if (!file) return "";
      const path = `${this.session().id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await sb().storage.from("report-photos").upload(path, file);
      if (error) throw error;
      const { data } = sb().storage.from("report-photos").getPublicUrl(path);
      return data.publicUrl;
    },
    subscribeNotifications(cb) {
      const me = this.session();
      if (!me) return () => {};
      if (this._realtimeChannel) {
        try { sb().removeChannel(this._realtimeChannel); } catch (_) {}
      }
      const ch = sb()
        .channel("notif-" + me.id)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${me.id}` }, (payload) => {
          const n = payload.new;
          try { cb(n); } catch (_) {}
          try { if (_pendingNotifDedup && _pendingNotifDedup.has(String(n.id || "") + "|" + String(n.created_at || ""))) return; } catch (_) {}
          try { window.dispatchEvent(new CustomEvent("sekolahku:notif", { detail: n })); } catch (_) {}
        })
        .subscribe();
      this._realtimeChannel = ch;
      return () => {
        try { sb().removeChannel(ch); } catch (_) {}
        if (this._realtimeChannel === ch) this._realtimeChannel = null;
      };
    },
  };

  function labelStatus(s) {
    return (
      {
        visual: "Visual",
        audio: "Audio",
        video: "Video",
        quiz: "Kuis",
        game: "Quiz Game",
        case: "Studi Kasus",
        case_study: "Studi Kasus",
        assignment: "Tugas",
        scheduled: "Terjadwal",
        live: "Live",
        ended: "Selesai",
        cancelled: "Batal",
        open: "Buka",
        closed: "Tutup",
        archive: "Arsip",
        pg: "Pilihan Ganda",
        essay: "Essay",
        draft: "Draft",
        published: "Dibuka",
        graded: "Dinilai",
        pending: "Menunggu koreksi",
        submitted: "Dikumpulkan",
        late: "Terlambat",
        returned: "Dikembalikan",
        easy: "Mudah",
        medium: "Sedang",
        hard: "Sulit",
        tugas: "Tugas",
        bimbingan: "Bimbingan",
        kelas: "Kelas",
        zoom: "Zoom Live",
        lain: "Lainnya",
      }[s] || s
    );
  }

  // Bug 1 fix: kalau Supabase aktif tapi Auth belum punya user (mis. akun demo
  // siswa@sekolah.id dkk belum dibuat), login gagal total. Fallback: coba login
  // Supabase dulu, kalau gagal coba akun demo lokal dan alihkan SEMUA operasi
  // ke mock store agar sesi + data konsisten (RLS butuh sesi Supabase).
  let forceMock = false;
  const activeStore = () => (configured() && !forceMock ? remote : mock);
  const backing = {};
  const storeProxy = new Proxy(backing, {
    get(t, prop, receiver) {
      if (prop in t) return Reflect.get(t, prop, receiver);
      const target = activeStore();
      const val = target[prop];
      if (prop === "login" && target === remote) {
        return async (email, password) => {
          try {
            return await remote.login(email, password);
          } catch (e) {
            try {
              const u = await mock.login(email, password);
              forceMock = true;
              try { await remote.logout().catch(() => {}); } catch (_) {}
              return u;
            } catch (_) {
              throw e;
            }
          }
        };
      }
      if (typeof val === "function") return val.bind(target);
      return val;
    },
    set(t, prop, v) {
      t[prop] = v;
      return true;
    },
  });

  window.Store = storeProxy;
  window.Store.isConfigured = configured();
  window.Store.today = today;
  window.Store.label = labelStatus;
})();
