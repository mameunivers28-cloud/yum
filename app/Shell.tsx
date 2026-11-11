import Link from "next/link";
import type { ReactNode } from "react";
import Header from "./Header";
import { WhatsAppFloat } from "./WhatsApp";
import { WA_GENERAL, waLink } from "../lib/config";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="car" viewBox="0 0 120 50">
          <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" d="M6 36v-8l10-3 14-12h46l16 12 16 3v8" />
          <circle cx="36" cy="38" r="7" fill="currentColor" /><circle cx="90" cy="38" r="7" fill="currentColor" />
        </symbol>
        <symbol id="mark" viewBox="0 0 48 48">
          <rect x="4" y="4" width="40" height="40" rx="10" fill="#2A5FE8" transform="rotate(45 24 24)" />
          <path d="M15 15l9 11 9-11M24 26v9" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="9" r="3" fill="#fff" />
        </symbol>
      </svg>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu">{children}</main>
      <WhatsAppFloat message={WA_GENERAL} />
      <footer className="site">
        <div className="wrap fgrid4">
          <div>
            <Link className="logo" href="/"><svg aria-hidden="true"><use href="#mark" /></svg><span>YUM</span></Link>
            <p className="fdesc">Location de véhicules à Dakar, Sénégal. Flotte YUM et propriétaires partenaires vérifiés.</p>
            <a href={waLink(WA_GENERAL)} target="_blank" rel="noreferrer">Nous écrire sur WhatsApp</a>
          </div>
          <div><b>Navigation</b><Link href="/">Accueil</Link><Link href="/vehicules">Véhicules</Link><Link href="/#fonctionnement">Comment ça marche</Link><Link href="/a-propos">À propos</Link><Link href="/contact">Contact</Link></div>
          <div><b>Services</b><Link href="/vehicules">Location</Link><Link href="/demande-speciale">Demande personnalisée</Link><Link href="/devenir-partenaire">Devenir partenaire</Link><Link href="/voyageurs-diaspora">Voyageurs et diaspora</Link><Link href="/professionnels">Professionnels</Link><Link href="/familles">Familles</Link><Link href="/proprietaires">Propriétaires</Link></div>
          <div><b>Informations</b><Link href="/conditions-generales">Conditions générales</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/annulation">Annulation</Link><Link href="/remboursement">Remboursement</Link><Link href="/depot-de-garantie">Dépôt de garantie</Link><Link href="/credits-photos">Crédits photos</Link></div>
        </div>
        <div className="wrap copy">© YUM Afrique. Tous droits réservés.</div>
      </footer>
    </>
  );
}
