import Legal from "../legal/Legal";

export const metadata = { title: "Politique de remboursement — YUM", description: "Politique de remboursement de YUM Afrique.", alternates: { canonical: "/remboursement" } };

export default function Page() {
  return <Legal title="Politique de remboursement" intro="Les cas et les délais de remboursement." sections={["Cas de remboursement", "Délais et moyens de remboursement", "Cas sans remboursement"]} />;
}
