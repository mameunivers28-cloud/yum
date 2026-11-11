import { Suspense } from "react";
import Shell from "./Shell";
import Accueil from "./Accueil";
import { getCars } from "./cars";

async function Home() {
  return <Accueil cars={await getCars()} />;
}

export default function Page() {
  return (
    <Shell>
      <Suspense fallback={<p style={{ padding: 24 }}>Chargement…</p>}>
        <Home />
      </Suspense>
    </Shell>
  );
}
