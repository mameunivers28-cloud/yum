import Legal from "../legal/Legal";

export const metadata = { title: "Politique d’annulation — YUM" };

export default function Page() {
  return <Legal title="Politique d’annulation" intro="Les conditions dans lesquelles une demande ou une réservation peut être annulée." sections={["Annulation par le client", "Annulation par YUM ou le propriétaire", "Délais et conséquences"]} />;
}
