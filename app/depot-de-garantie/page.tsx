import Legal from "../legal/Legal";

export const metadata = { title: "Dépôt de garantie — YUM" };

export default function Page() {
  return <Legal title="Dépôt de garantie" intro="Le dépôt de garantie est distinct du prix de la location." sections={["Montant et modalités de versement", "Conditions de restitution", "Cas de retenue"]} />;
}
