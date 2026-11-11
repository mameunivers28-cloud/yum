import Link from "next/link";
import type { ReactNode } from "react";
import Header from "./Header";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="car" viewBox="0 0 120 50">
          <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" d="M6 36v-8l10-3 14-12h46l16 12 16 3v8" />
          <circle cx="36" cy="38" r="7" fill="currentColor" /><circle cx="90" cy="38" r="7" fill="currentColor" />
        </symbol>
        <symbol id="mark" viewBox="0 0 48 48">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#C6A15B" />
          <path d="M14 14l10 12 10-12M24 26v10" fill="none" stroke="#0A1726" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </svg>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu">{children}</main>
      <footer className="site">
        <div className="wrap fgrid4">
          <div>
            <Link className="logo" href="/"><svg aria-hidden="true"><use href="#mark" /></svg><span>YUM<small>AFRIQUE</small></span></Link>
            <p className="fdesc">Location de véhicules à Dakar, Sénégal. Flotte YUM et propriétaires partenaires vérifiés.</p>
          </div>
          <div><b>Louer</b><Link href="/vehicules">Nos véhicules</Link><Link href="/demande-speciale">Demande personnalisée</Link><Link href="/#fonctionnement">Comment ça marche</Link></div>
          <div><b>YUM</b><Link href="/devenir-partenaire">Devenir partenaire</Link><Link href="/a-propos">À propos</Link><Link href="/contact">Contact</Link></div>
          <div><b>Informations</b><Link href="/credits-photos">Crédits photos</Link></div>
        </div>
        <div className="wrap copy">© YUM Afrique. Tous droits réservés.</div>
      </footer>
    </>
  );
}
