import MarketingPage from "../MarketingPage";

export const metadata = {
  title: "Location de véhicule pour professionnels à Dakar — YUM",
  description: "Déplacements professionnels à Dakar : découvrez les catégories de véhicules YUM et envoyez une demande personnalisée.",
  alternates: { canonical: "/professionnels" },
};

export default function Page() {
  return (
    <MarketingPage m={{
      eyebrow: "Professionnels et entreprises",
      title: "Des véhicules pour vos déplacements professionnels",
      lead: "Choisissez parmi les catégories disponibles ou décrivez votre besoin : YUM étudie votre demande et vous répond.",
      points: [
        ["M3 14l2-6h14l2 6M5 14v4M19 14v4", "Catégories de véhicules", "Citadines, berlines, SUV et 4x4 selon les véhicules publiés."],
        ["M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5", "Demande personnalisée", "Précisez votre besoin, nous cherchons dans la flotte et chez nos partenaires."],
        ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Un interlocuteur", "Contactez l’équipe pour échanger sur votre déplacement."],
      ],
      note: "Les conditions spécifiques aux entreprises sont étudiées au cas par cas par YUM, sur demande.",
      ctas: [["/demande-speciale", "Faire une demande"], ["/contact", "Contacter YUM"]],
      wa: "Bonjour YUM Afrique, je souhaite louer un véhicule pour un déplacement professionnel à Dakar.",
    }} />
  );
}
