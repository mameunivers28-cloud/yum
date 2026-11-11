"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Car } from "./cars";
import CarCard from "./CarCard";

const HERO = "https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful_sunset_dakar_corniche.jpg?width=1800";

const TRUST: [string, string, string][] = [
  ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4", "Propriétaires vérifiés", "Chaque véhicule partenaire est vérifié par YUM avant publication."],
  ["M3 7h18v10H3zM3 11h18M7 15h3", "Paiement après approbation", "Vous ne payez qu’une fois votre dossier approuvé."],
  ["M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z", "Remise où vous voulez", "À l’aéroport ou à l’adresse de votre choix, à Dakar."],
  ["M4 5h16v14H4zM8 9h8M8 13h5", "Remise et retour encadrés", "État des lieux avec photos, kilométrage et carburant."],
];

export default function Accueil({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [cat, setCat] = useState("");
  const [place, setPlace] = useState("Dakar");
  const [msg, setMsg] = useState("");
  const featured = cars.slice(0, 3);

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (d1 && d2 && d2 < d1) { setMsg("La date de retour doit suivre la date de départ."); return; }
    const q = new URLSearchParams();
    if (cat) q.set("categorie", cat);
    if (d1) q.set("du", d1);
    if (d2) q.set("au", d2);
    q.set("lieu", place);
    router.push(`/vehicules?${q.toString()}`);
  }

  return (
    <>
      <section className="hero" style={{ ["--hero" as string]: `url(${HERO})` }}>
        <div className="wrap hero-in">
          <p className="eyebrow">Location de véhicules à Dakar</p>
          <h1>Votre mobilité, <em>notre priorité.</em></h1>
          <p className="lead">Voitures de la flotte YUM et de propriétaires partenaires vérifiés. Remise à l’aéroport ou à l’adresse de votre choix.</p>
          <div className="hero-cta">
            <Link className="btn gold" href="/vehicules">Découvrir nos véhicules</Link>
            <Link className="btn ghost" href="/demande-speciale">Demander un véhicule</Link>
          </div>
          <form className="search" onSubmit={search} aria-label="Rechercher un véhicule">
            <label>Lieu de départ
              <select value={place} onChange={(e) => setPlace(e.target.value)}>
                <option>Dakar</option><option>Aéroport AIBD</option>
              </select>
            </label>
            <label>Départ<input type="date" value={d1} onChange={(e) => setD1(e.target.value)} /></label>
            <label>Retour<input type="date" value={d2} min={d1} onChange={(e) => setD2(e.target.value)} /></label>
            <label>Catégorie
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="">Toutes</option><option>Citadine</option><option>Berline</option><option>SUV</option><option>4x4</option>
              </select>
            </label>
            <button className="btn gold" type="submit">Rechercher</button>
          </form>
          <p className="msg" role="status">{msg}</p>
        </div>
      </section>

      <section className="s trust"><div className="wrap">
        <ul className="trust-grid">
          {TRUST.map(([d, t, p]) => (
            <li key={t}>
              <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <b>{t}</b><p>{p}</p>
            </li>
          ))}
        </ul>
      </div></section>

      <section className="s soft"><div className="wrap">
        <div className="sec-head">
          <div><p className="eyebrow dark">Notre sélection</p><h2>Nos véhicules</h2><p className="sub">La disponibilité est confirmée par notre équipe avant toute réservation.</p></div>
          <Link className="btn line" href="/vehicules">Voir tout le catalogue</Link>
        </div>
        <div className="grid">
          {featured.length === 0 && <p>Aucun véhicule pour le moment. Faites une demande personnalisée.</p>}
          {featured.map((c) => <CarCard key={c.id} c={c} />)}
        </div>
      </div></section>

      <section className="s" id="fonctionnement"><div className="wrap">
        <p className="eyebrow dark">Simple et transparent</p>
        <h2>Comment ça marche</h2>
        <p className="sub">Vous ne payez qu’après l’approbation de votre dossier.</p>
        <ol className="steps">
          <li><b>Envoyez votre demande</b>Choisissez un véhicule et vos dates.</li>
          <li><b>Nous vérifions</b>Disponibilité, dates et lieu de remise.</li>
          <li><b>Complétez votre dossier</b>Pièce d’identité et permis valide.</li>
          <li><b>Payez et partez</b>Réservation confirmée après paiement.</li>
        </ol>
      </div></section>

      <section className="s" style={{ paddingTop: 0 }}><div className="wrap"><div className="cta">
        <div><h2>Vous ne trouvez pas votre voiture ?</h2><p>Faites une demande personnalisée. Nous cherchons dans notre flotte et auprès de nos partenaires, puis nous vous proposons des offres.</p></div>
        <Link className="btn gold" href="/demande-speciale">Faire une demande personnalisée</Link>
      </div></div></section>

      <section className="s soft"><div className="wrap two">
        <div className="own"><h2>Mettez votre véhicule au travail</h2><p>Proposez-le à la location : YUM vérifie, publie, gère les demandes et organise la remise. Vous gardez votre voiture tant qu’une location n’est pas confirmée.</p><Link className="btn navy" href="/devenir-partenaire">Devenir partenaire</Link></div>
        <div className="own alt"><h2>Une location structurée</h2><p>Chaque remise et chaque restitution s’accompagnent d’un état des lieux avec photos, kilométrage et carburant, conservé dans votre dossier.</p></div>
      </div></section>
    </>
  );
}
