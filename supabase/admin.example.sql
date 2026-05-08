-- =========================================================
-- ARARA V1 - CRIAR ADMIN MANUALMENTE
-- =========================================================
-- Passos:
-- 1. Crie o usuário em Supabase → Authentication → Users.
-- 2. Copie o User UID.
-- 3. Troque os valores abaixo.
-- 4. Execute no SQL Editor do Supabase.
--
-- Não coloque seu UID real ou e-mail pessoal neste arquivo se o repositório for público.
-- =========================================================

insert into public.profiles (id, email, full_name, role)
values (
  'COLE_AQUI_O_USER_UID',
  'admin@example.com',
  'Nome do Admin',
  'admin'
)
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role;