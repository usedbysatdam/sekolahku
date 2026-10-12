window.APP_CONFIG = {
  supabaseUrl: "https://ljthooujdxcfxiamrufu.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdGhvb3VqZHhjZnhpYW1ydWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MjUyOTgsImV4cCI6MjEwNzIwMTI5OH0.SuEFqWOznfA2ixf4_HkQXp4KgEg7ztfzmPfrnihreWs",
  schoolName: "SekolahKu",
  schoolSubtitle: "Sistem Manajemen Sekolah",
  firebase: {
    apiKey: "AIzaSyChi49IQEhH80KCjChgF1nAIbqB40L1YIi",
    authDomain: "sekolahku-b9528.firebaseapp.com",
    projectId: "sekolahku-b9528",
    storageBucket: "sekolahku-b9528.firebasestorage.app",
    messagingSenderId: "437490024020",
    appId: "1:437490024020:web:1443bfab33764df28bf7c1",
  },
  fcmVapidKey:
    "BCfFfTJJSb6_M30G3RBDBaD-H5NRPey3sNfLashfflzHB83CpddgFdvfVRnQ8i_2QZmtP7vnWfoINGd4U-LXYE0",
  oneSignalAppId: "",
};

window.FCM_ENABLED = Boolean(
  window.APP_CONFIG.firebase &&
  window.APP_CONFIG.firebase.apiKey &&
  window.APP_CONFIG.fcmVapidKey,
);
window.ONESIGNAL_ENABLED = Boolean(window.APP_CONFIG.oneSignalAppId);