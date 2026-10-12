(() => {
  const cfg = () => window.APP_CONFIG || {};
  const fcmCfg = () => cfg().firebase || {};
  const fcmEnabled = () => Boolean(fcmCfg().apiKey && cfg().fcmVapidKey);
  const oneSignalEnabled = () => Boolean(cfg().oneSignalAppId);

  let didInit = false;
  let realtimeUnsub = null;
  let fcmMessaging = null;

  const LS_TOKEN = "sekolahku_fcm_token";

  const toast = (msg, type) => {
    if (window.showAppToast) window.showAppToast(msg, type);
  };

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

  async function ensurePermission(fromGesture) {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    if (!fromGesture) return false;
    try {
      const p = await Notification.requestPermission();
      return p === "granted";
    } catch (_) {
      return false;
    }
  }

  function showLocal(title, body, url) {
    toast(`${title}: ${body}`, "info");
    if ("Notification" in window && Notification.permission === "granted" && document.visibilityState === "hidden") {
      const n = new Notification(title, { body: body || "", tag: "sekolahku", data: { url: url || "#/app/notifikasi" } });
      n.onclick = () => {
        window.focus();
        const dest = n.data && n.data.url ? n.data.url : "#/app/notifikasi";
        location.hash = dest.startsWith("#") ? dest.slice(1) : dest;
        n.close();
      };
    }
  }

  async function initFCMCompat() {
    if (!fcmEnabled() || fcmMessaging) return fcmMessaging;
    await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
    await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
    const app = window.firebase.apps && window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(fcmCfg());
    fcmMessaging = window.firebase.messaging(app);
    try {
      fcmMessaging.onMessage((payload) => {
        const n = payload.notification || {};
        const d = payload.data || {};
        showLocal(n.title || d.title || "SekolahKu", n.body || d.body || "Ada pembaruan baru", d.url || "#/app/notifikasi");
      });
    } catch (_) {}
    return fcmMessaging;
  }

  async function fetchFcmToken() {
    const messaging = await initFCMCompat();
    if (!messaging) return null;
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
    const token = await messaging.getToken({ vapidKey: cfg().fcmVapidKey, serviceWorkerRegistration: reg || undefined });
    if (token) {
      try { localStorage.setItem(LS_TOKEN, token); } catch (_) {}
      try { if (window.Store && window.Store.savePushToken) await window.Store.savePushToken("fcm", token); } catch (e) { console.warn(e.message); }
    }
    return token;
  }

  async function initOneSignal() {
    if (!oneSignalEnabled()) return null;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({ appId: cfg().oneSignalAppId, allowLocalhostAsSecureOrigin: true });
      try {
        const id = OneSignal.User?.PushSubscription?.id || (OneSignal.getUserId && (await OneSignal.getUserId()));
        if (id && window.Store?.savePushToken) await window.Store.savePushToken("onesignal", id);
      } catch (_) {}
    });
    if (!document.querySelector('script[src*="OneSignalSDK"]')) {
      await loadScript("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js");
    }
  }

  function setupRealtime() {
    teardownRealtime();
    try {
      if (window.Store && window.Store.subscribeNotifications) {
        realtimeUnsub = window.Store.subscribeNotifications((n) => {
          window.dispatchEvent(new CustomEvent("sekolahku:notif", { detail: n }));
        });
      }
    } catch (e) { console.warn(e.message); }
  }

  function teardownRealtime() {
    try { if (typeof realtimeUnsub === "function") realtimeUnsub(); } catch (_) {}
    realtimeUnsub = null;
  }

  async function init() {
    if (didInit) return;
    didInit = true;
    if (fcmEnabled()) {
      try { await initFCMCompat(); } catch (e) { console.warn("[push] FCM gagal:", e.message); }
    }
    if (oneSignalEnabled()) {
      try { await initOneSignal(); } catch (e) { console.warn("[push] OneSignal gagal:", e.message); }
    }
    setupRealtime();
  }

  async function subscribe() {
    const ok = await ensurePermission(true);
    if (!ok) {
      toast("Izin notifikasi diperlukan. Aktifkan di pengaturan browser/HP.", "error");
      return false;
    }
    if (fcmEnabled()) {
      try { await fetchFcmToken(); } catch (e) { toast(e.message || "Gagal mengaktifkan FCM", "error"); return false; }
    }
    if (oneSignalEnabled() && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try { await OneSignal.Slidedown.promptPush({ force: true }); } catch (_) {}
      });
    }
    if (!fcmEnabled() && !oneSignalEnabled()) {
      setupRealtime();
      toast("Realtime notifikasi aktif (mode demo)", "ok");
      return true;
    }
    toast("Notifikasi HP diaktifkan", "ok");
    return true;
  }

  async function unsubscribe() {
    try { if (fcmMessaging) await fcmMessaging.deleteToken(); } catch (_) {}
    try { localStorage.removeItem(LS_TOKEN); } catch (_) {}
    teardownRealtime();
  }

  function isSubscribed() {
    try { return Boolean(localStorage.getItem(LS_TOKEN)); } catch (_) { return false; }
  }

  function permission() {
    return "Notification" in window ? Notification.permission : "unsupported";
  }

  window.Push = { init, subscribe, unsubscribe, isSubscribed, permission, showLocal };
  window.PushNotifications = window.Push;
})();
