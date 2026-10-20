-- ============================================================
-- RESET DATABASE Educrazy / SekolahKu  (DESTRUKTIF)
-- Jalankan di Supabase SQL Editor > New Query > Run.
-- Menghapus SEMUA tabel & policy milik aplikasi di schema public
-- + policy storage. TIDAK menghapus akun di Authentication > Users.
--
-- Urutan pakai setelah file ini:
--   1) reset.sql        (file ini)
--   2) schema.sql       (buat ulang semua tabel, RLS, realtime, bucket)
--   3) seed_demo_quiz.sql  (opsional: 3 kuis demo)
-- Lalu di aplikasi tekan Ctrl+Shift+R.
-- ============================================================

begin;

-- Tabel (CASCADE sekaligus membuang FK, index, trigger, dan policy-nya)
drop table if exists public.offline_queue        cascade;
drop table if exists public.chat_messages        cascade;
drop table if exists public.chat_sessions        cascade;
drop table if exists public.submissions          cascade;
drop table if exists public.assignments          cascade;
drop table if exists public.student_streaks      cascade;
drop table if exists public.lesson_progress      cascade;
drop table if exists public.reward_transactions  cascade;
drop table if exists public.student_preferences  cascade;
drop table if exists public.schedules_personal   cascade;
drop table if exists public.competitions         cascade;
drop table if exists public.community_links      cascade;
drop table if exists public.zoom_sessions        cascade;
drop table if exists public.push_subscriptions   cascade;
drop table if exists public.quiz_attempts        cascade;
drop table if exists public.quiz_questions       cascade;
drop table if exists public.quizzes              cascade;
drop table if exists public.learning_modules     cascade;
drop table if exists public.notifications        cascade;
drop table if exists public.classes             cascade;
drop table if exists public.profiles            cascade;

-- Fungsi bantu
drop function if exists public.current_role()   cascade;
drop function if exists public.set_updated_at() cascade;

-- Policy pada storage (bukan di public, jadi tidak ikut ter-drop di atas)
drop policy if exists "photos_public_read" on storage.objects;
drop policy if exists "photos_auth_write"  on storage.objects;

commit;

-- Catatan:
-- * Bucket 'report-photos' sengaja TIDAK dihapus agar file tidak hilang;
--   schema.sql akan memakainya kembali (on conflict do nothing).
-- * Ingin hapus akun Auth juga? Buka Authentication > Users di Dashboard,
--   atau gunakan reset penuh via Dashboard: Settings > Database > Reset database
--   (ini menghapus SEGALANYA termasuk Auth users & file storage).
