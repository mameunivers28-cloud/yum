import Link from "next/link";
import type { ReactNode } from "react";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="car" viewBox="0 0 120 50">
          <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" d="M6 36v-8l10-3 14-12h46l16 12 16 3v8" />
          <path fill="none" stroke="currentColor" strokeWidth="3" d="M30 13l-5 12M52 13v12M76 13l8 12M16 36h12M52 36h24M96 36h8" />
          <circle cx="36" cy="38" r="7" fill="currentColor" /><circle cx="90" cy="38" r="7" fill="currentColor" />
        </symbol>
        <symbol id="mark" viewBox="0 0 48 48">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#2A5FE8" transform="rotate(45 24 24)" />
          <path d="M15 15l9 11 9-11M24 26v9" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="9" r="3" fill="#fff" />
        </symbol>
      </svg>

      <header className="site"><div className="wrap">
        <Link className="logo" href="/" aria-label="YUM, accueil"><svg aria-hidden="true"><use href="#mark" /></svg>YUM</Link>
        <nav aria-label="Navigation principale">
          <Link href="/#vehicules">Nos véhicules</Link>
          <Link href="/#fonctionnement">Comment ça marche</Link>
          <Link href="/demande-speciale">Demande spéciale</Link>
        </nav>
        <Link className="btn" href="/" style={{ padding: "9px 16px" }}>Accueil</Link>
      </div></header>

      <main>{children}</main>

      <div className="zz" style={{ ["--zz" as string]: "#0F2A6B" }} />
      <footer className="site"><div className="wrap">
        <div><Link className="logo" href="/" style={{ fontSize: 26 }}><svg aria-hidden="true"><use href="#mark" /></svg>YUM</Link><p style={{ margin: "8px 0 0", opacity: 0.8 }}>Location de véhicules à Dakar, Sénégal.</p></div>
        <div><b>Aide</b><a href="#">Contact et assistance</a><a href="#">Foire aux questions</a></div>
        <div><b>Informations</b><a href="#">Conditions générales</a><a href="#">Politique de confidentialité</a><a href="#">Annulation et remboursement</a></div>
      </div></footer>
    </>
  );
}
