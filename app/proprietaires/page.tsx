import MarketingPage from "../MarketingPage";
import { WA_PARTNER } from "../../lib/config";

export const metadata = {
  title: "Propriétaires : proposer votre véhicule à la location au Sénégal — YUM",
  description: "Devenez propriétaire partenaire YUM : déposez votre candidature, faites vérifier votre véhicule et suivez votre dossier. Aucun revenu n’est garanti.",
  alternates: { canonical: "/proprietaires" },
};

export default function Page() {
  return (
    <MarketingPage m={{
      eyebrow: "Propriétaires partenaires",
      title: "Proposez votre véhicule avec YUM",
      lead: "YUM examine votre dossier et, après validation, peut publier votre véhicule. Il reste sous votre responsabilité, selon les conditions convenues avec YUM. Aucun revenu n’est garanti.",
      points: [
        ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z", "Vérification", "Le véhicule et les documents sont contrôlés avant toute publication."],
        ["M4 5h16v14H4zM8 9h8M8 13h5", "Suivi du dossier", "Suivez le statut de votre candidature depuis votre espace."],
        ["M4 5h16v14H4zM4 9h16", "Disponibilités", "Les périodes où le véhicule n’est pas disponible sont gérées dans la plateforme."],
        ["M9 12l2 2 4-4M5 4h14v16H5z", "Documents privés", "Vos documents ne sont accessibles qu’aux personnes autorisées de YUM."],
      ],
      steps: [["Déposez votre candidature", "Créez un compte et remplissez le formulaire."], ["Transmettez vos documents", "Joignez les pièces demandées."], ["Faites vérifier le véhicule", "YUM contrôle le dossier."], ["Recevez une réponse", "Approbation, complément demandé ou refus."], ["Mise à disposition", "Selon les modalités convenues avec YUM."]],
      note: "Les conditions de rémunération sont définies avec YUM lors de l’examen de votre dossier.",
      ctas: [["/devenir-partenaire", "Devenir partenaire"], ["/contact", "Contacter YUM"]],
      wa: WA_PARTNER,
    }} />
  );
}
