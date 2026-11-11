import Shell from "../Shell";
import Wizard from "./Wizard";
import { WhatsAppButton } from "../WhatsApp";
import { WA_PARTNER } from "../../lib/config";

export const metadata = { title: "Devenir partenaire — YUM", description: "Propriétaires : déposez votre candidature pour proposer votre véhicule à la location avec YUM. Aucun revenu n’est garanti.", alternates: { canonical: "/devenir-partenaire" } };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Propriétaires</p>
        <h1>Mettez votre véhicule au travail</h1>
        <p className="lead">Proposez votre véhicule à la location : YUM examine votre dossier et, après validation, peut le publier. Aucun revenu n’est garanti.</p>
      </div></section>
      <section className="s"><div className="wrap two2">
        <div>
          <ol className="steps col">
            <li><b>Vous déposez votre dossier</b>Décrivez votre véhicule et joignez vos documents en toute sécurité.</li>
            <li><b>YUM vérifie</b>Nous contrôlons le véhicule et les documents avant toute publication.</li>
            <li><b>Nous gérons les demandes</b>Vous gardez votre voiture tant qu’une location n’est pas confirmée.</li>
            <li><b>Remise et retour encadrés</b>État des lieux avec photos, kilométrage et carburant.</li>
          </ol>
          <div className="cta-row"><WhatsAppButton message={WA_PARTNER} label="Écrire à YUM sur WhatsApp" /></div>
        </div>
        <Wizard />
      </div></section>
    </Shell>
  );
}
