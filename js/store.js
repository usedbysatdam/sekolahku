(() => {
  const KEY = "sekolahku_db_v1";
  const SESSION = "sekolahku_session";
  const SCHEMA_VERSION = 2;

  const seed = () => ({
    schemaVersion: SCHEMA_VERSION,
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
    schedules: [
      { id: "sc1", class_name: "XI TKJ 4", day: "senin", time_start: "06:45", time_end: "08:15", subject: "Kreatif Inovasi dan Kewirausahaan 11 TKJ", teacher_name: "Bagus Fajariyanto, S.Kom", room: "" },
      { id: "sc2", class_name: "XI TKJ 4", day: "senin", time_start: "08:15", time_end: "09:45", subject: "Teknologi Jaringan Kabel dan Nirkabel 11", teacher_name: "Adrian Yogie P. W., S.Pd.", room: "" },
      { id: "sc3", class_name: "XI TKJ 4", day: "senin", time_start: "10:00", time_end: "11:30", subject: "Administrasi Sistem Jaringan 11", teacher_name: "Taufiq Pandu A., S.Pd.", room: "" },
      { id: "sc4", class_name: "XI TKJ 4", day: "senin", time_start: "11:30", time_end: "14:10", subject: "Keamanan Jaringan 11", teacher_name: "Fitria Dewi Piranangingtyas, S.Pd", room: "" },
      { id: "sc5", class_name: "XI TKJ 4", day: "senin", time_start: "14:10", time_end: "15:30", subject: "Pemasangan dan Konfigurasi Perangkat Jaringan 11", teacher_name: "Ahmad Hendrik, S.Pd.", room: "" },
      { id: "sc6", class_name: "XI TKJ 4", day: "selasa", time_start: "06:45", time_end: "08:15", subject: "Bahasa Inggris", teacher_name: "Senda Athara, S.Pd.", room: "" },
      { id: "sc7", class_name: "XI TKJ 4", day: "selasa", time_start: "08:15", time_end: "09:45", subject: "Teknologi Jaringan Kabel dan Nirkabel 11", teacher_name: "Adrian Yogie P. W., S.Pd.", room: "" },
      { id: "sc8", class_name: "XI TKJ 4", day: "selasa", time_start: "10:00", time_end: "12:15", subject: "Kreatif Inovasi dan Kewirausahaan 11 TKJ", teacher_name: "Bakhtiyar Arsada, S.T", room: "" },
      { id: "sc9", class_name: "XI TKJ 4", day: "selasa", time_start: "12:50", time_end: "14:10", subject: "Sejarah", teacher_name: "Tutik Mustajibah, S.Pd", room: "" },
      { id: "sc10", class_name: "XI TKJ 4", day: "selasa", time_start: "14:10", time_end: "15:30", subject: "Bahasa Inggris", teacher_name: "Senda Athara, S.Pd.", room: "" },
      { id: "sc11", class_name: "XI TKJ 4", day: "rabu", time_start: "06:45", time_end: "08:15", subject: "Pendidikan Jasmani, Olahraga, dan Kesehatan", teacher_name: "Drs. Kulut Ariwasono", room: "" },
      { id: "sc12", class_name: "XI TKJ 4", day: "rabu", time_start: "08:15", time_end: "10:45", subject: "Perencanaan dan Pengalamatan Jaringan 11", teacher_name: "Dyah Ayu Novani, S.Pd.", room: "" },
      { id: "sc13", class_name: "XI TKJ 4", day: "rabu", time_start: "10:45", time_end: "13:30", subject: "Matematika", teacher_name: "Septia Wulandari, S.Stat.", room: "" },
      { id: "sc14", class_name: "XI TKJ 4", day: "rabu", time_start: "13:30", time_end: "15:30", subject: "Administrasi Sistem Jaringan 11", teacher_name: "Taufiq Pandu A., S.Pd.", room: "" },
      { id: "sc15", class_name: "XI TKJ 4", day: "kamis", time_start: "06:45", time_end: "09:45", subject: "Mata Pelajaran Pilihan 11 (Membangun Web Server)", teacher_name: "Ardianta Marindra, S.Kom", room: "" },
      { id: "sc16", class_name: "XI TKJ 4", day: "kamis", time_start: "10:00", time_end: "12:15", subject: "Pendidikan Agama dan Budi Pekerti", teacher_name: "Muhammad Choirul Anwar, S.Ag", room: "" },
      { id: "sc17", class_name: "XI TKJ 4", day: "kamis", time_start: "12:50", time_end: "15:30", subject: "Bahasa Indonesia", teacher_name: "Rizki Febrianti, S.Pd", room: "" },
      { id: "sc18", class_name: "XI TKJ 4", day: "jumat", time_start: "06:45", time_end: "08:15", subject: "Pendidikan Pancasila dan Kewarganegaraan", teacher_name: "Sutarni, S.Pd", room: "" },
      { id: "sc19", class_name: "XI TKJ 4", day: "jumat", time_start: "08:15", time_end: "09:45", subject: "Pemasangan dan Konfigurasi Perangkat Jaringan 11", teacher_name: "Ahmad Hendrik, S.Pd.", room: "" },
      { id: "sc20", class_name: "XI TKJ 4", day: "jumat", time_start: "10:00", time_end: "11:30", subject: "Bahasa Mandarin", teacher_name: "Arani Rahmatika, S.Pd", room: "" },
      { id: "sc21", class_name: "XI TKJ 3", day: "senin", time_start: "07:00", time_end: "08:30", subject: "Matematika", teacher_name: "Rina Hartono", room: "R02" },
      { id: "sc22", class_name: "XI TKJ 3", day: "selasa", time_start: "07:00", time_end: "08:30", subject: "Pemrograman Web", teacher_name: "Andi Wijaya", room: "Lab 1" },
    ],
    attendance: [
      { id: "a1", student_id: "u-siswa", teacher_id: "u-guru", class_name: "XI TKJ 4", subject: "Jaringan", date: "2026-10-06", status: "hadir", notes: "" },
      { id: "a2", student_id: "u-siswa", teacher_id: "u-guru", class_name: "XI TKJ 4", subject: "PBO", date: "2026-10-07", status: "hadir", notes: "" },
      { id: "a3", student_id: "u-siswa", teacher_id: "u-guru", class_name: "XI TKJ 4", subject: "PKK", date: "2026-10-08", status: "izin", notes: "Urusan keluarga" },
    ],
    duty: [
      {
        id: "d1",
        student_id: "u-siswa",
        class_name: "XI TKJ 4",
        date: "2026-10-07",
        condition: "bersih",
        activities: "Membersihkan papan tulis, merapikan meja, menyapu lantai.",
        notes: "Sampah sudah dibuang.",
        photo_url: "",
        assigned_students: ["Ahmad Fauzi", "Budi Santoso", "Dammar Pratama"],
        status: "sudah_diperiksa",
        created_at: "2026-10-07T07:20:00.000Z",
      },
    ],
    facility: [
      {
        id: "f1",
        reporter_id: "u-siswa",
        facility_name: "AC",
        category: "Elektronik",
        location: "XI TKJ 4",
        description: "AC tidak mengeluarkan udara dingin sejak pagi.",
        photo_url: "",
        priority: "tinggi",
        status: "diproses",
        handling_notes: "Teknisi dijadwalkan 10 Oktober.",
        created_at: "2026-10-06T08:10:00.000Z",
        updated_at: "2026-10-07T09:00:00.000Z",
      },
      {
        id: "f2",
        reporter_id: "u-guru",
        facility_name: "Lampu",
        category: "Elektronik",
        location: "XI TKJ 3",
        description: "Dua lampu neon mati di sisi jendela.",
        photo_url: "",
        priority: "sedang",
        status: "menunggu",
        handling_notes: "",
        created_at: "2026-10-08T07:40:00.000Z",
        updated_at: "2026-10-08T07:40:00.000Z",
      },
    ],
    history: [
      { id: "h1", report_id: "f1", changed_by: "u-sekolah", old_status: "menunggu", new_status: "diproses", notes: "Teknisi dijadwalkan 10 Oktober.", created_at: "2026-10-07T09:00:00.000Z" },
    ],
    notifications: [
      { id: "n1", user_id: "u-siswa", title: "Laporan diproses", message: "Laporan AC Kelas XI TKJ 4 sedang diproses.", type: "fasilitas", is_read: false, created_at: "2026-10-07T09:01:00.000Z" },
      { id: "n2", user_id: "u-guru", title: "Presensi hari ini", message: "Presensi kelas XI TKJ 4 belum dilakukan.", type: "presensi", is_read: false, created_at: "2026-10-08T06:30:00.000Z" },
      { id: "n3", user_id: "u-sekolah", title: "Laporan baru", message: "Terdapat laporan fasilitas baru: Lampu di XI TKJ 3.", type: "fasilitas", is_read: false, created_at: "2026-10-08T07:41:00.000Z" },
    ],
    push_subscriptions: [],
  });

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let migrated = false;
        if (!parsed.schedules || !Array.isArray(parsed.schedules)) {
          parsed.schedules = seed().schedules;
          parsed.schemaVersion = SCHEMA_VERSION;
          migrated = true;
        } else if (!parsed.schemaVersion || parsed.schemaVersion < SCHEMA_VERSION) {
          parsed.schedules = seed().schedules;
          parsed.schemaVersion = SCHEMA_VERSION;
          migrated = true;
        }
        if (!parsed.push_subscriptions || !Array.isArray(parsed.push_subscriptions)) {
          parsed.push_subscriptions = [];
          migrated = true;
        }
        if (!parsed.schemaVersion) { parsed.schemaVersion = SCHEMA_VERSION; migrated = true; }
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
    schedules(className, role) {
      const me = this.session();
      if (me?.role === "siswa") return load().schedules.filter((s) => s.class_name === me.class_name);
      return load().schedules.filter((s) => !className || s.class_name === className);
    },
    todaySchedule(className, role) {
      const me = this.session();
      if (me?.role === "siswa") className = me.class_name;
      const today = new Date().toLocaleDateString("id-ID", { weekday: "long" }).toLowerCase();
      if (today === "sabtu" || today === "minggu") return [];
      return load().schedules.filter((s) => s.class_name === className && s.day === today).sort((a, b) => a.time_start.localeCompare(b.time_start));
    },
    attendance(filters = {}) {
      const me = this.session();
      if (!me) return [];
      return load().attendance.filter((a) => {
        if (me.role === "siswa" && a.student_id !== me.id) return false;
        if (filters.class_name && a.class_name !== filters.class_name) return false;
        if (filters.date && a.date !== filters.date) return false;
        if (filters.student_id && a.student_id !== filters.student_id) return false;
        return true;
      });
    },
    saveAttendance(records) {
      const db = load();
      const me = this.session();
      records.forEach((r) => {
        const i = db.attendance.findIndex((a) => a.student_id === r.student_id && a.date === r.date && a.subject === r.subject);
        const row = { ...r, teacher_id: me.id, id: i >= 0 ? db.attendance[i].id : uid() };
        if (i >= 0) db.attendance[i] = row;
        else db.attendance.push(row);
      });
      save(db);
    },
    dutyReports() {
      const me = this.session();
      if (!me) return [];
      return load().duty.filter((d) => me.role !== "siswa" || d.student_id === me.id);
    },
    createDuty(payload) {
      const db = load();
      const me = this.session();
      const { id, student_id, status, created_at, ...safe } = payload || {};
      const row = { ...safe, id: uid(), student_id: me.id, status: "belum_diperiksa", photo_url: safe.photo_url || "", created_at: new Date().toISOString() };
      db.duty.unshift(row);
      const n = {
        id: uid(),
        user_id: "u-guru",
        title: "Laporan piket baru",
        message: `Laporan piket ${row.class_name} sudah dikirim.`,
        type: "piket",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      db.notifications.push(n);
      _emitLocal(n);
      save(db);
      return row;
    },
    reviewDuty(id) {
      const db = load();
      const row = db.duty.find((d) => d.id === id);
      if (row) row.status = "sudah_diperiksa";
      save(db);
    },
    facilityReports() {
      const me = this.session();
      const all = load().facility;
      if (!me) return [];
      if (me.role === "siswa") return all.filter((f) => f.reporter_id === me.id);
      return all;
    },
    facilityById(id) {
      return this.facilityReports().find((f) => f.id === id) || load().facility.find((f) => f.id === id);
    },
    createFacility(payload) {
      const db = load();
      const me = this.session();
      const { id, reporter_id, status, handling_notes, created_at, updated_at, ...safe } = payload || {};
      const row = {
        ...safe,
        id: uid(),
        reporter_id: me.id,
        status: "menunggu",
        handling_notes: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.facility.unshift(row);
      const n = {
        id: uid(),
        user_id: "u-sekolah",
        title: "Laporan fasilitas baru",
        message: `Terdapat laporan ${row.facility_name} di ${row.location}.`,
        type: "fasilitas",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      db.notifications.push(n);
      _emitLocal(n);
      save(db);
      return row;
    },
    updateFacility(id, patch) {
      const db = load();
      const me = this.session();
      const row = db.facility.find((f) => f.id === id);
      if (!row) throw new Error("Laporan tidak ditemukan.");
      const old = row.status;
      Object.assign(row, patch, { updated_at: new Date().toISOString() });
      if (patch.status && patch.status !== old) {
        db.history.unshift({
          id: uid(),
          report_id: id,
          changed_by: me.id,
          old_status: old,
          new_status: patch.status,
          notes: patch.handling_notes || "",
          created_at: new Date().toISOString(),
        });
        const n = {
          id: uid(),
          user_id: row.reporter_id,
          title: "Status laporan diperbarui",
          message: `Laporan ${row.facility_name} sekarang: ${labelStatus(patch.status)}.`,
          type: "fasilitas",
          is_read: false,
          created_at: new Date().toISOString(),
        };
        db.notifications.push(n);
        _emitLocal(n);
      }
      save(db);
      return row;
    },
    history(reportId) {
      return load().history.filter((h) => !reportId || h.report_id === reportId);
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
    async schedules(className) {
      const me = this.session();
      if (me?.role === "siswa") className = me.class_name;
      let q = sb().from("class_schedules").select("*").order("time_start");
      if (className) q = q.eq("class_name", className);
      const { data, error } = await q;
      if (error) throw error;
      const order = { senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5 };
      return (data || []).sort((a, b) => (order[a.day] || 99) - (order[b.day] || 99) || a.time_start.localeCompare(b.time_start));
    },
    async todaySchedule(className) {
      const me = this.session();
      if (me?.role === "siswa") className = me.class_name;
      const today = new Date().toLocaleDateString("id-ID", { weekday: "long" }).toLowerCase();
      if (today === "sabtu" || today === "minggu") return [];
      let q = sb().from("class_schedules").select("*").eq("day", today).order("time_start");
      if (className) q = q.eq("class_name", className);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async attendance(filters = {}) {
      let q = sb().from("attendance").select("*").order("date", { ascending: false });
      if (filters.class_name) q = q.eq("class_name", filters.class_name);
      if (filters.date) q = q.eq("date", filters.date);
      if (filters.student_id) q = q.eq("student_id", filters.student_id);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    async saveAttendance(records) {
      const me = this.session();
      const rows = records.map((r) => ({ ...r, teacher_id: me.id }));
      const { error } = await sb().from("attendance").upsert(rows, { onConflict: "student_id,date,subject" });
      if (error) throw error;
    },
    async dutyReports() {
      const { data, error } = await sb().from("duty_reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async createDuty(payload) {
      const me = this.session();
      const { data, error } = await sb().from("duty_reports").insert({ ...payload, student_id: me.id }).select().single();
      if (error) throw error;
      return data;
    },
    async reviewDuty(id) {
      const { error } = await sb().from("duty_reports").update({ status: "sudah_diperiksa" }).eq("id", id);
      if (error) throw error;
    },
    async facilityReports() {
      const { data, error } = await sb().from("facility_reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async facilityById(id) {
      const { data, error } = await sb().from("facility_reports").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    async createFacility(payload) {
      const me = this.session();
      const { data, error } = await sb().from("facility_reports").insert({ ...payload, reporter_id: me.id, status: "menunggu" }).select().single();
      if (error) throw error;
      return data;
    },
    async updateFacility(id, patch) {
      const current = await this.facilityById(id);
      const { data, error } = await sb().from("facility_reports").update(patch).eq("id", id).select().single();
      if (error) throw error;
      if (patch.status && patch.status !== current.status) {
        await sb().from("facility_status_history").insert({
          report_id: id,
          changed_by: this.session().id,
          old_status: current.status,
          new_status: patch.status,
          notes: patch.handling_notes || "",
        });
        await sb().from("notifications").insert({
          user_id: current.reporter_id,
          title: "Status laporan diperbarui",
          message: `Laporan ${current.facility_name} sekarang: ${labelStatus(patch.status)}.`,
          type: "fasilitas",
        });
      }
      return data;
    },
    async history(reportId) {
      let q = sb().from("facility_status_history").select("*").order("created_at", { ascending: false });
      if (reportId) q = q.eq("report_id", reportId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
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
        menunggu: "Menunggu",
        diproses: "Diproses",
        perbaikan: "Dalam Perbaikan",
        selesai: "Selesai",
        ditolak: "Ditolak",
        hadir: "Hadir",
        izin: "Izin",
        sakit: "Sakit",
        alpa: "Alpa",
        belum_diperiksa: "Belum diperiksa",
        sudah_diperiksa: "Sudah diperiksa",
        sangat_bersih: "Sangat Bersih",
        bersih: "Bersih",
        cukup_bersih: "Cukup Bersih",
        kotor: "Kotor",
        rendah: "Rendah",
        sedang: "Sedang",
        tinggi: "Tinggi",
        darurat: "Darurat",
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
