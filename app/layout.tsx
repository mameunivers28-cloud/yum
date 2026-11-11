import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const font = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-main" });

export const metadata: Metadata = {
  title: "YUM — Location de véhicules à Dakar",
  description: "Louez un véhicule à Dakar : flotte YUM et propriétaires partenaires vérifiés.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#10243A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
