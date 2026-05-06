import Link from "next/link";
import styles from "./AdminSubnav.module.css";

type AdminSubnavProps = {
  currentPath: "/admin" | "/admin/pedidos";
};

export function AdminSubnav({ currentPath }: AdminSubnavProps) {
  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
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
      </div>
    </div>
  );
}