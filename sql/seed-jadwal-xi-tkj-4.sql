-- Jadwal XI TKJ 4 sesuai gambar aSc Timetables 20/07/2026
-- Jalankan di Supabase SQL Editor (day_order auto-generated)
delete from public.class_schedules where class_name = 'XI TKJ 4';

insert into public.class_schedules (class_name, day, time_start, time_end, subject, teacher_name) values
('XI TKJ 4','senin','06:45','08:15','Kreatif Inovasi dan Kewirausahaan 11 TKJ','Bagus Fajariyanto, S.Kom'),
('XI TKJ 4','senin','08:15','09:45','Teknologi Jaringan Kabel dan Nirkabel 11','Adrian Yogie P. W., S.Pd.'),
('XI TKJ 4','senin','10:00','11:30','Administrasi Sistem Jaringan 11','Taufiq Pandu A., S.Pd.'),
('XI TKJ 4','senin','11:30','14:10','Keamanan Jaringan 11','Fitria Dewi Piranangingtyas, S.Pd'),
('XI TKJ 4','senin','14:10','15:30','Pemasangan dan Konfigurasi Perangkat Jaringan 11','Ahmad Hendrik, S.Pd.'),
('XI TKJ 4','selasa','06:45','08:15','Bahasa Inggris','Senda Athara, S.Pd.'),
('XI TKJ 4','selasa','08:15','09:45','Teknologi Jaringan Kabel dan Nirkabel 11','Adrian Yogie P. W., S.Pd.'),
('XI TKJ 4','selasa','10:00','12:15','Kreatif Inovasi dan Kewirausahaan 11 TKJ','Bakhtiyar Arsada, S.T'),
('XI TKJ 4','selasa','12:50','14:10','Sejarah','Tutik Mustajibah, S.Pd'),
('XI TKJ 4','selasa','14:10','15:30','Bahasa Inggris','Senda Athara, S.Pd.'),
('XI TKJ 4','rabu','06:45','08:15','Pendidikan Jasmani, Olahraga, dan Kesehatan','Drs. Kulut Ariwasono'),
('XI TKJ 4','rabu','08:15','10:45','Perencanaan dan Pengalamatan Jaringan 11','Dyah Ayu Novani, S.Pd.'),
('XI TKJ 4','rabu','10:45','13:30','Matematika','Septia Wulandari, S.Stat.'),
('XI TKJ 4','rabu','13:30','15:30','Administrasi Sistem Jaringan 11','Taufiq Pandu A., S.Pd.'),
('XI TKJ 4','kamis','06:45','09:45','Mata Pelajaran Pilihan 11 (Membangun Web Server)','Ardianta Marindra, S.Kom'),
('XI TKJ 4','kamis','10:00','12:15','Pendidikan Agama dan Budi Pekerti','Muhammad Choirul Anwar, S.Ag'),
('XI TKJ 4','kamis','12:50','15:30','Bahasa Indonesia','Rizki Febrianti, S.Pd'),
('XI TKJ 4','jumat','06:45','08:15','Pendidikan Pancasila dan Kewarganegaraan','Sutarni, S.Pd'),
('XI TKJ 4','jumat','08:15','09:45','Pemasangan dan Konfigurasi Perangkat Jaringan 11','Ahmad Hendrik, S.Pd.'),
('XI TKJ 4','jumat','10:00','11:30','Bahasa Mandarin','Arani Rahmatika, S.Pd');
