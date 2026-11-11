import MarketingPage from "../MarketingPage";

export const metadata = {
  title: "Location de voiture pour la diaspora et les voyageurs au Sénégal — YUM",
  description: "Préparez votre séjour au Sénégal : consultez les véhicules YUM à Dakar, envoyez votre demande avant votre arrivée et demandez une remise à l’aéroport.",
  alternates: { canonical: "/voyageurs-diaspora" },
};

export default function Page() {
  return (
    <MarketingPage m={{
      eyebrow: "Voyageurs et diaspora",
      title: "Organisez votre location avant d’arriver au Sénégal",
      lead: "Consultez les véhicules, envoyez votre demande depuis l’étranger et préparez votre déplacement à Dakar avec l’accompagnement de YUM.",
      points: [
        ["M4 5h16v14H4zM4 9h16", "Préparer son séjour", "Choisissez un véhicule et vos dates avant votre départ."],
        ["M3 7h18v10H3zM7 11h6", "Consulter les véhicules", "Catalogue avec catégorie, transmission, places et prix journalier."],
        ["M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z", "Remise à l’aéroport", "Vous pouvez la demander dans votre demande ; YUM la confirme selon les possibilités."],
        ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Un accompagnement", "Une équipe qui répond à vos questions, notamment par WhatsApp."],
      ],
      steps: [["Choisissez", "Un véhicule et vos dates d’arrivée et de départ."], ["Envoyez votre demande", "Indiquez le lieu de remise souhaité."], ["YUM vérifie", "Disponibilité et dossier."], ["Confirmez", "Après réception des conditions finales et validation du paiement."]],
      note: "La réservation n’est jamais instantanée : elle est confirmée par YUM après validation de votre dossier.",
      ctas: [["/vehicules", "Voir les véhicules"], ["/demande-speciale", "Demande personnalisée"]],
      wa: "Bonjour YUM Afrique, je prépare un séjour au Sénégal et souhaite organiser une location de véhicule avant mon arrivée.",
    }} />
  );
}
