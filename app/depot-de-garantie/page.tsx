import Legal from "../legal/Legal";

export const metadata = { title: "Dépôt de garantie — YUM", description: "Informations sur le dépôt de garantie chez YUM Afrique.", alternates: { canonical: "/depot-de-garantie" } };

export default function Page() {
  return <Legal title="Dépôt de garantie" intro="Le dépôt de garantie est distinct du prix de la location." sections={["Montant et modalités de versement", "Conditions de restitution", "Cas de retenue"]} />;
}
