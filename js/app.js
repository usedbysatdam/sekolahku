(() => {
  const root = document.getElementById("root");
  const toastRoot = document.getElementById("toast-root");
  const modalRoot = document.getElementById("modal-root");
  const S = window.Store;
  const ICON = (name, size = 20) => `<i data-lucide="${name}" ${size ? `width="${size}" height="${size}"` : ""}></i>`;

  const routes = {
    siswa: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal Pelajaran", icon: "calendar" },
      { id: "presensi", label: "Presensi Saya", icon: "clipboard-check" },
      { id: "piket", label: "Laporan Piket", icon: "sparkles" },
      { id: "fasilitas", label: "Laporan Fasilitas", icon: "wrench" },
      { id: "notifikasi", label: "Notifikasi", icon: "bell" },
      { id: "profil", label: "Profil", icon: "user" },
    ],
    guru: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal Pelajaran", icon: "calendar" },
      { id: "presensi", label: "Presensi Siswa", icon: "clipboard-check" },
      { id: "piket", label: "Laporan Piket", icon: "sparkles" },
      { id: "fasilitas", label: "Laporan Fasilitas", icon: "wrench" },
      { id: "notifikasi", label: "Notifikasi", icon: "bell" },
      { id: "profil", label: "Profil", icon: "user" },
    ],
    sekolah: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal Pelajaran", icon: "calendar" },
      { id: "fasilitas", label: "Laporan Fasilitas", icon: "wrench" },
      { id: "riwayat", label: "Riwayat Penanganan", icon: "history" },
      { id: "notifikasi", label: "Notifikasi", icon: "bell" },
      { id: "profil", label: "Profil", icon: "user" },
    ],
  };

  let state = {
    view: "landing",
    page: "beranda",
    user: null,
    sidebarOpen: false,
    detailId: null,
    loading: false,
  };

  const toast = (msg, type = "ok") => {
    const el = document.createElement("div");
    el.className = `toast ${type === "error" ? "error" : type === "info" ? "info" : ""}`;
    el.setAttribute("role", "status");
    el.textContent = msg;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };
  window.showAppToast = toast;
  const pushState = () => {
    const p = window.Push && window.Push.permission ? window.Push.permission() : "unsupported";
    const sub = window.Push && window.Push.isSubscribed ? window.Push.isSubscribed() : false;
    const configured = Boolean(window.APP_CONFIG && (window.APP_CONFIG.fcmVapidKey || window.APP_CONFIG.oneSignalAppId));
    return { p, sub, configured };
  };
  const pushBanner = () => {
    const { p, sub, configured } = pushState();
    if (!configured) return "";
    if (p === "denied")
      return `<div class="push-row"><span class="push-status">${ICON("bell-off",14)} Mati</span><button class="link-btn" data-enable-push>Izinkan</button></div>`;
    if (sub)
      return `<div class="push-row"><span class="push-status">${ICON("bell",14)} Hidup</span><button class="link-btn" data-disable-push>Matikan</button></div>`;
    return `<div class="push-row"><span class="push-status">${ICON("bell",14)} Mati</span><button class="link-btn" data-enable-push>Aktifkan</button></div>`;
  };

  const closeSidebar = () => {
    const ov = document.querySelector("[data-close-sidebar]");
    if (ov) ov.classList.remove("show");
    const sb = document.querySelector("#sidebar");
    if (sb) sb.classList.remove("open");
  };

  const onEsc = (e) => {
    if (e.key === "Escape") closeModal();
  };

  const closeModal = () => {
    if (!modalRoot.innerHTML) return;
    modalRoot.innerHTML = "";
    document.removeEventListener("keydown", onEsc);
  };

  const openModal = (html) => {
    closeSidebar();
    modalRoot.innerHTML = `<div class="modal-backdrop" role="dialog" aria-modal="true">${html}</div>`;
    paint();
    bindModal();
    modalRoot.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) closeModal();
    });
    document.removeEventListener("keydown", onEsc);
    document.addEventListener("keydown", onEsc);
    const first = modalRoot.querySelector("input, select, textarea, button");
    if (first) first.focus();
  };

  const paint = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  const initials = (name) =>
    (name || "?")
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  };

  const badge = (key) => {
    const cls = String(key || "").replace(/[^a-z0-9_-]/gi, "_");
    const txt = S.label(key);
    return `<span class="badge badge-${cls}">${esc(txt)}</span>`;
  };

  const userName = (id) => {
    if (state.user && state.user.id === id) return state.user.name;
    return S.reporterName(id);
  };

  async function boot() {
    try {
      if (S.boot) await S.boot();
    } catch (e) {
      console.warn(e);
    }
    const user = S.session();
    if (user) {
      state.user = user;
      state.view = "app";
      hashToState();
    } else {
      hashToState();
    }
    if (window.Push && window.Push.init) {
      window.Push.init().catch(() => {});
    }
    window.addEventListener("sekolahku:notif", async () => {
      try {
        state._notifs = await unwrap(S.notifications());
      } catch (_) {}
      syncNotifBadges();
      if (state.view === "app" && state.page === "notifikasi") hydratePage();
      if (state.view === "app" && state.page === "beranda") hydratePage();
    });
    render();
  }

  function hashToState() {
    const h = (location.hash || "#/").replace(/^#/, "");
    const parts = h.split("/").filter(Boolean);
    if (!parts.length) {
      if (!state.user) state.view = "landing";
      return;
    }
    if (parts[0] === "login") {
      if (state.user) {
        state.view = "app";
        location.hash = "#/app/beranda";
        return;
      }
      state.view = "login";
      return;
    }
    if (parts[0] === "app") {
      if (!state.user) {
        state.view = "login";
        return;
      }
      state.view = "app";
      const page = parts[1] || "beranda";
      const allowed = routes[state.user.role].map((r) => r.id);
      if (!allowed.includes(page) && page !== "detail") {
        state.page = "beranda";
        location.hash = "#/app/beranda";
        return;
      }
      state.page = page;
      state.detailId = parts[2] || null;
    }
  }

  window.addEventListener("hashchange", () => {
    const prev = `${state.view}/${state.page}/${state.detailId}`;
    hashToState();
    const next = `${state.view}/${state.page}/${state.detailId}`;
    if (prev !== next || state.view === "app") render();
  });

  function go(path) {
    location.hash = path;
  }

  function render() {
    state.sidebarOpen = false;
    if (state.view === "landing") {
      root.innerHTML = landing();
    } else if (state.view === "login") {
      root.innerHTML = loginPage();
    } else {
      root.innerHTML = appShell() + (state.user ? bottomNav() : "");
    }
    bind();
    paint();
    if (state.view === "app") hydratePage();
  }

  function bottomNav() {
    const u = state.user;
    return `<nav class="bottom-nav" aria-label="Navigasi bawah">
      ${bottomLinks(u.role)
        .map(
          (n) =>
            `<a href="#/app/${n.id}" data-nav="${n.id}" class="${state.page === n.id ? "active" : ""}">${ICON(n.icon, 18)}${n.short}</a>`
        )
        .join("")}
    </nav>`;
  }

  function landing() {
    return `
      <div class="landing">
        <div class="deco deco-pink" aria-hidden="true"></div>
        <div class="deco deco-purple" aria-hidden="true"></div>
        <div class="deco deco-lime" aria-hidden="true"></div>
        <nav class="landing-nav">
          <a class="brand" href="#/">${ICON("school", 22)} SekolahKu</a>
          <a class="btn btn-yellow" href="#/login">Login</a>
        </nav>
        <section class="landing-hero">
          <div class="hero-card">
            <div>
              <span class="kicker">Untuk siswa, guru, dan sekolah</span>
              <h1>Kelola presensi, piket, dan fasilitas dalam satu tempat.</h1>
              <p class="lead">SekolahKu membantu kelas tetap tertib: catat kehadiran, laporkan piket, dan tindak lanjuti fasilitas rusak tanpa antre kertas.</p>
              <div class="hero-actions">
                <a class="btn btn-pink" href="#/login">Mulai Gunakan Sistem</a>
                <a class="btn" href="#fitur">Lihat Fitur</a>
              </div>
            </div>
            <div class="hero-preview" aria-hidden="true">
              <div class="mini-stat">92% kehadiran</div>
              <div class="mini-stat">8 laporan piket</div>
              <div class="mini-stat">AC XI TKJ 4 · Diproses</div>
            </div>
          </div>
        </section>
        <section class="landing-section" id="tentang">
            <h2>Tentang sistem</h2>
          <div class="card">
            <p>Satu platform dengan akses sesuai peran. Siswa melapor dan memantau, guru mengelola presensi kelas, pihak sekolah menindaklanjuti fasilitas rusak.</p>
          </div>
        </section>
        <section class="landing-section" id="fitur">
          <h2>Fitur utama</h2>
          <div class="feature-grid">
            ${[
              ["clipboard-check", "Presensi siswa", "Guru menandai hadir, izin, sakit, atau alpa. Siswa melihat rekapnya sendiri."],
              ["sparkles", "Laporan piket", "Catat kondisi kelas, siswa bertugas, dan foto dokumentasi."],
              ["wrench", "Laporan fasilitas", "Laporkan AC, lampu, meja, dan kerusakan lain lengkap dengan prioritas."],
              ["bell", "Monitoring perbaikan", "Status jelas dari menunggu hingga selesai, plus notifikasi untuk pelapor."],
            ]
              .map(
                ([icon, t, d]) => `
              <article class="card feature-card">
                ${ICON(icon, 28)}
                <h3>${t}</h3>
                <p>${d}</p>
              </article>`
              )
              .join("")}
          </div>
        </section>
        <section class="landing-section">
          <h2>Cara kerja</h2>
          <div class="step-grid">
            ${["Login", "Pilih aktivitas", "Kirim laporan / presensi", "Data tersimpan", "Tindak lanjut"]
              .map(
                (t, i) => `
              <article class="card step-card">
                <div class="step-num">${i + 1}</div>
                <h3>${t}</h3>
              </article>`
              )
              .join("")}
          </div>
        </section>
        <section class="landing-section">
          <div class="card cta-banner card-lg">
            <h2>Siap merapikan operasional kelas?</h2>
            <p style="margin:12px 0 18px">Masuk sesuai peran Anda dan mulai dari dashboard.</p>
            <a class="btn btn-yellow" href="#/login">Mulai Gunakan Sistem</a>
          </div>
        </section>
        <p class="landing-foot">SekolahKu · Sistem Manajemen Sekolah</p>
      </div>`;
  }

  function loginPage() {
    const demo = !S.isConfigured;
    return `
      <div class="auth-wrap">
        <div class="deco deco-pink" aria-hidden="true"></div>
        <div class="deco deco-purple" aria-hidden="true"></div>
        <div class="auth-card card card-lg">
          <a class="brand" href="#/">${ICON("school", 22)} SekolahKu</a>
          <h1>Masuk</h1>
          <p class="muted">Gunakan email dan kata sandi akun sekolah.</p>
          ${demo ? `<div class="setup-banner">Mode demo aktif. Isi <code>js/config.js</code> dengan URL dan anon key Supabase untuk memakai database nyata.</div>` : ""}
          <form id="login-form" class="field" style="margin-top:16px;gap:14px">
            <div class="field">
              <label for="email">Email / NIS</label>
              <input class="input" id="email" name="email" type="email" autocomplete="username" required />
            </div>
            <div class="field">
              <label for="password">Kata sandi</label>
              <input class="input" id="password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <p class="field-error hidden" id="login-error" role="alert"></p>
            <button class="btn btn-yellow btn-block" type="submit" id="login-btn">Masuk</button>
          </form>
          ${
            demo
              ? `<div class="demo-box">
            <strong>Akun uji</strong>
            <div>Siswa · siswa@sekolah.id / siswa123</div>
            <div>Guru · guru@sekolah.id / guru123</div>
            <div>Sekolah · sekolah@sekolah.id / sekolah123</div>
            <button type="button" class="btn btn-ghost" data-demo="siswa@sekolah.id|siswa123">Siswa</button>
            <button type="button" class="btn btn-ghost" data-demo="guru@sekolah.id|guru123">Guru</button>
            <button type="button" class="btn btn-ghost" data-demo="sekolah@sekolah.id|sekolah123">Sekolah</button>
          </div>`
              : ""
          }
        </div>
      </div>`;
  }

  function appShell() {
    const u = state.user;
    const nav = routes[u.role];
    const unread = (state._notifs || []).filter((n) => !n.is_read).length;
    return `
      <div class="app-shell">
        <div class="sidebar-overlay${state.sidebarOpen ? " show" : ""}" data-close-sidebar></div>
        <aside class="sidebar${state.sidebarOpen ? " open" : ""}" id="sidebar">
          <a class="brand" href="#/app/beranda">${ICON("school", 22)} SekolahKu</a>
          ${nav
            .filter((n) => !["profil", "notifikasi"].includes(n.id))
            .map(
              (n) => `<button class="nav-item${state.page === n.id ? " active" : ""}" data-nav="${n.id}">${ICON(n.icon)} ${n.label}</button>`
            )
            .join("")}
          <div class="nav-spacer"></div>
          <button class="nav-item${state.page === "notifikasi" ? " active" : ""}" data-nav="notifikasi">${ICON("bell")} Notifikasi ${unread ? `<span class="badge badge-alpa">${unread}</span>` : ""}</button>
          <button class="nav-item${state.page === "profil" ? " active" : ""}" data-nav="profil">${ICON("user")} Profil</button>
          <button class="nav-item" data-logout>${ICON("log-out")} Keluar</button>
        </aside>
        <div class="app-main">
          <header class="app-header">
            <div class="header-left">
              <button class="icon-btn" data-open-sidebar aria-label="Buka menu">${ICON("menu")}</button>
              <h2 class="page-title">${pageTitle()}</h2>
            </div>
            <div class="header-right">
              <button class="icon-btn rel" data-nav="notifikasi" aria-label="Notifikasi">
                ${ICON("bell")}
                ${unread ? `<span class="notif-dot" aria-hidden="true"></span>` : ""}
              </button>
              <div class="avatar" title="${u.name}">${u.photo_url ? `<img src="${u.photo_url}" alt="">` : initials(u.name)}</div>
              <strong class="hide-sm">${u.name.split(" ")[0]}</strong>
            </div>
          </header>
          <main id="main" class="page">${spinner()}</main>
        </div>
      </div>`;
  }

  function bottomLinks(role) {
    if (role === "sekolah")
      return [
        { id: "beranda", icon: "home", short: "Home" },
        { id: "jadwal", icon: "calendar", short: "Jadwal" },
        { id: "fasilitas", icon: "wrench", short: "Laporan" },
        { id: "riwayat", icon: "history", short: "Riwayat" },
        { id: "profil", icon: "user", short: "Profil" },
      ];
    return [
      { id: "beranda", icon: "home", short: "Home" },
      { id: "jadwal", icon: "calendar", short: "Jadwal" },
      { id: "presensi", icon: "clipboard-check", short: "Presensi" },
      { id: "piket", icon: "sparkles", short: "Piket" },
      { id: "fasilitas", icon: "wrench", short: "Laporan" },
    ];
  }

  function pageTitle() {
    const all = [...routes.siswa, ...routes.guru, ...routes.sekolah, { id: "detail", label: "Detail Laporan" }];
    return (all.find((r) => r.id === state.page) || { label: "Dashboard" }).label;
  }

  const spinner = () => `<div class="card empty"><p>Memuat…</p></div>`;

  function syncNotifBadges() {
    const unread = (state._notifs || []).filter((n) => !n.is_read).length;
    const headerBtn = document.querySelector('.app-header [data-nav="notifikasi"]');
    if (headerBtn) {
      let dot = headerBtn.querySelector(".notif-dot");
      if (unread && !dot) {
        dot = document.createElement("span");
        dot.className = "notif-dot";
        dot.setAttribute("aria-hidden", "true");
        headerBtn.appendChild(dot);
      } else if (!unread && dot) dot.remove();
    }
    const sideBtn = document.querySelector('.sidebar [data-nav="notifikasi"]');
    if (sideBtn) {
      let b = sideBtn.querySelector(".badge");
      if (unread) {
        if (!b) {
          b = document.createElement("span");
          b.className = "badge badge-alpa";
          sideBtn.appendChild(b);
        }
        b.textContent = unread;
      } else if (b) b.remove();
    }
  }

  async function hydratePage() {
    const main = document.getElementById("main");
    try {
      if (S.loadStudents) await S.loadStudents();
      state._notifs = await unwrap(S.notifications());
      syncNotifBadges();
      const html = await pages[state.page]();
      main.innerHTML = html;
      bindPage();
      paint();
    } catch (e) {
      main.innerHTML = `<div class="card empty"><p>Gagal memuat: ${esc(e.message)}</p></div>`;
    }
  }

  async function unwrap(v) {
    return v && typeof v.then === "function" ? await v : v;
  }

  const pages = {
    async beranda() {
      if (state.user.role === "siswa") return dashSiswa();
      if (state.user.role === "guru") return dashGuru();
      return dashSekolah();
    },
    async presensi() {
      return state.user.role === "guru" ? guruPresensi() : siswaPresensi();
    },
    async jadwal() {
      return jadwalPage();
    },
    async piket() {
      return piketPage();
    },
    async fasilitas() {
      return fasilitasPage();
    },
    async detail() {
      return detailPage();
    },
    async riwayat() {
      return riwayatPage();
    },
    async notifikasi() {
      return notifPage();
    },
    async profil() {
      return profilPage();
    },
  };

  async function dashSiswa() {
    const att = await unwrap(S.attendance({ student_id: state.user.id }));
    const duty = await unwrap(S.dutyReports());
    const fac = await unwrap(S.facilityReports());
    const hadir = att.filter((a) => a.status === "hadir").length;
    const pct = att.length ? Math.round((hadir / att.length) * 100) : 0;
    const aktif = fac.filter((f) => !["selesai", "ditolak"].includes(f.status)).length;
    const selesai = fac.filter((f) => f.status === "selesai").length;
    const latest = [...fac.map((f) => ({ ...f, kind: "fasilitas" })), ...duty.map((d) => ({ ...d, kind: "piket" }))]
      .sort((a, b) => String(b.created_at || b.date).localeCompare(String(a.created_at || a.date)))
      .slice(0, 5);
    const jadwalHariIniHtml = await jadwalHariIni(state.user.class_name);
    return `
      <section class="card hero-dash card-lg">
        <h1>Selamat datang, ${esc(state.user.name.split(" ")[0])}!</h1>
        <p>Pantau aktivitas sekolahmu hari ini.</p>
        <div class="actions-row">
          <button class="btn btn-yellow" data-nav="fasilitas">${ICON("wrench")} Lapor Fasilitas</button>
          <button class="btn" data-nav="piket">${ICON("sparkles")} Laporan Piket</button>
          <button class="btn" data-nav="presensi">${ICON("clipboard-check")} Lihat Presensi</button>
        </div>
      </section>
      <div class="stat-grid">
        <article class="card stat-card stat-yellow"><div class="num">${pct}%</div><div>Kehadiran</div></article>
        <article class="card stat-card stat-lime"><div class="num">${duty.length}</div><div>Piket</div></article>
        <article class="card stat-card stat-purple"><div class="num">${aktif}</div><div>Diproses</div></article>
        <article class="card stat-card stat-green"><div class="num">${selesai}</div><div>Selesai</div></article>
      </div>
      ${jadwalHariIniHtml}
      <section class="card">
        <h2>Aktivitas terbaru</h2>
        ${
          latest.length
            ? latest
                .map((x) =>
                  x.kind === "fasilitas"
                    ? `<div class="list-row"><div><strong>Laporan Fasilitas</strong><div class="muted">${esc(x.facility_name)} · ${esc(x.location)}</div></div>${badge(x.status)}</div>`
                    : `<div class="list-row"><div><strong>Laporan Piket</strong><div class="muted">${esc(x.class_name)} · ${fmtDate(x.date)}</div></div>${badge(x.status)}</div>`
                )
                .join("")
            : empty("Belum ada aktivitas", "Laporan dan presensi akan muncul di sini.")
        }
      </section>`;
  }

  async function dashGuru() {
    const cls = state.user.class_name || S.classes()[0] || "XI TKJ 4";
    const date = S.today();
    const att = await unwrap(S.attendance({ class_name: cls, date }));
    const students = S.students(cls);
    const count = (st) => att.filter((a) => a.status === st).length;
    const duty = await unwrap(S.dutyReports());
    const jadwalHariIniHtml = await jadwalHariIni(cls);
    return `
      <section class="card hero-dash yellow card-lg">
        <h1>Selamat datang, ${esc(state.user.name)}!</h1>
        <p>Kelola presensi dan pantau aktivitas kelas.</p>
        <div class="actions-row">
          <button class="btn btn-pink" data-nav="presensi">${ICON("plus")} Presensi Baru</button>
          <button class="btn" data-nav="piket">Lihat Laporan Piket</button>
          <button class="btn" data-nav="fasilitas">Laporan Fasilitas</button>
          <button class="btn" data-nav="jadwal">${ICON("calendar")} Jadwal Pelajaran</button>
        </div>
      </section>
      <section class="card">
        <h2>Presensi ${esc(cls)}</h2>
        <p class="muted">${fmtDate(date)} · ${students.length} siswa</p>
        <div class="actions-row" style="margin-top:12px">
          <span class="badge badge-hadir">${count("hadir")} Hadir</span>
          <span class="badge badge-izin">${count("izin")} Izin</span>
          <span class="badge badge-sakit">${count("sakit")} Sakit</span>
          <span class="badge badge-alpa">${count("alpa")} Alpa</span>
        </div>
        <button class="btn btn-yellow" style="margin-top:16px" data-nav="presensi">Kelola Presensi</button>
      </section>
      ${jadwalHariIniHtml}
      <section class="card" style="margin-top:16px">
        <h2>Piket terbaru</h2>
        ${
          duty.slice(0, 4)
            .map(
              (d) =>
                `<div class="list-row"><div><strong>${esc(d.class_name)}</strong><div class="muted">${fmtDate(d.date)} · ${S.label(d.condition)}</div></div>${badge(d.status)}</div>`
            )
            .join("") || empty("Belum ada laporan piket", "Laporan siswa akan tampil di sini.")
        }
      </section>`;
  }

  async function dashSekolah() {
    const fac = await unwrap(S.facilityReports());
    const n = (st) => fac.filter((f) => f.status === st).length;
    const months = lastMonths(6);
    const byMonth = months.map((m) => fac.filter((f) => String(f.created_at).startsWith(m.key)).length);
    const max = Math.max(1, ...byMonth);
    const cats = {};
    fac.forEach((f) => (cats[f.category] = (cats[f.category] || 0) + 1));
    return `
      <section class="card hero-dash purple card-lg">
        <span class="eyebrow">Dashboard sekolah</span>
        <h1>Pusat fasilitas sekolah</h1>
        <p>Pantau, proses, dan selesaikan laporan kerusakan.</p>
      </section>
      <div class="stat-grid">
        <article class="card stat-card stat-yellow"><div class="num">${fac.length}</div><div class="label">Total Laporan</div></article>
        <article class="card stat-card stat-orange"><div class="num">${n("menunggu")}</div><div class="label">Menunggu</div></article>
        <article class="card stat-card stat-purple"><div class="num">${n("diproses") + n("perbaikan")}</div><div class="label">Diproses</div></article>
        <article class="card stat-card stat-green"><div class="num">${n("selesai")}</div><div class="label">Selesai</div></article>
      </div>
      <div class="two-col">
        <section class="card">
          <h2>Laporan per bulan</h2>
          <div class="chart-bars" aria-hidden="true">
            ${byMonth.map((v, i) => `<div class="chart-bar" style="height:${Math.round((v / max) * 140) + 8}px"><span>${months[i].label}</span></div>`).join("")}
          </div>
        </section>
        <section class="card">
          <h2>Laporan terbaru</h2>
          ${
            fac.slice(0, 4)
              .map(
                (f) => `
              <div class="list-row">
                <div>
                  <strong>${esc(f.facility_name)} rusak</strong>
                  <div class="muted">${esc(f.location)} · ${badge(f.priority)} ${badge(f.status)}</div>
                </div>
                <button class="btn" data-detail="${f.id}">Detail</button>
              </div>`
              )
              .join("") || empty("Belum ada laporan", "Laporan fasilitas akan masuk ke sini.")
          }
        </section>
      </div>`;
  }

  function lastMonths(n) {
    const out = [];
    const d = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
      out.push({
        key: `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`,
        label: x.toLocaleDateString("id-ID", { month: "short" }),
      });
    }
    return out;
  }

  async function siswaPresensi() {
    const att = await unwrap(S.attendance({ student_id: state.user.id }));
    const hadir = att.filter((a) => a.status === "hadir").length;
    const izin = att.filter((a) => a.status === "izin").length;
    const sakit = att.filter((a) => a.status === "sakit").length;
    const alpa = att.filter((a) => a.status === "alpa").length;
    const pct = att.length ? Math.round((hadir / att.length) * 100) : 0;
    return `
      <h1>Presensi saya</h1>
      <p class="muted">Hanya data kehadiran milik Anda.</p>
      <div class="stat-grid">
        <article class="card stat-card stat-yellow"><div class="num">${pct}%</div><div class="label">Kehadiran</div></article>
        <article class="card stat-card stat-green"><div class="num">${hadir}</div><div class="label">Hadir</div></article>
        <article class="card stat-card stat-orange"><div class="num">${izin}</div><div class="label">Izin</div></article>
        <article class="card stat-card stat-blue"><div class="num">${sakit}</div><div class="label">Sakit</div></article>
      </div>
      <p class="muted" style="margin-bottom:12px">${alpa} alpa tercatat.</p>
      <button class="btn btn-yellow" data-open-rekap-siswa style="margin-top:8px">Rekap Bulanan</button>
      ${renderTable(
        ["Tanggal", "Mapel", "Status", "Catatan"],
        att.map((a) => [fmtDate(a.date), a.subject || "Umum", badge(a.status), a.notes || "—"]),
        att.map((a) => `<div class="card"><strong>${fmtDate(a.date)}</strong><div>${esc(a.subject || "Umum")}</div>${badge(a.status)}</div>`)
      )}`;
  }

  async function guruPresensi() {
    const classes = S.classes().length ? S.classes() : [state.user.class_name || "XI TKJ 4"];
    const date = S.today();
    return `
      <h1>Presensi siswa</h1>
      <p class="muted">${fmtDate(date)}</p>
      <form id="presensi-filter" class="toolbar">
        <div class="field">
          <label for="kelas">Kelas</label>
          <select class="select" id="kelas" name="kelas">${classes.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="tgl">Tanggal</label>
          <input class="input" id="tgl" name="tgl" type="date" value="${date}" />
        </div>
        <div class="field">
          <label for="mapel">Jam / mapel</label>
          <select class="select" id="mapel" name="mapel">
            <option>Jaringan</option><option>PBO</option><option>PKK</option><option>Umum</option>
          </select>
        </div>
        <div class="field" style="align-self:end">
          <button class="btn btn-yellow" type="submit">Tampilkan</button>
        </div>
      </form>
      <div id="presensi-list">${await presensiList(classes[0], date, "Jaringan")}</div>
      <div class="actions-row" style="margin-top:16px">
        <button class="btn btn-yellow" data-open-rekap>Tampilkan Rekap Bulanan</button>
      </div>`;
  }

  async function presensiList(cls, date, subject) {
    const students = S.students(cls);
    const existing = await unwrap(S.attendance({ class_name: cls, date }));
    const byStudent = Object.fromEntries(existing.filter((a) => a.subject === subject).map((a) => [a.student_id, a]));
    if (!students.length) return empty("Belum ada siswa", "Tambahkan profil siswa di database.");
    const statuses = ["hadir", "izin", "sakit", "alpa"];
    const rows = students
      .map((s) => {
        const cur = (byStudent[s.id] && byStudent[s.id].status) || "hadir";
        return `<div class="list-row" data-sid="${s.id}" data-status="${cur}">
          <strong>${esc(s.name)}</strong>
          <div class="chip-row">${statuses
            .map(
              (st) =>
                `<button type="button" class="status-btn badge-${st}${cur === st ? " is-selected" : ""}" data-st="${st}">${S.label(st)}</button>`
            )
            .join("")}</div>
        </div>`;
      })
      .join("");
    return `<section class="card" data-presensi-box data-class="${esc(cls)}" data-date="${date}" data-subject="${esc(subject)}">
      <div class="actions-row">
        <button class="btn" type="button" data-all-hadir>Tandai semua hadir</button>
        <button class="btn btn-green" type="button" data-save-presensi>Simpan presensi</button>
      </div>
      ${rows}
    </section>`;
  }

  async function rekapList(cls, bulan) {
    const students = S.students(cls);
    if (!students.length) return empty("Belum ada siswa", "Tambahkan profil siswa di database.");
    const all = await unwrap(S.attendance({ class_name: cls }));
    const filtered = all.filter((a) => String(a.date).startsWith(bulan));
    if (!filtered.length) return `<p class="muted">Tidak ada data presensi untuk ${esc(bulan)}.</p>`;
    const rows = students.map((s) => {
      const arr = filtered.filter((a) => a.student_id === s.id);
      const c = (st) => arr.filter((a) => a.status === st).length;
      const total = arr.length;
      const pct = total ? Math.round((c("hadir") / total) * 100) : 0;
      return [esc(s.name), String(c("hadir")), String(c("izin")), String(c("sakit")), String(c("alpa")), `${pct}%`];
    });
    const cards = students.map((s) => {
      const arr = filtered.filter((a) => a.student_id === s.id);
      const c = (st) => arr.filter((a) => a.status === st).length;
      const total = arr.length;
      const pct = total ? Math.round((c("hadir") / total) * 100) : 0;
      return `<div class="card"><strong>${esc(s.name)}</strong><div class="muted">${pct}% hadir · ${total} data</div><div class="actions-row" style="margin:8px 0 0">${badge("hadir")} ${c("hadir")} · ${badge("izin")} ${c("izin")} · ${badge("sakit")} ${c("sakit")} · ${badge("alpa")} ${c("alpa")}</div></div>`;
    });
    return renderTable(["Siswa", "Hadir", "Izin", "Sakit", "Alpa", "% Hadir"], rows, cards);
  }

  async function rekapListSiswa(bulan) {
    const list = await unwrap(S.attendance({ student_id: state.user.id }));
    const filtered = list.filter((a) => String(a.date).startsWith(bulan));
    if (!filtered.length) return `<p class="muted">Tidak ada data untuk ${esc(bulan)}.</p>`;
    const c = (st) => filtered.filter((a) => a.status === st).length;
    const pct = filtered.length ? Math.round((c("hadir") / filtered.length) * 100) : 0;
    return `<section class="card"><h3>${esc(state.user.name)} · ${esc(bulan)}</h3><div class="stat-grid" style="margin-top:12px"><article class="card stat-card stat-green"><div class="num">${c("hadir")}</div><div class="label">Hadir</div></article><article class="card stat-card stat-orange"><div class="num">${c("izin")}</div><div class="label">Izin</div></article><article class="card stat-card stat-blue"><div class="num">${c("sakit")}</div><div class="label">Sakit</div></article><article class="card stat-card stat-red"><div class="num">${c("alpa")}</div><div class="label">Alpa</div></article></div><p class="muted">Kehadiran ${pct}%</p></section>`;
  }

  async function piketPage() {
    const list = await unwrap(S.dutyReports());
    const isSiswa = state.user.role === "siswa";
    return `
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:end">
        <div>
          <h1>Laporan piket</h1>
          <p class="muted">${isSiswa ? "Kirim dokumentasi piket kelas." : "Pantau dan periksa laporan piket."}</p>
        </div>
        ${isSiswa ? `<button class="btn btn-yellow" data-open-piket>${ICON("plus")} Buat Laporan</button>` : ""}
      </div>
      <div style="margin-top:16px;">
        ${isSiswa ? `<button class="btn btn-yellow" data-open-piket-schedule>Lihat Jadwal Piket</button>` : ""}
      </div>
      <div style="margin-top:16px;">
        ${
          list.length
            ? list
                .map(
                  (d) => `
            <article class="card" style="margin-bottom:12px">
              <div class="list-row" style="border:0;padding:0">
                <div>
                  <strong>${esc(d.class_name)}</strong>
                  <div class="muted">${fmtDate(d.date)} · ${S.label(d.condition)}</div>
                  <p>${esc(d.activities || "")}</p>
                  ${d.assigned_students && d.assigned_students.length ? `<p class="muted">Bertugas: ${esc((d.assigned_students || []).join(", "))}</p>` : ""}
                </div>
                <div>
                  ${badge(d.status)}
                  ${state.user.role === "guru" && d.status === "belum_diperiksa" ? `<button class="btn" style="margin-top:8px" data-review="${d.id}">Periksa</button>` : ""}
                </div>
              </div>
              ${d.photo_url ? `<img src="${d.photo_url}" alt="Dokumentasi piket ${esc(d.class_name)}" style="margin-top:12px;border-radius:12px;border:3px solid #111;max-height:200px;object-fit:cover">` : ""}
            </article>`
                )
                .join("")
            : empty("Belum ada laporan piket", "Dokumentasi piket akan tampil di sini.", isSiswa ? "piket" : "")
        }
      </div>`;
  }

  function piketForm() {
    return `<div class="modal">
      <h2>Laporan piket</h2>
      <form id="piket-form" class="field" style="gap:12px;margin-top:12px">
        <div class="field"><label for="p-date">Tanggal</label><input class="input" id="p-date" name="date" type="date" value="${S.today()}" required></div>
        <div class="field"><label for="p-class">Kelas</label><input class="input" id="p-class" name="class_name" value="${esc(state.user.class_name || "")}" required></div>
        <div class="field"><label for="p-names">Siswa bertugas</label><input class="input" id="p-names" name="names" placeholder="Ahmad, Budi, Candra" required></div>
        <fieldset class="field" style="border:0;padding:0">
          <legend class="field-label">Kondisi kelas</legend>
          <div class="radio-row">
            ${["sangat_bersih", "bersih", "cukup_bersih", "kotor"]
              .map(
                (c, i) =>
                  `<label class="radio-pill"><input type="radio" name="condition" value="${c}" ${i === 1 ? "checked" : ""}> ${S.label(c)}</label>`
              )
              .join("")}
          </div>
        </fieldset>
        <div class="field"><label for="p-act">Aktivitas</label><textarea class="textarea" id="p-act" name="activities" required placeholder="Membersihkan papan tulis..."></textarea></div>
        <div class="field"><label for="p-notes">Catatan</label><textarea class="textarea" id="p-notes" name="notes"></textarea></div>
        <div class="field"><label for="p-photo">Foto</label><input class="input" id="p-photo" name="photo" type="file" accept="image/*"></div>
        <div class="actions-row">
          <button class="btn btn-yellow" type="submit">Kirim Laporan</button>
          <button class="btn" type="button" data-close-modal>Batal</button>
        </div>
      </form>
    </div>`;
  }

  function openRekap(cls) {
    const bulan = (S.today() || "").slice(0, 7) || new Date().toISOString().slice(0, 7);
    openModal(rekapModal(bulan));
    const input = modalRoot.querySelector("#rekap-bulan");
    paint();
    const refresh = async () => {
      const body = modalRoot.querySelector("#rekap-body");
      const val = input && input.value ? input.value : bulan;
      body.innerHTML = spinner();
      body.innerHTML = state.user.role === "siswa" ? await rekapListSiswa(val) : await rekapList(cls, val);
      paint();
    };
    if (input) input.addEventListener("change", refresh);
    refresh();
  }

  function rekapModal(defaultBulan) {
    return `<div class="modal">
      <h2>Rekap Bulanan</h2>
      <div class="toolbar" style="margin-top:12px">
        <input class="input" id="rekap-bulan" type="month" value="${defaultBulan}" />
      </div>
      <div id="rekap-body" style="margin-top:12px">${spinner()}</div>
      <button class="btn" type="button" data-close-modal>Tutup</button>
    </div>`;
  }

  function piketScheduleModal() {
    const cls = state.user.class_name || "";
    const students = S.students(cls);
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const perDay = Math.ceil((students.length || 1) / days.length) || 1;
    const chunks = days.map((_, i) => students.slice(i * perDay, (i + 1) * perDay));
    return `<div class="modal">
      <h2>Jadwal Piket Mingguan${cls ? ` · ${esc(cls)}` : ""}</h2>
      <p class="muted" style="margin-top:6px">${students.length ? `${students.length} siswa dibagi 5 hari` : "Belum ada data siswa"}</p>
      <div class="piket-grid-mobile">
        ${days.map((h, i) => `<div class="day-card"><div class="day-name">${h}</div><ul class="student-list">${(chunks[i].length ? chunks[i].map((s) => `<li>${esc(s.name)}</li>`).join("") : `<li class="muted">—</li>`)}</ul></div>`).join("")}
      </div>
      <button class="btn" type="button" data-close-modal>Tutup</button>
    </div>`;
  }

  async function fasilitasPage() {
    const list = await unwrap(S.facilityReports());
    const canCreate = state.user.role !== "sekolah";
    const q = state._facQ || { q: "", status: "", priority: "" };
    const filtered = list.filter((f) => {
      const text = `${f.facility_name} ${f.location} ${userName(f.reporter_id)}`.toLowerCase();
      if (q.q && !text.includes(q.q.toLowerCase())) return false;
      if (q.status && f.status !== q.status) return false;
      if (q.priority && f.priority !== q.priority) return false;
      return true;
    });
    return `
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:end">
        <div>
          <h1>Laporan fasilitas</h1>
          <p class="muted">${canCreate ? "Laporkan kerusakan agar segera ditindaklanjuti." : "Kelola seluruh laporan masuk."}</p>
        </div>
        ${canCreate ? `<button class="btn btn-yellow" data-open-fas>${ICON("plus")} Buat Laporan</button>` : ""}
      </div>
      <form id="fac-filter" class="toolbar" style="margin-top:16px">
        <input class="input" name="q" placeholder="Cari laporan, lokasi, pelapor" value="${esc(q.q)}" />
        <select class="select" name="status">
          <option value="">Semua status</option>
          ${["menunggu", "diproses", "perbaikan", "selesai", "ditolak"].map((s) => `<option value="${s}" ${q.status === s ? "selected" : ""}>${S.label(s)}</option>`).join("")}
        </select>
        <select class="select" name="priority">
          <option value="">Semua prioritas</option>
          ${["rendah", "sedang", "tinggi", "darurat"].map((s) => `<option value="${s}" ${q.priority === s ? "selected" : ""}>${S.label(s)}</option>`).join("")}
        </select>
        <button class="btn" type="submit">Filter</button>
      </form>
      ${
        filtered.length
          ? renderTable(
              ["Laporan", "Lokasi", "Pelapor", "Prioritas", "Status"],
              filtered.map((f) => [
                `<button class="btn" data-detail="${f.id}" style="min-height:36px">${esc(f.facility_name)}</button>`,
                esc(f.location),
                esc(userName(f.reporter_id)),
                badge(f.priority),
                badge(f.status),
              ]),
              filtered.map(
                (f) => `<article class="card"><strong>${esc(f.facility_name)}</strong><div class="muted">${esc(f.location)} · ${esc(userName(f.reporter_id))}</div><div style="margin-top:8px">${badge(f.priority)} ${badge(f.status)}</div><button class="btn" style="margin-top:10px" data-detail="${f.id}">Lihat Detail</button></article>`
              )
            )
          : empty("Belum ada laporan", "Belum ada laporan fasilitas yang tersedia.", canCreate ? "fasilitas" : "")
      }`;
  }

  function fasilitasForm() {
    return `<div class="modal">
      <h2>Laporkan fasilitas rusak</h2>
      <form id="fas-form" class="field" style="gap:12px;margin-top:12px">
        <div class="field"><label for="f-name">Nama fasilitas</label>
          <select class="select" id="f-name" name="facility_name" required>
            ${["AC", "Meja", "Kursi", "Proyektor", "Lampu", "Pintu", "Jendela"].map((n) => `<option>${n}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="f-loc">Lokasi</label><input class="input" id="f-loc" name="location" placeholder="XI TKJ 4" required></div>
        <div class="field"><label for="f-cat">Kategori</label>
          <select class="select" id="f-cat" name="category">
            <option>Elektronik</option><option>Furnitur</option><option>Bangunan</option><option>Lainnya</option>
          </select>
        </div>
        <div class="field"><label for="f-prio">Prioritas</label>
          <select class="select" id="f-prio" name="priority">
            ${["rendah", "sedang", "tinggi", "darurat"].map((p) => `<option value="${p}">${S.label(p)}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="f-desc">Deskripsi</label><textarea class="textarea" id="f-desc" name="description" required placeholder="AC tidak dingin sejak pagi..."></textarea></div>
        <div class="field"><label for="f-photo">Foto kerusakan</label><input class="input" id="f-photo" name="photo" type="file" accept="image/*"></div>
        <div class="actions-row">
          <button class="btn btn-yellow" type="submit">Kirim Laporan</button>
          <button class="btn" type="button" data-close-modal>Batal</button>
        </div>
      </form>
    </div>`;
  }

  async function detailPage() {
    const f = await unwrap(S.facilityById(state.detailId));
    if (!f) return empty("Laporan tidak ditemukan", "Kembali ke daftar laporan.");
    const hist = await unwrap(S.history(f.id));
    const canEdit = state.user.role === "sekolah";
    return `
      <button class="btn" data-nav="fasilitas">${ICON("arrow-left")} Kembali</button>
      <div class="two-col" style="margin-top:16px">
        <div class="photo-frame">${f.photo_url ? `<img src="${f.photo_url}" alt="Foto kerusakan ${esc(f.facility_name)}">` : `<p class="muted">Tidak ada foto</p>`}</div>
        <section class="card">
          <h1>${esc(f.facility_name)} rusak</h1>
          <p class="muted">${esc(f.location)}</p>
          <div class="actions-row">${badge(f.priority)} ${badge(f.status)}</div>
          <p><strong>Pelapor:</strong> ${esc(userName(f.reporter_id))}</p>
          <p><strong>Kategori:</strong> ${esc(f.category)}</p>
          <p><strong>Tanggal:</strong> ${fmtDate(f.created_at)}</p>
          <p style="margin-top:8px">${esc(f.description || "")}</p>
          ${f.handling_notes ? `<p><strong>Catatan penanganan:</strong> ${esc(f.handling_notes)}</p>` : ""}
          ${
            canEdit
              ? `<form id="status-form" class="field" style="margin-top:16px;gap:10px">
                  <label for="new-status">Ubah status</label>
                  <select class="select" id="new-status" name="status">${["menunggu", "diproses", "perbaikan", "selesai", "ditolak"].map((s) => `<option value="${s}" ${f.status === s ? "selected" : ""}>${S.label(s)}</option>`).join("")}</select>
                  <label for="notes">Catatan penanganan</label>
                  <textarea class="textarea" id="notes" name="handling_notes">${esc(f.handling_notes || "")}</textarea>
                  <button class="btn btn-purple" type="submit">Simpan status</button>
                </form>`
              : ""
          }
        </section>
      </div>
      <section class="card" style="margin-top:16px">
        <h2>Riwayat penanganan</h2>
        ${
          hist.length
            ? hist.map((h) => `<div class="list-row"><div>${badge(h.old_status || "menunggu")} → ${badge(h.new_status)}<div class="muted">${fmtDate(h.created_at)} · ${esc(h.notes || "")}</div></div></div>`).join("")
            : `<p class="muted">Belum ada perubahan status.</p>`
        }
      </section>`;
  }

  const DAYS = [
    ["senin", "Senin"],
    ["selasa", "Selasa"],
    ["rabu", "Rabu"],
    ["kamis", "Kamis"],
    ["jumat", "Jumat"],
  ];

  async function jadwalHariIni(cls) {
    const list = await unwrap(S.todaySchedule(cls));
    const dayLabel = new Date().toLocaleDateString("id-ID", { weekday: "long" });
    return `
      <section class="card" style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:end">
          <div>
            <h2>Jadwal hari ini</h2>
            <p class="muted">${esc(cls)} · ${esc(dayLabel)}</p>
          </div>
          <button class="btn" data-nav="jadwal">Lihat Semua</button>
        </div>
        <div style="margin-top:12px">
          ${
            list.length
              ? list
                  .map(
                    (s) => `<div class="list-row"><div><strong>${esc(s.time_start)}–${esc(s.time_end)} · ${esc(s.subject)}</strong><div class="muted">${esc(s.teacher_name)}${s.room ? ` · Ruang ${esc(s.room)}` : ""}</div></div></div>`
                  )
                  .join("")
              : `<p class="muted">Tidak ada jadwal hari ini.</p>`
          }
        </div>
      </section>`;
  }

  async function jadwalPage() {
    const isSiswa = state.user.role === "siswa";
    const classes = isSiswa ? [] : S.classes();
    const sel = isSiswa ? state.user.class_name : state._jadwalQ?.kelas || state.user.class_name || classes[0] || "";
    const all = sel ? await unwrap(S.schedules(sel)) : [];
    const byDay = Object.fromEntries(DAYS.map(([k]) => [k, []]));
    all.forEach((s) => {
      if (byDay[s.day]) byDay[s.day].push(s);
    });
    Object.values(byDay).forEach((arr) => arr.sort((a, b) => String(a.time_start).localeCompare(String(b.time_start))));
    return `
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:end">
        <div>
          <h1>Jadwal pelajaran</h1>
          <p class="muted">${isSiswa ? `Kelas ${esc(sel)} · Senin sampai Jumat.` : "Jadwal Senin sampai Jumat per kelas."}</p>
        </div>
      </div>
      ${
        isSiswa
          ? ""
          : `<form id="jadwal-filter" class="toolbar" style="margin-top:16px">
        <div class="field">
          <label for="jadwal-kelas">Kelas</label>
          <select class="select" id="jadwal-kelas" name="kelas">${classes.map((c) => `<option${c === sel ? " selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div>
        <div class="field" style="align-self:end">
          <button class="btn btn-yellow" type="submit">Tampilkan</button>
        </div>
      </form>`
      }
      ${
        sel && all.length
          ? `<div class="piket-grid">
              ${DAYS.map(
                ([key, label]) => `
                <div class="day-card">
                  <div class="day-name">${label}</div>
                  ${
                    byDay[key].length
                      ? `<ul class="student-list">${byDay[key]
                          .map(
                            (s) => `<li><strong>${esc(s.time_start)}–${esc(s.time_end)}</strong><br>${esc(s.subject)}<br><span class="muted">${esc(s.teacher_name)}${s.room ? ` · ${esc(s.room)}` : ""}</span></li>`
                          )
                          .join("")}</ul>`
                      : `<p class="muted" style="font-size:12px">Libur / kosong</p>`
                  }
                </div>`
              ).join("")}
            </div>`
          : empty("Belum ada jadwal", sel ? `Jadwal kelas ${esc(sel)} belum tersedia.` : "Pilih kelas untuk melihat jadwal.")
      }`;
  }

  async function riwayatPage() {
    const hist = await unwrap(S.history());
    const fac = await unwrap(S.facilityReports());
    const map = Object.fromEntries(fac.map((f) => [f.id, f]));
    return `
      <h1>Riwayat penanganan</h1>
      ${
        hist.length
          ? hist
              .map((h) => {
                const f = map[h.report_id];
                return `<div class="card" style="margin-bottom:10px"><strong>${esc(f ? f.facility_name : "Laporan")}</strong> · ${esc(f ? f.location : "")}<div>${badge(h.old_status || "menunggu")} → ${badge(h.new_status)}</div><p class="muted">${fmtDate(h.created_at)} · ${esc(h.notes || "")}</p></div>`;
              })
              .join("")
          : empty("Belum ada riwayat", "Perubahan status laporan akan tercatat di sini.")
      }`;
  }

  async function notifPage() {
    const list = await unwrap(S.notifications());
    state._notifs = list;
    return `
      ${pushBanner()}
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <h1>Notifikasi</h1>
        <button class="btn" data-read-all>Tandai semua dibaca</button>
      </div>
      ${
        list.length
          ? list
              .map(
                (n) => `<article class="card" style="margin-top:12px;opacity:${n.is_read ? 0.7 : 1}">
            <div class="list-row" style="border:0;padding:0">
              <div><strong>${esc(n.title)}</strong><p>${esc(n.message)}</p><p class="muted">${fmtDate(n.created_at)}</p></div>
              ${n.is_read ? "" : `<button class="btn" data-read="${n.id}">Sudah dibaca</button>`}
            </div>
          </article>`
              )
              .join("")
          : empty("Tidak ada notifikasi", "Pembaruan penting akan muncul di sini.")
      }`;
  }

  function profilPage() {
    const u = state.user;
    return `
      <h1>Profil</h1>
      ${pushBanner()}
      <div class="two-col" style="margin-top:16px">
        <section class="card">
          <div class="avatar" style="width:72px;height:72px;font-size:24px;margin-bottom:12px">${u.photo_url ? `<img src="${u.photo_url}" alt="">` : initials(u.name)}</div>
          <p><strong>${esc(u.name)}</strong></p>
          <p class="muted">${esc(u.role === "sekolah" ? "Pihak Sekolah" : u.role === "guru" ? "Guru" : "Siswa")}</p>
          <form id="profil-form" class="field" style="gap:12px;margin-top:16px">
            <div class="field"><label for="nm">Nama</label><input class="input" id="nm" name="name" value="${esc(u.name)}" required></div>
            <div class="field"><label for="em">Email</label><input class="input" id="em" name="email" type="email" value="${esc(u.email)}" required></div>
            <div class="field"><label for="nis">NIS / NIP</label><input class="input" id="nis" name="nis_nip" value="${esc(u.nis_nip || "")}"></div>
            <div class="field"><label for="kls">${u.role === "siswa" ? "Kelas" : "Kelas / jabatan"}</label><input class="input" id="kls" name="class_name" value="${esc(u.class_name || "")}"></div>
            <div class="field"><label for="hp">Nomor HP</label><input class="input" id="hp" name="phone" value="${esc(u.phone || "")}"></div>
            <button class="btn btn-yellow" type="submit">Simpan profil</button>
          </form>
        </section>
        <section class="card">
          <h2>Ubah kata sandi</h2>
          <form id="pw-form" class="field" style="gap:12px;margin-top:12px">
            <div class="field"><label for="old">Kata sandi lama</label><input class="input" id="old" name="old" type="password" autocomplete="current-password" required></div>
            <div class="field"><label for="nw">Kata sandi baru</label><input class="input" id="nw" name="nw" type="password" autocomplete="new-password" required minlength="6"></div>
            <button class="btn" type="submit">Ubah kata sandi</button>
          </form>
          <button class="btn btn-red" style="margin-top:24px" data-logout>Keluar</button>
        </section>
      </div>`;
  }

  function empty(title, desc, cta) {
    const btn =
      cta === "piket"
        ? `<button class="btn btn-yellow" style="margin-top:12px" data-open-piket>Buat Laporan</button>`
        : cta === "fasilitas"
          ? `<button class="btn btn-yellow" style="margin-top:12px" data-open-fas>Buat Laporan</button>`
          : "";
    return `<div class="card empty">
      ${ICON("clipboard", 40)}
      <h2 style="margin:8px 0">${title}</h2>
      <p class="muted">${desc}</p>
      ${btn}
    </div>`;
  }

  function renderTable(headers, rows, cards) {
    return `<div class="table-wrap"><table class="data">
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <div class="mobile-cards">${(cards || []).join("")}</div>`;
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bind() {
    root.querySelectorAll("[data-nav]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const sb = document.querySelector("#sidebar");
        if (sb) sb.classList.remove("open");
        const ov = document.querySelector("[data-close-sidebar]");
        if (ov) ov.classList.remove("show");
        go(`/app/${el.dataset.nav}`);
      })
    );
    root.querySelectorAll("[data-logout]").forEach((el) =>
      el.addEventListener("click", async () => {
        await S.logout();
        state.user = null;
        state.view = "landing";
        go("/");
        render();
      })
    );
    const open = root.querySelector("[data-open-sidebar]");
    const overlay = root.querySelector("[data-close-sidebar]");
    const side = root.querySelector("#sidebar");
    if (open)
      open.addEventListener("click", () => {
        side.classList.add("open");
        overlay.classList.add("show");
      });
    if (overlay)
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          side.classList.remove("open");
          overlay.classList.remove("show");
        }
      });

    const form = root.querySelector("#login-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;
        const err = root.querySelector("#login-error");
        const btn = root.querySelector("#login-btn");
        btn.disabled = true;
        try {
          state.user = await S.login(email, password);
          toast("Berhasil masuk");
          go("/app/beranda");
          state.view = "app";
          state.page = "beranda";
          render();
        } catch (ex) {
          err.textContent = ex.message;
          err.classList.remove("hidden");
        } finally {
          btn.disabled = false;
        }
      });
      root.querySelectorAll("[data-demo]").forEach((b) =>
        b.addEventListener("click", () => {
          const [e, p] = b.dataset.demo.split("|");
          form.email.value = e;
          form.password.value = p;
          form.requestSubmit();
        })
      );
    }
  }

  function bindPage() {
    const main = document.getElementById("main");
    main.querySelectorAll("[data-nav]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const sb = document.querySelector("#sidebar");
        if (sb) sb.classList.remove("open");
        const ov = document.querySelector("[data-close-sidebar]");
        if (ov) ov.classList.remove("show");
        go(`/app/${el.dataset.nav}`);
      })
    );
    main.querySelectorAll("[data-detail]").forEach((el) =>
      el.addEventListener("click", () => {
        state.detailId = el.dataset.detail;
        go(`/app/detail/${el.dataset.detail}`);
      })
    );
    main.querySelectorAll("[data-logout]").forEach((el) =>
      el.addEventListener("click", async () => {
        await S.logout();
        state.user = null;
        go("/");
        render();
      })
    );
    main.querySelectorAll("[data-open-piket]").forEach((el) => el.addEventListener("click", () => openModal(piketForm())));
    main.querySelectorAll("[data-open-fas]").forEach((el) => el.addEventListener("click", () => openModal(fasilitasForm())));
    main.querySelectorAll("[data-open-piket-schedule]").forEach((el) => el.addEventListener("click", () => openModal(piketScheduleModal())));

    main.querySelectorAll("[data-open-rekap]").forEach((el) => el.addEventListener("click", () => openRekap(state.user.class_name)));
    main.querySelectorAll("[data-open-rekap-siswa]").forEach((el) => el.addEventListener("click", () => openRekap(state.user.class_name)));

    const jd = main.querySelector("#jadwal-filter");
    if (jd)
      jd.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(jd);
        state._jadwalQ = { kelas: fd.get("kelas") };
        hydratePage();
      });

    const facFilter = main.querySelector("#fac-filter");
    if (facFilter)
      facFilter.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(facFilter);
        state._facQ = { q: fd.get("q"), status: fd.get("status"), priority: fd.get("priority") };
        hydratePage();
      });

    const statusForm = main.querySelector("#status-form");
    if (statusForm)
      statusForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(statusForm);
        try {
          await unwrap(S.updateFacility(state.detailId, { status: fd.get("status"), handling_notes: fd.get("handling_notes") }));
          toast("Status diperbarui");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });

    main.querySelectorAll("[data-review]").forEach((b) =>
      b.addEventListener("click", async () => {
        await unwrap(S.reviewDuty(b.dataset.review));
        toast("Laporan piket diperiksa");
        hydratePage();
      })
    );

    main.querySelectorAll("[data-read]").forEach((b) =>
      b.addEventListener("click", async () => {
        await unwrap(S.markRead(b.dataset.read));
        hydratePage();
      })
    );
    const readAll = main.querySelector("[data-read-all]");
    if (readAll)
      readAll.addEventListener("click", async () => {
        await unwrap(S.markAllRead());
        hydratePage();
      });

    const profil = main.querySelector("#profil-form");
    if (profil)
      profil.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(profil);
        try {
          state.user = await S.updateProfile({
            name: fd.get("name"),
            email: fd.get("email"),
            nis_nip: fd.get("nis_nip"),
            class_name: fd.get("class_name"),
            phone: fd.get("phone"),
          });
          toast("Profil disimpan");
          render();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
    const pw = main.querySelector("#pw-form");
    if (pw)
      pw.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          await S.changePassword(pw.old.value, pw.nw.value);
          toast("Kata sandi diubah");
          pw.reset();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });

    const pf = main.querySelector("#presensi-filter");
    if (pf)
      pf.addEventListener("submit", async (e) => {
        e.preventDefault();
        const box = main.querySelector("#presensi-list");
        box.innerHTML = spinner();
        box.innerHTML = await presensiList(pf.kelas.value, pf.tgl.value, pf.mapel.value);
        bindPresensi(box);
        paint();
      });

    main.querySelectorAll("[data-enable-push]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          await window.Push?.subscribe?.();
        } catch (e) {
          toast(e.message || "Gagal", "error");
        } finally {
          btn.disabled = false;
          hydratePage();
        }
      })
    );

    main.querySelectorAll("[data-disable-push]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          await window.Push?.unsubscribe?.();
          toast("Notifikasi HP dinonaktifkan", "info");
        } finally {
          btn.disabled = false;
          hydratePage();
        }
      })
    );

    bindPresensi(main);
  }

  function bindModal() {
    modalRoot.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", closeModal));
    const piketF = modalRoot.querySelector("#piket-form");
    if (piketF)
      piketF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(piketF);
        const btn = piketF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          const photo = piketF.photo.files[0];
          const photo_url = await S.uploadPhoto(photo);
          await unwrap(
            S.createDuty({
              date: fd.get("date"),
              class_name: fd.get("class_name"),
              assigned_students: String(fd.get("names"))
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              condition: fd.get("condition"),
              activities: fd.get("activities"),
              notes: fd.get("notes"),
              photo_url,
            })
          );
          closeModal();
          toast("Laporan piket berhasil dikirim");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const fasF = modalRoot.querySelector("#fas-form");
    if (fasF)
      fasF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(fasF);
        const btn = fasF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          const photo = fasF.photo.files[0];
          const photo_url = await S.uploadPhoto(photo);
          await unwrap(
            S.createFacility({
              facility_name: fd.get("facility_name"),
              location: fd.get("location"),
              category: fd.get("category"),
              priority: fd.get("priority"),
              description: fd.get("description"),
              photo_url,
            })
          );
          closeModal();
          toast("Laporan berhasil dikirim");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
  }

  function bindPresensi(scope) {
    const box = scope.querySelector("[data-presensi-box]");
    if (!box) return;
    box.querySelectorAll(".list-row").forEach((row) => {
      row.querySelectorAll("[data-st]").forEach((btn) =>
        btn.addEventListener("click", () => {
          row.querySelectorAll("[data-st]").forEach((b) => b.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          row.dataset.status = btn.dataset.st;
        })
      );
    });
    const all = box.querySelector("[data-all-hadir]");
    if (all)
      all.addEventListener("click", () => {
        box.querySelectorAll(".list-row").forEach((row) => {
          const btn = row.querySelector('[data-st="hadir"]');
          if (btn) btn.click();
        });
      });
    const save = box.querySelector("[data-save-presensi]");
    if (save)
      save.addEventListener("click", async () => {
        const records = [...box.querySelectorAll(".list-row")].map((row) => ({
          student_id: row.dataset.sid,
          class_name: box.dataset.class,
          date: box.dataset.date,
          subject: box.dataset.subject,
          status: row.dataset.status || "hadir",
          notes: "",
        }));
        try {
          await unwrap(S.saveAttendance(records));
          toast("Presensi tersimpan");
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
  }

  boot();
})();
