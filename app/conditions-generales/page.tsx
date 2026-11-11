import Legal from "../legal/Legal";

export const metadata = { title: "Conditions générales — YUM" };

export default function Page() {
  return <Legal title="Conditions générales" intro="Les règles applicables aux locations réalisées via YUM Afrique." sections={["Objet et champ d’application", "Conditions pour louer (âge, permis, pièces demandées)", "Demande, confirmation et paiement", "Utilisation du véhicule", "Responsabilités des parties", "Incidents, accidents et sinistres"]} />;
}
