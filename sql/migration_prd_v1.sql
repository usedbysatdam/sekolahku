-- MIGRASI PRD Educrazy v1 — jalankan SELURUH file ini di Supabase SQL Editor > New Query > Run
-- Sudah idempotent (aman diulang). Setelah Run tunggu 10 detik lalu Ctrl+Shift+R.
create extension if not exists "pgcrypto";
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create or replace function public.current_role() returns text language sql stable as $$ select role from public.profiles where id = auth.uid() $$;

-- ===== BASE TABLES (jika belum pernah jalan schema.sql, ini yang bikin schedules_personal dkk) =====
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, name text not null, email text unique not null, role text not null check (role in ('siswa','guru','sekolah')), class_name text, nis_nip text, phone text, photo_url text, created_at timestamptz default now());
create table if not exists public.classes (id uuid primary key default gen_random_uuid(), name text not null unique, homeroom_teacher_id uuid references public.profiles(id), created_at timestamptz default now());
create table if not exists public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, title text not null, message text not null, type text not null default 'info', is_read boolean default false, created_at timestamptz default now());
create table if not exists public.learning_modules (id uuid primary key default gen_random_uuid(), title text not null, subject text, class_name text, description text, type text not null check (type in ('visual','audio')), media_url text, created_by uuid references public.profiles(id), created_at timestamptz default now());
create table if not exists public.quizzes (id uuid primary key default gen_random_uuid(), title text not null, subject text, class_name text, description text, tipe text not null check (tipe in ('game','case')) default 'game', duration int not null default 15 check (duration > 0), status text not null check (status in ('draft','published','closed')) default 'draft', created_by uuid references public.profiles(id), created_at timestamptz default now(), published_at timestamptz);
create table if not exists public.quiz_questions (id uuid primary key default gen_random_uuid(), quiz_id uuid not null references public.quizzes(id) on delete cascade, question text not null, qtype text not null check (qtype in ('pg','essay')) default 'pg', options jsonb default '[]'::jsonb, answer text, points int not null default 10 check (points > 0), order_no int not null default 0, created_at timestamptz default now());
create table if not exists public.quiz_attempts (id uuid primary key default gen_random_uuid(), quiz_id uuid not null references public.quizzes(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, answers jsonb default '{}'::jsonb, score int not null default 0, max_score int not null default 0, status text not null check (status in ('graded','pending')) default 'graded', feedback text, graded_by uuid references public.profiles(id), started_at timestamptz default now(), submitted_at timestamptz default now(), unique (quiz_id, user_id));
create table if not exists public.push_subscriptions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, provider text not null check (provider in ('fcm','onesignal')), token text not null, created_at timestamptz default now(), updated_at timestamptz default now(), unique (user_id, token));
create table if not exists public.zoom_sessions (id uuid primary key default gen_random_uuid(), title text not null, subject text, class_name text, description text, zoom_url text not null, scheduled_at timestamptz not null, duration int not null default 60, status text not null check (status in ('scheduled','live','ended','cancelled')) default 'scheduled', created_by uuid references public.profiles(id), created_at timestamptz default now());
create table if not exists public.community_links (id uuid primary key default gen_random_uuid(), title text not null, link text not null, platform text not null check (platform in ('whatsapp','telegram','discord')) default 'whatsapp', class_name text, description text, is_active boolean default true, created_by uuid references public.profiles(id), created_at timestamptz default now());
create table if not exists public.competitions (id uuid primary key default gen_random_uuid(), title text not null, description text, link text, category text, deadline timestamptz, poster_url text, status text not null check (status in ('open','closed','archive')) default 'open', created_by uuid references public.profiles(id), created_at timestamptz default now());
create table if not exists public.schedules_personal (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, title text not null, tipe text not null check (tipe in ('zoom','kelas','bimbingan','quiz','lain')) default 'kelas', starts_at timestamptz not null, ends_at timestamptz not null, link text, notes text, color text default 'yellow', created_by uuid references public.profiles(id), created_at timestamptz default now(), check (ends_at > starts_at));

-- ===== PRD BARU =====
create table if not exists public.student_preferences (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade, favorite_subjects text[] default '{}', preferred_methods text[] default '{}', learning_goals text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.reward_transactions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, type text not null check (type in ('poin','xp','hint')), amount int not null, balance_after int not null, source text not null, source_id text, metadata jsonb default '{}', created_at timestamptz default now());
create index if not exists idx_reward_tx_user on public.reward_transactions(user_id, created_at desc);
create table if not exists public.lesson_progress (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, module_id uuid not null references public.learning_modules(id) on delete cascade, completed boolean default false, progress_pct int default 0, time_spent_seconds int default 0, last_position jsonb default '{}', completed_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now(), unique (user_id, module_id));
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create table if not exists public.student_streaks (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade, current_streak int default 0, longest_streak int default 0, last_activity_date date, timezone text default 'Asia/Jakarta', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.assignments (id uuid primary key default gen_random_uuid(), title text not null, description text, subject text, class_name text, type text not null check (type in ('assignment','case_study')) default 'assignment', instructions text, difficulty text check (difficulty in ('easy','medium','hard')) default 'medium', max_points int default 0, max_xp int default 0, hint_reward int default 0, due_at timestamptz, allow_hints boolean default true, status text not null check (status in ('draft','published','closed')) default 'draft', created_by uuid references public.profiles(id), created_at timestamptz default now(), published_at timestamptz);
create table if not exists public.submissions (id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.assignments(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, answer_text text, answer_files jsonb default '[]', status text not null check (status in ('submitted','graded','late','returned')) default 'submitted', score int, max_score int, xp_awarded int default 0, poin_awarded int default 0, hint_awarded int default 0, feedback text, graded_by uuid references public.profiles(id), submitted_at timestamptz default now(), graded_at timestamptz, unique (assignment_id, user_id));
create index if not exists idx_submissions_user on public.submissions(user_id);
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);
create table if not exists public.chat_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, context_type text, context_id text, mode text not null check (mode in ('learning','assessment')) default 'learning', is_active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.chat_messages (id uuid primary key default gen_random_uuid(), session_id uuid not null references public.chat_sessions(id) on delete cascade, role text not null check (role in ('user','assistant','system')), content text not null, metadata jsonb default '{}', created_at timestamptz default now());
create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at);
create table if not exists public.offline_queue (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, operation text not null, payload jsonb not null, status text not null check (status in ('pending','synced','failed')) default 'pending', retry_count int default 0, last_error text, created_at timestamptz default now(), synced_at timestamptz);
create index if not exists idx_offline_queue_user on public.offline_queue(user_id, status);

-- RLS enable (hanya jika tabel sudah ada)
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
alter table public.student_preferences enable row level security;
alter table public.reward_transactions enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.student_streaks enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.offline_queue enable row level security;

drop policy if exists "prefs_own" on public.student_preferences; create policy "prefs_own" on public.student_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "reward_own" on public.reward_transactions; create policy "reward_own" on public.reward_transactions for select to authenticated using (user_id = auth.uid());
drop policy if exists "reward_insert_staff" on public.reward_transactions; create policy "reward_insert_staff" on public.reward_transactions for insert to authenticated with check (public.current_role() in ('guru','sekolah'));
drop policy if exists "progress_own" on public.lesson_progress; create policy "progress_own" on public.lesson_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "progress_read_guru" on public.lesson_progress; create policy "progress_read_guru" on public.lesson_progress for select to authenticated using (public.current_role() in ('guru','sekolah'));
drop policy if exists "streak_own" on public.student_streaks; create policy "streak_own" on public.student_streaks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "assign_select" on public.assignments; create policy "assign_select" on public.assignments for select to authenticated using (true);
drop policy if exists "assign_write_guru" on public.assignments; create policy "assign_write_guru" on public.assignments for all to authenticated using (public.current_role() in ('guru','sekolah')) with check (public.current_role() in ('guru','sekolah'));
drop policy if exists "sub_own" on public.submissions; create policy "sub_own" on public.submissions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "sub_read_guru" on public.submissions; create policy "sub_read_guru" on public.submissions for select to authenticated using (public.current_role() in ('guru','sekolah'));
drop policy if exists "sub_grade_guru" on public.submissions; create policy "sub_grade_guru" on public.submissions for update to authenticated using (public.current_role() = 'guru');
drop policy if exists "chat_session_own" on public.chat_sessions; create policy "chat_session_own" on public.chat_sessions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "chat_msg_own" on public.chat_messages; create policy "chat_msg_own" on public.chat_messages for all to authenticated using (session_id in (select id from public.chat_sessions where user_id = auth.uid())) with check (session_id in (select id from public.chat_sessions where user_id = auth.uid()));
drop policy if exists "offline_own" on public.offline_queue; create policy "offline_own" on public.offline_queue for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop trigger if exists trg_prefs_updated on public.student_preferences; create trigger trg_prefs_updated before update on public.student_preferences for each row execute function public.set_updated_at();
drop trigger if exists trg_streak_updated on public.student_streaks; create trigger trg_streak_updated before update on public.student_streaks for each row execute function public.set_updated_at();
drop trigger if exists trg_progress_updated on public.lesson_progress; create trigger trg_progress_updated before update on public.lesson_progress for each row execute function public.set_updated_at();
drop trigger if exists trg_chat_session_updated on public.chat_sessions; create trigger trg_chat_session_updated before update on public.chat_sessions for each row execute function public.set_updated_at();

do $$ begin alter publication supabase_realtime add table public.chat_messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.reward_transactions; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lesson_progress; exception when duplicate_object then null; end $$;

select pg_notify('pgrst','reload schema');
