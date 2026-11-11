import Link from "next/link";

export default function Dakar() {
  return (
    <section className="s"><div className="wrap">
      <p className="eyebrow dark">Louer à Dakar</p>
      <h2>Louer une voiture à Dakar avec YUM</h2>
      <p className="sub">Que ce soit pour un séjour, un déplacement professionnel ou le quotidien, voici comment choisir.</p>
      <div className="two dakar">
        <div className="own">
          <h3>Un SUV ou un 4x4</h3>
          <p>Pour plus d’espace ou de confort sur la route, consultez les SUV et 4x4 publiés. La catégorie, le nombre de places et la transmission sont indiqués sur chaque fiche.</p>
          <Link className="btn line" href="/vehicules?categorie=SUV">Voir les SUV</Link>
        </div>
        <div className="own">
          <h3>Une remise à l’aéroport</h3>
          <p>Vous arrivez à l’aéroport international Blaise-Diagne ? Vous pouvez indiquer ce lieu de remise dans votre demande. YUM confirme si c’est possible, ainsi que les éventuels frais.</p>
          <Link className="btn line" href="/voyageurs-diaspora">Préparer mon arrivée</Link>
        </div>
        <div className="own">
          <h3>Un séjour au Sénégal</h3>
          <p>Choisissez vos dates avant de partir, envoyez votre demande et suivez-la depuis votre espace. Aucun paiement n’est demandé à l’envoi.</p>
          <Link className="btn line" href="/demande-speciale">Faire une demande</Link>
        </div>
      </div>
    </div></section>
  );
}
