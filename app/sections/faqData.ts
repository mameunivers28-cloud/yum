export type FaqGroup = { cat: string; items: { q: string; a: string }[] };

export const FAQ: FaqGroup[] = [
  { cat: "Réservation", items: [
    { q: "Comment réserver un véhicule ?", a: "Choisissez un véhicule, indiquez vos dates et envoyez votre demande. L’équipe YUM l’examine, puis vous recontacte pour la suite." },
    { q: "La réservation est-elle instantanée ?", a: "Non. Chaque demande est vérifiée par une personne de l’équipe YUM. Votre réservation n’est confirmée qu’après validation de votre dossier et du paiement." },
    { q: "Comment confirmer ma demande ?", a: "Une fois votre dossier approuvé, YUM vous communique les conditions finales. La réservation est confirmée après validation du paiement." },
  ] },
  { cat: "Paiement", items: [
    { q: "Comment fonctionne le paiement ?", a: "Vous ne payez qu’après l’approbation de votre dossier. Les modalités de paiement vous sont communiquées par YUM avant toute confirmation." },
    { q: "Comment fonctionne le dépôt de garantie ?", a: "Le dépôt de garantie est distinct du prix de la location. Son montant et ses modalités vous sont communiqués par YUM avant confirmation. Voir aussi la page « Dépôt de garantie »." },
    { q: "Quand dois-je payer ?", a: "Après l’approbation de votre dossier et la réception des conditions finales, pas au moment de l’envoi de la demande." },
  ] },
  { cat: "Véhicules", items: [
    { q: "Les véhicules sont-ils vérifiés ?", a: "Les véhicules de propriétaires partenaires sont examinés par YUM avant d’être publiés." },
    { q: "Comment connaître les disponibilités ?", a: "Les dates déjà réservées sont indiquées sur la fiche du véhicule. La disponibilité définitive est toujours confirmée par l’équipe YUM." },
    { q: "Puis-je demander un véhicule particulier ?", a: "Oui. Utilisez la demande personnalisée : YUM cherche dans sa flotte et auprès de ses partenaires." },
  ] },
  { cat: "Livraison", items: [
    { q: "Puis-je récupérer mon véhicule à l’aéroport ?", a: "Vous pouvez demander une remise à l’aéroport dans votre demande. Elle est confirmée par YUM selon les possibilités." },
    { q: "Puis-je demander une livraison à une adresse particulière ?", a: "Vous pouvez en faire la demande. YUM vous confirme si c’est possible et les éventuels frais avant votre validation." },
  ] },
  { cat: "Partenariat", items: [
    { q: "Comment devenir partenaire ?", a: "Créez un compte, puis remplissez le formulaire « Devenir partenaire » en joignant les documents demandés. YUM examine votre dossier. Aucun revenu n’est garanti." },
    { q: "Quels documents sont nécessaires ?", a: "Le formulaire indique les documents à joindre. Ils sont conservés de façon privée et ne sont accessibles qu’aux personnes autorisées de YUM." },
    { q: "Comment sont gérées les demandes de location ?", a: "YUM reçoit et examine les demandes. Le véhicule reste sous votre responsabilité, selon les conditions convenues avec YUM." },
  ] },
];
