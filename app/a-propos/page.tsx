import Link from "next/link";
import Shell from "../Shell";

export const metadata = { title: "À propos — YUM" };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">À propos</p>
        <h1>Une location claire, à Dakar</h1>
        <p className="lead">YUM met en relation les voyageurs et résidents avec des véhicules vérifiés : la flotte YUM et ceux de propriétaires partenaires.</p>
      </div></section>
      <section className="s"><div className="wrap two">
        <div className="own"><h2>Notre modèle</h2><p>Une flotte détenue par YUM, complétée par des véhicules de propriétaires partenaires. Chaque véhicule est vérifié avant d’être publié.</p></div>
        <div className="own alt"><h2>Notre engagement</h2><p>Vous ne payez qu’après l’approbation de votre dossier, et chaque remise ou restitution s’accompagne d’un état des lieux avec photos.</p></div>
      </div>
      <div className="wrap" style={{ marginTop: 28 }}><Link className="btn navy" href="/vehicules">Découvrir nos véhicules</Link></div></section>
    </Shell>
  );
}
