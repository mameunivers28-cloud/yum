import { Suspense } from "react";
import Shell from "./Shell";
import Accueil from "./Accueil";
import { getCars } from "./cars";
import { FAQ } from "./sections/faqData";
import { SITE_URL } from "../lib/config";

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "YUM Afrique", url: SITE_URL },
    { "@type": "FAQPage", mainEntity: FAQ.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))) },
  ],
};

async function Home() {
  return <Accueil cars={await getCars()} />;
}

export default function Page() {
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Suspense fallback={<p style={{ padding: 24 }}>Chargement…</p>}>
        <Home />
      </Suspense>
    </Shell>
  );
}
