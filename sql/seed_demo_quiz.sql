-- Seed 3 Quiz Demo — jalanin di Supabase SQL Editor > New Query > Run (bisa diulang)
-- SQL Editor jalan sebagai postgres (bypass RLS), jadi insert guru tidak ditolak.
-- Sekalian perbaiki current_role() + policy insert quiz agar "Buat Quiz" dari aplikasi jalan.
create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
grant execute on function public.current_role() to authenticated, anon;

drop policy if exists "quizzes_insert_guru" on public.quizzes;
create policy "quizzes_insert_guru" on public.quizzes for insert to authenticated
  with check (created_by = auth.uid() and public.current_role() = 'guru');

drop policy if exists "qq_write_guru" on public.quiz_questions;
create policy "qq_write_guru" on public.quiz_questions for all to authenticated
  using (public.current_role() = 'guru')
  with check (public.current_role() = 'guru');

do $$
declare
  gid uuid;
  q1 uuid; q2 uuid; q3 uuid;
begin
  select id into gid from public.profiles where role='guru' limit 1;

  delete from public.quiz_questions where quiz_id in (select id from public.quizzes where title in ('Game: Subnetting Kilat','Game: Keamanan Jaringan — Phishing','Studi Kasus: Internet Lab Lumpuh'));
  delete from public.quizzes where title in ('Game: Subnetting Kilat','Game: Keamanan Jaringan — Phishing','Studi Kasus: Internet Lab Lumpuh');

  insert into public.quizzes (title, subject, class_name, description, tipe, duration, status, created_by, published_at)
  values ('Game: Subnetting Kilat','TKJ 11','XI TKJ 4','Kuis game pilihan ganda 5 soal — hitung subnet /24 & /26. Skor langsung + poin/XP.', 'game', 10, 'published', gid, now()),
         ('Game: Keamanan Jaringan — Phishing','TKJ 11','XI TKJ 4','Kenali phishing, social engineering, dan mitigasi. 4 soal PG + 1 essay singkat.', 'game', 12, 'published', gid, now()),
         ('Studi Kasus: Internet Lab Lumpuh','TKJ 11','XI TKJ 4','Lab bisa ping lokal tapi tidak internet. Analisa berlapis + tulis langkah diagnosis.', 'case', 25, 'published', gid, now());

  select id into q1 from public.quizzes where title='Game: Subnetting Kilat' limit 1;
  select id into q2 from public.quizzes where title='Game: Keamanan Jaringan — Phishing' limit 1;
  select id into q3 from public.quizzes where title='Studi Kasus: Internet Lab Lumpuh' limit 1;

  insert into public.quiz_questions (quiz_id, question, qtype, options, answer, points, order_no) values
  (q1, 'Berapa jumlah host usable pada subnet /26?', 'pg', '["62","64","30","126"]'::jsonb, '62', 10, 0),
  (q1, 'IP 192.168.10.0/24 dibagi jadi 4 subnet sama besar. Berapa prefix baru?', 'pg', '["/25","/26","/27","/28"]'::jsonb, '/26', 10, 1),
  (q1, 'Subnet mask /27 dalam desimal adalah?', 'pg', '["255.255.255.224","255.255.255.192","255.255.255.240","255.255.255.0"]'::jsonb, '255.255.255.224', 10, 2),
  (q1, 'Berapa subnet yang dihasilkan jika /24 dipecah jadi /28?', 'pg', '["4","8","16","32"]'::jsonb, '16', 10, 3),
  (q1, 'Gateway biasanya diletakkan di alamat?', 'pg', '["Alamat pertama host","Alamat terakhir host","Alamat network","Alamat broadcast"]'::jsonb, 'Alamat pertama host', 10, 4),
  (q2, 'Ciri email phishing yang paling umum?', 'pg', '["Pengirim tidak dikenal + link mencurigakan","Logo sekolah rapi","Bahasa formal","Ada tanda tangan"]'::jsonb, 'Pengirim tidak dikenal + link mencurigakan', 10, 0),
  (q2, 'Langkah pertama saat curiga link phishing?', 'pg', '["Klik dulu untuk cek","Hover/cek URL tanpa klik","Forward ke teman","Abaikan"]'::jsonb, 'Hover/cek URL tanpa klik', 10, 1),
  (q2, '2FA (OTP) berguna untuk?', 'pg', '["Mencegah phishing 100%","Mempersulit pembobolan meski password bocor","Mempercepat login","Mengganti password"]'::jsonb, 'Mempersulit pembobolan meski password bocor', 10, 2),
  (q2, 'Jelaskan 2 cara sekolah edukasi siswa agar tidak kena phishing (essay singkat, dinilai guru).', 'essay', '[]'::jsonb, '', 20, 3),
  (q3, 'Lab: semua PC bisa ping antar-PC dan ke server lokal, tapi tidak bisa ping 8.8.8.8. Sebutkan 3 langkah diagnosis berurutan + alasan tiap langkah.', 'essay', '[]'::jsonb, '', 30, 0),
  (q3, 'Jika traceroute berhenti di gateway, apa hipotesis utama dan 1 perintah untuk verifikasi?', 'essay', '[]'::jsonb, '', 20, 1),
  (q3, 'Tuliskan 2 langkah pencegahan agar kasus serupa tidak terulang (dokumentasi/topologi/monitoring).', 'essay', '[]'::jsonb, '', 20, 2);
  raise notice 'Seed OK: % % %', q1, q2, q3;
end $$;
select title, tipe, status from public.quizzes order by created_at desc limit 5;
