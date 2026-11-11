// Configuration unique du site. Modifier ici, pas dans les composants.
export const SITE_URL = "https://yumafrique.com";
// Numéro WhatsApp professionnel de YUM, au format international sans « + ».
export const WHATSAPP_NUMBER = "15142354803";

export const waLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
export const WA_GENERAL = "Bonjour YUM Afrique, je souhaite obtenir des informations sur vos véhicules de location.";
export const WA_PARTNER = "Bonjour YUM Afrique, je souhaite proposer mon véhicule sur votre plateforme et devenir propriétaire partenaire.";
