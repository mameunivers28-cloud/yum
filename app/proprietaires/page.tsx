import Link from "next/link";
import Shell from "../Shell";
import { WhatsAppButton } from "../WhatsApp";
import { WA_PARTNER } from "../../lib/config";
import { Steps, PROPOSER } from "../sections/Parcours";

export const metadata = {
  title: "Mettre mon véhicule en location au Sénégal — particulier ou professionnel — YUM",
  description: "Particulier ou agence : proposez votre véhicule à la location sur YUM Afrique. L’équipe examine votre candidature avant toute publication. Aucun revenu n’est garanti.",
  alternates: { canonical: "/proprietaires" },
};

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Mettre mon véhicule en location</p>
        <h1>Particuliers et professionnels : proposez vos véhicules sur YUM</h1>
        <p className="lead">Vous avez une voiture, ou une agence qui en gère plusieurs ? Soumettez votre candidature de partenaire. YUM examine votre dossier avant toute publication.</p>
      </div></section>

      <section className="s"><div className="wrap">
        <h2>Vous êtes…</h2>
        <div className="two">
          <div className="own">
            <h2>Un particulier</h2>
            <ul className="tick">
              <li>Vous pouvez proposer votre véhicule à la location.</li>
              <li>YUM examine votre candidature ; il n’est pas publié automatiquement.</li>
              <li>Les conditions de mise à disposition sont définies avant toute exploitation.</li>
              <li>Les revenus éventuels dépendent des locations réalisées et des conditions convenues. Aucun revenu n’est garanti.</li>
            </ul>
            <Link className="btn navy" href="/devenir-partenaire?profil=particulier">Je suis un particulier</Link>
          </div>
          <div className="own">
            <h2>Une agence ou une entreprise</h2>
            <ul className="tick">
              <li>Vous pouvez demander à rejoindre YUM comme partenaire.</li>
              <li>Vous pouvez proposer plusieurs véhicules : un dossier par véhicule.</li>
              <li>Chaque véhicule doit satisfaire aux conditions de validation.</li>
              <li>Les modalités peuvent être adaptées à votre activité. YUM ne promet pas de volume de réservations.</li>
            </ul>
            <Link className="btn navy" href="/devenir-partenaire?profil=pro">Je représente une agence ou une entreprise</Link>
          </div>
        </div>
      </div></section>

      <section className="s soft"><div className="wrap">
        <h2>Comment ça se passe</h2>
        <Steps items={PROPOSER} />
        <p className="notice" style={{ marginTop: 22 }}>Votre véhicule ne devient pas la propriété de YUM. Responsabilités, disponibilités, assurances et modalités financières sont définies contractuellement.</p>
      </div></section>

      <section className="s"><div className="wrap"><div className="cta">
        <div><h2>Une question avant de vous lancer ?</h2><p>L’équipe YUM vous répond.</p></div>
        <WhatsAppButton message={WA_PARTNER} label="Écrire à YUM sur WhatsApp" />
      </div></div></section>
    </Shell>
  );
}
