import Link from "next/link";

export default function Modele() {
  return (
    <section className="s"><div className="wrap two2">
      <div>
        <p className="eyebrow dark">Présentation de YUM</p>
        <h2>Une seule plateforme, trois sources de véhicules</h2>
        <p className="sub">YUM Afrique réunit sa propre flotte, des particuliers et des professionnels partenaires. L’équipe examine les dossiers, coordonne chaque demande et encadre la location. Ce n’est pas une simple page de petites annonces.</p>
        <Link className="btn navy" href="/a-propos">Découvrir YUM</Link>
      </div>
      <ul className="hyb">
        <li><b>La flotte YUM</b><p>Des véhicules que YUM possède ou exploite directement.</p></li>
        <li><b>Des particuliers partenaires</b><p>Des véhicules de propriétaires, publiés seulement après examen du dossier et du véhicule.</p></li>
        <li><b>Des professionnels partenaires</b><p>Des agences et entreprises qui proposent leurs véhicules, sous réserve de validation de chacun.</p></li>
      </ul>
    </div></section>
  );
}
