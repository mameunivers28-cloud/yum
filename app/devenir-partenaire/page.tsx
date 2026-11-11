import Shell from "../Shell";
import LeadForm from "../LeadForm";

export const metadata = { title: "Devenir partenaire — YUM" };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Propriétaires</p>
        <h1>Mettez votre véhicule au travail</h1>
        <p className="lead">Proposez votre véhicule à la location : YUM vérifie, publie, gère les demandes et organise la remise.</p>
      </div></section>
      <section className="s"><div className="wrap two2">
        <div>
          <ol className="steps col">
            <li><b>Vous nous écrivez</b>Décrivez votre véhicule et vos disponibilités.</li>
            <li><b>YUM vérifie</b>Nous contrôlons le véhicule et les documents avant toute publication.</li>
            <li><b>Nous gérons les demandes</b>Vous gardez votre voiture tant qu’une location n’est pas confirmée.</li>
            <li><b>Remise et retour encadrés</b>État des lieux avec photos, kilométrage et carburant.</li>
          </ol>
        </div>
        <LeadForm table="partner_requests" submit="Devenir partenaire" okTitle="Demande reçue" okText="Merci. Notre équipe vous contacte pour la suite. Aucun engagement à ce stade."
          fields={[
            { k: "full_name", label: "Nom complet", required: true, half: true },
            { k: "phone", label: "Téléphone / WhatsApp", type: "tel", required: true, half: true },
            { k: "email", label: "Courriel", type: "email", required: true },
            { k: "vehicle_make", label: "Marque", half: true },
            { k: "vehicle_model", label: "Modèle", half: true },
            { k: "vehicle_year", label: "Année", num: true, half: true },
            { k: "city", label: "Ville", half: true },
            { k: "message", label: "Précisions", area: true, hint: "(facultatif)" },
          ]} />
      </div></section>
    </Shell>
  );
}
