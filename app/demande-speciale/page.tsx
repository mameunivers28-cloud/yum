import Shell from "../Shell";
import SpecialForm from "./SpecialForm";

export const metadata = { title: "Demande spéciale — YUM" };

export default function Page() {
  return (
    <Shell>
      <section className="s"><div className="wrap" style={{ maxWidth: 720 }}>
        <h1 className="dt">Demande spéciale</h1>
        <p className="sub">Vous ne trouvez pas le véhicule voulu ? Décrivez ce que vous cherchez. Nous cherchons dans notre flotte et auprès de nos partenaires, puis nous vous proposons des offres.</p>
        <SpecialForm />
      </div></section>
    </Shell>
  );
}
