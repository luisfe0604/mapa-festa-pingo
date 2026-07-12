import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import Bandeirinhas from "@/components/Bandeirinhas";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mapa de Mesas - Festa Junina",
  description: "Mapa de mesas da festa junina",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="ceu-fundo" aria-hidden="true" />
        <Bandeirinhas />
        <div className="pagina-shell">{children}</div>
      </body>
    </html>
  );
}
