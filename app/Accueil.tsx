"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Car } from "./cars";
import CarCard from "./CarCard";
import Modele from "./sections/Modele";
import Pourquoi from "./sections/Pourquoi";
import Parcours from "./sections/Parcours";
import Perso from "./sections/Perso";
import Choix from "./sections/Choix";
import Dakar from "./sections/Dakar";
import Faq from "./sections/Faq";

const HERO = "https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful_sunset_dakar_corniche.jpg?width=1800";

export default function Accueil({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [cat, setCat] = useState("");
  const [place, setPlace] = useState("Dakar");
  const [msg, setMsg] = useState("");
  const featured = cars.slice(0, 4);

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
      <section className="hero hero2" style={{ ["--hero" as string]: `url(${HERO})` }}>
        <div className="wrap hero2-in">
          <div className="h2-copy">
            <p className="eyebrow">YUM Afrique · La mobilité, autrement</p>
            <h1>Louez un véhicule. <em>Ou mettez le vôtre en location.</em></h1>
            <p className="lead">YUM Afrique vous connecte à des véhicules proposés par notre flotte, des particuliers et des professionnels partenaires. Trouvez le véhicule qu’il vous faut ou proposez le vôtre, avec un accompagnement à chaque étape.</p>
            <div className="paths">
              <Link href="/vehicules" className="path primary">
                <span className="path-k">Besoin d’un véhicule ?</span>
                <span className="path-t">Explorez les véhicules disponibles à la demande, choisissez celui qui vous correspond et transmettez votre demande de location.</span>
                <span className="btn gold">Trouver un véhicule</span>
              </Link>
              <Link href="/proprietaires" className="path">
                <span className="path-k">Vous possédez un véhicule ?</span>
                <span className="path-t">Particulier ou professionnel, proposez votre véhicule à la location sur YUM Afrique. Notre équipe examine votre candidature avant toute publication.</span>
                <span className="btn ghost">Mettre mon véhicule en location</span>
              </Link>
            </div>
            <p className="h2-perso"><b>Vous recherchez un véhicule précis ?</b> Décrivez votre besoin et laissez YUM rechercher une solution dans sa flotte et auprès de ses partenaires. <Link href="/demande-speciale">Faire une demande personnalisée →</Link></p>
            <p className="h2-geo">Disponible au Sénégal, avec une ambition à l’échelle africaine.</p>
          </div>
          <div className="h2-visual" aria-hidden="true">
            <svg className="h2-car" viewBox="0 0 120 50"><use href="#car" /></svg>
            <div className="h2-photo" />
            <ul className="h2-sources">
              <li>La flotte YUM</li><li>Des particuliers partenaires</li><li>Des professionnels partenaires</li>
            </ul>
          </div>
        </div>
      </section>

      <Modele />

      <section className="s soft"><div className="wrap">
        <div className="sec-head">
          <div><p className="eyebrow dark">Louer un véhicule</p><h2>Explorer les véhicules</h2><p className="sub">Flotte YUM et partenaires. La disponibilité est confirmée par notre équipe avant toute réservation.</p></div>
          <Link className="btn line" href="/vehicules">Voir tous les véhicules</Link>
        </div>
        <form className="search flat" onSubmit={search} aria-label="Rechercher un véhicule">
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
        <div className="grid home-grid">
          {featured.length === 0 && <p>Aucun véhicule pour le moment. Faites une demande personnalisée.</p>}
          {featured.map((c) => <CarCard key={c.id} c={c} />)}
        </div>
      </div></section>

      <Parcours />
      <Perso />
      <Pourquoi />

      <Dakar />

      <Faq />

      <Choix />
      <div className="mbar-space" />
      <nav className="mbar" aria-label="Actions principales">
        <Link className="btn gold" href="/vehicules">Trouver un véhicule</Link>
        <Link className="btn line" href="/proprietaires">Proposer mon véhicule</Link>
      </nav>
    </>
  );
}
