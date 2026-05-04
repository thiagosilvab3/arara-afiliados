import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logo}>A</div>
          <div>
            <div className={styles.name}>Arara</div>
            <div className={styles.tagline}>Produtos digitais e afiliados</div>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className="btn btnSecondary">
            Catálogo
          </Link>
          <Link href="/admin" className="btn btnPrimary">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}