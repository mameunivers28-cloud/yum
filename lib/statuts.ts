// Messages affichés au client : ce qui se passe ensuite pour chaque statut.
// Aucune règle commerciale n'est inventée : ce sont des explications du processus déjà défini.
export const NEXT_RENTAL: Record<string, string> = {
  "Nouvelle demande": "Votre demande a bien été reçue. L’équipe YUM va l’examiner.",
  "En cours de traitement": "L’équipe YUM examine votre demande.",
  "Vérification de disponibilité": "YUM vérifie la disponibilité du véhicule sur vos dates.",
  "Disponibilité confirmée": "Le véhicule est disponible sur vos dates. YUM vous contactera pour la suite.",
  "Dossier client à compléter": "YUM a besoin d’éléments pour compléter votre dossier (par exemple pièce d’identité et permis valide). L’équipe vous contactera pour les recevoir.",
  "Proposition commerciale envoyée": "YUM vous a communiqué les conditions. Répondez à l’équipe pour confirmer ou poser vos questions.",
  "En attente de paiement": "YUM vous a communiqué les modalités de paiement. La réservation n’est pas confirmée tant que le paiement n’est pas validé.",
  "Paiement à vérifier": "YUM vérifie votre paiement. Vous serez informé dès sa validation.",
  "Réservation confirmée": "Votre réservation est confirmée par YUM.",
  "Location en cours": "Votre location est en cours.",
  "Location terminée": "Votre location est terminée. Merci d’avoir choisi YUM.",
  "Annulée": "Cette demande a été annulée. Vous pouvez faire une nouvelle demande.",
  "Refusée": "YUM n’a pas pu donner suite à cette demande. Vous pouvez en faire une nouvelle ou contacter l’équipe.",
};

export const NEXT_SPECIAL: Record<string, string> = {
  "Nouvelle demande": "Votre demande a bien été reçue. L’équipe YUM va l’étudier.",
  "Recherche en cours": "YUM cherche un véhicule correspondant à votre demande.",
  "Véhicule identifié": "YUM a identifié un véhicule possible. L’équipe vous contactera pour vous le présenter.",
  "Proposition envoyée": "YUM vous a envoyé une proposition. Répondez à l’équipe pour la suite.",
  "En attente de réponse": "YUM attend votre réponse à sa proposition.",
  "Convertie en réservation": "Votre demande est devenue une demande de location suivie par YUM.",
  "Clôturée": "Cette demande est clôturée.",
  "Impossible à satisfaire": "YUM n’a pas trouvé de véhicule correspondant. Vous pouvez adapter votre demande ou contacter l’équipe.",
};

export const NEXT_PARTNER: Record<string, string> = {
  "Soumise": "Votre dossier a bien été reçu. YUM va le vérifier.",
  "En attente de vérification": "Votre dossier attend sa vérification par YUM.",
  "En cours d’examen": "YUM examine votre dossier et votre véhicule.",
  "Documents complémentaires demandés": "YUM a besoin d’éléments supplémentaires. L’équipe vous contactera pour les recevoir.",
  "Approuvée": "Votre dossier est approuvé. YUM vous contactera pour les modalités de mise à disposition.",
  "Refusée": "YUM n’a pas pu donner suite à ce dossier. Vous pouvez contacter l’équipe pour en savoir plus.",
  "Suspendue": "Votre dossier est suspendu. Contactez l’équipe YUM pour en savoir plus.",
};

// Frise du dossier partenaire : étape atteinte (0 à 3) et issue.
export const FRISE = ["Dossier reçu", "Vérification", "Décision"];
export function friseIndex(status: string): { step: number; issue: "ok" | "ko" | "wait" | null } {
  switch (status) {
    case "Soumise": return { step: 0, issue: null };
    case "En attente de vérification":
    case "En cours d’examen":
    case "Documents complémentaires demandés": return { step: 1, issue: status.startsWith("Documents") ? "wait" : null };
    case "Approuvée": return { step: 2, issue: "ok" };
    case "Refusée":
    case "Suspendue": return { step: 2, issue: "ko" };
    default: return { step: 0, issue: null };
  }
}
