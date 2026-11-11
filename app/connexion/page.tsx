import { Suspense } from "react";
import Shell from "../Shell";
import AuthForm from "./AuthForm";

export const metadata = { title: "Connexion — YUM" };

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Mon compte</p>
        <h1>Connexion</h1>
        <p className="lead">Suivez vos demandes de location et vos demandes personnalisées.</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 480 }}>
        <Suspense fallback={<p>Chargement…</p>}><AuthForm /></Suspense>
      </div></section>
    </Shell>
  );
}
