 import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© {new Date().getFullYear()} Arara. Catálogo de produtos digitais.</p>
        <p>Checkout demonstrativo. Configure backend e pagamentos reais antes de publicar comercialmente.</p>
      </div>
    </footer>
  );
}