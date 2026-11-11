import { Suspense } from "react";
import Shell from "../Shell";
import Catalogue from "./Catalogue";
import { getCars } from "../cars";

export const metadata = { title: "Nos véhicules — YUM", description: "Catalogue des véhicules de location à Dakar : filtrez par catégorie, transmission et prix. Flotte YUM et véhicules de partenaires vérifiés.", alternates: { canonical: "/vehicules" } };

async function Liste() {
  return <Catalogue cars={await getCars()} />;
}

export default function Page() {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Catalogue</p>
        <h1>Nos véhicules</h1>
        <p className="lead">Flotte YUM et véhicules de propriétaires partenaires. La disponibilité est confirmée par notre équipe.</p>
      </div></section>
      <Suspense fallback={<p style={{ padding: 24 }}>Chargement…</p>}>
        <Liste />
      </Suspense>
    </Shell>
  );
}
