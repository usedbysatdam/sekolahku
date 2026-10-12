window.APP_CONFIG = {
  supabaseUrl: "https://xxx.supabase.co",
  supabaseAnonKey: "eyJ...",
  schoolName: "SekolahKu",
  schoolSubtitle: "Sistem Manajemen Sekolah",
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
  fcmVapidKey: "",
  oneSignalAppId: "",
};

window.FCM_ENABLED = Boolean(
  window.APP_CONFIG.firebase &&
  window.APP_CONFIG.firebase.apiKey &&
  window.APP_CONFIG.fcmVapidKey,
);
window.ONESIGNAL_ENABLED = Boolean(window.APP_CONFIG.oneSignalAppId);
