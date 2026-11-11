import Link from "next/link";

export default function Choix() {
  return (
    <section className="s"><div className="wrap">
      <h2>Par où commencer ?</h2>
      <div className="choix">
        <Link href="/vehicules" className="own"><h3>Trouver un véhicule</h3><p>Parcourez le catalogue et envoyez votre demande.</p><span className="btn navy">Trouver un véhicule</span></Link>
        <Link href="/proprietaires" className="own"><h3>Proposer mon véhicule</h3><p>Particulier ou professionnel, candidatez pour publier votre véhicule.</p><span className="btn navy">Proposer mon véhicule</span></Link>
        <Link href="/demande-speciale" className="own"><h3>Faire une demande personnalisée</h3><p>Décrivez votre besoin, YUM cherche pour vous.</p><span className="btn navy">Faire une demande personnalisée</span></Link>
      </div>
    </div></section>
  );
}
