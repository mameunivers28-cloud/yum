import Link from "next/link";
import Shell from "../Shell";

export const metadata = { title: "À propos — YUM Afrique", description: "YUM Afrique est une plateforme de mobilité qui relie locataires et offreurs de véhicules : flotte YUM, particuliers et professionnels partenaires. Disponible au Sénégal.", alternates: { canonical: "/a-propos" } };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">À propos</p>
        <h1>Une plateforme de mobilité qui relie locataires et propriétaires de véhicules</h1>
        <p className="lead">YUM Afrique organise la rencontre entre ceux qui cherchent un véhicule et ceux qui en proposent. L’équipe examine les dossiers, coordonne les demandes et encadre chaque location.</p>
      </div></section>
      <section className="s"><div className="wrap">
        <h2>Trois sources de véhicules, une seule plateforme</h2>
        <ul className="hyb three">
          <li><b>La flotte YUM</b><p>Des véhicules que YUM possède ou exploite directement.</p></li>
          <li><b>Des particuliers partenaires</b><p>Ils restent propriétaires de leur véhicule. Il n’est publié qu’après examen du dossier.</p></li>
          <li><b>Des professionnels partenaires</b><p>Agences, entreprises et gestionnaires de flottes, avec un parcours adapté à leur activité.</p></li>
        </ul>
      </div></section>
      <section className="s soft"><div className="wrap two">
        <div className="own"><h2>Notre rôle</h2><p>Examiner les dossiers, coordonner les demandes, communiquer les conditions avant confirmation et documenter l’état du véhicule à la remise et au retour. YUM n’est pas un simple site de petites annonces.</p></div>
        <div className="own alt"><h2>Où nous opérons</h2><p>Le Sénégal, en particulier Dakar. Le nom YUM Afrique porte une ambition plus large, mais nous n’annonçons que les services réellement disponibles aujourd’hui.</p></div>
      </div></section>
      <section className="s"><div className="wrap">
        <p><b>YUM Afrique a été fondée par Mame Mor Sylla.</b></p>
        <div className="cta-row"><Link className="btn navy" href="/vehicules">Trouver un véhicule</Link><Link className="btn line" href="/proprietaires">Mettre mon véhicule en location</Link><Link className="btn line" href="/demande-speciale">Faire une demande personnalisée</Link></div>
      </div></section>
    </Shell>
  );
}
