"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export type Car = { id: string; n: string; y: number; c: string; t: string; s: number; p: number; o: "YUM" | "Partenaire"; img: string };

const CATS = [["", "Tous"], ["Citadine", "Citadines"], ["Berline", "Berlines"], ["SUV", "SUV"], ["4x4", "4x4"]];
const fmt = (n: number) => n.toLocaleString("fr-FR");

export default function Accueil({ cars }: { cars: Car[] }) {
  const [cat, setCat] = useState("");
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [msg, setMsg] = useState("");
  const list = cars.filter((c) => !cat || c.c === cat);

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (d2 < d1) { setMsg("La date de retour doit suivre la date de départ."); return; }
    setMsg(`Résultats pour Dakar, du ${d1} au ${d2}.`);
    document.getElementById("vehicules")?.scrollIntoView();
  }

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
        <a className="logo" href="#" aria-label="YUM, accueil"><svg aria-hidden="true"><use href="#mark" /></svg>YUM</a>
        <nav aria-label="Navigation principale">
          <a href="#vehicules">Nos véhicules</a><a href="#fonctionnement">Comment ça marche</a>
          <a href="#proprietaire">Devenir propriétaire</a><a href="#contact">Contact</a>
        </nav>
        <a className="btn" href="#connexion" style={{ padding: "9px 16px" }}>Connexion</a>
      </div></header>

      <main>
        <div className="hero"><div className="wrap">
          <div>
            <h1>Trouvez le véhicule idéal pour vos déplacements au Sénégal.</h1>
            <p>Voitures de la flotte YUM et de propriétaires partenaires vérifiés. Remise à l’aéroport ou à l’adresse de votre choix, à Dakar.</p>
            <form className="search" onSubmit={search} aria-label="Rechercher un véhicule">
              <label>Ville<select><option>Dakar</option></select></label>
              <label>Départ<input type="date" value={d1} onChange={(e) => setD1(e.target.value)} required /></label>
              <label>Retour<input type="date" value={d2} min={d1} onChange={(e) => setD2(e.target.value)} required /></label>
              <label>Catégorie
                <select value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option value="">Toutes</option><option>Citadine</option><option>Berline</option><option>SUV</option><option>4x4</option>
                </select>
              </label>
              <button className="btn" type="submit">Rechercher</button>
            </form>
            <div className="msg" role="status">{msg}</div>
          </div>
          <div className="arch"><svg viewBox="0 0 120 50" aria-hidden="true"><use href="#car" /></svg><span>Photo principale à ajouter</span></div>
        </div><div className="zz" style={{ ["--zz" as string]: "#9DBDFF", position: "relative" }} /></div>

        <div className="welcome">Dalal ak jàmm. Bienvenue au Sénégal.</div>

        <section className="s" id="vehicules"><div className="wrap">
          <h2>Nos véhicules</h2>
          <p className="sub">La disponibilité affichée est confirmée par notre équipe avant toute réservation.</p>
          <div className="cats" role="group" aria-label="Catégories">
            {CATS.map(([v, l]) => (
              <button key={l} className="chip" aria-pressed={cat === v} onClick={() => setCat(v)}>{l}</button>
            ))}
          </div>
          <div className="grid">
            {list.length === 0 && <p>Aucun véhicule pour le moment. Faites une demande spéciale.</p>}
            {list.map((c) => (
              <article className="car" key={c.id}>
                <div className="pic">
                  <span className={c.o === "YUM" ? "tag" : "tag p"}>{c.o === "YUM" ? "Flotte YUM" : "Partenaire"}</span>
                  {c.img ? <img src={c.img} alt={c.n} /> : <svg viewBox="0 0 120 50" aria-hidden="true"><use href="#car" /></svg>}
                </div>
                <div className="body">
                  <h3>{c.n}</h3>
                  <small>{c.y}, {c.c}, {c.t}, {c.s} places</small>
                  <div className="price">{fmt(c.p)} FCFA <small>par jour</small></div>
                  <Link className="btn line" style={{ marginTop: 10 }} href={`/vehicule/${c.id}`}>Voir le détail</Link>
                </div>
              </article>
            ))}
          </div>
        </div></section>

        <div className="zz" />
        <section className="s band" id="fonctionnement"><div className="wrap">
          <h2>Comment ça marche</h2>
          <p className="sub">Vous ne payez qu’après l’approbation de votre dossier.</p>
          <ol className="steps">
            <li><b>Envoyez votre demande</b>Choisissez un véhicule et vos dates.</li>
            <li><b>Nous vérifions</b>Disponibilité, dates et lieu de remise.</li>
            <li><b>Complétez votre dossier</b>Pièce d’identité et permis valide.</li>
            <li><b>Payez et partez</b>Réservation confirmée après paiement.</li>
          </ol>
        </div></section>

        <section className="s"><div className="wrap"><div className="cta">
          <div><h2>Vous ne trouvez pas votre voiture ?</h2><p>Faites une demande spéciale. Nous cherchons dans notre flotte et auprès de nos partenaires, puis nous vous proposons des offres.</p></div>
          <Link className="btn w" href="/demande-speciale">Faire une demande spéciale</Link>
        </div></div></section>

        <section className="s" id="proprietaire" style={{ paddingTop: 0 }}><div className="wrap two">
          <div className="own"><h2>Mettez votre véhicule au travail</h2><p>Proposez-le à la location : YUM vérifie, publie, gère les demandes et organise la remise. Vous gardez votre voiture tant qu’une location n’est pas confirmée.</p><a className="btn" href="#devenir-proprietaire">Devenir propriétaire partenaire</a></div>
          <div className="own" style={{ borderColor: "var(--line)" }}><h2>Une location structurée</h2><p>Chaque remise et chaque restitution s’accompagnent d’un état des lieux avec photos, kilométrage et carburant, conservé dans votre dossier.</p></div>
        </div></section>
      </main>

      <div className="zz" style={{ ["--zz" as string]: "#0F2A6B" }} />
      <footer className="site" id="contact"><div className="wrap">
        <div><a className="logo" href="#" style={{ fontSize: 26 }}><svg aria-hidden="true"><use href="#mark" /></svg>YUM</a><p style={{ margin: "8px 0 0", opacity: 0.8 }}>Location de véhicules à Dakar, Sénégal.</p></div>
        <div><b>Aide</b><a href="#">Contact et assistance</a><a href="#">Foire aux questions</a></div>
        <div><b>Informations</b><a href="#">Conditions générales</a><a href="#">Politique de confidentialité</a><a href="#">Annulation et remboursement</a><Link href="/credits-photos">Crédits photos</Link></div>
      </div></footer>
    </>
  );
}
