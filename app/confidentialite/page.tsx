import Legal from "../legal/Legal";

export const metadata = { title: "Politique de confidentialité — YUM", description: "Politique de confidentialité de YUM Afrique.", alternates: { canonical: "/confidentialite" } };

export default function Page() {
  return <Legal title="Politique de confidentialité" intro="Comment YUM Afrique collecte, utilise et protège vos données personnelles." sections={["Données collectées", "Utilisation des données", "Conservation et sécurité", "Vos droits", "Contact pour vos données"]} />;
}
