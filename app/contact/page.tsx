import Shell from "../Shell";
import LeadForm from "../LeadForm";
import { WhatsAppButton } from "../WhatsApp";
import { WA_GENERAL } from "../../lib/config";

export const metadata = { title: "Contact — YUM", description: "Contactez YUM Afrique pour toute question sur la location de véhicules à Dakar.", alternates: { canonical: "/contact" } };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Contact</p>
        <h1>Parlons de votre location</h1>
        <p className="lead">Une question avant de réserver ? Écrivez-nous, nous vous répondons.</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 720 }}>
        <p><WhatsAppButton message={WA_GENERAL} label="Nous écrire sur WhatsApp" /></p>
        <LeadForm table="contact_messages" submit="Envoyer le message" okTitle="Message envoyé" okText="Merci. Nous vous répondons dès que possible."
          fields={[
            { k: "full_name", label: "Nom complet", required: true, half: true },
            { k: "phone", label: "Téléphone", type: "tel", half: true, hint: "(facultatif)" },
            { k: "email", label: "Courriel", type: "email", required: true },
            { k: "subject", label: "Sujet" },
            { k: "message", label: "Message", area: true, required: true },
          ]} />
      </div></section>
    </Shell>
  );
}
