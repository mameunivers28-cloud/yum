import Link from "next/link";
import Shell from "../Shell";
import { Steps, LOUER, PROPOSER } from "../sections/Parcours";

export const metadata = {
  title: "Comment ça marche — louer ou proposer un véhicule — YUM",
  description: "Trois parcours sur YUM Afrique : louer un véhicule, proposer le vôtre en location, ou faire une demande personnalisée.",
  alternates: { canonical: "/comment-ca-marche" },
};

const PERSO: [string, string][] = [
  ["Décrivez", "Dates, budget, type de véhicule et préférences."],
  ["YUM examine", "L’équipe étudie votre demande."],
  ["Recherche", "YUM cherche dans sa flotte et auprès de ses partenaires."],
  ["Proposition", "Si une solution existe, YUM vous la propose avec ses conditions."],
];

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Comment ça marche</p>
        <h1>Louer, proposer, ou demander : trois parcours</h1>
        <p className="lead">À chaque étape, une personne de l’équipe YUM examine et accompagne votre dossier. Rien n’est automatique.</p>
      </div></section>
      <section className="s"><div className="wrap">
        <h2>Pour louer</h2>
        <Steps items={LOUER} />
        <p className="notice" style={{ marginTop: 22 }}>Une demande n’est pas une réservation confirmée. La remise à l’aéroport ou à une adresse dépend des disponibilités et des conditions.</p>
        <div className="cta-row"><Link className="btn navy" href="/vehicules">Trouver un véhicule</Link></div>
      </div></section>
      <section className="s soft"><div className="wrap">
        <h2>Pour proposer un véhicule</h2>
        <Steps items={PROPOSER} />
        <p className="notice" style={{ marginTop: 22 }}>Particulier ou professionnel. Aucun revenu n’est garanti et aucun volume de réservations n’est promis.</p>
        <div className="cta-row"><Link className="btn navy" href="/proprietaires">Mettre mon véhicule en location</Link></div>
      </div></section>
      <section className="s"><div className="wrap">
        <h2>Pour faire une demande personnalisée</h2>
        <Steps items={PERSO} />
        <p className="notice" style={{ marginTop: 22 }}>Aucun véhicule ni tarif n’est garanti avant validation, et aucun paiement n’est demandé pour envoyer la demande.</p>
        <div className="cta-row"><Link className="btn navy" href="/demande-speciale">Décrire mon besoin</Link></div>
      </div></section>
    </Shell>
  );
}
