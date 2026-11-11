"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

const LINKS = [
  ["/", "Accueil"],
  ["/vehicules", "Nos véhicules"],
  ["/#fonctionnement", "Comment ça marche"],
  ["/devenir-partenaire", "Devenir partenaire"],
  ["/a-propos", "À propos"],
  ["/contact", "Contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const close = () => setOpen(false);
  return (
    <header className="site">
      <div className="wrap bar">
        <Link className="logo" href="/" aria-label="YUM Afrique, accueil" onClick={close}>
          <svg aria-hidden="true"><use href="#mark" /></svg><span>YUM</span>
        </Link>
        <nav id="menu" className={open ? "open" : ""} aria-label="Navigation principale">
          {LINKS.map(([h, l]) => <Link key={h} href={h} onClick={close}>{l}</Link>)}
          <Link href={user ? "/mon-espace" : "/connexion"} onClick={close}>{user ? "Mon espace" : "Connexion"}</Link>
          <Link className="btn gold navcta" href="/vehicules" onClick={close}>Réserver un véhicule</Link>
        </nav>
        <button className="burger" aria-expanded={open} aria-controls="menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
