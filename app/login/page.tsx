import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="container">
      <section className="panel">
        <h1>Entrar</h1>
        <p className="muted">
          Faça login com o usuário administrador cadastrado no Supabase.
        </p>

        <form action={loginAction}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <label>
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                className="field"
                placeholder="admin@exemplo.com"
                required
              />
            </label>

            <label>
              <span>Senha</span>
              <input
                name="password"
                type="password"
                className="field"
                placeholder="Sua senha"
                required
              />
            </label>

            {error ? (
              <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>
            ) : null}

            <button type="submit" className="btn btnPrimary">
              Entrar no admin
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}