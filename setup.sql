-- ============================================================
--  IRAQ SHIELD — إعداد قاعدة البيانات / Database setup
--  انسخ هذا كاملًا في: Supabase ▸ SQL Editor ▸ New query ▸ Run
--  Paste all of this into: Supabase ▸ SQL Editor ▸ New query ▸ Run
-- ============================================================

-- 1) جدول ملفات المستخدمين / user profiles table
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  org_type     text,                        -- الجهة / organisation type
  province     text,                        -- المحافظة / province
  lang         text default 'ar',
  theme        text default 'dark',
  alert_breach boolean default true,        -- إشعار عند اختراق ناجح
  alert_weekly boolean default true,        -- تقرير أسبوعي بالبريد
  alert_local  boolean default false,       -- تنبيه لمحافظتي فقط
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 2) تفعيل أمان مستوى الصف / enable Row Level Security
alter table public.profiles enable row level security;

-- 3) سياسات: كل مستخدم يرى ويعدّل ملفه فقط
--    policies: each user can only read/update their own row
drop policy if exists "read own profile"   on public.profiles;
drop policy if exists "insert own profile"  on public.profiles;
drop policy if exists "update own profile"  on public.profiles;

create policy "read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 4) إنشاء ملف تلقائيًا عند تسجيل مستخدم جديد
--    auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, org_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'org_type', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- تم. / Done.
