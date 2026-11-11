import Shell from "../Shell";
import SpecialForm from "./SpecialForm";
import { WhatsAppButton } from "../WhatsApp";


export const metadata = { title: "Demande personnalisée — YUM", description: "Vous ne trouvez pas le véhicule recherché ? Faites une demande personnalisée, YUM cherche pour vous à Dakar.", alternates: { canonical: "/demande-speciale" } };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Sur mesure</p>
        <h1>Demande personnalisée</h1>
        <p className="lead">Vous ne trouvez pas le véhicule voulu ? Décrivez ce que vous cherchez. Nous cherchons dans notre flotte et auprès de nos partenaires, puis nous vous proposons des offres.</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 760 }}>
        <p><WhatsAppButton message="Bonjour YUM Afrique, je cherche un véhicule précis et je souhaite faire une demande personnalisée." label="Préférer WhatsApp" /></p>
        <SpecialForm />
      </div></section>
    </Shell>
  );
}
