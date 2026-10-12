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

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  teacher_id uuid not null references public.profiles(id),
  class_name text not null,
  subject text default 'Umum',
  date date not null,
  status text not null check (status in ('hadir', 'izin', 'sakit', 'alpa')),
  notes text,
  created_at timestamptz default now(),
  unique (student_id, date, subject)
);

create table if not exists public.duty_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id),
  class_name text not null,
  date date not null,
  condition text not null check (condition in ('sangat_bersih', 'bersih', 'cukup_bersih', 'kotor')),
  activities text,
  notes text,
  photo_url text,
  assigned_students text[] default '{}',
  status text not null default 'belum_diperiksa' check (status in ('belum_diperiksa', 'sudah_diperiksa')),
  created_at timestamptz default now()
);

create table if not exists public.facility_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  facility_name text not null,
  category text not null,
  location text not null,
  description text,
  photo_url text,
  priority text not null check (priority in ('rendah', 'sedang', 'tinggi', 'darurat')),
  status text not null default 'menunggu' check (status in ('menunggu', 'diproses', 'perbaikan', 'selesai', 'ditolak')),
  handling_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.facility_status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.facility_reports(id) on delete cascade,
  changed_by uuid references public.profiles(id),
  old_status text,
  new_status text not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  day text not null check (day in ('senin','selasa','rabu','kamis','jumat')),
  day_order int generated always as (
    case day when 'senin' then 1 when 'selasa' then 2 when 'rabu' then 3 when 'kamis' then 4 when 'jumat' then 5 else 99 end
  ) stored,
  time_start text not null,
  time_end text not null,
  subject text not null,
  teacher_name text not null,
  room text,
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

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('fcm', 'onesignal')),
  token text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, token)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_facility_updated on public.facility_reports;
create trigger trg_facility_updated
before update on public.facility_reports
for each row execute function public.set_updated_at();

drop trigger if exists trg_push_sub_updated on public.push_subscriptions;
create trigger trg_push_sub_updated
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.attendance enable row level security;
alter table public.duty_reports enable row level security;
alter table public.facility_reports enable row level security;
alter table public.facility_status_history enable row level security;
alter table public.class_schedules enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

create or replace function public.current_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles_select" on public.profiles for select to authenticated
  using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid());

create policy "classes_select" on public.classes for select to authenticated
  using (true);

create policy "attendance_select" on public.attendance for select to authenticated
  using (
    student_id = auth.uid()
    or public.current_role() in ('guru', 'sekolah')
  );
create policy "attendance_write_guru" on public.attendance for all to authenticated
  using (public.current_role() = 'guru')
  with check (public.current_role() = 'guru');

create policy "duty_select" on public.duty_reports for select to authenticated
  using (
    student_id = auth.uid()
    or public.current_role() in ('guru', 'sekolah')
  );
create policy "duty_insert_siswa" on public.duty_reports for insert to authenticated
  with check (student_id = auth.uid() and public.current_role() = 'siswa');
create policy "duty_update_guru" on public.duty_reports for update to authenticated
  using (public.current_role() = 'guru');

create policy "facility_select" on public.facility_reports for select to authenticated
  using (true);
create policy "facility_insert" on public.facility_reports for insert to authenticated
  with check (reporter_id = auth.uid() and public.current_role() in ('siswa', 'guru'));
create policy "facility_update_sekolah" on public.facility_reports for update to authenticated
  using (public.current_role() = 'sekolah');

create policy "history_select" on public.facility_status_history for select to authenticated
  using (true);
create policy "history_insert_sekolah" on public.facility_status_history for insert to authenticated
  with check (public.current_role() = 'sekolah');

create policy "schedule_select" on public.class_schedules for select to authenticated
  using (
    public.current_role() in ('guru','sekolah')
    or class_name = (select class_name from public.profiles where id = auth.uid())
  );

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

alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.facility_reports;
alter publication supabase_realtime add table public.duty_reports;

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "photos_public_read" on storage.objects for select
  using (bucket_id = 'report-photos');
create policy "photos_auth_write" on storage.objects for insert to authenticated
  with check (bucket_id = 'report-photos');

-- Setelah membuat user di Authentication, isi profiles:
-- insert into public.profiles (id, name, email, role, class_name, nis_nip, phone)
-- values
--   ('<uuid-siswa>', 'Dammar Pratama', 'siswa@sekolah.id', 'siswa', 'XI TKJ 4', '240411', '081234567890'),
--   ('<uuid-guru>', 'Andi Wijaya', 'guru@sekolah.id', 'guru', 'XI TKJ 4', '198812', '081298765432'),
--   ('<uuid-sekolah>', 'Sari Lestari', 'sekolah@sekolah.id', 'sekolah', null, '197705', '081211122233');
