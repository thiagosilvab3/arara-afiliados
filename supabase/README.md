# Supabase - Arara Afiliados

Esta pasta guarda os arquivos SQL usados para recriar a estrutura do banco de dados do projeto.

## Arquivos

### `schema.sql`

Cria a estrutura principal do Supabase:

- extensões;
- enums;
- tabelas;
- triggers;
- funções;
- RLS;
- policies;
- bucket de imagens;
- produtos iniciais;
- views de analytics.

### `admin.example.sql`

Modelo para criar manualmente o usuário admin na tabela `public.profiles`.

O usuário precisa existir primeiro em:

```txt
Supabase → Authentication → Users
