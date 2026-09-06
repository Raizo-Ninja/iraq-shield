-- ============================================================
--  IRAQ SHIELD — صلاحيات الأدمن / Admin roles
--  شغّله بعد setup.sql. / Run this after setup.sql.
-- ============================================================

-- 1) عمود الصلاحية / role column  (user | admin)
alter table public.profiles
  add column if not exists role text not null default 'user';

-- 2) دالة تتحقق إن كان المستخدم الحالي أدمن (بأمان، بلا حلقات RLS)
--    helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $BODY$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$BODY$;

-- 3) سياسة: الأدمن يقرأ كل الملفات / admins can read every profile
drop policy if exists "admin read all" on public.profiles;
create policy "admin read all"
  on public.profiles for select
  using ( public.is_admin() );

-- 4) سياسة: الأدمن يعدّل كل الملفات / admins can update every profile
drop policy if exists "admin update all" on public.profiles;
create policy "admin update all"
  on public.profiles for update
  using ( public.is_admin() );

-- 5) سياسة: الأدمن يحذف الملفات / admins can delete profiles
drop policy if exists "admin delete" on public.profiles;
create policy "admin delete"
  on public.profiles for delete
  using ( public.is_admin() );

-- تم. لتعيين حسابك أدمن، شغّل (بعد التسجيل):
-- Done. To make your account an admin, run (after you sign up):
--   update public.profiles set role = 'admin' where id = (
--     select id from auth.users where email = 'YOUR_EMAIL_HERE'
--   );
