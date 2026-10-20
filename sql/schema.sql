-- SekolahKu — jalankan di Supabase SQL Editor
-- Setelah ini: Authentication > Users > buat 3 akun, lalu isi tabel profiles.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text not null check (role in ('siswa', 'guru', 'sekolah')),
  class_name text,
  nis_nip text,
  phone text,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  homeroom_teacher_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  class_name text,
  description text,
  type text not null check (type in ('visual', 'audio')),
  media_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  class_name text,
  description text,
  tipe text not null check (tipe in ('game','case')) default 'game',
  duration int not null default 15 check (duration > 0),
  status text not null check (status in ('draft','published','closed')) default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  published_at timestamptz
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  qtype text not null check (qtype in ('pg','essay')) default 'pg',
  options jsonb default '[]'::jsonb,
  answer text,
  points int not null default 10 check (points > 0),
  order_no int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb default '{}'::jsonb,
  score int not null default 0,
  max_score int not null default 0,
  status text not null check (status in ('graded','pending')) default 'graded',
  feedback text,
  graded_by uuid references public.profiles(id),
  started_at timestamptz default now(),
  submitted_at timestamptz default now(),
  unique (quiz_id, user_id)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('fcm', 'onesignal')),
  token text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, token)
);

create table if not exists public.zoom_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  class_name text,
  description text,
  zoom_url text not null,
  scheduled_at timestamptz not null,
  duration int not null default 60,
  status text not null check (status in ('scheduled','live','ended','cancelled')) default 'scheduled',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.community_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  link text not null,
  platform text not null check (platform in ('whatsapp','telegram','discord')) default 'whatsapp',
  class_name text,
  description text,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  category text,
  deadline timestamptz,
  poster_url text,
  status text not null check (status in ('open','closed','archive')) default 'open',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.schedules_personal (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  tipe text not null check (tipe in ('zoom','kelas','bimbingan','quiz','lain')) default 'kelas',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  link text,
  notes text,
  color text default 'yellow',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  check (ends_at > starts_at)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_push_sub_updated on public.push_subscriptions;
create trigger trg_push_sub_updated
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.learning_modules enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.zoom_sessions enable row level security;
alter table public.community_links enable row level security;
alter table public.competitions enable row level security;
alter table public.schedules_personal enable row level security;

create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
grant execute on function public.current_role() to authenticated, anon;

create policy "profiles_select" on public.profiles for select to authenticated
  using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid());

create policy "classes_select" on public.classes for select to authenticated
  using (true);

create policy "notif_own" on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy "notif_update_own" on public.notifications for update to authenticated
  using (user_id = auth.uid());
create policy "notif_insert_staff" on public.notifications for insert to authenticated
  with check (
    public.current_role() = 'sekolah'
    or (
      public.current_role() = 'guru'
      and user_id in (
        select id from public.profiles
        where class_name = (select class_name from public.profiles where id = auth.uid())
      )
    )
  );

create policy "push_own" on public.push_subscriptions for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "learning_select" on public.learning_modules for select to authenticated
  using (true);
create policy "learning_insert_guru" on public.learning_modules for insert to authenticated
  with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "learning_update_guru" on public.learning_modules for update to authenticated
  using (created_by = auth.uid() and public.current_role() = 'guru')
  with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "learning_delete_guru" on public.learning_modules for delete to authenticated
  using (created_by = auth.uid() and public.current_role() = 'guru');

create policy "quizzes_select" on public.quizzes for select to authenticated
  using (true);
create policy "quizzes_insert_guru" on public.quizzes for insert to authenticated
  with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "quizzes_update_guru" on public.quizzes for update to authenticated
  using (created_by = auth.uid() and public.current_role() = 'guru')
  with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "quizzes_delete_guru" on public.quizzes for delete to authenticated
  using (created_by = auth.uid() and public.current_role() = 'guru');

create policy "qq_select" on public.quiz_questions for select to authenticated
  using (true);
create policy "qq_write_guru" on public.quiz_questions for all to authenticated
  using (public.current_role() = 'guru')
  with check (public.current_role() = 'guru');

create policy "attempts_select" on public.quiz_attempts for select to authenticated
  using (
    user_id = auth.uid()
    or public.current_role() in ('guru', 'sekolah')
  );
create policy "attempts_insert_siswa" on public.quiz_attempts for insert to authenticated
  with check (user_id = auth.uid() and public.current_role() = 'siswa');
create policy "attempts_update_guru" on public.quiz_attempts for update to authenticated
  using (public.current_role() = 'guru');

create policy "zoom_select" on public.zoom_sessions for select to authenticated using (true);
create policy "zoom_insert_guru" on public.zoom_sessions for insert to authenticated with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "zoom_update_guru" on public.zoom_sessions for update to authenticated using (created_by = auth.uid() and public.current_role() = 'guru') with check (created_by = auth.uid() and public.current_role() = 'guru');
create policy "zoom_delete_guru" on public.zoom_sessions for delete to authenticated using (created_by = auth.uid() and public.current_role() = 'guru');

create policy "comm_select" on public.community_links for select to authenticated using (true);
create policy "comm_write_guru" on public.community_links for all to authenticated using (public.current_role() in ('guru','sekolah')) with check (public.current_role() in ('guru','sekolah'));

create policy "comp_select" on public.competitions for select to authenticated using (true);
create policy "comp_write_staff" on public.competitions for all to authenticated using (public.current_role() in ('guru','sekolah')) with check (public.current_role() in ('guru','sekolah'));

create policy "sched_select" on public.schedules_personal for select to authenticated
  using (student_id = auth.uid() or public.current_role() in ('guru','sekolah'));
create policy "sched_write_guru" on public.schedules_personal for all to authenticated
  using (public.current_role() = 'guru')
  with check (public.current_role() = 'guru' and created_by = auth.uid());

alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.quizzes;
alter publication supabase_realtime add table public.schedules_personal;

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "photos_public_read" on storage.objects for select
  using (bucket_id = 'report-photos');
create policy "photos_auth_write" on storage.objects for insert to authenticated
  with check (bucket_id = 'report-photos');

-- ============================================================
-- TAMBAHAN UNTUK EDUCPRAD FITUR MVP
-- ============================================================

-- FR-02: Preferensi belajar siswa
create table if not exists public.student_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  favorite_subjects text[] default '{}',
  preferred_methods text[] default '{}', -- visual, audio, video, quiz
  learning_goals text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FR-06: Transaksi gamifikasi (poin, XP, petunjuk) — audit trail
create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('poin','xp','hint')),
  amount int not null, -- positif = earn, negatif = spend
  balance_after int not null,
  source text not null, -- quiz, assignment, module, streak, hint_spend, etc.
  source_id text, -- quiz_id, assignment_id, module_id, etc.
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_reward_tx_user on public.reward_transactions(user_id, created_at desc);

-- FR-07/08: Progres belajar per materi + streak harian
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  completed boolean default false,
  progress_pct int default 0, -- 0-100
  time_spent_seconds int default 0,
  last_position jsonb default '{}', -- untuk video/audio resume
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, module_id)
);

create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);

create table if not exists public.student_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_activity_date date, -- YYYY-MM-DD di zona waktu user
  timezone text default 'Asia/Jakarta',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FR-05: Tugas & Studi Kasus (assignments)
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text,
  class_name text,
  type text not null check (type in ('assignment','case_study')) default 'assignment',
  instructions text,
  difficulty text check (difficulty in ('easy','medium','hard')) default 'medium',
  max_points int default 0,
  max_xp int default 0,
  hint_reward int default 0, -- petunjuk yang didapat kalau selesai
  due_at timestamptz,
  allow_hints boolean default true,
  status text not null check (status in ('draft','published','closed')) default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  published_at timestamptz
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  answer_text text,
  answer_files jsonb default '[]', -- array of {url, name, type}
  status text not null check (status in ('submitted','graded','late','returned')) default 'submitted',
  score int,
  max_score int,
  xp_awarded int default 0,
  poin_awarded int default 0,
  hint_awarded int default 0,
  feedback text,
  graded_by uuid references public.profiles(id),
  submitted_at timestamptz default now(),
  graded_at timestamptz,
  unique (assignment_id, user_id)
);

create index if not exists idx_submissions_user on public.submissions(user_id);
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);

-- FR-09: Chatbot sessions
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  context_type text, -- 'module', 'quiz', 'assignment', 'general'
  context_id text, -- module_id, quiz_id, etc.
  mode text not null check (mode in ('learning','assessment')) default 'learning',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  metadata jsonb default '{}', -- {hint_used: true, tokens, etc.}
  created_at timestamptz default now()
);

create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at);

-- FR-13: Offline queue untuk sinkronisasi
create table if not exists public.offline_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  operation text not null, -- 'create_progress', 'submit_attempt', 'submit_assignment', 'spend_hint', etc.
  payload jsonb not null,
  status text not null check (status in ('pending','synced','failed')) default 'pending',
  retry_count int default 0,
  last_error text,
  created_at timestamptz default now(),
  synced_at timestamptz
);

create index if not exists idx_offline_queue_user on public.offline_queue(user_id, status);

-- RLS policies (baru sudah di-enable di atas baris 190, jadi skip enable ulang)
create policy "prefs_own" on public.student_preferences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reward_own" on public.reward_transactions for select to authenticated
  using (user_id = auth.uid());
create policy "reward_insert_staff" on public.reward_transactions for insert to authenticated
  with check (public.current_role() in ('guru','sekolah'));

create policy "progress_own" on public.lesson_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress_read_guru" on public.lesson_progress for select to authenticated
  using (public.current_role() in ('guru','sekolah'));

create policy "streak_own" on public.student_streaks for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "assign_select" on public.assignments for select to authenticated using (true);
create policy "assign_write_guru" on public.assignments for all to authenticated
  using (public.current_role() in ('guru','sekolah')) with check (public.current_role() in ('guru','sekolah'));

create policy "sub_own" on public.submissions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "sub_read_guru" on public.submissions for select to authenticated
  using (public.current_role() in ('guru','sekolah'));
create policy "sub_grade_guru" on public.submissions for update to authenticated
  using (public.current_role() = 'guru');

create policy "chat_session_own" on public.chat_sessions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "chat_msg_own" on public.chat_messages for all to authenticated
  using (session_id in (select id from public.chat_sessions where user_id = auth.uid()))
  with check (session_id in (select id from public.chat_sessions where user_id = auth.uid()));

create policy "offline_own" on public.offline_queue for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Realtime untuk chat
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.reward_transactions;
alter publication supabase_realtime add table public.lesson_progress;

-- Trigger updated_at
create trigger trg_prefs_updated before update on public.student_preferences
  for each row execute function public.set_updated_at();
create trigger trg_streak_updated before update on public.student_streaks
  for each row execute function public.set_updated_at();
create trigger trg_progress_updated before update on public.lesson_progress
  for each row execute function public.set_updated_at();
create trigger trg_chat_session_updated before update on public.chat_sessions
  for each row execute function public.set_updated_at();

-- Contoh seed (opsional, jalankan manual kalau perlu)
-- insert into public.student_preferences (user_id, favorite_subjects, preferred_methods, learning_goals)
-- values ('<uuid-siswa>', ARRAY['Matematika','Fisika'], ARRAY['visual','quiz'], 'Naikkan nilai UTBK');
-- insert into public.student_streaks (user_id, current_streak, longest_streak, last_activity_date)
-- values ('<uuid-siswa>', 0, 0, null);
-- insert into public.assignments (title, description, subject, class_name, type, instructions, difficulty, max_points, max_xp, hint_reward, due_at, status, created_by)
-- values ('Tugas: Dasar Routing', 'Konfigurasi static route', 'TKJ 11', 'XI TKJ 4', 'assignment', 'Buat topologi 3 router', 'medium', 50, 100, 2, now() + interval '7 days', 'published', '<uuid-guru>');

-- Setelah membuat user di Authentication, isi profiles:
-- insert into public.profiles (id, name, email, role, class_name, nis_nip, phone)
-- values
--   ('<uuid-siswa>', 'Dammar Pratama', 'siswa@sekolah.id', 'siswa', 'XI TKJ 4', '240411', '081234567890'),
--   ('<uuid-guru>', 'Andi Wijaya', 'guru@sekolah.id', 'guru', 'XI TKJ 4', '198812', '081298765432'),
--   ('<uuid-sekolah>', 'Sari Lestari', 'sekolah@sekolah.id', 'sekolah', null, '197705', '081211122233');
