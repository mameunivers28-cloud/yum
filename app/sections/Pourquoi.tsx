import Ico from "../Ico";

const ITEMS: [string, string, string][] = [
  ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4", "Véhicules vérifiés", "Les véhicules de partenaires sont examinés par YUM avant toute publication. Vous ne voyez que des annonces validées."],
  ["M4 5h16v14H4zM8 9h8M8 13h5", "Réservation encadrée", "Votre demande est étudiée par une personne de l’équipe. Aucune réservation n’est confirmée automatiquement."],
  ["M9 12l2 2 4-4M5 4h14v16H5z", "Conditions transparentes", "Location, dépôt de garantie et frais éventuels sont distincts et vous sont communiqués avant votre confirmation."],
  ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Accompagnement personnalisé", "Une question, un besoin particulier, un véhicule précis ? L’équipe YUM vous répond, notamment par WhatsApp."],
];

export default function Pourquoi() {
  return (
    <section className="s"><div className="wrap">
      <p className="eyebrow dark">Pourquoi YUM</p>
      <h2>Pourquoi choisir YUM ?</h2>
      <p className="sub">Quatre engagements concrets pour louer plus sereinement à Dakar.</p>
      <ul className="why">
        {ITEMS.map(([d, t, p]) => (
          <li key={t}><Ico d={d} /><h3>{t}</h3><p>{p}</p></li>
        ))}
      </ul>
    </div></section>
  );
}
