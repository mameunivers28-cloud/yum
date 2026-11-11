import Shell from "../Shell";
import Espace from "./Espace";

export const metadata = { title: "Mon espace — YUM", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Mon compte</p>
        <h1>Mon espace</h1>
        <p className="lead">Vos demandes et leur avancement.</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 820 }}><Espace /></div></section>
    </Shell>
  );
}
