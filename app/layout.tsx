import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "../lib/config";

const font = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-main" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "YUM Afrique — Location de voiture à Dakar, Sénégal",
  description: "Location de voiture à Dakar : véhicules de la flotte YUM et de propriétaires partenaires vérifiés. Envoyez votre demande, YUM vérifie et vous accompagne.",
  openGraph: { type: "website", siteName: "YUM Afrique", locale: "fr_FR", title: "YUM Afrique — Votre mobilité commence ici", description: "Location de véhicules à Dakar, flotte YUM et partenaires vérifiés.", url: "/" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0F2A6B" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
