import Shell from "../Shell";
import SpecialForm from "./SpecialForm";

export const metadata = { title: "Demande personnalisée — YUM" };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Sur mesure</p>
        <h1>Demande personnalisée</h1>
        <p className="lead">Vous ne trouvez pas le véhicule voulu ? Décrivez ce que vous cherchez. Nous cherchons dans notre flotte et auprès de nos partenaires, puis nous vous proposons des offres.</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 760 }}>
        <SpecialForm />
      </div></section>
    </Shell>
  );
}
