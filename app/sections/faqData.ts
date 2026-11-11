export type FaqGroup = { cat: string; items: { q: string; a: string }[] };

export const FAQ: FaqGroup[] = [
  { cat: "Louer un véhicule", items: [
    { q: "Comment louer un véhicule ?", a: "Choisissez un véhicule, indiquez vos dates et envoyez votre demande. L’équipe YUM l’examine, puis vous recontacte pour la suite." },
    { q: "La réservation est-elle instantanée ?", a: "Non. Chaque demande est vérifiée par une personne de l’équipe. Elle n’est confirmée qu’après validation de votre dossier et du paiement." },
    { q: "Comment savoir si un véhicule est disponible ?", a: "Les dates déjà prises sont indiquées sur la fiche du véhicule. La disponibilité définitive est confirmée par YUM après l’envoi de votre demande." },
    { q: "Quels documents dois-je fournir ?", a: "Une pièce d’identité et un permis de conduire valide. YUM vous indique comment les transmettre lorsque votre dossier est examiné." },
    { q: "Quand et comment dois-je payer ?", a: "Après l’approbation de votre dossier et la réception des conditions finales, pas au moment de l’envoi de la demande. Le dépôt de garantie est distinct du prix de la location." },
    { q: "Puis-je récupérer le véhicule à l’aéroport ou à une adresse ?", a: "Vous pouvez le demander. La remise à l’aéroport ou à une adresse dépend des disponibilités et des conditions de la location ; YUM confirme avant votre validation." },
    { q: "Puis-je annuler ma demande ?", a: "Les conditions figurent dans la politique d’annulation de YUM. En cas de doute, écrivez à l’équipe avant de confirmer." },
  ] },
  { cat: "Proposer un véhicule", items: [
    { q: "Puis-je mettre ma voiture en location ?", a: "Oui. Remplissez le formulaire « Mettre mon véhicule en location » avec les documents demandés. YUM examine votre candidature avant toute publication." },
    { q: "Mon véhicule est-il publié automatiquement ?", a: "Non. Il n’est publié qu’après examen et approbation. Les conditions de mise à disposition sont définies avant toute exploitation." },
    { q: "Vais-je gagner de l’argent ?", a: "Aucun revenu n’est garanti : il dépend des locations effectivement réalisées et des conditions convenues avec YUM." },
    { q: "Qui reste responsable du véhicule ?", a: "Le véhicule vous appartient et reste sous votre responsabilité, selon les conditions convenues avec YUM. Il ne devient pas la propriété de YUM." },
    { q: "Mes documents sont-ils protégés ?", a: "Ils sont conservés de façon privée et ne sont accessibles qu’aux personnes autorisées de YUM. Voir la politique de confidentialité." },
  ] },
  { cat: "Demande personnalisée", items: [
    { q: "À quoi sert la demande personnalisée ?", a: "Si le catalogue ne correspond pas à votre besoin, décrivez-le : dates, budget, type de véhicule, préférences. YUM cherche dans sa flotte et auprès de ses partenaires." },
    { q: "YUM est-il sûr de trouver un véhicule ?", a: "Non. La demande ne garantit pas qu’un véhicule sera trouvé, ni un tarif avant validation. Vous ne payez rien pour l’envoyer." },
  ] },
  { cat: "Agences et professionnels", items: [
    { q: "Une agence ou une entreprise peut-elle proposer ses véhicules ?", a: "Oui. Les professionnels peuvent demander à rejoindre YUM comme partenaires, sous réserve de validation." },
    { q: "Peut-on proposer plusieurs véhicules ?", a: "Oui. Chaque véhicule fait l’objet d’un dossier examiné séparément et doit satisfaire aux conditions de validation." },
    { q: "YUM garantit-il un volume de réservations ?", a: "Non. Les modalités de collaboration peuvent être adaptées à votre activité, sans promesse de volume." },
  ] },
];
