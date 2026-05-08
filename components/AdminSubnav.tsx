import Link from "next/link";
import styles from "./AdminSubnav.module.css";

type AdminPath = "/admin" | "/admin/pedidos" | "/admin/analytics";

type AdminSubnavProps = {
  currentPath: AdminPath;
};

export function AdminSubnav({ currentPath }: AdminSubnavProps) {
  return (
    <nav className={styles.wrap} aria-label="Navegação administrativa">
      <div className={styles.inner}>
        <Link
          href="/admin"
          className={`${styles.link} ${
            currentPath === "/admin" ? styles.active : ""
          }`}
        >
          Produtos
        </Link>

        <Link
          href="/admin/pedidos"
          className={`${styles.link} ${
            currentPath === "/admin/pedidos" ? styles.active : ""
          }`}
        >
          Pedidos
        </Link>

        <Link
          href="/admin/analytics"
          className={`${styles.link} ${
            currentPath === "/admin/analytics" ? styles.active : ""
          }`}
        >
          Analytics
        </Link>
      </div>
    </nav>
  );
}
