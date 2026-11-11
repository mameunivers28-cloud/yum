import MarketingPage from "../MarketingPage";

export const metadata = {
  title: "Location de voiture familiale à Dakar — YUM",
  description: "Trouvez un véhicule adapté à vos déplacements en famille à Dakar : nombre de places, catégorie et transmission indiqués sur chaque fiche.",
  alternates: { canonical: "/familles" },
};

export default function Page() {
  return (
    <MarketingPage m={{
      eyebrow: "Familles",
      title: "Un véhicule adapté à vos déplacements en famille",
      lead: "Chaque fiche indique le nombre de places, la catégorie et la transmission pour choisir plus facilement.",
      points: [
        ["M16 11a4 4 0 10-8 0M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6", "Nombre de places", "Filtrez le catalogue selon le nombre de places affiché."],
        ["M3 14l2-6h14l2 6M5 14v4M19 14v4", "Catégories", "Berlines, SUV et 4x4 selon les véhicules publiés."],
        ["M9 12l2 2 4-4M5 4h14v16H5z", "Conditions claires", "Location, dépôt de garantie et frais éventuels sont communiqués avant confirmation."],
      ],
      ctas: [["/vehicules", "Voir les véhicules"], ["/demande-speciale", "Demande personnalisée"]],
      wa: "Bonjour YUM Afrique, je cherche un véhicule adapté à un déplacement en famille à Dakar.",
    }} />
  );
}
