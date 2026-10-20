(() => {
  const root = document.getElementById("root");
  const toastRoot = document.getElementById("toast-root");
  const modalRoot = document.getElementById("modal-root");
  const S = window.Store;
  const ICON = (name, size = 20) =>
    `<i data-lucide="${name}" ${size ? `width="${size}" height="${size}"` : ""}></i>`;

  const routes = {
    siswa: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal", icon: "calendar" },
      { id: "materi", label: "Progres Belajar", icon: "book-open" },
      { id: "quiz", label: "Quiz", icon: "help-circle" },
      { id: "tugas", label: "Tugas", icon: "file-text" },
      { id: "komunitas", label: "Komunitas", icon: "users" },
      { id: "lomba", label: "Info Lomba", icon: "trophy" },
      { id: "notifikasi", label: "Notifikasi", icon: "bell" },
      { id: "profil", label: "Profil", icon: "user" },
    ],
    guru: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal", icon: "calendar" },
      { id: "materi", label: "Progres Belajar", icon: "book-open" },
      { id: "quiz", label: "Quiz", icon: "help-circle" },
      { id: "tugas", label: "Tugas", icon: "file-text" },
      { id: "komunitas", label: "Komunitas", icon: "users" },
      { id: "lomba", label: "Info Lomba", icon: "trophy" },
      { id: "notifikasi", label: "Notifikasi", icon: "bell" },
      { id: "profil", label: "Profil", icon: "user" },
    ],
    sekolah: [
      { id: "beranda", label: "Dashboard", icon: "layout-dashboard" },
      { id: "jadwal", label: "Jadwal", icon: "calendar" },
      { id: "materi", label: "Progres Belajar", icon: "book-open" },
      { id: "quiz", label: "Quiz", icon: "help-circle" },
      { id: "tugas", label: "Tugas", icon: "file-text" },
      { id: "komunitas", label: "Komunitas", icon: "users" },
      { id: "lomba", label: "Info Lomba", icon: "trophy" },
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
    _quizQ: { q: "", tipe: "" },
    _jadwal: {
      view: "grid",
      date: new Date().toISOString().slice(0, 10),
      student_id: "",
    },
    _onboarding: false,
    _wallet: null,
    _streak: null,
    _progress: null,
    _recommended: null,
    _tugasQ: { q: "", status: "", type: "" },
    _materiSec: null,
    _matMod: null,
    _tocOpen: false,
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
    const p =
      window.Push && window.Push.permission
        ? window.Push.permission()
        : "unsupported";
    const sub =
      window.Push && window.Push.isSubscribed
        ? window.Push.isSubscribed()
        : false;
    const configured = Boolean(
      window.APP_CONFIG &&
      (window.APP_CONFIG.fcmVapidKey || window.APP_CONFIG.oneSignalAppId),
    );
    return { p, sub, configured };
  };
  const pushBanner = () => {
    const { p, sub, configured } = pushState();
    if (!configured) return "";
    if (p === "denied")
      return `<div class="push-row"><span class="push-status">${ICON("bell-off", 14)} Mati</span><button class="link-btn" data-enable-push>Izinkan</button></div>`;
    if (sub)
      return `<div class="push-row"><span class="push-status">${ICON("bell", 14)} Hidup</span><button class="link-btn" data-disable-push>Matikan</button></div>`;
    return `<div class="push-row"><span class="push-status">${ICON("bell", 14)} Mati</span><button class="link-btn" data-enable-push>Aktifkan</button></div>`;
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
    modalRoot
      .querySelector(".modal-backdrop")
      .addEventListener("click", (e) => {
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
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
    window.addEventListener("online", async () => {
      if (S.syncQueue)
        try {
          const n = await unwrap(S.syncQueue());
          if (n) toast(`${n} aktivitas offline tersinkron`);
          hydratePage();
        } catch (_) {}
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
    if (parts[0] === "baru" || parts[0] === "kontak") {
      state.view = parts[0];
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
      if (!allowed.includes(page) && page !== "detail" && page !== "ecgames") {
        state.page = "beranda";
        location.hash = "#/app/beranda";
        return;
      }
      state.page = page;
      state.detailId = parts[2] || null;
    }
    if (parts[0] === "ecgames") {
      if (!state.user) {
        state.view = "login";
        return;
      }
      state.view = "app";
      state.page = "ecgames";
      state.detailId = parts[1] || null;
    }
  }

  window.addEventListener("hashchange", () => {
    const prev = `${state.view}/${state.page}/${state.detailId}`;
    hashToState();
    const next = `${state.view}/${state.page}/${state.detailId}`;
    if (prev !== next || state.view === "app") render();
  });

  document.addEventListener("mousedown", (e) => {
    const wrap = document.querySelector("[data-sm-wrap].open");
    if (!wrap) return;
    const panel = wrap.querySelector("[data-sm-panel]");
    const toggle = wrap.querySelector("[data-sm-toggle]");
    if (
      (panel && panel.contains(e.target)) ||
      (toggle && toggle.contains(e.target))
    )
      return;
    closeStaggeredMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeStaggeredMenu();
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
    } else if (state.view === "baru") {
      root.innerHTML = whatsNewPage();
    } else if (state.view === "kontak") {
      root.innerHTML = contactPage();
    } else {
      const hideBot = state.page === "materi" && !state.detailId;
      root.innerHTML =
        appShell() +
        (state.user ? bottomNav() : "") +
        (hideBot ? "" : botFAB());
    }
    const gameEl = document.getElementById("ecgames-root");
    const gameActive = state.view === "app" && state.page === "ecgames";
    if (gameEl) gameEl.classList.toggle("hidden", !gameActive);
    if (window.ECGames) {
      try {
        if (gameActive)
          window.ECGames.enter(
            state.detailId || "",
            state.user
              ? {
                  name: state.user.name,
                  role: state.user.role,
                  class_name: state.user.class_name,
                  photo_url: state.user.photo_url,
                }
              : null,
          );
        else window.ECGames.leave();
      } catch (e) {
        console.error("ECGames:", e);
      }
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
            `<a href="#/app/${n.id}" data-nav="${n.id}" class="${state.page === n.id ? "active" : ""}">${ICON(n.icon, 18)}${n.short}</a>`,
        )
        .join("")}
    </nav>`;
  }

  const botTime = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  function botMsgHtml(who, text, hr) {
    const av =
      who === "bot"
        ? `<div class="bot-msg-av">${ICON("sparkles", 14)}</div>`
        : "";
    const acts =
      who === "bot"
        ? `<div class="bot-acts"><button type="button" class="bot-act" data-bot-copy aria-label="Salin balasan" title="Salin">${ICON("copy", 13)}</button><button type="button" class="bot-act" data-bot-like aria-label="Bermanfaat" title="Bermanfaat">${ICON("thumbs-up", 13)}</button><button type="button" class="bot-act" data-bot-dislike aria-label="Kurang membantu" title="Kurang membantu">${ICON("thumbs-down", 13)}</button><button type="button" class="bot-act" data-bot-regen aria-label="Susun ulang" title="Susun ulang">${ICON("refresh-cw", 13)}</button></div>`
        : "";
    return `<div class="bot-msg ${who}">${av}<div class="bot-msg-col"><div class="bubble">${esc(text)}</div>${acts}<span class="meta">${hr}</span></div></div>`;
  }
  function botWelcomeHtml() {
    return `<div class="bot-welcome" data-bot-welcome>${botMsgHtml("bot", "Halo! Saya asisten belajar SekolahKu. Tanyakan apa saja tentang materi, quiz, atau tugas — aku bantu arahkan tanpa memberi jawaban akhir.", "Baru saja")}<div class="bot-chips" role="group" aria-label="Saran cepat" data-bot-chips>${["Quiz terbaru", "Zoom hari ini", "Info lomba"].map((c) => `<button type="button" class="chip-mini" data-chip>${esc(c)}</button>`).join("")}</div></div>`;
  }
  function botFAB() {
    return `<div class="bot-root" aria-live="polite"><button class="bot-fab" data-bot-toggle aria-label="Buka bantuan">${ICON("message-circle", 22)}</button><div class="bot-overlay" data-bot-overlay aria-hidden="true"></div><section class="bot-panel" data-bot-panel aria-hidden="true" role="dialog" aria-label="Belajar dengan AI">
      <header class="bot-head">
        <div class="bot-head-left"><div class="bot-avatar">${ICON("sparkles", 17)}</div><div><div class="bot-title">Belajar dengan AI</div><div class="bot-sub">Asisten belajar · balas cepat</div></div></div>
        <div class="bot-head-actions"><button type="button" class="bot-tool" data-bot-full aria-label="Layar penuh" title="Layar penuh">${ICON("maximize-2", 14)}<span>Layar Penuh</span></button><button type="button" class="bot-close" data-bot-close aria-label="Tutup">${ICON("x", 16)}</button></div>
      </header>
      <div class="bot-main">
        <aside class="bot-rail" aria-label="Riwayat obrolan">
          <button type="button" class="bot-new" data-bot-new>${ICON("plus", 14)} Obrolan baru</button>
          <div class="bot-rail-label">Riwayat</div>
          <div class="bot-hist" data-bot-hist></div>
          <div class="bot-prog"><div class="bot-prog-top"><span>Progres belajar</span><strong data-bot-pct>–</strong></div><div class="bot-prog-bar" role="progressbar" aria-label="Progres belajar" aria-valuemin="0" aria-valuemax="100"><div class="bot-prog-fill" data-bot-fill></div></div></div>
        </aside>
        <div class="bot-chat">
          <div class="bot-body" data-bot-body role="log" aria-live="polite">${botWelcomeHtml()}</div>
          <form class="bot-foot" data-bot-form aria-label="Ketik pesan"><div class="bot-input-box"><input class="input" name="q" data-bot-input placeholder="Tanyakan apa saja tentang materi…" autocomplete="off" aria-label="Pesan" /><button class="bot-send" type="submit" aria-label="Kirim">${ICON("arrow-up", 16)}</button></div></form>
          <div class="bot-note">AI bisa membuat kesalahan. Periksa kembali jawaban dan verifikasi di modul materi.</div>
        </div>
      </div>
    </section></div>`;
  }
  function botAct(btn) {
    const col = btn.closest(".bot-msg-col");
    const bubble = col ? col.querySelector(".bubble") : null;
    const text = bubble ? bubble.textContent : "";
    if (btn.hasAttribute("data-bot-copy")) {
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(text).then(
          () => toast("Balasan disalin"),
          () => toast("Gagal menyalin", "error"),
        );
      else toast("Gagal menyalin", "error");
      return;
    }
    if (
      btn.hasAttribute("data-bot-like") ||
      btn.hasAttribute("data-bot-dislike")
    ) {
      const was = btn.classList.contains("on");
      btn.parentElement
        ?.querySelectorAll("[data-bot-like],[data-bot-dislike]")
        .forEach((b) => b.classList.remove("on"));
      btn.classList.toggle("on", !was);
      btn.setAttribute("aria-pressed", String(!was));
      if (!was) toast("Terima kasih atas masukannya!");
      return;
    }
    if (btn.hasAttribute("data-bot-regen") && bubble) {
      bubble.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
      setTimeout(() => {
        bubble.textContent = text;
      }, 650);
    }
  }
  async function openBotPanel() {
    const body = root.querySelector("[data-bot-body]");
    if (!body) return;
    const ctx = window._botCtx || { type: "general", id: "" };
    try {
      if (!state._botSessId && S.chatSession) {
        const sess = await unwrap(S.chatSession(ctx.type, ctx.id));
        if (sess && sess.id) state._botSessId = sess.id;
      }
      if (
        state._botSessId &&
        state._botRendered !== state._botSessId &&
        S.chatHistory
      ) {
        const msgs = (await unwrap(S.chatHistory(state._botSessId))) || [];
        state._botRendered = state._botSessId;
        if (Array.isArray(msgs) && msgs.length) {
          body.innerHTML = msgs
            .map((m) =>
              botMsgHtml(
                m.role === "user" ? "you" : "bot",
                m.content,
                new Date(m.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              ),
            )
            .join("");
          body.classList.toggle(
            "chatting",
            msgs.some((m) => m.role === "user"),
          );
          body.scrollTop = body.scrollHeight;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    } catch (_) {}
    try {
      if (S.myProgress) {
        const prog = (await unwrap(S.myProgress())) || [];
        const pct = prog.length
          ? Math.round(
              prog.reduce(
                (a, p) => a + Number(p.completed ? 100 : p.progress_pct || 0),
                0,
              ) / prog.length,
            )
          : 0;
        const fill = root.querySelector("[data-bot-fill]");
        const txt = root.querySelector("[data-bot-pct]");
        const bar = root.querySelector(".bot-prog-bar");
        if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + "%";
        if (txt) txt.textContent = pct + "%";
        if (bar) bar.setAttribute("aria-valuenow", String(pct));
      }
    } catch (_) {}
    renderBotHist();
  }
  async function renderBotHist() {
    const histEl = root.querySelector("[data-bot-hist]");
    if (!histEl || !S.chatSessions) return;
    try {
      const list = (await unwrap(S.chatSessions(8))) || [];
      if (!list.length) {
        histEl.innerHTML = `<p class="bot-hist-empty">Belum ada obrolan</p>`;
        return;
      }
      const items = [];
      for (const s of list) {
        let msgs = [];
        try {
          msgs = (await unwrap(S.chatHistory(s.id))) || [];
        } catch (_) {}
        if (!msgs.length) continue;
        let title =
          s.context_type === "module"
            ? "Materi"
            : s.context_type === "quiz"
              ? "Quiz"
              : s.context_type === "assignment"
                ? "Tugas"
                : "Obrolan umum";
        const first = msgs.find((m) => m.role === "user");
        if (first) title = String(first.content).slice(0, 44);
        items.push(
          `<button type="button" class="bot-hist-item${s.id === state._botSessId ? " on" : ""}" data-bot-hist-item="${s.id}">${ICON("message-square", 13)}<span class="bot-hist-t">${esc(title)}</span><span class="bot-hist-d">${s.updated_at || s.created_at ? fmtDate(s.updated_at || s.created_at) : ""}</span></button>`,
        );
      }
      if (!items.length) {
        histEl.innerHTML = `<p class="bot-hist-empty">Belum ada obrolan</p>`;
        return;
      }
      histEl.innerHTML = items.join("");
      if (window.lucide) window.lucide.createIcons();
    } catch (_) {
      histEl.innerHTML = "";
    }
  }
  async function openBotHistory(sid) {
    const body = root.querySelector("[data-bot-body]");
    if (!body || !sid) return;
    try {
      if (S.chatOpenSession) await unwrap(S.chatOpenSession(sid));
      state._botSessId = sid;
      state._botRendered = sid;
      const msgs = (await unwrap(S.chatHistory(sid))) || [];
      body.innerHTML = msgs.length
        ? msgs
            .map((m) =>
              botMsgHtml(
                m.role === "user" ? "you" : "bot",
                m.content,
                new Date(m.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              ),
            )
            .join("")
        : botWelcomeHtml();
      body.classList.toggle(
        "chatting",
        msgs.some((m) => m.role === "user"),
      );
      body.scrollTop = body.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
      root
        .querySelectorAll("[data-bot-hist-item]")
        .forEach((el) =>
          el.classList.toggle("on", el.dataset.botHistItem === sid),
        );
    } catch (ex) {
      toast(ex.message || "Gagal membuka obrolan", "error");
    }
  }

  let _botOpen = false;
  let _botClose = null;
  function bindBot() {
    const fab = root.querySelector("[data-bot-toggle]");
    const panel = root.querySelector("[data-bot-panel]");
    const overlay = root.querySelector("[data-bot-overlay]");
    const closeBtn = root.querySelector("[data-bot-close]");
    if (!fab || !panel) return;
    _botOpen = false;
    const body = panel.querySelector("[data-bot-body]");
    const histEl = panel.querySelector("[data-bot-hist]");
    const fullBtn = panel.querySelector("[data-bot-full]");
    const botRootEl = panel.closest(".bot-root");
    state._botSessId = null;
    state._botRendered = null;
    const setFull = (on) => {
      panel.classList.toggle("full", on);
      if (botRootEl) botRootEl.classList.toggle("bot-full", on);
      if (fullBtn) {
        fullBtn.innerHTML = on
          ? `${ICON("minimize-2", 14)}<span>Kecilkan</span>`
          : `${ICON("maximize-2", 14)}<span>Layar Penuh</span>`;
        fullBtn.setAttribute("aria-label", on ? "Kecilkan" : "Layar penuh");
        fullBtn.title = on ? "Kecilkan" : "Layar penuh";
        if (window.lucide) window.lucide.createIcons();
      }
    };
    const setOpen = (on) => {
      _botOpen = on;
      panel.classList.toggle("open", on);
      if (overlay) overlay.classList.toggle("show", on);
      fab.classList.toggle("open", on);
      fab.setAttribute("aria-label", on ? "Tutup bantuan" : "Buka bantuan");
      fab.innerHTML = `<!--icon-->${on ? ICON("x", 22) : ICON("message-circle", 22)}`;
      if (window.lucide) window.lucide.createIcons();
      panel.setAttribute("aria-hidden", on ? "false" : "true");
      if (overlay) overlay.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        setTimeout(() => root.querySelector("[data-bot-input]")?.focus(), 120);
        openBotPanel();
      } else setFull(false);
    };
    _botClose = () => setOpen(false);
    fab.addEventListener("click", () => setOpen(!_botOpen));
    if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
    if (overlay) overlay.addEventListener("click", () => setOpen(false));
    if (fullBtn)
      fullBtn.addEventListener("click", () =>
        setFull(!panel.classList.contains("full")),
      );
    document.removeEventListener("keydown", onBotEsc);
    document.addEventListener("keydown", onBotEsc);
    if (body)
      body.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-chip]");
        if (chip) {
          botSend(chip.textContent);
          return;
        }
        const act = e.target.closest(".bot-act");
        if (act) botAct(act);
      });
    if (histEl)
      histEl.addEventListener("click", (e) => {
        const item = e.target.closest("[data-bot-hist-item]");
        if (item) openBotHistory(item.dataset.botHistItem);
      });
    const newBtn = panel.querySelector("[data-bot-new]");
    if (newBtn)
      newBtn.addEventListener("click", async () => {
        const ctx = window._botCtx || { type: "general", id: "" };
        try {
          let ns = null;
          if (S.chatNewSession)
            ns = await unwrap(S.chatNewSession(ctx.type, ctx.id));
          state._botSessId = ns && ns.id ? ns.id : null;
          state._botRendered = state._botSessId;
          body.innerHTML = botWelcomeHtml();
          body.classList.remove("chatting");
          body.scrollTop = 0;
          if (window.lucide) window.lucide.createIcons();
          root.querySelector("[data-bot-input]")?.focus();
          renderBotHist();
        } catch (ex) {
          toast(ex.message || "Gagal membuat obrolan baru", "error");
        }
      });
    const form = panel.querySelector("[data-bot-form]");
    if (form)
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inp = root.querySelector("[data-bot-input]");
        const v = String(inp ? inp.value : "").trim();
        if (!v) return;
        inp.value = "";
        botSend(v);
      });
  }
  function onBotEsc(e) {
    if (e.key === "Escape" && _botOpen && _botClose) _botClose();
  }
  function botSend(text) {
    const body = document.querySelector("[data-bot-body]");
    if (!body) return;
    const push = (who, msg) => {
      body.insertAdjacentHTML("beforeend", botMsgHtml(who, msg, botTime()));
      body.scrollTop = body.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    };
    push("you", text);
    body.classList.add("chatting");
    const typing = document.createElement("div");
    typing.className = "bot-msg bot";
    typing.innerHTML = `<div class="bot-msg-av">${ICON("sparkles", 14)}</div><div class="bot-msg-col"><div class="bubble"><span class="typing"><span></span><span></span><span></span></span></div></div>`;
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
    (async () => {
      try {
        const ctx = window._botCtx || { type: "general", id: "" };
        const inAssessment =
          (ctx.type === "quiz" || ctx.type === "assignment") && ctx.id;
        if (inAssessment) {
          typing.remove();
          push(
            "bot",
            "Mode penilaian aktif: aku tidak memberi jawaban akhir. Tulis langkah yang sudah kamu coba, aku bantu arahkan.",
          );
          return;
        }
        let sess = state._botSessId ? { id: state._botSessId } : null;
        if (!sess && S.chatSession)
          sess = await unwrap(S.chatSession(ctx.type, ctx.id));
        if (sess && sess.id && S.chatSend) {
          state._botSessId = sess.id;
          state._botRendered = sess.id;
          const reply = await unwrap(S.chatSend(sess.id, text));
          typing.remove();
          push("bot", reply);
          renderBotHist();
          return;
        }
        throw new Error("fallback");
      } catch (_) {
        typing.remove();
        const lower = text.toLowerCase();
        if (/(contoh|example)/.test(lower))
          push(
            "bot",
            "Contoh: topologi Star — semua PC ke switch pusat. Kalau satu kabel putus, hanya PC itu yang mati.",
          );
        else if (/(apa itu|jelaskan|pengertian)/.test(lower))
          push(
            "bot",
            "Penjelasan singkat: bagi jadi 3 — definisi, cara kerja, contoh nyata. Tulis ulang dengan bahasamu sendiri biar nempel.",
          );
        else
          push(
            "bot",
            "Siap! Ceritakan bagian mana yang bikin bingung (definisi / langkah / contoh)? Ketik 'jelaskan topologi star' atau 'beri contoh subnetting'.",
          );
      }
    })();
  }

  function openBotModal() {
    document.querySelector("[data-bot-toggle]")?.click();
  }

  function landing() {
    const social = ["YouTube", "LinkedIn", "Twitter", "Facebook"];
    const navLinks = [
      { label: "Beranda", href: "#/" },
      { label: "FAQ", href: "#faq" },
      { label: "Apa yang Baru?", href: "#/baru" },
      { label: "Kontak", href: "#/kontak" },
    ];
    const faqs = [
      {
        q: "Apa itu EduCrazy?",
        a: "EduCrazy adalah platform belajar untuk siswa, guru, dan sekolah. Isinya materi audio-visual, quiz game dan studi kasus, live class bersama tutor, komunitas WhatsApp, serta info lomba.",
      },
      {
        q: "Bagaimana cara masuk?",
        a: "Klik tombol Masuk, lalu isi email dan kata sandi akun sekolahmu. Kalau belum punya akun, hubungi admin sekolah atau tim EduCrazy lewat halaman Kontak.",
      },
      {
        q: "Apakah bisa dipakai di HP?",
        a: "Bisa. EduCrazy berjalan di browser HP maupun komputer, jadi tidak perlu menginstal aplikasi tambahan. Tampilan akan menyesuaikan ukuran layar.",
      },
      {
        q: "Apakah materi bisa diulang?",
        a: "Bisa. Materi audio-visual dan quiz dapat dibuka ulang kapan saja, termasuk saat ingin mengulang sebelum ujian.",
      },
      {
        q: "Bagaimana kalau lupa kata sandi?",
        a: "Hubungi admin sekolah untuk mengatur ulang kata sandi akunmu. Demi keamanan, jangan bagikan kata sandi ke teman.",
      },
      {
        q: "Bagaimana cara mendaftarkan sekolah?",
        a: "Hubungi tim EduCrazy melalui WhatsApp atau email di halaman Kontak. Kami akan membantu menyiapkan akun guru, siswa, dan kelas.",
      },
    ];
    const steps = [
      {
        title: "Masuk dengan akun sekolah",
        desc: "Gunakan email dan kata sandi yang diberikan sekolah.",
      },
      {
        title: "Pilih kelas dan materi",
        desc: "Buka jadwal, materi, quiz, atau tugas yang tersedia.",
      },
      {
        title: "Belajar sambil bermain",
        desc: "Kumpulkan poin di EC Games dan pantau progresmu.",
      },
    ];
    return `
      <div class="lp-page">
        <div class="sm-wrap" data-sm-wrap>
          <div class="sm-prelayers" aria-hidden="true">
            <div class="sm-prelayer"></div>
            <div class="sm-prelayer"></div>
          </div>
          <header class="lp-nav sm-header">
            <div class="lp-container lp-nav-in">
              <a class="brand" href="#/"><img class="brand-logo" src="assets/krezilogo.jpg" alt="" /> EduCrazy</a>
              <nav class="lp-nav-links" aria-label="Navigasi utama">
                ${navLinks.map((l) => `<a href="${l.href}"${l.href === "#/" ? ' aria-current="page"' : ""}>${l.label}</a>`).join("")}
              </nav>
              <div class="lp-nav-actions">
                <a class="btn btn-yellow btn-sm lp-nav-cta" href="#/login">Masuk</a>
                <button class="sm-toggle" type="button" data-sm-toggle aria-expanded="false" aria-controls="sm-panel" aria-label="Buka menu">
                  <span class="sm-toggle-text" aria-hidden="true">
                    <span class="sm-toggle-inner"><span>Menu</span><span>Tutup</span><span>Menu</span><span>Tutup</span><span>Tutup</span></span>
                  </span>
                  <span class="sm-icon" aria-hidden="true"><span class="sm-icon-h"></span><span class="sm-icon-v"></span></span>
                </button>
              </div>
            </div>
          </header>
          <aside class="sm-panel" id="sm-panel" data-sm-panel aria-hidden="true" aria-label="Menu navigasi">
            <ul class="sm-list">
              <li class="sm-item-wrap"><a class="sm-item" href="#/"><span class="sm-item-label">Beranda</span></a></li>
              <li class="sm-item-wrap"><a class="sm-item" href="#faq"><span class="sm-item-label">FAQ</span></a></li>
              <li class="sm-item-wrap"><a class="sm-item" href="#/baru"><span class="sm-item-label">Apa yang Baru?</span></a></li>
              <li class="sm-item-wrap"><a class="sm-item" href="#/kontak"><span class="sm-item-label">Kontak</span></a></li>
            </ul>
            <div class="sm-socials">
              <h3 class="sm-socials-title">Socials</h3>
              <ul class="sm-socials-list">
                ${social.map((s) => `<li><a class="sm-socials-link" href="#/kontak">${s}</a></li>`).join("")}
              </ul>
            </div>
            <a class="btn btn-yellow btn-block lp-panel-cta" href="#/login">Masuk</a>
          </aside>
        </div>

        <main id="main" class="lp-main" tabindex="-1">
          <section class="lp-hero" aria-labelledby="lp-hero-title">
            <div class="lp-hero-bg" aria-hidden="true"></div>
            <div class="lp-container lp-hero-inner">
              <div class="lp-hero-copy">
                <h1 id="lp-hero-title">Belajar jadi <span class="lp-hl">seru</span>, bukan beban.</h1>
                <p class="lp-lead">
                  Materi kontekstual audio-visual, quiz game &amp; studi kasus, live class
                  dengan tutor, komunitas WA, dan info lomba — untuk siswa, guru, dan sekolah.
                </p>
                <div class="lp-hero-cta">
                  <a class="btn btn-yellow btn-lg" href="#/login">Masuk sekarang</a>
                  <a class="btn btn-ghost btn-lg" href="#faq">Lihat FAQ</a>
                </div>
              </div>
              <div class="lp-hero-art" aria-hidden="true">
                <span class="lp-orbit lp-orbit-a">Quiz game</span>
                <span class="lp-orbit lp-orbit-b">Live class</span>
                <div class="lp-logo-plate"><img src="assets/krezi.png" alt="" /></div>
              </div>
            </div>
          </section>

          <section class="lp-section lp-section-alt" id="faq" aria-labelledby="lp-faq-title">
            <div class="lp-container">
              <div class="lp-section-head">
                <span class="kicker">FAQ</span>
                <h2 id="lp-faq-title">Pertanyaan yang sering muncul</h2>
                <p>Belum ketemu jawabannya? <a href="#/kontak">Hubungi kami</a>.</p>
              </div>
              <div class="lp-faq">
                ${faqs
                  .map(
                    (f) => `<details class="lp-faq-item">
                  <summary>
                    <span class="lp-faq-q">${f.q}</span>
                    <span class="lp-faq-icon" aria-hidden="true">${ICON("plus", 16)}</span>
                  </summary>
                  <p class="lp-faq-a">${f.a}</p>
                </details>`,
                  )
                  .join("")}
              </div>
            </div>
          </section>

          <section class="lp-section" aria-labelledby="lp-steps-title">
            <div class="lp-container">
              <div class="lp-section-head">
                <span class="kicker">Cara mulai</span>
                <h2 id="lp-steps-title">Mulai dalam tiga langkah</h2>
                <p>Tidak perlu instalasi. Buka browser, masuk, lalu belajar.</p>
              </div>
              <ol class="lp-grid lp-steps">
                ${steps
                  .map(
                    (s, i) => `<li class="lp-step">
                  <span class="lp-step-n">${String(i + 1).padStart(2, "0")}</span>
                  <h3>${s.title}</h3>
                  <p>${s.desc}</p>
                </li>`,
                  )
                  .join("")}
              </ol>
            </div>
          </section>

          <section class="lp-section lp-section-cta" aria-labelledby="lp-cta-title">
            <div class="lp-container">
              <div class="lp-cta">
                <div>
                  <h2 id="lp-cta-title">Siap belajar dengan cara yang lebih seru?</h2>
                  <p>Masuk dengan akun sekolahmu dan mulai dari materi hari ini.</p>
                </div>
                <div class="lp-cta-actions">
                  <a class="btn btn-ink btn-lg" href="#/login">Masuk sekarang</a>
                  <a class="lp-cta-link" href="#/kontak">Butuh bantuan? Hubungi kami</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer class="lp-footer">
          <div class="lp-container lp-footer-in">
            <div class="lp-footer-brand">
              <a class="brand" href="#/"><img class="brand-logo" src="assets/krezi.png" alt="" /> EduCrazy</a>
              <p>Belajar jadi seru — materi, quiz game, live class, dan komunitas dalam satu tempat.</p>
            </div>
            <nav class="lp-footer-col" aria-label="Jelajahi">
              <h3>Jelajahi</h3>
              <a href="#/">Beranda</a>
              <a href="#faq">FAQ</a>
              <a href="#/baru">Apa yang Baru?</a>
            </nav>
            <nav class="lp-footer-col" aria-label="Bantuan">
              <h3>Bantuan</h3>
              <a href="#/kontak">Kontak</a>
              <a href="#/login">Masuk</a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener">WhatsApp</a>
              <a href="mailto:halo@educrazy.id">halo@educrazy.id</a>
            </nav>
          </div>
          <div class="lp-container lp-footer-bottom">
            <span>© 2026 EduCrazy. Semua hak dilindungi.</span>
            <span>Dibuat untuk siswa, guru, dan sekolah.</span>
          </div>
        </footer>
      </div>`;
  }

  function publicHead() {
    return `<header class="public-head">
      <div class="page-container public-head-in">
        <a class="brand" href="#/"><img class="brand-logo" src="assets/krezi.png" alt="" /> EduCrazy</a>
        <a class="btn btn-sm" href="#/login">Masuk</a>
      </div>
    </header>`;
  }

  function whatsNewPage() {
    const items = [
      {
        badge: "Fitur",
        title: "Mode EduCrazy (EC)",
        desc: "Kumpulan game edukasi interaktif: quiz cepat, tebak istilah, dan studi kasus sambil mengumpulkan poin.",
        time: "12 Okt 2026",
      },
      {
        badge: "Fitur",
        title: "Belajar dengan AI",
        desc: "Asisten belajar yang membantu memahami materi langkah demi langkah — tanpa memberi jawaban akhir.",
        time: "5 Okt 2026",
      },
      {
        badge: "Peningkatan",
        title: "Papan peringkat & lencana",
        desc: "Poin, streak, dan lencana baru untuk menemani progres belajarmu.",
        time: "28 Sep 2026",
      },
    ];
    return `
      <div class="page-public">
        ${publicHead()}
        <main class="page-container public-main">
          <a class="public-back" href="#/">${ICON("arrow-left", 14)} Kembali ke Beranda</a>
          <span class="kicker">Update</span>
          <h1 class="public-title">Apa yang Baru?</h1>
          <p class="public-sub">Ringkasan fitur dan peningkatan terbaru di EduCrazy.</p>
          <ul class="update-list">
            ${items
              .map(
                (it) => `<li class="card update-card">
              <div class="update-top"><span class="kicker">${it.badge}</span><time>${it.time}</time></div>
              <h3>${it.title}</h3>
              <p>${it.desc}</p>
            </li>`,
              )
              .join("")}
          </ul>
        </main>
      </div>`;
  }

  function contactPage() {
    const socials = ["YouTube", "LinkedIn", "Twitter", "Facebook"];
    return `
      <div class="page-public">
        ${publicHead()}
        <main class="page-container public-main">
          <a class="public-back" href="#/">${ICON("arrow-left", 14)} Kembali ke Beranda</a>
          <span class="kicker">Kontak</span>
          <h1 class="public-title">Hubungi EduCrazy</h1>
          <p class="public-sub">Ada pertanyaan tentang kelas, kerja sama sekolah, atau kendala teknis? Tim kami siap membantu.</p>
          <div class="contact-grid">
            <a class="card contact-card" href="https://wa.me/6281234567890" target="_blank" rel="noopener">
              ${ICON("message-circle", 22)}
              <h3>WhatsApp</h3>
              <p>+62 812-3456-7890</p>
              <span class="contact-note">Balas cepat · Senin–Jumat, 08.00–17.00 WIB</span>
            </a>
            <a class="card contact-card" href="mailto:halo@educrazy.id">
              ${ICON("mail", 22)}
              <h3>Email</h3>
              <p>halo@educrazy.id</p>
              <span class="contact-note">Untuk kerja sama & pertanyaan umum</span>
            </a>
          </div>
          <h2 class="public-section-title">Media sosial</h2>
          <ul class="contact-socials">
            ${socials.map((s) => `<li>${s}</li>`).join("")}
          </ul>
          <p class="public-foot-note">Akun resmi sosial media EduCrazy segera hadir. Sementara itu, hubungi kami lewat WhatsApp atau email di atas.</p>
        </main>
      </div>`;
  }

  function loginPage() {
    const demo = !S.isConfigured;
    return `
      <div class="auth-wrap">
        <div class="deco deco-pink" aria-hidden="true"></div>
        <div class="deco deco-purple" aria-hidden="true"></div>
        <div class="auth-card card card-lg">
          <a class="brand" href="#/"><span class="brand-mark">${ICON("school", 22)}</span> SekolahKu</a>
          <span class="eyebrow" style="margin-top:12px">Akses aman</span>
          <h1>Masuk ke SekolahKu</h1>
          <p class="muted">Gunakan email dan kata sandi akun sekolah Anda.</p>
          ${demo ? `<div class="setup-banner">Mode demo aktif. Isi <code>js/config.js</code> dengan URL & anon key Supabase untuk data nyata.</div>` : ""}
          <form id="login-form" class="field" style="margin-top:16px;gap:14px">
            <div class="field">
              <label for="email">Email</label>
              <input class="input" id="email" name="email" type="email" autocomplete="username" placeholder="nama@sekolah.id" required />
            </div>
            <div class="field">
              <label for="password">Kata sandi</label>
              <input class="input" id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required />
            </div>
            <p class="field-error hidden" id="login-error" role="alert"></p>
            <button class="btn btn-yellow btn-block" type="submit" id="login-btn">${ICON("log-in", 16)} Masuk</button>
            <p class="form-hint" style="text-align:center">Lupa password? Hubungi admin sekolah.</p>
          </form>
          ${
            demo
              ? `<div class="demo-box">
            <strong>${ICON("flask-conical", 14)} Akun uji — klik untuk isi otomatis</strong>
            <div style="margin-top:6px;display:grid;gap:4px;font-size:12px"><span>Siswa · siswa@sekolah.id / siswa123</span><span>Guru · guru@sekolah.id / guru123</span><span>Sekolah · sekolah@sekolah.id / sekolah123</span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <button type="button" class="btn btn-sm" data-demo="siswa@sekolah.id|siswa123">Siswa</button>
              <button type="button" class="btn btn-sm" data-demo="guru@sekolah.id|guru123">Guru</button>
              <button type="button" class="btn btn-sm" data-demo="sekolah@sekolah.id|sekolah123">Sekolah</button>
            </div>
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
          <a class="brand" href="#/app/beranda"><span class="brand-mark">${ICON("school", 18)}</span> SekolahKu</a>
          <p class="muted" style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin:6px 4px 8px">${u.role === "siswa" ? "Siswa" : u.role === "guru" ? "Guru" : "Pihak Sekolah"} · ${esc(u.class_name || "Umum")}</p>
          ${nav
            .filter((n) => !["profil", "notifikasi"].includes(n.id))
            .map(
              (n) =>
                `<button class="nav-item${state.page === n.id ? " active" : ""}" data-nav="${n.id}">${ICON(n.icon, 18)} ${n.label}</button>`,
            )
            .join("")}
          <div class="nav-spacer"></div>
          <button class="nav-item${state.page === "notifikasi" ? " active" : ""}" data-nav="notifikasi">${ICON("bell", 18)} Notifikasi ${unread ? `<span class="badge badge-alpa" style="margin-left:auto">${unread}</span>` : ""}</button>
          <button class="nav-item${state.page === "profil" ? " active" : ""}" data-nav="profil">${ICON("user", 18)} Profil</button>
          <button class="nav-item" data-logout>${ICON("log-out", 18)} Keluar</button>
        </aside>
        <div class="app-main">
          <header class="app-header">
            <div class="header-left">
              <button class="icon-btn" data-open-sidebar aria-label="Buka menu">${ICON("menu", 18)}</button>
              <div>
                <h2 class="page-title">${pageTitle()}</h2>
                <p class="muted" style="font-size:12px;font-weight:600">${esc(u.name)} · ${esc(u.role === "siswa" ? "Siswa" : u.role === "guru" ? "Guru" : "Sekolah")}</p>
              </div>
            </div>
            <div class="header-right">
              <button class="icon-btn rel" data-nav="notifikasi" aria-label="Notifikasi">
                ${ICON("bell", 18)}
                ${unread ? `<span class="notif-dot" aria-hidden="true"></span>` : ""}
              </button>
              <div class="avatar" title="${u.name}">${u.photo_url ? `<img src="${u.photo_url}" alt="">` : initials(u.name)}</div>
              <strong class="hide-sm" style="font-size:13px">${esc(u.name.split(" ")[0])}</strong>
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
        { id: "quiz", icon: "help-circle", short: "Quiz" },
        { id: "tugas", icon: "file-text", short: "Tugas" },
        { id: "profil", icon: "user", short: "Profil" },
      ];
    return [
      { id: "beranda", icon: "home", short: "Home" },
      { id: "materi", icon: "book-open", short: "Belajar" },
      { id: "quiz", icon: "help-circle", short: "Quiz" },
      { id: "tugas", icon: "file-text", short: "Tugas" },
      { id: "profil", icon: "user", short: "Profil" },
    ];
  }

  function walletCard(w, streak) {
    if (!w) return "";
    const pct = Math.max(
      4,
      Math.min(100, Math.round(((w.xp % 200) / 200) * 100)),
    );
    const dots = Array.from(
      { length: 7 },
      (_, i) =>
        `<span class="streak-dot${i < Math.min(7, streak?.current_streak || 0) ? (i < 2 ? " on" : " fire") : ""}"></span>`,
    ).join("");
    return `<section class="card" style="background:var(--color-surface)">
      <div class="section-head" style="margin-bottom:8px"><div><h2>Level ${w.level} · ${w.xp} XP</h2><p class="muted">${w.xpToNext} XP lagi naik level · ${streak?.current_streak || 0} hari beruntun</p></div><span class="badge">Lv ${w.level}</span></div>
      <div class="xp-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
      <div class="actions-row" style="margin-top:12px">
        <span class="badge">${ICON("star", 13)} ${w.poin} Poin</span>
        <span class="badge badge-sedang">${ICON("lightbulb", 13)} ${w.hint} Petunjuk</span>
        <span class="badge badge-hadir">${ICON("flame", 13)} ${streak?.current_streak || 0} Streak</span>
      </div>
      <div class="streak-dots" style="margin-top:10px" aria-label="Streak 7 hari">${dots}</div>
    </section>`;
  }

  function onboardingHtml(pref) {
    const fav = pref?.favorite_subjects || [];
    const meth = pref?.preferred_methods || [];
    const subjects = [
      "Matematika",
      "Fisika",
      "Kimia",
      "Biologi",
      "TKJ",
      "B. Indonesia",
      "B. Inggris",
      "Sejarah",
    ];
    const methods = [
      ["visual", "tv", "Video/Visual"],
      ["audio", "headphones", "Audio"],
      ["video", "clapperboard", "Praktik Video"],
      ["quiz", "gamepad-2", "Kuis Game"],
    ];
    return `<div class="onboarding-wrap"><div class="onboarding-card" role="dialog" aria-modal="true" aria-label="Onboarding preferensi">
      <span class="eyebrow">Langkah awal · 30 detik</span>
      <h1 style="margin:8px 0">Cara belajarmu gimana?</h1>
      <p class="muted">Dipakai untuk rekomendasi materi & kuis. Bisa diubah di Profil. Semua mapel tetap bisa dibuka.</p>
      <form id="onboarding-form" class="field" style="gap:14px;margin-top:14px">
        <div class="field"><label>Mapel favorit (pilih maks 3)</label><div class="chip-row">${subjects.map((s) => `<label class="chip${fav.includes(s) ? " on" : ""}"><input type="checkbox" name="fav" value="${s}" ${fav.includes(s) ? "checked" : ""} class="hidden"> ${s}</label>`).join("")}</div></div>
        <div class="field"><label>Metode favorit</label><div class="chip-row">${methods.map(([v, ic, lb]) => `<label class="chip${meth.includes(v) ? " on" : ""}"><input type="checkbox" name="meth" value="${v}" ${meth.includes(v) ? "checked" : ""} class="hidden"> ${ICON(ic, 15)} ${lb}</label>`).join("")}</div></div>
        <div class="field"><label for="ob-goal">Tujuan belajar (opsional)</label><input class="input" id="ob-goal" name="goal" placeholder="cth: lolos LKS / naikkan nilai TKJ" value="${esc(pref?.learning_goals || "")}"></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan & Mulai Belajar</button><button class="btn" type="button" data-ob-skip>Lewati dulu</button></div>
      </form>
    </div></div>`;
  }

  async function checkOnboarding() {
    if (!state.user || state.user.role !== "siswa" || state._onboarding) return;
    try {
      let pref = null;
      try {
        pref = await unwrap(S.getPreferences ? S.getPreferences() : null);
      } catch (e) {
        if (
          String(e.message || "").includes("schema cache") ||
          String(e.message || "").includes("does not exist")
        )
          localStorage.setItem("onboarding_skipped", "1");
        return;
      }
      if (String(localStorage.getItem("onboarding_skipped") || "") === "1")
        return;
      if (!pref) {
        state._onboarding = true;
        const div = document.createElement("div");
        div.innerHTML = onboardingHtml(null);
        document.body.appendChild(div.firstElementChild);
        paint();
        bindOnboarding();
      }
    } catch (_) {}
  }

  function bindOnboarding() {
    const wrap = document.querySelector(".onboarding-wrap");
    if (!wrap) return;
    const close = () => {
      try {
        wrap.remove();
      } catch (_) {}
      localStorage.setItem("onboarding_skipped", "1");
    };
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) close();
    });
    document.addEventListener("keydown", function escOnce(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escOnce);
      }
    });
    wrap
      .querySelectorAll(".chip input")
      .forEach((c) =>
        c.addEventListener("change", () =>
          c.closest(".chip").classList.toggle("on", c.checked),
        ),
      );
    const skip = wrap.querySelector("[data-ob-skip]");
    if (skip) skip.addEventListener("click", close);
    const f = wrap.querySelector("#onboarding-form");
    if (f)
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(f);
        const fav = fd.getAll("fav").slice(0, 3);
        const meth = fd.getAll("meth");
        const btn = f.querySelector('[type="submit"]');
        if (btn) btn.disabled = true;
        try {
          await unwrap(
            S.savePreferences({
              favorite_subjects: fav,
              preferred_methods: meth,
              learning_goals: String(fd.get("goal") || ""),
            }),
          );
          try {
            await unwrap(S.queueOp ? S.queueOp("onboarding", {}) : null);
          } catch (_) {}
          toast("Preferensi tersimpan +20 XP");
          try {
            if (S.wallet) state._wallet = await unwrap(S.wallet());
          } catch (_) {}
          wrap.remove();
          hydratePage();
        } catch (ex) {
          if (
            String(ex.message || "").includes("schema cache") ||
            String(ex.message || "").includes("does not exist")
          ) {
            toast(
              "Backend belum migrasi — preferensi disimpan, tapi mungkin butuh jalanin migration_prd_v1.sql",
              "info",
            );
            wrap.remove();
            localStorage.setItem("onboarding_skipped", "1");
          } else toast(ex.message, "error");
        } finally {
          if (btn) btn.disabled = false;
        }
      });
  }

  function pageTitle() {
    const all = [...routes.siswa, ...routes.guru, ...routes.sekolah];
    return (all.find((r) => r.id === state.page) || { label: "Dashboard" })
      .label;
  }

  const spinner = () =>
    `<div class="card empty"><div class="skeleton" aria-hidden="true"><span style="width:60%"></span><span style="width:90%"></span><span style="width:75%"></span></div><p class="muted" style="margin-top:10px">Memuat data…</p></div>`;

  function syncNotifBadges() {
    const unread = (state._notifs || []).filter((n) => !n.is_read).length;
    const headerBtn = document.querySelector(
      '.app-header [data-nav="notifikasi"]',
    );
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

  const withTimeout = (p, ms = 7000) =>
    Promise.race([
      p,
      new Promise((_, rj) => setTimeout(() => rj(new Error("timeout")), ms)),
    ]);
  async function hydratePage() {
    const main = document.getElementById("main");
    try {
      const safe = (p) =>
        withTimeout(
          Promise.resolve().then(() => unwrap(p)),
          7000,
        ).catch(() => null);
      state._notifs = null;
      if (state.user && state.user.role === "siswa") {
        const [notifs, wallet, streak, progress, rec] = await Promise.all([
          safe(S.notifications()),
          safe(S.wallet ? S.wallet() : null),
          safe(S.myStreak ? S.myStreak() : null),
          safe(S.myProgress ? S.myProgress() : null),
          safe(S.recommendedModules ? S.recommendedModules() : null),
        ]);
        state._notifs = notifs || [];
        state._wallet = wallet;
        state._streak = streak;
        state._progress = progress;
        state._recommended = rec;
        syncNotifBadges();
        setTimeout(checkOnboarding, 300);
      } else {
        state._notifs = (await safe(S.notifications())) || [];
        syncNotifBadges();
      }
      if (S.loadStudents) withTimeout(S.loadStudents(), 4000).catch(() => {});
      if (navigator.onLine && S.syncQueue)
        withTimeout(unwrap(S.syncQueue()), 4000).catch(() => {});
      const html = await withTimeout(pages[state.page](), 8000);
      main.innerHTML = html;
      bindPage();
      paint();
      if (
        state.page === "materi" ||
        state.page === "tugas" ||
        state.page === "quiz"
      )
        try {
          initBotContext();
        } catch (_) {}
    } catch (e) {
      main.innerHTML = `<div class="card empty"><p>Gagal memuat: ${esc(e.message)}</p><button class="btn btn-yellow" onclick="location.reload()" style="margin-top:10px">Muat Ulang</button></div>`;
    }
  }

  function initBotContext() {
    const ctx = state.detailId
      ? state.page === "materi"
        ? "module"
        : state.page === "quiz"
          ? "quiz"
          : state.page === "tugas"
            ? "assignment"
            : "general"
      : "general";
    window._botCtx = { type: ctx, id: state.detailId || "" };
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
    async materi() {
      if (state.detailId) return materiDetailPage();
      return materiPage();
    },
    async quiz() {
      if (state.detailId) return quizTakePage();
      return quizPage();
    },
    async ecgames() {
      return `<div class="ecgames-launch muted" style="display:flex;align-items:center;justify-content:center;min-height:50vh">Memuat EC Games…</div>`;
    },
    async tugas() {
      if (state.detailId) return tugasDetailPage();
      return tugasPage();
    },
    async jadwal() {
      return jadwalPage();
    },
    async komunitas() {
      return komunitasPage();
    },
    async lomba() {
      return lombaPage();
    },
    async notifikasi() {
      return notifPage();
    },
    async profil() {
      return profilPage();
    },
  };

  async function tugasPage() {
    const isStaff = ["guru", "sekolah"].includes(state.user.role);
    const qq = state._tugasQ || { q: "", status: "", type: "" };
    let list = await unwrap(S.assignments ? S.assignments({}) : []);
    if (qq.type) list = list.filter((a) => a.type === qq.type);
    if (qq.status && isStaff) list = list.filter((a) => a.status === qq.status);
    if (qq.q) {
      const s = String(qq.q).toLowerCase();
      list = list.filter((a) =>
        (
          (a.title || "") +
          " " +
          (a.subject || "") +
          " " +
          (a.description || "")
        )
          .toLowerCase()
          .includes(s),
      );
    }
    let subs = [];
    try {
      subs = await unwrap(S.submissions ? S.submissions() : []);
    } catch (_) {}
    const subByA = Object.fromEntries(subs.map((s) => [s.assignment_id, s]));
    return `
      <section class="card"><div class="materi-head"><div class="materi-head-left"><span class="icon-box yellow">${ICON("file-text", 22)}</span><div><h1>Tugas & Studi Kasus</h1><p class="muted">${isStaff ? "Buat tugas, nilai jawaban, beri hint reward." : "Kerjakan tugas, kumpulkan sebelum deadline, dapat poin + XP + petunjuk."}</p></div></div>
      ${isStaff ? `<button class="btn btn-pink" data-open-assignment>${ICON("plus", 16)} Buat Tugas</button>` : ""}</div></section>
      <section class="materi-toolbar card">
        <form id="tugas-filter" class="search-wrap"><label class="search-box" style="flex:1">${ICON("search", 18)}<input class="input" name="q" placeholder="Cari tugas" value="${esc(qq.q)}"></label><button class="btn btn-yellow" type="submit">Cari</button></form>
        <div class="materi-tabs">
          <button class="tab-btn${!qq.type ? " active" : ""}" data-tugas-type="">Semua</button>
          <button class="tab-btn${qq.type === "assignment" ? " active" : ""}" data-tugas-type="assignment">${ICON("file-text", 16)} Tugas</button>
          <button class="tab-btn${qq.type === "case_study" ? " active" : ""}" data-tugas-type="case_study">${ICON("briefcase", 16)} Studi Kasus</button>
        </div>
        <p class="muted" style="font-size:13px">${list.length} tugas ditemukan</p>
      </section>
      <div style="display:grid;gap:12px;margin-top:16px">
      ${
        list.length
          ? `<div class="hub-grid">
        ${list
          .map((a) => {
            const sub = subByA[a.id];
            const late = a.due_at && new Date() > new Date(a.due_at);
            const typeIcon =
              a.type === "case_study" ? "briefcase" : "file-text";
            const typeColor = a.type === "case_study" ? "purple" : "blue";
            const diffCls =
              {
                easy: "badge-rendah",
                medium: "badge-sedang",
                hard: "badge-tinggi",
              }[a.difficulty || "medium"] || "badge-sedang";
            return `<article class="hub-card">
          <div class="hub-head">
            <span class="icon-box ${typeColor}">${ICON(typeIcon, 20)}</span>
            <div class="hub-title"><h3 class="clamp-2">${esc(a.title)}</h3><span class="hub-sub">${esc(a.subject || "Umum")}</span></div>
            ${a.status !== "published" ? `<span class="badge">${S.label(a.status)}</span>` : ""}
          </div>
          <div class="hub-meta">
            <span class="badge badge-${a.type}">${S.label(a.type)}</span>
            <span class="badge ${diffCls}">${S.label(a.difficulty || "medium")}</span>
            ${late && !sub ? `<span class="badge badge-alpa">${ICON("alarm-clock", 12)} Lewat deadline</span>` : ""}
          </div>
          <div class="hub-meta">
            <span class="dl-chip">${ICON("calendar-clock", 14)} ${a.due_at ? fmtDate(a.due_at) : "Tanpa deadline"}</span>
            <span class="dl-chip">${ICON("zap", 14)} +${a.max_xp || 0} XP</span>
            <span class="dl-chip">${ICON("star", 14)} +${a.max_points || 0} poin</span>
            <span class="dl-chip">${ICON("lightbulb", 14)} +${a.hint_reward || 0}</span>
          </div>
          ${sub ? `<div class="hub-meta"><span class="hub-status${sub.status === "graded" ? "" : " wait"}"><span class="dot"></span>${S.label(sub.status)}${sub.score != null ? " · Nilai " + sub.score : ""}</span></div>` : ""}
          <div class="hub-foot">
            <div class="hub-actions">
              <button class="btn ${sub ? "" : "btn-yellow"} btn-sm" data-tugas-take="${a.id}">${ICON(sub ? "eye" : "pencil", 14)} ${sub ? "Lihat" : "Kerjakan"}</button>
              ${isStaff ? `<button class="btn btn-sm" data-tugas-toggle="${a.id}">${ICON(a.status === "published" ? "lock" : "unlock", 14)} ${a.status === "published" ? "Tutup" : "Publish"}</button><button class="btn btn-sm btn-red btn-icon" data-tugas-del="${a.id}" aria-label="Hapus ${esc(a.title)}" title="Hapus">${ICON("trash-2", 14)}</button>` : ""}
            </div>
          </div>
        </article>`;
          })
          .join("")}
      </div>`
          : empty(
              "Belum ada tugas",
              "Tugas & studi kasus dari guru akan muncul di sini.",
              isStaff ? "tugas" : "",
            )
      }
      </div>`;
  }

  async function tugasDetailPage() {
    const a = await unwrap(S.assignmentById(state.detailId));
    if (!a) return empty("Tugas tidak ditemukan", "Kembali ke daftar tugas.");
    const isStaff = ["guru", "sekolah"].includes(state.user.role);
    const typeIcon = a.type === "case_study" ? "briefcase" : "file-text";
    const typeColor = a.type === "case_study" ? "purple" : "blue";
    const late = a.due_at && new Date() > new Date(a.due_at);
    const headCard = `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box ${typeColor}">${ICON(typeIcon, 22)}</span><div><h1 class="clamp-2">${esc(a.title)}</h1><p class="muted">${esc(a.subject || "Umum")} · ${esc(S.label(a.type))}</p></div></div>
          ${a.status !== "published" ? `<span class="badge">${esc(S.label(a.status))}</span>` : ""}
        </div>
        <div class="hub-meta" style="margin-top:14px">
          <span class="dl-chip${late ? " hot" : ""}">${ICON("calendar-clock", 14)} ${a.due_at ? fmtDate(a.due_at) : "Tanpa deadline"}${late ? " · lewat" : ""}</span>
          <span class="dl-chip">${ICON("zap", 14)} +${a.max_xp || 0} XP</span>
          <span class="dl-chip">${ICON("star", 14)} +${a.max_points || 0} poin</span>
          <span class="dl-chip">${ICON("lightbulb", 14)} +${a.hint_reward || 0} petunjuk</span>
          <span class="dl-chip">${ICON("gauge", 14)} ${esc(S.label(a.difficulty || "medium"))}</span>
        </div>
        ${a.description ? `<p style="margin-top:14px">${esc(a.description)}</p>` : ""}
        ${a.instructions ? `<div class="qz-feedback" style="margin-top:12px"><strong>${ICON("list-checks", 14)} Instruksi</strong><p>${esc(a.instructions)}</p></div>` : ""}
      </section>`;
    if (isStaff) {
      const subs = await unwrap(S.submissions(a.id));
      const pending = subs.filter((s) => s.status !== "graded").length;
      return `<button class="btn" data-nav="tugas">${ICON("arrow-left")} Kembali</button>
      <div style="margin-top:16px">${headCard}</div>
      <section class="dash-sec" style="margin-top:20px">
        <div class="section-head"><div><h2>Jawaban Masuk</h2><p>${subs.length} pengumpulan · ${pending} menunggu nilai</p></div></div>
        <div style="display:grid;gap:12px">
        ${
          subs.length
            ? subs
                .map(
                  (s) => `<article class="card">
              <div class="hub-head">
                <div class="avatar" style="width:44px;height:44px;font-size:15px">${initials(S.reporterName(s.user_id))}</div>
                <div class="hub-title"><h3 style="font-size:16px">${esc(S.reporterName(s.user_id))}</h3><span class="hub-sub">${fmtDate(s.submitted_at)}</span></div>
                <span class="badge badge-${s.status}">${esc(S.label(s.status))}${s.score != null ? " · " + s.score : ""}</span>
              </div>
              <p class="hub-desc" style="min-height:0;margin-top:10px">${esc(String(s.answer_text || "").slice(0, 300))}</p>
              ${s.feedback ? `<div class="qz-feedback" style="margin-top:8px"><strong>${ICON("message-circle", 13)} Feedback</strong><p>${esc(s.feedback)}</p></div>` : ""}
              <div class="hub-foot"><div class="hub-actions">${s.status !== "graded" ? `<button class="btn btn-yellow btn-sm" data-grade-sub="${s.id}">${ICON("pen-line", 14)} Nilai</button>` : `<span class="hub-status"><span class="dot"></span>Sudah dinilai</span>`}</div></div>
            </article>`,
                )
                .join("")
            : '<div class="card"><p class="muted" style="margin:0">Belum ada jawaban masuk.</p></div>'
        }
        </div>
      </section>`;
    }
    const sub = await unwrap(S.mySubmission(a.id));
    return `<button class="btn" data-nav="tugas">${ICON("arrow-left")} Kembali</button>
    <div style="margin-top:16px">${headCard}</div>
    ${
      sub
        ? `<section class="card" style="margin-top:16px">
          <div class="section-head" style="margin-bottom:8px"><div><h2>Jawabanmu</h2><p>Dikumpulkan ${fmtDate(sub.submitted_at)}</p></div><span class="badge badge-${sub.status}">${esc(S.label(sub.status))}${sub.score != null ? " · Nilai " + sub.score : ""}</span></div>
          <p style="margin-top:8px">${esc(sub.answer_text || "")}</p>
          ${sub.feedback ? `<div class="qz-feedback" style="margin-top:12px"><strong>${ICON("message-circle", 14)} Feedback guru</strong><p>${esc(sub.feedback)}</p></div>` : ""}
        </section>`
        : `<section class="card" style="margin-top:16px">
          <div class="section-head" style="margin-bottom:0"><div><h2>Kumpulkan Jawaban</h2><p>${late ? "Sudah melewati deadline — masih bisa dikumpulkan dengan penanda terlambat." : "Kumpulkan sebelum deadline untuk penilaian penuh."}</p></div></div>
          <form id="tugas-do" class="field" style="gap:12px;margin-top:14px">
            <div class="field"><label for="t-answer">Jawabanmu</label><textarea class="textarea" id="t-answer" name="answer" required placeholder="Tulis jawaban / langkah diagnosis..."></textarea></div>
            <button class="btn btn-yellow" type="submit">${ICON("send", 16)} Kumpulkan Tugas</button>
          </form>
        </section>`
    }`;
  }

  function assignmentForm() {
    return `<div class="modal"><div class="modal-head"><h2>Buat tugas / studi kasus</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
    <form id="assignment-form" class="field" style="gap:12px;margin-top:14px">
      <div class="field"><label>Judul</label><input class="input" name="title" required placeholder="Studi Kasus: LAN mati"></div>
      <div class="field"><label>Mapel</label><input class="input" name="subject" placeholder="TKJ 11"></div>
      <div class="field"><label>Tipe</label><select class="select" name="type"><option value="assignment">Tugas</option><option value="case_study">Studi Kasus</option></select></div>
      <div class="field"><label>Kesulitan</label><select class="select" name="difficulty"><option value="easy">Mudah</option><option value="medium" selected>Sedang</option><option value="hard">Sulit</option></select></div>
      <div class="field" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px"><div class="field"><label>Max poin</label><input class="input" name="max_points" type="number" value="30"></div><div class="field"><label>Max XP</label><input class="input" name="max_xp" type="number" value="50"></div><div class="field"><label>Reward petunjuk</label><input class="input" name="hint_reward" type="number" value="1"></div></div>
      <div class="field"><label>Deadline</label><input class="input" name="due_at" type="datetime-local"></div>
      <div class="field"><label>Deskripsi</label><textarea class="textarea" name="description"></textarea></div>
      <div class="field"><label>Instruksi</label><textarea class="textarea" name="instructions"></textarea></div>
      <div class="field"><label>Status</label><select class="select" name="status"><option value="draft">Draft</option><option value="published">Publish</option></select></div>
      <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan</button><button class="btn" data-close-modal type="button">Batal</button></div>
    </form></div>`;
  }

  function gradeSubForm(sid, cur) {
    return `<div class="modal"><div class="modal-head"><h2>Nilai tugas</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
    <form id="grade-sub-form" class="field" data-sid="${sid}"><div class="field"><label>Skor</label><input class="input" name="score" type="number" value="${cur.score || 0}"></div><div class="field"><label>Feedback</label><textarea class="textarea" name="feedback">${esc(cur.feedback || "")}</textarea></div><button class="btn btn-yellow" type="submit">Simpan Nilai</button></form></div>`;
  }

  function ytEmbed(url) {
    const mch = String(url || "").match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/,
    );
    return mch ? `https://www.youtube.com/embed/${mch[1]}` : "";
  }

  function defaultChapters(m) {
    const how =
      m.type === "audio"
        ? "Dengarkan audio sambil mencatat poin penting. Jeda dan ulangi bagian yang belum jelas."
        : m.type === "video"
          ? "Tonton video sampai selesai. Jeda di bagian penting lalu catat langkahnya."
          : "Ikuti materi halaman demi halaman. Catat istilah baru dan contoh yang muncul.";
    return [
      {
        title: "Orientasi",
        items: [
          {
            title: "Tujuan Pembelajaran",
            body: [
              `Materi ini disusun untuk mapel ${m.subject || "Umum"}${m.class_name ? " kelas " + m.class_name : ""}.`,
              "Setelah menyelesaikan materi ini kamu diharapkan mampu menjelaskan konsep intinya, mempraktikkan langkah kunci, dan menjawab pertanyaan evaluasi.",
            ],
          },
          {
            title: "Cara Mengikuti Materi",
            body: [
              how,
              "Tandai selesai di setiap bagian untuk memantau progresmu. XP dan poin diberikan saat materi ditandai selesai.",
            ],
          },
        ],
      },
      {
        title: "Inti Materi",
        items: [
          {
            title: "Poin-Poin Kunci",
            body: [
              "- Catat istilah baru beserta artinya.",
              "- Tulis dua contoh penerapan materi ini yang kamu temui di lab.",
              "- Tandai bagian yang belum jelas untuk ditanyakan ke guru atau lewat Tanya Bot.",
            ],
          },
          {
            title: "Contoh dan Penerapan",
            body: [
              "Amati contoh pada media utama, lalu hubungkan dengan praktik yang biasa kamu lakukan di lab.",
            ],
          },
        ],
      },
      {
        title: "Latihan dan Evaluasi",
        items: [
          {
            title: "Latihan Mandiri",
            body: [
              "- Tulis rangkuman singkat dengan bahasamu sendiri.",
              "- Kerjakan quiz terkait di menu Quiz untuk mengukur pemahaman.",
            ],
          },
          {
            title: "Cek Pemahaman",
            body: [
              "Jika kamu bisa menjelaskan materi ini kepada teman tanpa membaca ulang, pemahamanmu sudah cukup.",
            ],
          },
        ],
      },
      {
        title: "Penutup",
        items: [
          {
            title: "Rangkuman",
            body: [
              "Ulangi poin penting dari media utama dan catatanmu sebelum lanjut ke materi berikutnya.",
            ],
          },
          {
            title: "Langkah Selanjutnya",
            body: [
              "Tandai materi ini selesai untuk mendapatkan XP dan poin, lalu lanjut ke materi berikutnya.",
            ],
          },
        ],
      },
    ];
  }

  async function materiDetailPage() {
    const list = await unwrap(S.learningModules({}));
    const m = list.find((x) => x.id === state.detailId);
    if (!m) return empty("Materi tidak ditemukan", "Kembali ke daftar materi.");
    if (state._matMod !== m.id) {
      state._matMod = m.id;
      state._materiSec = null;
      state._tocOpen = false;
    }
    const saved = await unwrap(S.offlineSaved ? S.offlineSaved() : []);
    const isSaved = saved.includes(m.id);
    const prog = (state._progress || []).find((p) => p.module_id === m.id);
    const pct = prog ? prog.progress_pct : 0;
    const chapters =
      Array.isArray(m.chapters) && m.chapters.length
        ? m.chapters
        : defaultChapters(m);
    const flat = [];
    chapters.forEach((ch, ci) =>
      (ch.items || []).forEach((it, ii) =>
        flat.push({
          ...it,
          num: `${ci + 1}.${ii + 1}`,
          chap: ch.title,
          chapIdx: ci,
        }),
      ),
    );
    if (!flat.length)
      return empty("Materi kosong", "Belum ada bagian yang bisa dibaca.");
    let secMap =
      (prog && prog.last_position && prog.last_position.sections) || null;
    if (!secMap) {
      secMap = {};
      const k = Math.floor(((pct || 0) / 100) * flat.length);
      flat.slice(0, k).forEach((it) => {
        secMap[it.num] = true;
      });
    }
    if (prog && prog.completed)
      flat.forEach((it) => {
        secMap[it.num] = true;
      });
    const doneCount = flat.filter((it) => secMap[it.num]).length;
    const firstUnfinished = flat.find((it) => !secMap[it.num]);
    const cur = flat.find((it) => it.num === state._materiSec) || flat[0];
    const curIdx = flat.indexOf(cur);
    const prevNum = curIdx > 0 ? flat[curIdx - 1].num : "";
    const nextNum = curIdx < flat.length - 1 ? flat[curIdx + 1].num : "";
    const curDone = !!secMap[cur.num];
    const embed = curIdx === 0 ? ytEmbed(m.media_url) : "";
    const bodyHtml = (() => {
      const out = [];
      let ul = [];
      const flush = () => {
        if (ul.length) {
          out.push(`<ul>${ul.join("")}</ul>`);
          ul = [];
        }
      };
      (cur.body || []).forEach((line) => {
        if (String(line).startsWith("- "))
          ul.push(`<li>${esc(String(line).slice(2))}</li>`);
        else {
          flush();
          out.push(`<p>${esc(line)}</p>`);
        }
      });
      flush();
      return out.join("");
    })();
    const tocHtml = chapters
      .map(
        (ch, ci) => `
        <div class="toc-chap">
          <p class="toc-chap-title">Bab ${ci + 1} · ${esc(ch.title)}</p>
          ${(ch.items || [])
            .map((it, ii) => {
              const num = `${ci + 1}.${ii + 1}`;
              const done = !!secMap[num];
              return `<button type="button" class="toc-item${done ? " done" : ""}${num === cur.num ? " is-current" : ""}" data-toc="${num}"><span class="toc-check" aria-hidden="true"></span><span class="toc-num">${num}</span><span class="toc-name">${esc(it.title)}</span></button>`;
            })
            .join("")}
        </div>`,
      )
      .join("");
    return `<button class="btn" data-nav="materi">${ICON("arrow-left")} Kembali</button>
      <div class="mjax-grid" data-materi-id="${m.id}" data-sec-map='${esc(JSON.stringify(secMap))}' data-sec-list='${esc(JSON.stringify(flat.map((f) => f.num)))}'>
        <aside class="toc-card card${state._tocOpen ? " open" : ""}">
          <div class="toc-head">
            <span class="icon-box sm ${m.type === "audio" ? "purple" : "blue"}">${ICON(m.type === "audio" ? "headphones" : "play-circle", 17)}</span>
            <div class="toc-id"><h2 class="clamp-2">${esc(m.title)}</h2><p class="muted">${doneCount} dari ${flat.length} bagian selesai · ${pct}%</p></div>
          </div>
          <div class="xp-bar" style="margin-top:12px"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
          <div class="toc-done">${!prog?.completed ? `<button class="btn btn-green btn-block" data-module-done="${m.id}">${ICON("check", 14)} Tandai Selesai +XP</button>` : `<span class="badge badge-hadir">${ICON("check", 13)} Materi selesai</span>`}</div>
          <div class="toc-actions">
            <button type="button" class="btn btn-sm toc-toggle" data-toc-toggle>${ICON("list", 15)} Daftar Isi</button>
            ${isSaved ? `<span class="offline-pill saved">${ICON("wifi-off", 12)} Tersimpan offline</span>` : ""}
            ${!navigator.onLine ? `<span class="offline-pill off">Offline</span>` : ""}
          </div>
          <nav class="toc-list" aria-label="Daftar isi materi">${tocHtml}</nav>
        </aside>
        <section class="mjax-main card">
          <div class="mjax-top"><p class="mjax-crumb">Bagian ${curIdx + 1} dari ${flat.length} · Bab ${cur.chapIdx + 1}</p><span class="badge badge-${m.type}">${esc(S.label(m.type))}</span></div>
          <h2 class="mjax-title">${cur.num} · ${esc(cur.title)}</h2>
          ${
            curIdx === 0
              ? `<div class="mjax-note">
            <strong>${ICON("info", 14)} Tentang materi ini</strong>
            <p>${esc(m.description || "Materi dari guru pengampu. Ikuti setiap bagian sampai tuntas, ya.")}</p>
            ${firstUnfinished && firstUnfinished.num !== cur.num ? `<button type="button" class="btn btn-yellow btn-sm" data-toc="${firstUnfinished.num}">${ICON("play-circle", 14)} Lanjutkan</button>` : ""}
          </div>`
              : ""
          }
          <div class="mjax-body">${bodyHtml}</div>
          ${embed ? `<div class="mjax-embed"><iframe src="${embed}" title="${esc(m.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>` : ""}
          <div class="mjax-nav">
            <button type="button" class="btn btn-sm" data-sec-nav="${prevNum}" ${prevNum ? "" : "disabled"}>${ICON("arrow-left", 14)} Sebelumnya</button>
            <button type="button" class="btn btn-sm ${curDone ? "btn-green" : "btn-yellow"}" data-sec-done="${cur.num}">${ICON("check", 14)} ${curDone ? "Selesai" : "Tandai selesai"}</button>
            <button type="button" class="btn btn-sm" data-sec-nav="${nextNum}" ${nextNum ? "" : "disabled"}>Berikutnya ${ICON("arrow-right", 14)}</button>
          </div>
        </section>
      </div>
      <section class="mjax-foot card">
        <div class="hub-actions" style="margin-left:0">
          ${m.media_url ? `<a class="btn" href="${esc(m.media_url)}" target="_blank" rel="noopener">${ICON("external-link", 14)} Buka Media</a>` : ""}
          <button class="btn" data-offline-toggle="${m.id}">${ICON("download", 14)} ${isSaved ? "Hapus dari offline" : "Simpan offline"}</button>
          <button class="btn" data-ask-bot="${m.id}">${ICON("message-circle", 14)} Tanya Bot</button>
        </div>
      </section>`;
  }

  async function dashSiswa() {
    const safeAll = (p) =>
      Promise.resolve()
        .then(() => unwrap(p))
        .catch(() => []);
    const [qz, sched, myTugas, mySubs, mats] = await Promise.all([
      safeAll(S.quizzes({})),
      safeAll(S.mySchedules({})),
      safeAll(S.assignments ? S.assignments({ status: "published" }) : []),
      safeAll(S.submissions ? S.submissions() : []),
      safeAll(S.learningModules ? S.learningModules({}) : []),
    ]);
    const subIds = new Set(mySubs.map((s) => s.assignment_id));
    const pendingTugas = myTugas.filter((a) => !subIds.has(a.id));

    const progById = Object.fromEntries(
      (state._progress || []).map((p) => [p.module_id, p]),
    );
    const subjectIcon = (s) =>
      /matematika/i.test(s)
        ? "calculator"
        : /fisika/i.test(s)
          ? "atom"
          : /kimia/i.test(s)
            ? "flask-conical"
            : /inggris/i.test(s)
              ? "languages"
              : /sejarah/i.test(s)
                ? "landmark"
                : /keamanan/i.test(s)
                  ? "shield"
                  : /jaringan/i.test(s)
                    ? "network"
                    : /pemrograman|web|koding|informatika/i.test(s)
                      ? "code"
                      : "book-open";
    const bySubject = {};
    mats.forEach((m) => {
      const s = m.subject || "Umum";
      (bySubject[s] = bySubject[s] || []).push(m);
    });
    const subjCards = Object.entries(bySubject)
      .map(([name, items]) => {
        const pcts = items.map((m) =>
          Number(progById[m.id]?.progress_pct || 0),
        );
        const pct = Math.round(
          pcts.reduce((a, b) => a + b, 0) / Math.max(1, items.length),
        );
        const quizN = qz.filter(
          (q) => q.status === "published" && (q.subject || "Umum") === name,
        ).length;
        return { name, count: items.length, quizN, pct };
      })
      .sort((a, b) => b.pct - a.pct || b.count - a.count)
      .slice(0, 2);

    const recSeen = new Set((state._recommended || []).map((m) => m.id));
    const recommended = [
      ...(state._recommended || []),
      ...mats.filter((m) => !recSeen.has(m.id)),
    ].slice(0, 3);

    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const upcomingEv = sched
      .filter((j) => new Date(j.starts_at) >= dayStart)
      .sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))
      .slice(0, 2);

    const wallet = state._wallet || {
      poin: 0,
      xp: 0,
      hint: 0,
      level: 1,
      xpToNext: 200,
    };
    const streak = state._streak || { current_streak: 0, longest_streak: 0 };
    const xpPct = Math.max(
      4,
      Math.min(100, Math.round(((wallet.xp % 200) / 200) * 100)),
    );
    const dots = Array.from(
      { length: 7 },
      (_, i) =>
        `<span class="streak-dot${i < Math.min(7, streak.current_streak || 0) ? (i < 2 ? " on" : " fire") : ""}"></span>`,
    ).join("");
    const TIPE_ICON = {
      bimbingan: "compass",
      kelas: "school",
      zoom: "video",
      quiz: "gamepad-2",
      lain: "pin",
    };
    const TYPE_ICON = {
      visual: "tv",
      audio: "headphones",
      video: "clapperboard",
    };
    const jam = (iso) =>
      new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    return `
      <div class="dash-grid">
        <div class="dash-main">
          <section class="dash-sec">
            <div class="section-head"><h2>Progres Belajar</h2><button type="button" class="link-more" data-nav="materi">Lihat semua ${ICON("arrow-right", 14)}</button></div>
            ${
              subjCards.length
                ? `<div class="prog-grid">${subjCards
                    .map(
                      (s, i) => `
              <article class="prog-card">
                <span class="prog-cover acc-${i % 3}">${ICON(subjectIcon(s.name), 30)}</span>
                <h3 class="clamp-2">${esc(s.name)}</h3>
                <p class="muted prog-desc">${s.count} materi · ${s.quizN} quiz</p>
                <div class="prog-bar" role="progressbar" aria-valuenow="${s.pct}" aria-valuemin="0" aria-valuemax="100"><div class="prog-bar-fill" style="width:${s.pct}%"></div></div>
                <span class="prog-pct">${s.pct}%</span>
                <div class="prog-actions">${s.pct >= 100 ? `<span class="badge badge-hadir">${ICON("check", 13)} Selesai</span>` : ""}<button type="button" class="btn btn-sm" data-nav="materi">Lanjut Belajar</button></div>
              </article>`,
                    )
                    .join("")}</div>`
                : empty(
                    "Belum ada materi",
                    "Materi dari tutor akan muncul di sini.",
                  )
            }
          </section>
          <section class="dash-sec">
            <div class="section-head"><h2>Rekomendasi Materi</h2><button type="button" class="link-more" data-nav="materi">Lihat semua ${ICON("arrow-right", 14)}</button></div>
            ${
              recommended.length
                ? `<div class="rec-list">${recommended
                    .map(
                      (m) => `
              <article class="rec-row" data-materi-open="${m.id}" role="button" tabindex="0">
                <span class="rec-thumb t-${esc(m.type)}">${ICON(TYPE_ICON[m.type] || "file-text", 26)}</span>
                <div class="rec-body">
                  <h3 class="clamp-2">${esc(m.title)}</h3>
                  <p class="muted clamp-2 rec-desc">${esc(m.description || "")}</p>
                  <div class="rec-meta"><span class="badge badge-${esc(m.type)}">${S.label(m.type)}</span><span class="rec-mi">${ICON("calendar", 14)} ${fmtDate(m.created_at)}</span></div>
                  <div class="rec-actions"><button type="button" class="btn btn-yellow btn-sm" data-materi-btn="${m.id}">Belajar</button>${m.media_url ? `<a class="btn btn-sm" href="${esc(m.media_url)}" target="_blank" rel="noopener">Buka Media</a>` : ""}</div>
                </div>
                <span class="rec-side">${esc(m.subject || "Umum")}</span>
              </article>`,
                    )
                    .join("")}</div>`
                : empty(
                    "Belum ada rekomendasi",
                    "Selesaikan materi untuk dapat rekomendasi baru.",
                  )
            }
          </section>
          <section class="dash-sec">
            <div class="section-head"><h2>Event Mendatang</h2><button type="button" class="link-more" data-nav="jadwal">Lihat semua ${ICON("arrow-right", 14)}</button></div>
            ${
              upcomingEv.length
                ? `<div class="evt-grid">${upcomingEv
                    .map(
                      (j) => `
              <article class="evt-card">
                <div class="evt-cover t-${esc(j.tipe || "lain")}">${ICON(TIPE_ICON[j.tipe] || "pin", 38)}<span class="evt-chip">${S.label(j.tipe)}</span></div>
                <div class="evt-body">
                  <h3 class="clamp-2">${esc(j.title)}</h3>
                  <div class="evt-row">${ICON("calendar", 15)}<span>${fmtDate(j.starts_at)}</span></div>
                  <div class="evt-row">${ICON("clock", 15)}<span>${jam(j.starts_at)}–${jam(j.ends_at)}</span></div>
                  <div class="evt-row">${ICON("map-pin", 15)}<span>${j.link ? "Online (Zoom)" : "Sekolah"}</span></div>
                  ${j.link ? `<a class="btn btn-yellow btn-sm" href="${esc(j.link)}" target="_blank" rel="noopener">Join</a>` : ""}
                </div>
              </article>`,
                    )
                    .join("")}</div>`
                : empty(
                    "Belum ada event",
                    "Jadwal dari tutor akan muncul di sini.",
                  )
            }
          </section>
        </div>
        <aside class="dash-rail">
          <section class="rail-card">
            <div class="rail-head"><h3>Check-in Harian</h3><span class="rail-ico">${ICON("calendar-check", 20)}</span></div>
            <p class="rail-big" style="display:flex;align-items:center;gap:8px">${ICON("flame", 18)} ${streak.current_streak || 0} hari beruntun</p>
            <div class="streak-dots" aria-label="Streak 7 hari">${dots}</div>
            <p class="muted rail-note">Terpanjang ${streak.longest_streak || 0} hari. Belajar tiap hari biar streak tetap hidup!</p>
            <button type="button" class="link-more" data-nav="profil">Lihat riwayat ${ICON("arrow-right", 14)}</button>
            <button type="button" class="btn btn-yellow rail-btn" data-nav="materi">Mulai Belajar</button>
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Tugas Aktif ${pendingTugas.length ? `<span class="badge">${pendingTugas.length}</span>` : ""}</h3><span class="rail-ico">${ICON("clipboard-list", 20)}</span></div>
            ${
              pendingTugas.length
                ? `<div class="rail-list">${pendingTugas
                    .slice(0, 3)
                    .map(
                      (a) =>
                        `<div class="rail-row">${ICON("file-text", 16)}<div><strong class="clamp-1">${esc(a.title)}</strong><small class="muted">${a.due_at ? "Deadline " + fmtDate(a.due_at) : esc(a.subject || "Umum")}</small></div></div>`,
                    )
                    .join("")}</div>
            <button type="button" class="btn btn-yellow rail-btn" data-nav="tugas">Buka Tugas</button>
            <button type="button" class="btn rail-btn" data-nav="jadwal">Lihat Jadwal</button>`
                : `<p class="muted rail-note">Semua tugas beres!</p><button type="button" class="btn rail-btn" data-nav="tugas">Buka Tugas</button>`
            }
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Poin & Level</h3><span class="rail-ico">${ICON("gift", 20)}</span></div>
            <p class="muted rail-note">Level ${wallet.level} · ${wallet.poin} poin · ${wallet.hint} hint. Selesaikan modul & quiz untuk naik level dan buka hadiah.</p>
            <div class="xp-bar" role="progressbar" aria-valuenow="${xpPct}" aria-valuemin="0" aria-valuemax="100"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
            <small class="muted rail-note">${wallet.xpToNext} XP lagi naik level</small>
            <button type="button" class="btn btn-yellow rail-btn" data-nav="profil">Buka Profil</button>
          </section>
        </aside>
      </div>
      <footer class="dash-foot">© 2026 Educrazy · Platform Belajar Sekolah</footer>`;
  }

  async function dashGuru() {
    const safeAll = (p) =>
      Promise.resolve()
        .then(() => unwrap(p))
        .catch(() => []);
    const [qz, subs, tugas, mats, sched, students] = await Promise.all([
      safeAll(S.quizzes({})),
      safeAll(S.submissions ? S.submissions() : []),
      safeAll(S.assignments ? S.assignments({}) : []),
      safeAll(S.learningModules ? S.learningModules({}) : []),
      safeAll(S.mySchedules ? S.mySchedules({}) : []),
      S.students ? S.students("") : [],
    ]);
    const asgById = Object.fromEntries(tugas.map((a) => [a.id, a]));
    const pending = subs
      .filter((x) => x.status && x.status !== "graded")
      .slice(0, 4);
    const now = new Date();
    const upcoming = sched
      .filter((s) => new Date(s.starts_at) >= now)
      .slice(0, 3);
    const published = qz.filter((q) => q.status === "published").length;
    const first = esc((state.user.name || "").split(" ")[0]);
    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box yellow">${ICON("graduation-cap", 22)}</span><div><h1>Halo, ${first}!</h1><p class="muted">${students.length} murid · ${mats.length} materi · ${published} quiz aktif</p></div></div>
          <div class="hub-actions">
            <button class="btn btn-pink btn-sm" data-open-assignment>${ICON("plus", 15)} Tugas</button>
            <button class="btn btn-yellow btn-sm" data-open-quiz>${ICON("plus", 15)} Quiz</button>
          </div>
        </div>
      </section>
      <div class="dash-grid" style="margin-top:16px">
        <div class="dash-main">
          <section class="dash-sec">
            <div class="section-head"><div><h2>Perlu Dinilai</h2><p>${pending.length ? pending.length + " jawaban menunggu" : "Semua jawaban sudah dinilai"}</p></div><button class="link-more" data-nav="tugas">Buka Tugas ${ICON("arrow-right", 14)}</button></div>
            <div class="card">
              ${
                pending.length
                  ? pending
                      .map(
                        (s) =>
                          `<div class="list-row"><div style="min-width:0"><strong>${esc(S.reporterName(s.user_id))}</strong><div class="muted">${esc(asgById[s.assignment_id]?.title || "Tugas")} · ${fmtDate(s.submitted_at)}</div></div><button class="btn btn-yellow btn-sm" data-grade-sub="${s.id}">${ICON("pen-line", 14)} Nilai</button></div>`,
                      )
                      .join("")
                  : `<p class="muted" style="margin:0">Tidak ada yang menunggu penilaian.</p>`
              }
            </div>
          </section>
          <section class="dash-sec">
            <div class="section-head"><div><h2>Quiz Saya</h2><p>${qz.length} quiz · ${published} dibuka</p></div><button class="link-more" data-nav="quiz">Kelola semua ${ICON("arrow-right", 14)}</button></div>
            <div class="card">
              ${
                qz.length
                  ? qz
                      .slice(0, 4)
                      .map(
                        (q) =>
                          `<div class="list-row"><div style="min-width:0"><strong>${esc(q.title)}</strong><div class="muted">${esc(q.subject || "Umum")} · ${q.duration} menit</div></div><div class="hub-actions"><span class="badge badge-${q.status}">${esc(S.label(q.status))}</span><button class="btn btn-sm" data-quiz-manage="${q.id}">Kelola</button></div></div>`,
                      )
                      .join("")
                  : `<p class="muted" style="margin:0">Belum ada quiz. Mulai dengan membuat quiz game.</p>`
              }
            </div>
          </section>
          <section class="dash-sec">
            <div class="section-head"><div><h2>Materi Terbaru</h2><p>${mats.length} materi visual & audio</p></div><button class="link-more" data-nav="materi">Progres Belajar ${ICON("arrow-right", 14)}</button></div>
            <div class="card">
              ${
                mats.length
                  ? mats
                      .slice(0, 4)
                      .map(
                        (m) =>
                          `<div class="list-row" data-materi-open="${m.id}" style="cursor:pointer"><div style="min-width:0"><strong>${esc(m.title)}</strong><div class="muted">${esc(m.subject || "Umum")}</div></div><span class="badge badge-${m.type}">${esc(S.label(m.type))}</span></div>`,
                      )
                      .join("")
                  : `<p class="muted" style="margin:0">Belum ada materi.</p>`
              }
            </div>
          </section>
        </div>
        <aside class="dash-rail">
          <section class="rail-card">
            <div class="rail-head"><h3>Ringkasan</h3><span class="badge">${students.length} murid</span></div>
            <div class="list-row"><span class="muted">Materi</span><strong>${mats.length}</strong></div>
            <div class="list-row"><span class="muted">Quiz</span><strong>${qz.length}</strong></div>
            <div class="list-row"><span class="muted">Tugas</span><strong>${tugas.length}</strong></div>
            <div class="list-row" style="border-bottom:0"><span class="muted">Menunggu dinilai</span><strong>${pending.length}</strong></div>
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Aksi Cepat</h3></div>
            <button class="btn btn-yellow btn-block" data-open-quiz>${ICON("help-circle", 16)} Buat Quiz</button>
            <button class="btn btn-block" data-open-assignment>${ICON("file-text", 16)} Buat Tugas</button>
            <button class="btn btn-block" data-open-materi>${ICON("book-open", 16)} Tambah Materi</button>
            <button class="btn btn-block" data-open-jadwal>${ICON("calendar", 16)} Buat Jadwal</button>
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Jadwal Terdekat</h3></div>
            ${
              upcoming.length
                ? upcoming
                    .map(
                      (s) =>
                        `<div class="list-row"><div style="min-width:0"><strong class="clamp-1">${esc(s.title)}</strong><span class="muted" style="font-size:12.5px">${fmtDate(s.starts_at)} · ${new Date(s.starts_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span></div><span class="badge">${esc(S.label(s.tipe || "lain"))}</span></div>`,
                    )
                    .join("")
                : `<p class="muted" style="margin:0">Belum ada jadwal mendatang.</p>`
            }
            <button class="link-more" data-nav="jadwal">Lihat jadwal ${ICON("arrow-right", 14)}</button>
          </section>
        </aside>
      </div>`;
  }

  async function dashSekolah() {
    const safeAll = (p) =>
      Promise.resolve()
        .then(() => unwrap(p))
        .catch(() => []);
    const [zs, cp, links] = await Promise.all([
      safeAll(S.zoomSessions ? S.zoomSessions({}) : []),
      safeAll(S.competitions ? S.competitions({}) : []),
      safeAll(S.communityLinks ? S.communityLinks({}) : []),
    ]);
    const students = S.students ? S.students("") : [];
    const classCount = new Set(
      students.map((s) => s.class_name).filter(Boolean),
    ).size;
    const byClass = {};
    students.forEach((s) => {
      const k = s.class_name || "Tanpa kelas";
      byClass[k] = (byClass[k] || 0) + 1;
    });
    const openCp = cp.filter((c) => c.status === "open");
    const upcomingZoom = zs.slice(0, 3);
    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box purple">${ICON("building-2", 22)}</span><div><h1>Dashboard Sekolah</h1><p class="muted">Pantau pembelajaran live, komunitas, dan lomba.</p></div></div>
          <div class="hub-actions">
            <button class="btn btn-pink btn-sm" data-open-competition>${ICON("plus", 15)} Lomba</button>
            <button class="btn btn-yellow btn-sm" data-open-zoom>${ICON("plus", 15)} Sesi Zoom</button>
          </div>
        </div>
      </section>
      <div class="stat-grid" style="margin-top:16px">
        <article class="card stat-card stat-yellow"><div class="stat-top"><span class="icon-box yellow sm">${ICON("users", 18)}</span><span class="badge">${students.length}</span></div><div class="num">${students.length}</div><span class="stat-label">Total Siswa</span></article>
        <article class="card stat-card stat-green"><div class="stat-top"><span class="icon-box green sm">${ICON("school", 18)}</span><span class="badge">${classCount}</span></div><div class="num">${classCount}</div><span class="stat-label">Kelas</span></article>
        <article class="card stat-card stat-blue"><div class="stat-top"><span class="icon-box blue sm">${ICON("video", 18)}</span><span class="badge">${zs.length}</span></div><div class="num">${zs.length}</div><span class="stat-label">Sesi Zoom</span></article>
        <article class="card stat-card stat-purple"><div class="stat-top"><span class="icon-box purple sm">${ICON("trophy", 18)}</span><span class="badge">${openCp.length}</span></div><div class="num">${openCp.length}</div><span class="stat-label">Lomba Buka</span></article>
      </div>
      <div class="dash-grid" style="margin-top:16px">
        <div class="dash-main">
          <section class="dash-sec">
            <div class="section-head"><div><h2>Sesi Zoom</h2><p>${zs.length} sesi terjadwal</p></div><button class="link-more" data-open-zoom>${ICON("plus", 14)} Sesi baru</button></div>
            <div class="card">
              ${
                upcomingZoom.length
                  ? upcomingZoom
                      .map((z) => {
                        const zsLabel =
                          z.status === "live"
                            ? "Live"
                            : z.status === "ended"
                              ? "Selesai"
                              : "Terjadwal";
                        const zsCls =
                          z.status === "live"
                            ? "badge-alpa"
                            : z.status === "ended"
                              ? "badge-closed"
                              : "badge-open";
                        return `<div class="list-row"><div style="min-width:0"><strong>${esc(z.title)}</strong><div class="muted">${esc(z.subject || "")} · ${fmtDate(z.scheduled_at)} · ${z.duration || 60} menit</div></div><div class="hub-actions"><span class="badge ${zsCls}">${zsLabel}</span><button class="btn btn-sm" data-zoom-status="${z.id}">${ICON("refresh-cw", 14)} Status</button><button class="btn btn-sm btn-red btn-icon" data-zoom-del="${z.id}" aria-label="Hapus ${esc(z.title)}" title="Hapus">${ICON("trash-2", 14)}</button></div></div>`;
                      })
                      .join("")
                  : `<p class="muted" style="margin:0">Belum ada sesi zoom. Buat sesi live pertama.</p>`
              }
            </div>
          </section>
          <section class="dash-sec">
            <div class="section-head"><div><h2>Lomba Dibuka</h2><p>${openCp.length} dari ${cp.length} lomba</p></div><button class="link-more" data-nav="lomba">Kelola lomba ${ICON("arrow-right", 14)}</button></div>
            <div class="card">
              ${
                openCp.length
                  ? openCp
                      .slice(0, 4)
                      .map(
                        (c) =>
                          `<div class="list-row"><div style="min-width:0"><strong>${esc(c.title)}</strong><div class="muted">${esc(c.category || "Umum")}${c.deadline ? " · Deadline " + fmtDate(c.deadline) : ""}</div></div><div class="hub-actions"><button class="btn btn-sm" data-lomba-toggle="${c.id}">${ICON("lock", 14)} Tutup</button><button class="btn btn-sm btn-red btn-icon" data-lomba-del="${c.id}" aria-label="Hapus ${esc(c.title)}" title="Hapus">${ICON("trash-2", 14)}</button></div></div>`,
                      )
                      .join("")
                  : `<p class="muted" style="margin:0">Tidak ada lomba dibuka. Tambah lomba baru untuk siswa.</p>`
              }
            </div>
          </section>
        </div>
        <aside class="dash-rail">
          <section class="rail-card">
            <div class="rail-head"><h3>Siswa per Kelas</h3><span class="badge">${classCount} kelas</span></div>
            ${
              Object.keys(byClass).length
                ? Object.keys(byClass)
                    .slice(0, 6)
                    .map(
                      (k) =>
                        `<div class="list-row"><span class="clamp-1">${esc(k)}</span><strong>${byClass[k]}</strong></div>`,
                    )
                    .join("")
                : `<p class="muted" style="margin:0">Data siswa belum tersedia.</p>`
            }
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Komunitas & Link</h3><span class="badge">${links.length} link</span></div>
            ${
              links.length
                ? links
                    .slice(0, 3)
                    .map(
                      (c) =>
                        `<div class="list-row"><div style="min-width:0"><strong class="clamp-1">${esc(c.title)}</strong><span class="muted" style="font-size:12.5px">${esc(c.platform)}</span></div><span class="badge ${c.is_active ? "badge-hadir" : "badge-closed"}">${c.is_active ? "Aktif" : "Nonaktif"}</span></div>`,
                    )
                    .join("")
                : `<p class="muted" style="margin:0">Belum ada link komunitas.</p>`
            }
            <button class="link-more" data-nav="komunitas">Kelola komunitas ${ICON("arrow-right", 14)}</button>
          </section>
          <section class="rail-card">
            <div class="rail-head"><h3>Aksi Cepat</h3></div>
            <button class="btn btn-yellow btn-block" data-open-competition>${ICON("trophy", 16)} Tambah Lomba</button>
            <button class="btn btn-block" data-open-community>${ICON("users", 16)} Tambah Link Komunitas</button>
            <button class="btn btn-block" data-open-materi>${ICON("book-open", 16)} Tambah Materi</button>
          </section>
        </aside>
      </div>`;
  }

  async function quizPage() {
    const isGuru = state.user.role === "guru";
    const q = state._quizQ || { q: "", tipe: "" };
    const all = await unwrap(S.quizzes({}));
    const types = [
      { id: "game", label: "Quiz Game", icon: "zap" },
      { id: "case", label: "Studi Kasus", icon: "file-text" },
    ];
    let filtered = all.filter((qq) => {
      if (q.tipe && qq.tipe !== q.tipe) return false;
      if (q.q) {
        const s = String(q.q).toLowerCase();
        const hay = (
          qq.title +
          " " +
          (qq.subject || "") +
          " " +
          (qq.description || "")
        ).toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
    const canCreate = isGuru;
    const isRemote = S.mode === "supabase";
    const modeBadge = `<span class="badge">${isRemote ? "Supabase" : "Demo lokal"}</span>`;
    const showGamePanel = q.tipe === "game";
    const emptyExtra = `
      <div class="actions-row" style="justify-content:center;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-yellow btn-sm" data-zep-free>${ICON("gamepad-2", 15)} Main EC Games Bebas (soal bawaan)</button>
        ${canCreate ? `<button class="btn btn-sm" data-seed-quiz>${ICON("sprout", 15)} Isi contoh Quiz Game</button>` : ""}
      </div>
      ${!canCreate ? `<p class="muted" style="font-size:12px;margin-top:8px;text-align:center">Belum ada quiz dari guru — main EC Games Bebas dulu, atau minta guru publish quiz Game.</p>` : ""}`;
    const gamePanel = `
      <section class="card quiz-game-panel">
        <span class="qgp-blob qgp-blob-a" aria-hidden="true"></span>
        <span class="qgp-blob qgp-blob-b" aria-hidden="true"></span>
        <div class="qgp-info">
          <span class="kicker">${ICON("gamepad-2", 14)} EC Games · Multiplayer</span>
          <h2 class="qgp-title">Arena <span class="qgp-hl">Quiz Game</span></h2>
          <p class="muted">Main langsung dari sini, tanpa pindah aplikasi. Latihan mandiri atau duel sekelas.</p>
          <div class="qgp-chips">
            <span class="qgp-chip">${ICON("palette", 14)} 4 zona warna</span>
            <span class="qgp-chip">${ICON("timer", 14)} Duel 12 detik</span>
            <span class="qgp-chip">${ICON("lock", 14)} Buka gembok XP</span>
          </div>
          <div class="qgp-actions">
            <button class="btn btn-pink" data-zep-free>${ICON("gamepad-2", 16)} ${isGuru ? "Main / Host Sekarang" : "Main Sekarang"}</button>
            <span class="qgp-note">${ICON("save", 13)} Skor otomatis tersimpan ke progres</span>
          </div>
        </div>
        <div class="qgp-preview" aria-hidden="true">
          <div class="qgp-board">
            <span class="qgp-timer">${ICON("timer", 13)} 12s</span>
            <span class="qgp-cell qgp-y">A</span><span class="qgp-cell qgp-p">B</span><span class="qgp-cell qgp-b">C</span><span class="qgp-cell qgp-t">D</span>
          </div>
          <div class="qgp-hud">
            <span class="qgp-badge">${ICON("star", 12)} XP</span>
            <span class="qgp-badge">${ICON("lock", 12)} Gembok</span>
            <span class="qgp-badge">${ICON("users", 12)} Duel kelas</span>
          </div>
        </div>
      </section>`;
    const renderCard = (qq) => {
      const st = S.label(qq.status);
      const tp = S.label(qq.tipe);
      return `<article class="card materi-card" style="position:relative">
        <div class="card-top-strip ${qq.tipe}"></div>
        <div class="materi-preview placeholder">${ICON(qq.tipe === "game" ? "zap" : "file-text", 28)}</div>
        <div class="materi-body">
          <div class="materi-meta"><span class="badge badge-${qq.status}">${esc(st)}</span><span class="badge">${esc(tp)}</span><span class="muted">${esc(qq.subject || "Umum")}</span></div>
          <h3 class="clamp-2">${esc(qq.title)}</h3>
          <p class="muted clamp-2">${esc(qq.description || "")}</p>
          <p class="muted" style="font-size:12px">${qq.duration} menit · ${esc(S.reporterName(qq.created_by))} · ${fmtDate(qq.created_at)}</p>
          <div class="materi-footer" style="gap:8px;flex-wrap:wrap">
            ${qq.status === "published" && !isGuru ? `<button class="btn btn-yellow btn-sm" data-quiz-take="${qq.id}">Kerjakan</button>` : ""}
            ${qq.tipe === "game" && (qq.status === "published" || isGuru) ? `<button class="btn btn-sm" data-zep-play="${qq.id}">${ICON("gamepad-2", 14)} ${isGuru ? "Host EC Games" : "Main EC Games"}</button>` : ""}
            ${isGuru ? `<button class="btn btn-sm" data-quiz-manage="${qq.id}">Kelola</button><button class="btn btn-sm" data-quiz-delete="${qq.id}">Hapus</button>` : ""}
            ${!isGuru && qq.status !== "published" ? `<span class="badge">${esc(st)}</span>` : ""}
          </div>
        </div>
      </article>`;
    };
    const emptyAll = showGamePanel
      ? `<section class="card qgp-empty"><p class="muted" style="margin:0">Belum ada quiz game dari guru. Main dulu lewat Arena di atas${canCreate ? ", atau isi contoh soal untuk mulai." : "."}</p>${canCreate ? `<div class="actions-row" style="margin-top:12px"><button class="btn btn-yellow btn-sm" data-seed-quiz>${ICON("sprout", 14)} Isi contoh Quiz Game</button></div>` : ""}</section>`
      : empty(
          "Belum ada quiz",
          "Quiz game & studi kasus akan tampil di sini.",
          canCreate ? "quiz" : "",
        ) + emptyExtra;
    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left">
            <span class="icon-box yellow">${ICON("help-circle", 22)}</span>
            <div><h1>Quiz</h1><p class="muted">${canCreate ? "Buat quiz game & studi kasus, kelola soal, lihat nilai siswa." : "Kerjakan quiz dari guru, lihat skor & riwayat."}</p></div>
          </div>
          ${canCreate ? `<button class="btn btn-pink" data-open-quiz>${ICON("plus", 16)} Buat Quiz</button>` : ""}
        </div>
      </section>
      <section class="materi-toolbar card">
        <form id="quiz-filter" class="search-wrap">
          <label class="search-box" style="flex:1"><span class="hidden">Cari quiz</span>${ICON("search", 18)}<input class="input" name="q" placeholder="Cari judul, mapel" value="${esc(q.q)}" /></label>
          <button class="btn btn-yellow" type="submit">${ICON("search", 16)} Cari</button>
        </form>
        <div class="materi-tabs">
          <button class="tab-btn${!q.tipe ? " active" : ""}" data-tipe="">${ICON("grid", 16)} Semua</button>
          ${types.map((t) => `<button class="tab-btn${q.tipe === t.id ? " active" : ""}" data-tipe="${t.id}">${ICON(t.icon, 16)} ${t.label}</button>`).join("")}
        </div>
        <p class="muted" style="font-size:13px">${filtered.length} quiz ditemukan · ${modeBadge}</p>
      </section>
      ${showGamePanel ? gamePanel : ""}
      ${filtered.length ? `<div class="materi-grid">${filtered.map(renderCard).join("")}</div>` : emptyAll}
    `;
  }

  async function quizTakePage() {
    const qq = await unwrap(S.quizById(state.detailId));
    if (!qq) return empty("Quiz tidak ditemukan", "Kembali ke daftar quiz.");
    const isGuru = state.user.role === "guru";
    const qs = await unwrap(S.quizQuestions(qq.id));
    if (isGuru) return quizManagePage(qq, qs);
    const attempt = await unwrap(S.myAttempt(qq.id));
    if (attempt) return quizResultPage(qq, attempt, qs);
    return quizDoPage(qq, qs);
  }

  function quizDoPage(qq, qs) {
    if (!qs.length)
      return `<button class="btn" data-nav="quiz">${ICON("arrow-left")} Kembali</button><div class="card" style="margin-top:16px"><p>Soal belum tersedia.</p></div>`;
    const hintBal = (state._wallet && state._wallet.hint) || 0;
    const totalPoin = qs.reduce((n, q) => n + (Number(q.points) || 0), 0);
    return `
      <button class="btn" data-nav="quiz">${ICON("arrow-left")} Kembali</button>
      <section class="card" style="margin-top:16px">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box pink">${ICON(qq.tipe === "game" ? "zap" : "file-text", 22)}</span><div><h1 class="clamp-1">${esc(qq.title)}</h1><p class="muted">${esc(qq.subject || "Umum")} · ${esc(S.label(qq.tipe))}</p></div></div>
          <div class="hub-actions">
            <span class="dl-chip">${ICON("clock", 14)} ${qq.duration} menit</span>
            <span class="dl-chip">${ICON("list-checks", 14)} ${qs.length} soal</span>
            <span class="dl-chip">${ICON("trophy", 14)} ${totalPoin} poin</span>
            <span class="dl-chip">${ICON("lightbulb", 14)} ${hintBal} petunjuk</span>
          </div>
        </div>
        ${qq.description ? `<p class="muted" style="margin-top:10px">${esc(qq.description)}</p>` : ""}
        ${qq.tipe === "game" ? `<div class="actions-row" style="margin-top:10px"><a class="btn btn-pink btn-sm" href="zep-game/index.html?quizId=${qq.id}" target="_blank" rel="noopener">${ICON("gamepad-2", 15)} Main EC Games (Multiplayer)</a></div>` : ""}
      </section>
      <form id="quiz-do" class="field" style="gap:16px;margin-top:16px">
        ${qs
          .map((q, idx) => {
            const opts = Array.isArray(q.options) ? q.options : [];
            return `<section class="card qz-q" data-qcard="${q.id}">
            <div class="qz-qhead">
              <span class="num-circle">${idx + 1}</span>
              <div class="qz-qbody">
                <strong>${esc(q.question)}</strong>
                <div class="hub-meta" style="margin-top:8px"><span class="dl-chip">${ICON("star", 13)} ${q.points} poin</span><span class="dl-chip">${esc(S.label(q.qtype))}</span></div>
              </div>
            </div>
            ${q.qtype === "pg" ? `<div class="radio-row" style="flex-direction:column;align-items:stretch;margin-top:12px">${opts.map((o) => `<label class="radio-pill" style="justify-content:flex-start"><input type="radio" name="q-${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join("")}</div>` : `<textarea class="textarea" name="q-${q.id}" placeholder="Tulis jawaban studi kasus..." style="margin-top:12px"></textarea>`}
            <div class="actions-row" style="margin-top:10px"><button class="btn btn-sm" type="button" data-hint="${q.id}" data-quiz="${qq.id}">${ICON("lightbulb", 14)} Pakai Petunjuk (1)</button><span class="muted" style="font-size:12px" data-hint-out="${q.id}"></span></div>
          </section>`;
          })
          .join("")}
        <button class="btn btn-yellow" type="submit">${ICON("send", 16)} Kumpulkan Jawaban</button>
      </form>`;
  }

  function quizResultPage(qq, attempt, qs) {
    const pct = attempt.max_score
      ? Math.round((attempt.score / attempt.max_score) * 100)
      : 0;
    const tone =
      attempt.status === "pending"
        ? "wait"
        : pct >= 80
          ? "good"
          : pct >= 60
            ? "mid"
            : "low";
    return `
      <button class="btn" data-nav="quiz">${ICON("arrow-left")} Kembali</button>
      <section class="card" style="margin-top:16px">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box blue">${ICON("clipboard-check", 22)}</span><div><h1 class="clamp-1">${esc(qq.title)}</h1><p class="muted">${esc(S.label(qq.tipe))} · dikumpulkan ${fmtDate(attempt.submitted_at)}</p></div></div>
          <span class="badge badge-${attempt.status}">${esc(S.label(attempt.status))}</span>
        </div>
        <div class="qz-scores">
          <div class="qz-big ${tone}">
            <span class="qz-num">${attempt.score ?? "–"}</span>
            <span class="qz-den">/ ${attempt.max_score}</span>
            ${attempt.status === "pending" ? "" : `<span class="qz-pct">${pct}%</span>`}
          </div>
          ${
            attempt.feedback
              ? `<div class="qz-feedback"><strong>${ICON("message-circle", 14)} Feedback guru</strong><p>${esc(attempt.feedback)}</p></div>`
              : attempt.status === "pending"
                ? `<div class="qz-feedback"><p class="muted" style="margin:0">Menunggu koreksi guru untuk soal essay.</p></div>`
                : ""
          }
        </div>
      </section>
      <section class="dash-sec" style="margin-top:20px">
        <div class="section-head"><div><h2>Review Jawaban</h2><p>${qs.length} soal</p></div></div>
        <div class="qz-review-list">
          ${qs
            .map((q, i) => {
              const my = (attempt.answers || {})[q.id] || "";
              const isPg = q.qtype === "pg";
              const ok = isPg && String(my) === String(q.answer || "");
              const mark = !isPg
                ? `<span class="dl-chip">${esc(S.label(q.qtype))}</span>`
                : ok
                  ? `<span class="badge badge-hadir">${ICON("check", 12)} Benar</span>`
                  : `<span class="badge badge-alpa">${ICON("x", 12)} Salah</span>`;
              return `<article class="card qz-review">
              <div class="qz-qhead">
                <span class="num-circle">${i + 1}</span>
                <div class="qz-qbody">
                  <div class="hub-meta">${mark}<span class="dl-chip">${ICON("star", 13)} ${q.points} poin</span></div>
                  <strong>${esc(q.question)}</strong>
                  <p class="muted" style="margin-top:6px">Jawabanmu: <strong>${esc(my || "—")}</strong></p>
                  ${isPg && !ok ? `<p class="muted" style="margin-top:4px">Kunci: <strong>${esc(q.answer || "—")}</strong></p>` : ""}
                </div>
              </div>
            </article>`;
            })
            .join("")}
        </div>
      </section>`;
  }

  async function quizManagePage(qq, qs) {
    const attempts = await unwrap(S.attempts(qq.id));
    const pending = attempts.filter((a) => a.status === "pending").length;
    const totalPoin = qs.reduce((n, q) => n + (Number(q.points) || 0), 0);
    return `
      <button class="btn" data-nav="quiz">${ICON("arrow-left")} Kembali</button>
      <section class="card" style="margin-top:16px">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box pink">${ICON(qq.tipe === "game" ? "zap" : "file-text", 22)}</span><div><h1 class="clamp-1">${esc(qq.title)}</h1><p class="muted">${esc(qq.subject || "Umum")} · ${qq.duration} menit</p></div></div>
          <div class="hub-actions">
            <span class="badge badge-${qq.status}">${esc(S.label(qq.status))}</span>
            <button class="btn btn-sm" data-quiz-status="${qq.id}">${ICON(qq.status === "published" ? "lock" : "send", 14)} ${qq.status === "published" ? "Tutup" : "Publish"}</button>
          </div>
        </div>
        <div class="hub-meta" style="margin-top:14px">
          <span class="dl-chip">${ICON("list-checks", 14)} ${qs.length} soal</span>
          <span class="dl-chip">${ICON("trophy", 14)} ${totalPoin} poin total</span>
          <span class="dl-chip">${ICON("users", 14)} ${attempts.length} pengerjaan</span>
          ${pending ? `<span class="dl-chip hot">${ICON("pen-line", 14)} ${pending} perlu dinilai</span>` : ""}
          <button class="btn btn-sm btn-yellow" data-open-question="${qq.id}" style="margin-left:auto">${ICON("plus", 14)} Tambah Soal</button>
        </div>
      </section>
      <section class="card" style="margin-top:16px">
        <div class="section-head" style="margin-bottom:8px"><div><h2>Bank Soal</h2><p>${qs.length} soal tersimpan</p></div></div>
        ${qs.length ? qs.map((q, i) => `<div class="list-row"><span class="num-circle sm">${i + 1}</span><div style="min-width:0;flex:1"><strong class="clamp-1">${esc(q.question)}</strong><div class="muted">${esc(S.label(q.qtype))} · ${q.points} poin${q.qtype === "pg" ? " · Kunci: " + esc(q.answer) : ""}</div></div><button class="btn btn-sm btn-red btn-icon" data-del-q="${q.id}" aria-label="Hapus soal" title="Hapus">${ICON("trash-2", 14)}</button></div>`).join("") : '<p class="muted" style="margin:0">Belum ada soal.</p>'}
      </section>
      <section class="card" style="margin-top:16px">
        <div class="section-head" style="margin-bottom:8px"><div><h2>Nilai Siswa</h2><p>${attempts.length} pengerjaan</p></div></div>
        ${attempts.length ? attempts.map((a) => `<div class="list-row"><div style="min-width:0"><strong>${esc(S.reporterName(a.user_id))}</strong><div class="muted">${fmtDate(a.submitted_at)}${a.feedback ? " · " + esc(a.feedback) : ""}</div></div><div class="hub-actions"><span class="badge badge-${a.status}">${a.score ?? "–"}/${a.max_score}</span>${a.status === "pending" ? `<button class="btn btn-sm btn-yellow" data-grade="${a.id}">${ICON("pen-line", 14)} Nilai</button>` : ""}</div></div>`).join("") : '<p class="muted" style="margin:0">Belum ada jawaban.</p>'}
      </section>`;
  }

  function quizForm() {
    return `<div class="modal">
      <div class="modal-head"><h2>Buat quiz</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="quiz-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label>Judul</label><input class="input" name="title" required placeholder="Game: Operasi Jaringan"></div>
        <div class="field"><label>Mapel</label><input class="input" name="subject" placeholder="TKJ 11"></div>
        <div class="field"><label>Tipe</label><div class="radio-row"><label class="radio-pill"><input type="radio" name="tipe" value="game" checked> Game</label><label class="radio-pill"><input type="radio" name="tipe" value="case"> Studi Kasus</label></div></div>
        <div class="field"><label>Durasi (menit)</label><input class="input" name="duration" type="number" min="1" value="15" required></div>
        <div class="field"><label>Deskripsi</label><textarea class="textarea" name="description"></textarea></div>
        <div class="field"><label>Status</label><select class="select" name="status"><option value="draft">Draft</option><option value="published">Publish</option></select></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form>
    </div>`;
  }

  function questionForm(quizId) {
    return `<div class="modal">
      <div class="modal-head"><h2>Tambah soal</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="question-form" class="field" style="gap:12px;margin-top:14px" data-qid="${quizId}">
        <div class="field"><label>Pertanyaan</label><textarea class="textarea" name="question" required placeholder="Tulis soal..."></textarea></div>
        <div class="field"><label>Tipe soal</label><select class="select" name="qtype"><option value="pg">Pilihan Ganda</option><option value="essay">Essay / Studi Kasus</option></select></div>
        <div class="field"><label>Opsi (pisah koma, untuk PG)</label><input class="input" name="options" placeholder="A, B, C, D"></div>
        <div class="field"><label>Kunci jawaban (PG = harus sama persis dengan salah satu opsi)</label><input class="input" name="answer"></div>
        <div class="field"><label>Poin</label><input class="input" name="points" type="number" min="1" value="10"></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan Soal</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form>
    </div>`;
  }

  function gradeForm(attemptId, cur) {
    return `<div class="modal"><div class="modal-head"><h2>Nilai essay</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="grade-form" class="field" data-aid="${attemptId}"><div class="field"><label>Skor</label><input class="input" name="score" type="number" value="${cur.score || 0}"></div><div class="field"><label>Feedback</label><textarea class="textarea" name="feedback">${esc(cur.feedback || "")}</textarea></div><button class="btn btn-yellow" type="submit">Simpan Nilai</button></form></div>`;
  }

  async function jadwalPage() {
    const isGuru = state.user.role === "guru";
    const view = (state._jadwal && state._jadwal.view) || "grid";
    const curDate =
      state._jadwal && state._jadwal.date
        ? new Date(state._jadwal.date)
        : new Date();
    const targetStudent = isGuru ? state._jadwal?.student_id || "" : "";
    let list = isGuru
      ? targetStudent
        ? await unwrap(S.mySchedules({ student_id: targetStudent }))
        : await unwrap(S.mySchedules({}))
      : await unwrap(S.mySchedules({}));

    const students = isGuru ? S.students("") : [];
    // week range Monday-Sunday from curDate
    const start = new Date(curDate);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - (day - 1));
    start.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    const byDay = days.map((d) => ({
      d,
      items: list
        .filter((x) => {
          const ad = new Date(x.starts_at);
          return ad.toDateString() === d.toDateString();
        })
        .sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at))),
    }));

    const weekLabel = curDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

    const typeBadge = (t) =>
      `<span class="badge">${esc(S.label(t || "lain"))}</span>`;
    const timeHM = (iso) =>
      new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const fmtHM = (iso) => {
      const d = new Date(iso);
      return (
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0")
      );
    };
    let minH = 7,
      maxH = 18;
    byDay.forEach(({ items }) =>
      items.forEach((j) => {
        const s = new Date(j.starts_at),
          e = new Date(j.ends_at);
        minH = Math.min(minH, s.getHours());
        maxH = Math.max(maxH, e.getHours() + (e.getMinutes() > 0 ? 1 : 0));
      }),
    );
    maxH = Math.min(maxH, 24);
    const hourPx = 52;
    const hours = Array.from({ length: maxH - minH + 1 }, (_, i) => minH + i);

    const gridHtml = `<section class="week-cal" aria-label="Kalender mingguan">
      <div class="wc-head">
        <div class="wc-head-pad" aria-hidden="true"></div>
        ${byDay
          .map(({ d }) => {
            const isToday = new Date().toDateString() === d.toDateString();
            return `<div class="wc-head-cell${isToday ? " today" : ""}">
            <span class="wc-dow">${d.toLocaleDateString("id-ID", { weekday: "short" })}</span>
            <span class="wc-date">${d.getDate()}</span>
          </div>`;
          })
          .join("")}
      </div>
      <div class="wc-body">
        <div class="wc-gutter"><span class="wc-tz">WIB</span>${hours.map((h) => `<span class="wc-hour">${String(h).padStart(2, "0")}:00</span>`).join("")}</div>
        <div class="wc-days" style="--wc-rows:${maxH - minH};--wc-hpx:${hourPx}px">
          ${byDay
            .map(({ d, items }) => {
              const isToday = new Date().toDateString() === d.toDateString();
              return `<div class="wc-col${isToday ? " today" : ""}">
              <div class="wc-colhead"><span>${d.toLocaleDateString("id-ID", { weekday: "short" })}</span><span class="wc-coldate">${d.getDate()}</span></div>
              ${items
                .map((j) => {
                  const s = new Date(j.starts_at),
                    e = new Date(j.ends_at);
                  const sm = s.getHours() * 60 + s.getMinutes();
                  const em = Math.max(
                    e.getHours() * 60 + e.getMinutes(),
                    sm + 30,
                  );
                  const top = ((sm - minH * 60) / 60) * hourPx;
                  const hgt = Math.max(26, ((em - sm) / 60) * hourPx - 2);
                  return `<article class="wc-ev t-${esc(j.tipe || "lain")}" style="--ev-top:${top}px;--ev-h:${hgt}px">
                  <b>${fmtHM(j.starts_at)}–${fmtHM(j.ends_at)}</b>
                  <span class="wc-ev-title">${esc(j.title)}</span>
                  <small>${S.label(j.tipe)}${isGuru ? " · " + S.reporterName(j.student_id) : ""}</small>
                  ${j.link ? `<a class="wc-ev-join" href="${esc(j.link)}" target="_blank" rel="noopener">Join</a>` : ""}
                  ${isGuru ? `<button type="button" class="wc-ev-del" data-jadwal-del="${j.id}" aria-label="Hapus jadwal">${ICON("x", 14)}</button>` : ""}
                </article>`;
                })
                .join("")}
            </div>`;
            })
            .join("")}
        </div>
      </div>
    </section>`;

    const listHtml = `<div style="display:grid;gap:12px">
      ${
        list.length
          ? list
              .slice(0, 60)
              .map(
                (j) =>
                  `<article class="card"><div class="list-row" style="border:0;padding:0"><div><strong>${esc(j.title)}</strong> ${typeBadge(j.tipe)}<div class="muted">${fmtDate(j.starts_at)} · ${timeHM(j.starts_at)}–${timeHM(j.ends_at)}${isGuru ? " · " + S.reporterName(j.student_id) : ""}</div>${j.notes ? '<p class="muted">' + esc(j.notes) + "</p>" : ""}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${j.link ? '<a class="btn btn-yellow btn-sm" href="' + esc(j.link) + '" target="_blank">Join</a>' : ""} ${isGuru ? '<button class="btn btn-sm" data-jadwal-del="' + j.id + '">Hapus</button>' : ""}</div></div></article>`,
              )
              .join("")
          : empty(
              "Belum ada jadwal",
              "Tutor belum membuat jadwal untukmu.",
              isGuru ? "jadwal" : "",
            )
      }
    </div>`;

    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box yellow">${ICON("calendar", 22)}</span><div><h1>Jadwal</h1><p class="muted">${isGuru ? "Atur jadwal per murid — personal, seperti GCal." : "Jadwal pembelajaran personal dari tutor."}</p></div></div>
          ${isGuru ? `<button class="btn btn-pink" data-open-jadwal>${ICON("plus", 16)} Buat Jadwal</button>` : ""}
        </div>
      </section>
      <section class="card" style="margin-top:12px">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between">
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn" data-jadwal-prev>${ICON("chevron-left", 16)}</button>
            <strong>${weekLabel}</strong>
            <button class="btn" data-jadwal-next>${ICON("chevron-right", 16)}</button>
            <button class="btn" data-jadwal-today>Hari ini</button>
          </div>
          <div class="materi-tabs">
            <button class="tab-btn${view === "grid" ? " active" : ""}" data-jadwal-view="grid">Grid</button>
            <button class="tab-btn${view === "list" ? " active" : ""}" data-jadwal-view="list">List</button>
          </div>
        </div>
        ${isGuru ? `<div style="margin-top:12px"><label class="muted" style="font-size:12px">Filter murid</label><select class="select" data-jadwal-student><option value="">Semua murid (${list.length})</option>${students.map((st) => `<option value="${st.id}" ${targetStudent === st.id ? "selected" : ""}>${esc(st.name)}</option>`).join("")}</select></div>` : ""}
      </section>
      <div style="margin-top:16px">${view === "grid" ? gridHtml : listHtml}</div>`;
  }

  function jadwalForm() {
    const students = S.students("");
    return `<div class="modal"><div class="modal-head"><h2>Buat jadwal untuk murid</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="jadwal-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label>Murid (personal)</label><select class="select" name="student_id" required>${students.map((st) => `<option value="${st.id}">${esc(st.name)} · ${esc(st.class_name)}</option>`).join("")}</select></div>
        <div class="field"><label>Judul</label><input class="input" name="title" required placeholder="Bimbingan LKS / Zoom Materi X"></div>
        <div class="field"><label>Tipe</label><select class="select" name="tipe"><option value="bimbingan">Bimbingan</option><option value="kelas">Kelas</option><option value="zoom">Zoom Live</option><option value="quiz">Quiz</option><option value="lain">Lainnya</option></select></div>
        <div class="field" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Mulai</label><input class="input" name="starts_at" type="datetime-local" required></div><div class="field"><label>Selesai</label><input class="input" name="ends_at" type="datetime-local" required></div></div>
        <div class="field"><label>Link (Zoom/GMeet)</label><input class="input" name="link" placeholder="https://..."></div>
        <div class="field"><label>Catatan</label><textarea class="textarea" name="notes" placeholder="Bawa laptop..."></textarea></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan Jadwal</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form></div>`;
  }

  async function komunitasPage() {
    const canManage = ["guru", "sekolah"].includes(state.user.role);
    const list = await unwrap(S.communityLinks({}));
    const activeCount = list.filter((c) => c.is_active).length;
    const PLAT = {
      whatsapp: { icon: "message-circle", color: "green", label: "WhatsApp" },
      telegram: { icon: "send", color: "blue", label: "Telegram" },
      discord: { icon: "gamepad-2", color: "purple", label: "Discord" },
    };
    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box yellow">${ICON("users", 22)}</span><div><h1>Komunitas</h1><p class="muted">${list.length} grup · ${activeCount} aktif · diskusi & info</p></div></div>
          ${canManage ? `<button class="btn btn-pink" data-open-community>${ICON("plus", 16)} Tambah Link</button>` : ""}
        </div>
      </section>
      ${
        list.length
          ? `<div class="hub-grid">
        ${list
          .map((c) => {
            const p = PLAT[c.platform] || {
              icon: "link",
              color: "teal",
              label: c.platform || "Lainnya",
            };
            return `<article class="hub-card${c.is_active ? "" : " is-off"}">
            <div class="hub-head">
              <span class="icon-box ${p.color}">${ICON(p.icon, 20)}</span>
              <div class="hub-title"><h3 class="clamp-2">${esc(c.title)}</h3><span class="hub-sub">${esc(p.label)}</span></div>
            </div>
            <p class="hub-desc clamp-2">${esc(c.description || "Tanpa deskripsi.")}</p>
            <div class="hub-foot">
              <span class="hub-status${c.is_active ? "" : " off"}"><span class="dot"></span>${c.is_active ? "Aktif" : "Nonaktif"}</span>
              <div class="hub-actions">
                ${c.is_active && c.link ? `<a class="btn btn-yellow btn-sm" href="${esc(c.link)}" target="_blank" rel="noopener">${ICON("external-link", 14)} Gabung</a>` : ""}
                ${canManage ? `<button class="btn btn-sm" data-comm-toggle="${c.id}">${ICON(c.is_active ? "eye-off" : "eye", 14)} ${c.is_active ? "Nonaktifkan" : "Aktifkan"}</button><button class="btn btn-sm btn-red btn-icon" data-comm-del="${c.id}" aria-label="Hapus ${esc(c.title)}" title="Hapus">${ICON("trash-2", 14)}</button>` : ""}
              </div>
            </div>
          </article>`;
          })
          .join("")}
      </div>`
          : empty(
              "Belum ada komunitas",
              "Link grup WA akan muncul di sini.",
              canManage ? "komunitas" : "",
            )
      }
    `;
  }

  function communityForm() {
    return `<div class="modal"><div class="modal-head"><h2>Tambah komunitas</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="community-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label>Nama grup</label><input class="input" name="title" required placeholder="Grup WA Kelas XI TKJ"></div>
        <div class="field"><label>Link undangan</label><input class="input" name="link" required placeholder="https://chat.whatsapp.com/..."></div>
        <div class="field"><label>Platform</label><select class="select" name="platform"><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option><option value="discord">Discord</option></select></div>
        <div class="field"><label>Deskripsi</label><textarea class="textarea" name="description"></textarea></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form></div>`;
  }

  async function lombaPage() {
    const canManage = ["guru", "sekolah"].includes(state.user.role);
    const qq = state._lombaQ || { q: "", status: "" };
    let list = await unwrap(S.competitions({}));
    const openCount = list.filter((c) => c.status === "open").length;
    if (qq.status) list = list.filter((c) => c.status === qq.status);
    if (qq.q) {
      const s = String(qq.q).toLowerCase();
      list = list.filter((c) =>
        (
          (c.title || "") +
          " " +
          (c.description || "") +
          " " +
          (c.category || "")
        )
          .toLowerCase()
          .includes(s),
      );
    }
    const CAT_COLOR = {
      lks: "purple",
      olimpiade: "blue",
      esport: "pink",
      robotik: "teal",
    };
    const catColor = (cat) =>
      CAT_COLOR[String(cat || "").toLowerCase()] || "teal";
    const daysLeft = (d) =>
      d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) : null;
    return `
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box yellow">${ICON("trophy", 22)}</span><div><h1>Info Lomba</h1><p class="muted">${list.length} lomba · ${openCount} masih dibuka</p></div></div>
          ${canManage ? `<button class="btn btn-pink" data-open-competition>${ICON("plus", 16)} Tambah Lomba</button>` : ""}
        </div>
      </section>
      <section class="materi-toolbar card">
        <form id="lomba-filter" class="search-wrap"><label class="search-box" style="flex:1">${ICON("search", 18)}<input class="input" name="q" placeholder="Cari lomba" value="${esc(qq.q)}"></label><button class="btn btn-yellow" type="submit">Cari</button></form>
        <div class="materi-tabs"><button class="tab-btn${!qq.status ? " active" : ""}" data-lomba="">Semua</button><button class="tab-btn${qq.status === "open" ? " active" : ""}" data-lomba="open">Buka</button><button class="tab-btn${qq.status === "closed" ? " active" : ""}" data-lomba="closed">Tutup</button></div>
      </section>
      ${
        list.length
          ? `<div class="hub-grid">
        ${list
          .map((c) => {
            const dl = daysLeft(c.deadline);
            const dlTxt =
              dl === null
                ? ""
                : dl < 0
                  ? "Lewat"
                  : dl === 0
                    ? "Hari ini"
                    : dl + " hari lagi";
            return `<article class="hub-card">
            <div class="hub-head">
              <span class="icon-box ${catColor(c.category)}">${ICON("trophy", 20)}</span>
              <div class="hub-title"><h3 class="clamp-2">${esc(c.title)}</h3><span class="hub-sub">${esc(c.category || "Umum")}</span></div>
              <span class="badge badge-${c.status}">${esc(S.label(c.status))}</span>
            </div>
            <p class="hub-desc clamp-2">${esc(c.description || "Info lengkap lewat tombol di bawah.")}</p>
            ${c.deadline ? `<div class="hub-meta"><span class="dl-chip${dl !== null && dl < 0 ? " past" : dl !== null && dl <= 7 ? " hot" : ""}">${ICON("clock", 14)} ${dlTxt} · ${fmtDate(c.deadline)}</span></div>` : ""}
            <div class="hub-foot">
              <div class="hub-actions">
                ${c.link ? `<a class="btn btn-yellow btn-sm" href="${esc(c.link)}" target="_blank" rel="noopener">${ICON("external-link", 14)} ${c.status === "open" ? "Daftar" : "Info"}</a>` : ""}
                ${canManage ? `<button class="btn btn-sm" data-lomba-toggle="${c.id}">${ICON(c.status === "open" ? "lock" : "unlock", 14)} ${c.status === "open" ? "Tutup" : "Buka"}</button><button class="btn btn-sm btn-red btn-icon" data-lomba-del="${c.id}" aria-label="Hapus ${esc(c.title)}" title="Hapus">${ICON("trash-2", 14)}</button>` : ""}
              </div>
            </div>
          </article>`;
          })
          .join("")}
      </div>`
          : empty(
              "Belum ada lomba",
              "Info lomba akan muncul di sini.",
              canManage ? "lomba" : "",
            )
      }
    `;
  }

  function competitionForm() {
    return `<div class="modal"><div class="modal-head"><h2>Tambah lomba</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="competition-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label>Judul lomba</label><input class="input" name="title" required></div>
        <div class="field"><label>Kategori</label><input class="input" name="category" placeholder="LKS / Olimpiade / Esport"></div>
        <div class="field"><label>Link pendaftaran/info</label><input class="input" name="link" placeholder="https://..."></div>
        <div class="field"><label>Deadline</label><input class="input" name="deadline" type="date"></div>
        <div class="field"><label>Deskripsi</label><textarea class="textarea" name="description"></textarea></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form></div>`;
  }

  async function materiPage() {
    const canCreate = state.user.role === "guru";
    const all = await unwrap(S.learningModules({}));
    const tab = state._materiTab || "learning";
    const progressById = Object.fromEntries(
      (state._progress || []).map((p) => [p.module_id, p]),
    );
    const pctOf = (m) => {
      const p = progressById[m.id];
      return p?.completed ? 100 : Number(p?.progress_pct || 0);
    };
    const learning = all.filter((m) => pctOf(m) < 100);
    const done = all.filter((m) => pctOf(m) >= 100);
    const list = tab === "done" ? done : learning;
    return `
      <section class="pl-head">
        <span class="icon-box yellow" aria-hidden="true">${ICON("book-open", 22)}</span>
        <div class="pl-head-text">
          <h1>Progres Belajar</h1>
          <p class="muted">${canCreate ? "Pantau materi yang dipelajari & diselesaikan siswa — semua kelas." : "Lanjutkan materi yang sedang dipelajari dan lihat yang sudah selesai."}</p>
        </div>
        ${canCreate ? `<button class="btn btn-pink" data-open-materi>${ICON("plus", 16)} Tambah Materi</button>` : ""}
      </section>

      <div class="pl-tabs" role="tablist" aria-label="Filter progres materi">
        <button type="button" class="pl-tab${tab === "learning" ? " active" : ""}" role="tab" aria-selected="${tab === "learning"}" data-pl-tab="learning">Materi yang Dipelajari${learning.length ? ` (${learning.length})` : ""}</button>
        <button type="button" class="pl-tab${tab === "done" ? " active" : ""}" role="tab" aria-selected="${tab === "done"}" data-pl-tab="done">Materi yang Diselesaikan${done.length ? ` (${done.length})` : ""}</button>
      </div>

      ${
        list.length
          ? `<section class="pl-panel">${list
              .map((m) => {
                const pct = pctOf(m);
                return `<article class="pl-row" data-materi-open="${m.id}" role="button" tabindex="0">
          <div class="pl-row-main">
            <strong class="clamp-1">${esc(m.title)}</strong>
            <span class="muted">${esc(S.label(m.type))} · ${esc(m.subject || "Umum")} · ${fmtDate(m.created_at)}</span>
          </div>
          <span class="pl-row-end">${pct >= 100 ? `<span class="badge badge-hadir">${ICON("check", 13)} Selesai</span>` : pct > 0 ? `<span class="badge">${pct}%</span>` : `<span class="pl-go">${ICON("arrow-right", 16)}</span>`}</span>
        </article>`;
              })
              .join("")}</section>`
          : empty(
              tab === "done"
                ? "Belum ada materi selesai"
                : "Tidak ada materi tersisa",
              tab === "done"
                ? "Materi yang sudah kamu tuntaskan akan muncul di sini."
                : "Semua materi sudah diselesaikan — hebat!",
              canCreate ? "materi" : "",
            )
      }
      <footer class="dash-foot">© 2026 Educrazy · Platform Belajar Sekolah</footer>
    `;
  }

  function zoomForm() {
    return `<div class="modal"><div class="modal-head"><h2>Buat sesi Zoom</h2><button class="icon-btn" data-close-modal>${ICON("x", 18)}</button></div>
      <form id="zoom-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label>Judul</label><input class="input" name="title" required placeholder="Live: Routing Dinamis"></div>
        <div class="field"><label>Mapel</label><input class="input" name="subject" placeholder="TKJ 11"></div>
        <div class="field"><label>Link Zoom</label><input class="input" name="zoom_url" required placeholder="https://zoom.us/j/..."></div>
        <div class="field"><label>Jadwal</label><input class="input" name="scheduled_at" type="datetime-local" required></div>
        <div class="field"><label>Durasi (menit)</label><input class="input" name="duration" type="number" value="60" min="10"></div>
        <div class="field"><label>Deskripsi</label><textarea class="textarea" name="description"></textarea></div>
        <div class="actions-row"><button class="btn btn-yellow" type="submit">Simpan</button><button class="btn" data-close-modal type="button">Batal</button></div>
      </form></div>`;
  }

  function materiForm() {
    return `<div class="modal">
      <div class="modal-head"><h2>Tambah materi</h2><button class="icon-btn" type="button" data-close-modal aria-label="Tutup">${ICON("x", 18)}</button></div>
      <p class="muted" style="font-size:13px">Materi visual (video/gambar) atau audio.</p>
      <form id="materi-form" class="field" style="gap:12px;margin-top:14px">
        <div class="field"><label for="m-title">Judul</label><input class="input" id="m-title" name="title" placeholder="Contoh: Dasar-dasar Routing IP" required></div>
        <div class="field"><label for="m-subject">Mapel</label><input class="input" id="m-subject" name="subject" placeholder="Teknologi Jaringan Kabel dan Nirkabel 11"></div>
        <div class="field"><label for="m-class">Tingkat</label>
          <select class="select" id="m-class" name="class_name">
            <option value="">Semua kelas</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
          <p class="form-hint">Kosong = berlaku semua kelas. Pilih X/XI/XII jika materi khusus tingkat tersebut.</p>
        </div>
        <fieldset class="field" style="border:0;padding:0">
          <legend class="field-label">Tipe materi</legend>
          <div class="radio-row">
            <label class="radio-pill"><input type="radio" name="type" value="visual" checked> ${ICON("image", 16)} Visual (video, slide, gambar, link YouTube)</label>
            <label class="radio-pill"><input type="radio" name="type" value="audio"> ${ICON("music", 16)} Audio (podcast, rekaman suara, link audio)</label>
          </div>
        </fieldset>
        <div class="field"><label for="m-desc">Deskripsi</label><textarea class="textarea" id="m-desc" name="description" placeholder="Ringkasan materi, poin pembahasan, durasi..."></textarea></div>
        <div class="field"><label for="m-media">Link media (YouTube, Drive, SoundCloud, dll)</label><input class="input" id="m-media" name="media_url" placeholder="https://..."></div>
        <div class="field"><label for="m-file">Atau upload file (opsional, max 20 MB)</label><input class="input" id="m-file" name="file" type="file" accept=".pdf,.mp4,.webm,.mp3,.wav,.m4a"></div>
        <div class="actions-row">
          <button class="btn btn-yellow" type="submit">Simpan Materi</button>
          <button class="btn" type="button" data-close-modal>Batal</button>
        </div>
      </form>
    </div>`;
  }

  async function notifPage() {
    const list = await unwrap(S.notifications());
    state._notifs = list;
    const unread = list.filter((n) => !n.is_read).length;
    const TYPE_META = {
      quiz: { icon: "help-circle", color: "pink" },
      jadwal: { icon: "calendar", color: "blue" },
      tugas: { icon: "file-text", color: "green" },
    };
    return `
      ${pushBanner()}
      <section class="card">
        <div class="materi-head">
          <div class="materi-head-left"><span class="icon-box yellow">${ICON("bell", 22)}</span><div><h1>Notifikasi</h1><p class="muted">${unread ? unread + " belum dibaca" : "Semua sudah dibaca"} · ${list.length} total</p></div></div>
          ${unread ? `<button class="btn btn-sm" data-read-all>${ICON("check-check", 15)} Tandai semua dibaca</button>` : ""}
        </div>
      </section>
      ${
        list.length
          ? `<div class="notif-list">${list
              .map((n) => {
                const tm = TYPE_META[n.type] || {
                  icon: "bell",
                  color: "purple",
                };
                return `<article class="notif-item${n.is_read ? " read" : ""}">
              <span class="icon-box ${tm.color} sm">${ICON(tm.icon, 17)}</span>
              <div class="notif-body"><strong>${esc(n.title)}</strong><p class="muted">${esc(n.message)}</p><span class="notif-time">${ICON("clock", 12)} ${fmtDate(n.created_at)}</span></div>
              ${n.is_read ? "" : `<div class="notif-actions"><span class="badge badge-alpa">Baru</span><button class="btn btn-sm" data-read="${n.id}">${ICON("check", 14)} Baca</button></div>`}
            </article>`;
              })
              .join("")}</div>`
          : empty(
              "Tidak ada notifikasi",
              "Pembaruan penting akan muncul di sini.",
            )
      }`;
  }

  function profilPage() {
    const u = state.user;
    const w = state._wallet || {
      poin: 0,
      xp: 0,
      hint: 0,
      level: 1,
      transactions: [],
    };
    const streak = state._streak || { current_streak: 0, longest_streak: 0 };
    const pref = (() => {
      try {
        const db = JSON.parse(localStorage.getItem("sekolahku_db_v1") || "{}");
        return (
          (db.student_preferences || []).find((p) => p.user_id === u.id) || null
        );
      } catch (_) {
        return null;
      }
    })();
    const txRows = (w.transactions || []).slice(0, 8);
    const roleLabel =
      u.role === "sekolah"
        ? "Pihak Sekolah"
        : u.role === "guru"
          ? "Guru"
          : "Siswa";
    return `
      ${pushBanner()}
      <section class="card prof-hero">
        <div class="avatar" style="width:84px;height:84px;font-size:28px">${u.photo_url ? `<img src="${u.photo_url}" alt="">` : initials(u.name)}</div>
        <div class="prof-id">
          <span class="kicker">${ICON("badge-check", 14)} ${roleLabel}${u.class_name ? " · " + esc(u.class_name) : ""}</span>
          <h1>${esc(u.name)}</h1>
          <p class="muted">${esc(u.email)}</p>
          ${
            u.role === "siswa"
              ? `<div class="hub-meta" style="margin-top:10px">
            <span class="dl-chip">${ICON("star", 14)} ${w.poin} poin</span>
            <span class="dl-chip">${ICON("zap", 14)} ${w.xp} XP · Lv ${w.level}</span>
            <span class="dl-chip">${ICON("flame", 14)} ${streak.current_streak || 0} hari beruntun</span>
          </div>`
              : ""
          }
        </div>
      </section>
      ${
        state.user.role === "siswa"
          ? walletCard(w, streak) +
            `<section class="card" style="margin-top:12px">
        <div class="section-head" style="margin-bottom:0"><div><h2>Preferensi Belajar</h2><p>Dipakai untuk rekomendasi materi & quiz.</p></div></div>
        <form id="pref-form" class="field" style="gap:10px;margin-top:12px"><div class="chip-row">${["Matematika", "Fisika", "TKJ", "B. Inggris", "Sejarah", "Kimia"].map((s) => `<label class="chip${(pref?.favorite_subjects || []).includes(s) ? " on" : ""}"><input type="checkbox" name="fav" value="${s}" ${(pref?.favorite_subjects || []).includes(s) ? "checked" : ""} class="hidden"> ${s}</label>`).join("")}</div><div class="chip-row" style="margin-top:8px">${[
          ["visual", "Visual"],
          ["audio", "Audio"],
          ["video", "Video"],
          ["quiz", "Quiz"],
        ]
          .map(
            ([v, lb]) =>
              `<label class="chip${(pref?.preferred_methods || []).includes(v) ? " on" : ""}"><input type="checkbox" name="meth" value="${v}" ${(pref?.preferred_methods || []).includes(v) ? "checked" : ""} class="hidden"> ${lb}</label>`,
          )
          .join(
            " ",
          )}</div><input class="input" name="goal" placeholder="Tujuan belajar" value="${esc(pref?.learning_goals || "")}" style="margin-top:8px"><button class="btn btn-yellow" type="submit">Simpan Preferensi</button></form>
      </section>` +
            (txRows.length
              ? `<section class="card" style="margin-top:12px">
        <div class="section-head" style="margin-bottom:8px"><div><h2>Riwayat Poin/XP</h2><p>${txRows.length} transaksi terakhir</p></div></div>
        ${txRows.map((t) => `<div class="list-row"><div style="min-width:0"><strong>${t.type.toUpperCase()} ${t.amount > 0 ? "+" : ""}${t.amount}</strong><div class="muted">${esc(t.source)} · ${fmtDate(t.created_at)} · saldo: ${t.balance_after}</div></div><span class="badge ${t.amount > 0 ? "badge-hadir" : "badge-alpa"}">${t.amount > 0 ? "+" : ""}${t.amount}</span></div>`).join("")}
      </section>`
              : "")
          : ""
      }
      <div class="two-col" style="margin-top:16px">
        <section class="card">
          <div class="section-head" style="margin-bottom:8px"><div><h2>Data Diri</h2><p>Informasi akun kamu.</p></div><span class="icon-box blue sm">${ICON("user", 17)}</span></div>
          <form id="profil-form" class="field" style="gap:12px;margin-top:12px">
            <div class="field"><label for="nm">Nama</label><input class="input" id="nm" name="name" value="${esc(u.name)}" required></div>
            <div class="field"><label for="em">Email</label><input class="input" id="em" name="email" type="email" value="${esc(u.email)}" required></div>
            <div class="field"><label for="nis">NIS / NIP</label><input class="input" id="nis" name="nis_nip" value="${esc(u.nis_nip || "")}"></div>
            <div class="field"><label for="kls">${u.role === "siswa" ? "Kelas" : "Kelas / jabatan"}</label><input class="input" id="kls" name="class_name" value="${esc(u.class_name || "")}"></div>
            <div class="field"><label for="hp">Nomor HP</label><input class="input" id="hp" name="phone" value="${esc(u.phone || "")}"></div>
            <button class="btn btn-yellow" type="submit">Simpan profil</button>
          </form>
        </section>
        <section class="card">
          <div class="section-head" style="margin-bottom:8px"><div><h2>Keamanan</h2><p>Ubah kata sandi akun.</p></div><span class="icon-box purple sm">${ICON("lock", 17)}</span></div>
          <form id="pw-form" class="field" style="gap:12px;margin-top:12px">
            <div class="field"><label for="old">Kata sandi lama</label><input class="input" id="old" name="old" type="password" autocomplete="current-password" required></div>
            <div class="field"><label for="nw">Kata sandi baru</label><input class="input" id="nw" name="nw" type="password" autocomplete="new-password" required minlength="6"></div>
            <button class="btn" type="submit">Ubah kata sandi</button>
          </form>
          <button class="btn btn-red" style="margin-top:24px" data-logout>${ICON("log-out", 16)} Keluar</button>
        </section>
      </div>`;
  }

  function empty(title, desc, cta) {
    const btn =
      cta === "materi"
        ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-materi>${ICON("plus", 16)} Tambah Materi</button>`
        : cta === "quiz"
          ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-quiz>${ICON("plus", 16)} Buat Quiz</button>`
          : cta === "tugas"
            ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-assignment>${ICON("plus", 16)} Buat Tugas</button>`
            : cta === "zoom"
              ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-zoom>${ICON("plus", 16)} Buat Sesi Zoom</button>`
              : cta === "jadwal"
                ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-jadwal>${ICON("plus", 16)} Buat Jadwal</button>`
                : cta === "komunitas"
                  ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-community>${ICON("plus", 16)} Tambah Link</button>`
                  : cta === "lomba"
                    ? `<button class="btn btn-yellow" style="margin-top:14px" data-open-competition>${ICON("plus", 16)} Tambah Lomba</button>`
                    : "";
    return `<div class="card empty">
      <div class="icon-box yellow" style="margin:0 auto 12px">${ICON("inbox", 24)}</div>
      <h2 style="margin:6px 0">${title}</h2>
      <p class="muted" style="max-width:44ch;margin:0 auto">${desc}</p>
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

  function closeStaggeredMenu() {
    const wrap = document.querySelector("[data-sm-wrap].open");
    if (!wrap) return;
    wrap.classList.remove("open");
    wrap.classList.add("closing");
    const toggle = wrap.querySelector("[data-sm-toggle]");
    const panel = wrap.querySelector("[data-sm-panel]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Buka menu");
    }
    if (panel) panel.setAttribute("aria-hidden", "true");
    setTimeout(() => wrap.classList.remove("closing"), 340);
  }

  function bindStaggeredMenu() {
    const wrap = root.querySelector("[data-sm-wrap]");
    if (!wrap) return;
    const toggle = wrap.querySelector("[data-sm-toggle]");
    const panel = wrap.querySelector("[data-sm-panel]");
    if (toggle)
      toggle.addEventListener("click", () => {
        if (wrap.classList.contains("open")) {
          closeStaggeredMenu();
        } else {
          wrap.classList.remove("closing");
          wrap.classList.add("open");
          toggle.setAttribute("aria-expanded", "true");
          toggle.setAttribute("aria-label", "Tutup menu");
          if (panel) panel.setAttribute("aria-hidden", "false");
        }
      });
    if (panel)
      panel
        .querySelectorAll(".sm-item")
        .forEach((a) =>
          a.addEventListener("click", () => closeStaggeredMenu()),
        );
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
      }),
    );
    root.querySelectorAll("[data-logout]").forEach((el) =>
      el.addEventListener("click", async () => {
        await S.logout();
        state.user = null;
        state.view = "landing";
        go("/");
        render();
      }),
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
    bindBot();
    bindStaggeredMenu();

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
        }),
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
      }),
    );
    main.querySelectorAll("[data-logout]").forEach((el) =>
      el.addEventListener("click", async () => {
        await S.logout();
        state.user = null;
        go("/");
        render();
      }),
    );
    main
      .querySelectorAll("[data-open-materi]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(materiForm())),
      );
    main
      .querySelectorAll("[data-open-zoom]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(zoomForm())),
      );
    main
      .querySelectorAll("[data-open-jadwal]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(jadwalForm())),
      );
    main.querySelectorAll("[data-jadwal-del]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!confirm("Hapus jadwal?")) return;
        try {
          await unwrap(S.deleteSchedule(el.dataset.jadwalDel));
          toast("Jadwal dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-jadwal-view]").forEach((el) =>
      el.addEventListener("click", () => {
        state._jadwal = {
          ...(state._jadwal || {}),
          view: el.dataset.jadwalView || "grid",
        };
        hydratePage();
      }),
    );
    const prev = main.querySelector("[data-jadwal-prev]");
    if (prev)
      prev.addEventListener("click", () => {
        const d = new Date(
          (state._jadwal && state._jadwal.date) ||
            new Date().toISOString().slice(0, 10),
        );
        d.setDate(d.getDate() - 7);
        state._jadwal = {
          ...(state._jadwal || {}),
          date: d.toISOString().slice(0, 10),
        };
        hydratePage();
      });
    const nxt = main.querySelector("[data-jadwal-next]");
    if (nxt)
      nxt.addEventListener("click", () => {
        const d = new Date(
          (state._jadwal && state._jadwal.date) ||
            new Date().toISOString().slice(0, 10),
        );
        d.setDate(d.getDate() + 7);
        state._jadwal = {
          ...(state._jadwal || {}),
          date: d.toISOString().slice(0, 10),
        };
        hydratePage();
      });
    const todayBtn = main.querySelector("[data-jadwal-today]");
    if (todayBtn)
      todayBtn.addEventListener("click", () => {
        state._jadwal = {
          ...(state._jadwal || {}),
          date: new Date().toISOString().slice(0, 10),
        };
        hydratePage();
      });
    const selSt = main.querySelector("[data-jadwal-student]");
    if (selSt)
      selSt.addEventListener("change", () => {
        state._jadwal = {
          ...(state._jadwal || {}),
          student_id: selSt.value || "",
        };
        hydratePage();
      });
    main
      .querySelectorAll("[data-open-community]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(communityForm())),
      );
    main
      .querySelectorAll("[data-open-competition]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(competitionForm())),
      );
    main.querySelectorAll("[data-zoom-del]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!confirm("Hapus sesi?")) return;
        try {
          await unwrap(S.deleteZoom(el.dataset.zoomDel));
          toast("Sesi dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-zoom-status]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const list = await unwrap(S.zoomSessions({}));
          const cur = list.find((z) => z.id === el.dataset.zoomStatus);
          const next = !cur
            ? "scheduled"
            : cur.status === "scheduled"
              ? "live"
              : cur.status === "live"
                ? "ended"
                : "scheduled";
          await unwrap(S.updateZoom(el.dataset.zoomStatus, { status: next }));
          toast("Status: " + next);
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-comm-del]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await unwrap(S.deleteCommunity(el.dataset.commDel));
          toast("Dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-comm-toggle]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const list = await unwrap(S.communityLinks({}));
          const cur = list.find((x) => x.id === el.dataset.commToggle);
          await unwrap(
            S.updateCommunity(cur.id, { is_active: !cur.is_active }),
          );
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-lomba-del]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await unwrap(S.deleteCompetition(el.dataset.lombaDel));
          toast("Dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-lomba-toggle]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const list = await unwrap(S.competitions({}));
          const cur = list.find((x) => x.id === el.dataset.lombaToggle);
          await unwrap(
            S.updateCompetition(cur.id, {
              status: cur.status === "open" ? "closed" : "open",
            }),
          );
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    const lf = main.querySelector("#lomba-filter");
    if (lf)
      lf.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(lf);
        state._lombaQ = { q: fd.get("q"), status: state._lombaQ?.status || "" };
        hydratePage();
      });
    main.querySelectorAll("[data-lomba]").forEach((b) =>
      b.addEventListener("click", () => {
        state._lombaQ = {
          ...(state._lombaQ || {}),
          status: b.dataset.lomba || "",
        };
        hydratePage();
      }),
    );
    main
      .querySelectorAll("[data-open-quiz]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(quizForm())),
      );
    const takeTo = (id) => {
      state.detailId = id;
      go("/app/quiz/" + id);
    };
    main
      .querySelectorAll("[data-quiz-take]")
      .forEach((el) =>
        el.addEventListener("click", () => takeTo(el.dataset.quizTake)),
      );
    main
      .querySelectorAll("[data-quiz-manage]")
      .forEach((el) =>
        el.addEventListener("click", () => takeTo(el.dataset.quizManage)),
      );
    main
      .querySelectorAll("[data-zep-play]")
      .forEach((el) =>
        el.addEventListener("click", () =>
          go("#/ecgames/" + el.dataset.zepPlay),
        ),
      );
    main
      .querySelectorAll("[data-zep-free]")
      .forEach((el) => el.addEventListener("click", () => go("#/ecgames")));
    main.querySelectorAll("[data-seed-quiz]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!confirm("Isi 1 contoh Quiz Game + 5 soal PG dan publish?")) return;
        try {
          const qq = await unwrap(
            S.createQuiz({
              title: "Game: Contoh EC Games — Dasar Jaringan",
              subject: "TKJ 11",
              tipe: "game",
              duration: 10,
              description:
                "Contoh Quiz Game untuk dimainkan di EC Games (multiplayer).",
              status: "published",
            }),
          );
          const soal = [
            [
              "Topologi yang semua node terhubung ke hub/switch pusat?",
              ["Star", "Ring", "Bus", "Mesh"],
              "Star",
            ],
            [
              "Perangkat untuk menghubungkan 2 segmen jaringan berbeda?",
              ["Hub", "Router", "Kabel", "NIC"],
              "Router",
            ],
            [
              "IP address versi 4 terdiri dari berapa oktet?",
              ["2", "4", "6", "8"],
              "4",
            ],
            [
              "Bagian tumbuhan tempat fotosintesis terjadi?",
              ["Akar", "Batang", "Daun", "Bunga"],
              "Daun",
            ],
            [
              "Planet terdekat dari Matahari?",
              ["Venus", "Mars", "Merkurius", "Jupiter"],
              "Merkurius",
            ],
          ];
          for (let i = 0; i < soal.length; i++) {
            await unwrap(
              S.createQuestion({
                quiz_id: qq.id,
                question: soal[i][0],
                qtype: "pg",
                options: soal[i][1],
                answer: soal[i][2],
                points: 10,
                order_no: i,
              }),
            );
          }
          toast("Contoh Quiz Game dibuat — tombol Main EC Games muncul");
          state._quizQ = { q: "", tipe: "game" };
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main
      .querySelectorAll("[data-detail]")
      .forEach((el) =>
        el.addEventListener("click", () => takeTo(el.dataset.detail)),
      );
    main.querySelectorAll("[data-quiz-delete]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!confirm("Hapus quiz ini + semua soalnya?")) return;
        try {
          await unwrap(S.deleteQuiz(el.dataset.quizDelete));
          toast("Quiz dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-quiz-status]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const cur = await unwrap(S.quizById(el.dataset.quizStatus));
          const next = cur.status === "published" ? "closed" : "published";
          await unwrap(S.updateQuiz(cur.id, { status: next }));
          toast(next === "published" ? "Quiz dibuka" : "Quiz ditutup");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main
      .querySelectorAll("[data-open-question]")
      .forEach((el) =>
        el.addEventListener("click", () =>
          openModal(questionForm(el.dataset.openQuestion)),
        ),
      );
    main.querySelectorAll("[data-del-q]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await unwrap(S.deleteQuestion(el.dataset.delQ));
          toast("Soal dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-grade]").forEach((el) =>
      el.addEventListener("click", async () => {
        const list = await unwrap(S.attempts(state.detailId));
        const cur = list.find((a) => a.id === el.dataset.grade);
        if (cur) openModal(gradeForm(cur.id, cur));
      }),
    );
    const qf = main.querySelector("#quiz-filter");
    if (qf)
      qf.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(qf);
        state._quizQ = { q: fd.get("q"), tipe: state._quizQ?.tipe || "" };
        hydratePage();
      });
    main.querySelectorAll(".materi-tabs .tab-btn[data-tipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state._quizQ = {
          ...(state._quizQ || {}),
          tipe: btn.dataset.tipe || "",
        };
        hydratePage();
      });
    });
    const qd = main.querySelector("#quiz-do");
    if (qd)
      qd.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(qd);
        const qs = await unwrap(S.quizQuestions(state.detailId));
        const answers = {};
        qs.forEach((qq) => {
          const v = fd.get("q-" + qq.id);
          if (v != null) answers[qq.id] = String(v);
        });
        try {
          if (!navigator.onLine && S.queueOp) {
            await unwrap(
              S.queueOp("submit_attempt", { quizId: state.detailId, answers }),
            );
            toast(
              "Offline — jawaban diantre, akan tersinkron otomatis",
              "info",
            );
            return;
          }
          const res = await unwrap(S.submitAttempt(state.detailId, answers));
          state._wallet = await unwrap(S.wallet ? S.wallet() : null);
          state._streak = await unwrap(S.myStreak ? S.myStreak() : null);
          toast(
            "Jawaban terkumpul. Skor: " +
              res.score +
              "/" +
              res.max_score +
              " +XP +Poin",
          );
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });

    main.querySelectorAll("[data-pl-tab]").forEach((btn) =>
      btn.addEventListener("click", () => {
        state._materiTab = btn.dataset.plTab || "learning";
        hydratePage();
      }),
    );

    main.querySelectorAll("[data-read]").forEach((b) =>
      b.addEventListener("click", async () => {
        await unwrap(S.markRead(b.dataset.read));
        hydratePage();
      }),
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
      }),
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
      }),
    );

    // Tugas
    main
      .querySelectorAll("[data-open-assignment]")
      .forEach((el) =>
        el.addEventListener("click", () => openModal(assignmentForm())),
      );
    main.querySelectorAll("[data-tugas-take]").forEach((el) => {
      el.addEventListener("click", () => {
        state.detailId = el.dataset.tugasTake;
        go("/app/tugas/" + el.dataset.tugasTake);
      });
    });
    main.querySelectorAll("[data-tugas-del]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!confirm("Hapus tugas ini?")) return;
        try {
          await unwrap(S.deleteAssignment(el.dataset.tugasDel));
          toast("Tugas dihapus");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-tugas-toggle]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const cur = await unwrap(S.assignmentById(el.dataset.tugasToggle));
          const next = cur.status === "published" ? "closed" : "published";
          await unwrap(S.updateAssignment(cur.id, { status: next }));
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    const tqf = main.querySelector("#tugas-filter");
    if (tqf)
      tqf.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(tqf);
        state._tugasQ = { ...state._tugasQ, q: fd.get("q") };
        hydratePage();
      });
    main
      .querySelectorAll(".materi-tabs .tab-btn[data-tugas-type]")
      .forEach((btn) =>
        btn.addEventListener("click", () => {
          state._tugasQ = {
            ...state._tugasQ,
            type: btn.dataset.tugasType || "",
          };
          hydratePage();
        }),
      );

    // Materi detail
    main.querySelectorAll("[data-offline-toggle]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await unwrap(S.toggleOffline(el.dataset.offlineToggle));
          toast("Offline list diperbarui");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-module-done]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          await unwrap(
            S.recordModuleProgress(el.dataset.moduleDone, { completed: true }),
          );
          state._wallet = await unwrap(S.wallet());
          state._streak = await unwrap(S.myStreak());
          toast("Modul selesai +XP +Poin");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
    main.querySelectorAll("[data-ask-bot]").forEach((el) =>
      el.addEventListener("click", () => {
        state.detailId = el.dataset.askBot;
        if (window._botCtx)
          window._botCtx = { type: "module", id: el.dataset.askBot };
        openBotModal();
      }),
    );
    const scrollMjax = () => {
      const t = main.querySelector(".mjax-main");
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    main.querySelectorAll("[data-toc-toggle]").forEach((el) =>
      el.addEventListener("click", async () => {
        state._tocOpen = !state._tocOpen;
        await hydratePage();
      }),
    );
    main.querySelectorAll("[data-toc]").forEach((el) =>
      el.addEventListener("click", async () => {
        state._materiSec = el.dataset.toc;
        state._tocOpen = false;
        await hydratePage();
        scrollMjax();
      }),
    );
    main.querySelectorAll("[data-sec-nav]").forEach((el) =>
      el.addEventListener("click", async () => {
        if (!el.dataset.secNav) return;
        state._materiSec = el.dataset.secNav;
        await hydratePage();
        scrollMjax();
      }),
    );
    main.querySelectorAll("[data-sec-done]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const wrap = main.querySelector("[data-materi-id]");
          if (!wrap) return;
          const mid = wrap.dataset.materiId;
          const secList = JSON.parse(wrap.dataset.secList || "[]");
          const secMap = JSON.parse(wrap.dataset.secMap || "{}");
          const total = secList.length || 1;
          const num = el.dataset.secDone;
          const wasDone = !!secMap[num];
          if (wasDone) delete secMap[num];
          else secMap[num] = true;
          const done = secList.filter((k) => secMap[k]).length;
          const patch = {
            progress_pct: Math.round((done / total) * 100),
            last_position: { sections: secMap },
          };
          if (wasDone) patch.completed = false;
          const row = await unwrap(S.recordModuleProgress(mid, patch));
          state._progress = (state._progress || [])
            .filter((p) => p.module_id !== mid)
            .concat(row);
          if (!wasDone) {
            const idx = secList.indexOf(num);
            const next = secList.slice(idx + 1).find((k) => !secMap[k]);
            if (done === total)
              toast("Semua bagian selesai — tandai materi untuk XP + Poin");
            else {
              toast("Bagian selesai");
              if (next) state._materiSec = next;
            }
          } else {
            toast("Tanda selesai dibatalkan", "info");
          }
          await hydratePage();
          scrollMjax();
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );

    // Quiz hints
    main.querySelectorAll("[data-hint]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const qid = btn.dataset.hint;
        const quizId = btn.dataset.quiz;
        const out = document.querySelector(`[data-hint-out="${qid}"]`);
        try {
          const spent = await unwrap(S.spendHint(`${quizId}:${qid}`));
          state._wallet = await unwrap(S.wallet());
          if (out)
            out.textContent =
              "Petunjuk: pecah soal jadi langkah kecil, cek konsep terkait, coba eliminate opsi salah.";
          btn.disabled = true;
          toast("Petunjuk dipakai, saldo petunjuk: " + spent.hint);
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );

    // Profil: wallet / streak / pref
    const prefForm = main.querySelector("#pref-form");
    if (prefForm) {
      prefForm
        .querySelectorAll(".chip input")
        .forEach((c) =>
          c.addEventListener("change", () =>
            c.closest(".chip").classList.toggle("on", c.checked),
          ),
        );
      prefForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(prefForm);
        const fav = fd.getAll("fav").slice(0, 3);
        const meth = fd.getAll("meth");
        try {
          await unwrap(
            S.savePreferences({
              favorite_subjects: fav,
              preferred_methods: meth,
              learning_goals: String(fd.get("goal") || ""),
            }),
          );
          toast("Preferensi diperbarui");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
    }

    // Materi: buka detail
    main.querySelectorAll("[data-materi-btn]").forEach((el) =>
      el.addEventListener("click", () => {
        state.detailId = el.dataset.materiBtn;
        go("/app/materi/" + el.dataset.materiBtn);
      }),
    );
    main.querySelectorAll("[data-materi-open]").forEach((el) => {
      const open = (ev) => {
        if (ev.target.closest("a,button")) return;
        state.detailId = el.dataset.materiOpen;
        go("/app/materi/" + el.dataset.materiOpen);
      };
      el.addEventListener("click", open);
      el.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") open(ev);
      });
    });

    // Tugas: kumpulkan
    const tugasDo = main.querySelector("#tugas-do");
    if (tugasDo)
      tugasDo.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(tugasDo);
        try {
          await unwrap(
            S.submitAssignment(
              state.detailId,
              String(fd.get("answer") || ""),
              [],
            ),
          );
          toast("Tugas terkumpul +XP +Poin +Petunjuk");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
    main.querySelectorAll("[data-grade-sub]").forEach((el) =>
      el.addEventListener("click", async () => {
        try {
          const list = await unwrap(S.submissions(state.detailId));
          const cur = list.find((s) => s.id === el.dataset.gradeSub);
          if (cur) openModal(gradeSubForm(cur.id, cur));
        } catch (ex) {
          toast(ex.message, "error");
        }
      }),
    );
  }

  function bindModal() {
    modalRoot
      .querySelectorAll("[data-close-modal]")
      .forEach((b) => b.addEventListener("click", closeModal));
    const quizF = modalRoot.querySelector("#quiz-form");
    if (quizF)
      quizF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(quizF);
        const btn = quizF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createQuiz({
              title: fd.get("title"),
              subject: fd.get("subject"),
              tipe: fd.get("tipe"),
              duration: Number(fd.get("duration")) || 15,
              description: fd.get("description"),
              status: fd.get("status"),
            }),
          );
          closeModal();
          toast("Quiz dibuat");
          state.detailId = null;
          go("/app/quiz");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const quesF = modalRoot.querySelector("#question-form");
    if (quesF)
      quesF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(quesF);
        const btn = quesF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          const opts = String(fd.get("options") || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
          await unwrap(
            S.createQuestion({
              quiz_id: quesF.dataset.qid,
              question: fd.get("question"),
              qtype: fd.get("qtype"),
              options: opts,
              answer: String(fd.get("answer") || "").trim(),
              points: Number(fd.get("points")) || 10,
            }),
          );
          closeModal();
          toast("Soal ditambah");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const gradeF = modalRoot.querySelector("#grade-form");
    if (gradeF)
      gradeF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(gradeF);
        try {
          await unwrap(
            S.gradeAttempt(
              gradeF.dataset.aid,
              Number(fd.get("score")) || 0,
              String(fd.get("feedback") || ""),
            ),
          );
          closeModal();
          toast("Nilai tersimpan");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
    const zoomF = modalRoot.querySelector("#zoom-form");
    if (zoomF)
      zoomF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(zoomF);
        const btn = zoomF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createZoom({
              title: fd.get("title"),
              subject: fd.get("subject"),
              zoom_url: fd.get("zoom_url"),
              scheduled_at: new Date(
                String(fd.get("scheduled_at")),
              ).toISOString(),
              duration: Number(fd.get("duration")) || 60,
              description: fd.get("description"),
              status: "scheduled",
            }),
          );
          closeModal();
          toast("Sesi Zoom dibuat");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const commF = modalRoot.querySelector("#community-form");
    if (commF)
      commF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(commF);
        const btn = commF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createCommunity({
              title: fd.get("title"),
              link: fd.get("link"),
              platform: fd.get("platform"),
              description: fd.get("description"),
            }),
          );
          closeModal();
          toast("Link komunitas ditambah");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const compF = modalRoot.querySelector("#competition-form");
    if (compF)
      compF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(compF);
        const btn = compF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createCompetition({
              title: fd.get("title"),
              category: fd.get("category"),
              link: String(fd.get("link") || "").trim(),
              deadline: fd.get("deadline")
                ? new Date(String(fd.get("deadline"))).toISOString()
                : "",
              description: fd.get("description"),
              status: "open",
            }),
          );
          closeModal();
          toast("Lomba ditambah");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const jadwalF = modalRoot.querySelector("#jadwal-form");
    if (jadwalF)
      jadwalF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(jadwalF);
        const btn = jadwalF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createSchedule({
              student_id: fd.get("student_id"),
              title: fd.get("title"),
              tipe: fd.get("tipe"),
              starts_at: String(fd.get("starts_at")),
              ends_at: String(fd.get("ends_at")),
              link: String(fd.get("link") || ""),
              notes: String(fd.get("notes") || ""),
            }),
          );
          closeModal();
          toast("Jadwal dibuat");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const assignmentF = modalRoot.querySelector("#assignment-form");
    if (assignmentF)
      assignmentF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(assignmentF);
        const btn = assignmentF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          await unwrap(
            S.createAssignment({
              title: fd.get("title"),
              subject: fd.get("subject"),
              type: fd.get("type"),
              difficulty: fd.get("difficulty"),
              max_points: Number(fd.get("max_points")) || 0,
              max_xp: Number(fd.get("max_xp")) || 0,
              hint_reward: Number(fd.get("hint_reward")) || 0,
              due_at: fd.get("due_at")
                ? new Date(fd.get("due_at")).toISOString()
                : "",
              description: fd.get("description"),
              instructions: fd.get("instructions"),
              status: fd.get("status"),
            }),
          );
          closeModal();
          toast("Tugas dibuat");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
    const gradeSubF = modalRoot.querySelector("#grade-sub-form");
    if (gradeSubF)
      gradeSubF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(gradeSubF);
        const sid = gradeSubF.dataset.sid;
        try {
          await unwrap(
            S.gradeSubmission(
              sid,
              Number(fd.get("score")) || 0,
              String(fd.get("feedback") || ""),
            ),
          );
          closeModal();
          toast("Nilai tersimpan");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        }
      });
    const materiF = modalRoot.querySelector("#materi-form");
    if (materiF)
      materiF.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(materiF);
        const btn = materiF.querySelector('[type="submit"]');
        btn.disabled = true;
        try {
          let media_url = String(fd.get("media_url") || "").trim();
          const file = materiF.file.files[0];
          if (file) {
            if (file.size > 20 * 1024 * 1024)
              throw new Error("File terlalu besar, maksimal 20 MB.");
            media_url = await unwrap(
              S.uploadFile ? S.uploadFile(file) : S.uploadPhoto(file),
            );
          }
          if (!media_url && !String(fd.get("description") || "").trim()) {
            throw new Error("Isi link media/file atau deskripsi materi.");
          }
          await unwrap(
            S.createModule({
              title: fd.get("title"),
              subject: fd.get("subject"),
              class_name: fd.get("class_name") || "",
              type: fd.get("type"),
              description: fd.get("description"),
              media_url,
            }),
          );
          closeModal();
          toast("Materi berhasil disimpan");
          hydratePage();
        } catch (ex) {
          toast(ex.message, "error");
        } finally {
          btn.disabled = false;
        }
      });
  }

  boot();
})();
