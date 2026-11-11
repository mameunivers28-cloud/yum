import Link from "next/link";

export default function Modele() {
  return (
    <section className="s"><div className="wrap two2">
      <div>
        <p className="eyebrow dark">Présentation de YUM</p>
        <h2>Plus qu’une page de petites annonces</h2>
        <p className="sub">YUM Afrique est une plateforme de location de véhicules à Dakar. Chaque demande est suivie par une équipe, de l’envoi jusqu’à la remise des clés.</p>
        <Link className="btn navy" href="/a-propos">Découvrir YUM</Link>
      </div>
      <ul className="hyb">
        <li><b>La flotte YUM</b><p>Des véhicules qui appartiennent directement à YUM.</p></li>
        <li><b>Des propriétaires partenaires</b><p>Des véhicules de particuliers, publiés seulement après vérification du véhicule et du dossier par YUM.</p></li>
        <li><b>Un processus encadré</b><p>Demande, vérification de la disponibilité, conditions finales, puis confirmation : rien n’est automatique.</p></li>
      </ul>
    </div></section>
  );
}
