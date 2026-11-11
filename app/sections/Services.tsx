import Link from "next/link";
import Ico from "../Ico";

const SERVICES: [string, string, string, string, string][] = [
  ["M3 14l2-6h14l2 6M5 14v4M19 14v4M7 11h10", "Location de véhicules", "Parcourez la flotte YUM et envoyez votre demande.", "/vehicules", "Voir les véhicules"],
  ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z", "Véhicules de partenaires", "Des véhicules de propriétaires, publiés après vérification par YUM.", "/vehicules", "Voir le catalogue"],
  ["M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5", "Recherche personnalisée", "Décrivez le véhicule souhaité, nous le cherchons pour vous.", "/demande-speciale", "Faire une demande"],
  ["M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z", "Remise du véhicule", "Aéroport ou adresse à Dakar : à préciser dans votre demande, selon les possibilités.", "/contact", "Poser la question"],
  ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Accompagnement", "Une équipe qui répond à vos questions avant et pendant la location.", "/contact", "Contacter YUM"],
  ["M4 7h16v12H4zM9 7V5h6v2", "Familles et professionnels", "Déplacements familiaux ou professionnels : catégories de véhicules et demande sur mesure.", "/familles-professionnels", "En savoir plus"],
];

export default function Services() {
  return (
    <section className="s"><div className="wrap">
      <p className="eyebrow dark">Nos services</p>
      <h2>Ce que YUM peut faire pour vous</h2>
      <ul className="why svc">
        {SERVICES.map(([d, t, p, h, l]) => (
          <li key={t}><Ico d={d} /><h3>{t}</h3><p>{p}</p><Link className="linkbtn" href={h}>{l} →</Link></li>
        ))}
      </ul>
    </div></section>
  );
}
