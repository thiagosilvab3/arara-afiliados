import Link from "next/link";
import styles from "./Header.module.css";
import { createSupabaseServerClient } from "../lib/supabase/server";
import { logoutAction } from "../app/logout/actions";

export async function Header() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    isAdmin = profile?.role === "admin";
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>A</span>

          <span>
            <span className={styles.name}>Arara</span>
            <span className={styles.tagline}>Produtos digitais e afiliados</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <Link href="/" className={styles.navLink}>
            Catálogo
          </Link>

          {isAdmin ? (
            <Link href="/admin" className={`${styles.navLink} ${styles.adminLink}`}>
              Admin
            </Link>
          ) : null}

          {user ? (
            <form action={logoutAction}>
              <button type="submit" className={styles.logoutButton}>
                Sair
              </button>
            </form>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
