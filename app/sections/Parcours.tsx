import Link from "next/link";

export const LOUER: [string, string][] = [
  ["Recherche", "Parcourez le catalogue et choisissez vos dates."],
  ["Demande", "Envoyez votre demande. Ce n’est pas une réservation."],
  ["Vérification", "Une personne de l’équipe vérifie disponibilité et dossier."],
  ["Conditions finales", "YUM vous communique les conditions avant confirmation."],
  ["Paiement validé", "Vous payez seulement après approbation du dossier."],
  ["Confirmation", "La réservation est confirmée après validation du paiement."],
];
export const PROPOSER: [string, string][] = [
  ["Candidature", "Décrivez votre véhicule, en tant que particulier ou professionnel."],
  ["Documents", "Joignez les pièces demandées, conservées de façon privée."],
  ["Vérification", "YUM examine le dossier et le véhicule."],
  ["Conditions de partenariat", "Elles sont définies avec vous avant toute exploitation."],
  ["Publication", "Votre véhicule n’est publié qu’après approbation."],
  ["Gestion des demandes", "YUM reçoit et examine les demandes de location."],
];

export function Steps({ items }: { items: [string, string][] }) {
  return <ol className="tl">{items.map(([t, p]) => <li key={t}><b>{t}</b><span>{p}</span></li>)}</ol>;
}

export default function Parcours() {
  return (
    <section className="s band" id="fonctionnement"><div className="wrap">
      <p className="eyebrow">Comment ça marche</p>
      <h2>Deux parcours, un accompagnement humain</h2>
      <div className="tl-block">
        <h3>Pour louer un véhicule</h3>
        <Steps items={LOUER} />
        <p className="tl-note">Une demande n’est pas une réservation confirmée.</p>
        <Link className="btn gold" href="/vehicules">Trouver un véhicule</Link>
      </div>
      <div className="tl-block">
        <h3>Pour proposer un véhicule</h3>
        <Steps items={PROPOSER} />
        <p className="tl-note">Particulier ou professionnel. Aucun revenu n’est garanti.</p>
        <Link className="btn ghost" href="/proprietaires">Mettre mon véhicule en location</Link>
      </div>
    </div></section>
  );
}
