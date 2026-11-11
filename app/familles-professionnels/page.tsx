import MarketingPage from "../MarketingPage";

export const metadata = {
  title: "Location de voiture pour familles et professionnels à Dakar — YUM",
  description: "Familles ou déplacements professionnels à Dakar : choisissez un véhicule selon le nombre de places et la catégorie, ou faites une demande personnalisée à YUM.",
  alternates: { canonical: "/familles-professionnels" },
};

export default function Page() {
  return (
    <MarketingPage m={{
      eyebrow: "Familles et professionnels",
      title: "Le bon véhicule pour votre famille ou votre activité",
      lead: "Chaque fiche indique la catégorie, le nombre de places et la transmission. Si rien ne convient, YUM cherche pour vous.",
      points: [
        ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Nombre de places", "Choisissez selon le nombre de personnes à transporter."],
        ["M3 14l2-6h14l2 6M5 14v4M19 14v4", "Catégories", "Citadines, berlines, SUV et 4x4 selon les véhicules publiés."],
        ["M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5", "Demande personnalisée", "Décrivez votre besoin, YUM cherche dans la flotte et chez ses partenaires."],
        ["M9 12l2 2 4-4M5 4h14v16H5z", "Conditions claires", "Location, dépôt de garantie et frais éventuels sont communiqués avant confirmation."],
      ],
      note: "Les conditions spécifiques aux entreprises sont étudiées au cas par cas par YUM, sur demande.",
      ctas: [["/vehicules", "Voir les véhicules"], ["/demande-speciale", "Faire une demande"]],
      wa: "Bonjour YUM Afrique, je cherche un véhicule pour ma famille ou pour un déplacement professionnel à Dakar.",
    }} />
  );
}
