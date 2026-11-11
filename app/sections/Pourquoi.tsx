import Link from "next/link";
import Ico from "../Ico";

const ITEMS: [string, string, string][] = [
  ["M9 12l2 2 4-4M5 4h14v16H5z", "Examen des dossiers", "Chaque demande de location et chaque candidature de partenaire est examinée par l’équipe."],
  ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4", "Véhicules partenaires vérifiés", "Un véhicule de partenaire n’est publié qu’après vérification du dossier et du véhicule."],
  ["M4 5h16v14H4zM4 9h16", "Conditions avant confirmation", "Location, dépôt de garantie et frais éventuels vous sont communiqués avant toute confirmation."],
  ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Suivi humain", "Une personne de l’équipe répond, notamment par WhatsApp, et suit votre dossier."],
  ["M4 5h16v14H4zM8 3v4M16 3v4", "Gestion des disponibilités", "Les périodes déjà prises sont indiquées ; la disponibilité définitive est confirmée par YUM."],
  ["M4 5h16v14H4zM8 9h8M8 13h5", "État du véhicule documenté", "Photos, kilométrage et carburant à la remise et au retour, selon le processus applicable."],
];

export default function Pourquoi() {
  return (
    <section className="s"><div className="wrap trust2">
      <div className="t2-head">
        <p className="eyebrow dark">Confiance</p>
        <h2>Pourquoi faire confiance à YUM ?</h2>
        <p className="sub">Des engagements concrets, sans promesse que nous ne pourrions pas tenir.</p>
        <p className="t2-for">Pour qui ?</p>
        <div className="pills">
          <Link href="/vehicules">Résidents</Link>
          <Link href="/voyageurs-diaspora">Voyageurs et diaspora</Link>
          <Link href="/familles-professionnels">Familles et professionnels</Link>
          <Link href="/proprietaires">Propriétaires et agences</Link>
        </div>
      </div>
      <ul className="t2-list">
        {ITEMS.map(([d, t, p]) => (
          <li key={t}><Ico d={d} /><div><h3>{t}</h3><p>{p}</p></div></li>
        ))}
      </ul>
    </div></section>
  );
}
