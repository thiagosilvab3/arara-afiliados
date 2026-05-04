import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AnalyticsProvider } from "../components/AnalyticsProvider";
import { getSiteUrl } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Arara | Produtos Digitais e Afiliados",
    template: "%s | Arara"
  },
  description:
    "Loja de afiliados com catálogo de produtos digitais, filtros interativos, checkout simulado e admin local."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AnalyticsProvider />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}