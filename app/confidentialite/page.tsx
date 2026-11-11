import Legal from "../legal/Legal";

export const metadata = { title: "Politique de confidentialité — YUM" };

export default function Page() {
  return <Legal title="Politique de confidentialité" intro="Comment YUM Afrique collecte, utilise et protège vos données personnelles." sections={["Données collectées", "Utilisation des données", "Conservation et sécurité", "Vos droits", "Contact pour vos données"]} />;
}
