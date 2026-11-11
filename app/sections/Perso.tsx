import Link from "next/link";

export default function Perso() {
  return (
    <section className="s" style={{ paddingTop: 0 }}><div className="wrap"><div className="cta">
      <div>
        <h2>Vous ne trouvez pas le véhicule idéal ? YUM peut le rechercher pour vous.</h2>
        <p>Indiquez vos dates, votre budget, le type de véhicule souhaité et vos préférences. Notre équipe examine votre demande et recherche une solution auprès de notre flotte et de nos partenaires. Aucun paiement n’est demandé pour l’envoyer, et aucun véhicule ni tarif n’est garanti avant validation.</p>
      </div>
      <Link className="btn gold" href="/demande-speciale">Décrire mon besoin</Link>
    </div></div></section>
  );
}
