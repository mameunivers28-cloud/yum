"use client";
import { useState } from "react";

const STEPS: [string, string, string][] = [
  ["Le client découvre un véhicule", "Il parcourt le catalogue et ouvre la fiche d’un véhicule, par exemple une Toyota Corolla.", "Fiche véhicule"],
  ["Il choisit ses dates", "Il indique ses dates de départ et de retour et le lieu de remise souhaité.", "Dates et lieu"],
  ["Il envoie sa demande", "Il renseigne ses coordonnées et envoie sa demande. Ce n’est pas encore une réservation.", "Demande envoyée"],
  ["YUM vérifie", "L’équipe contrôle la disponibilité et le dossier du client.", "Vérification par YUM"],
  ["Le client reçoit les conditions", "YUM lui communique les conditions finales : location, dépôt de garantie et frais éventuels.", "Conditions finales"],
  ["Le dossier est validé", "Une fois le dossier approuvé et le paiement validé par YUM, la réservation est confirmée.", "Réservation confirmée"],
];

export default function Demo() {
  const [i, setI] = useState(0);
  const last = STEPS.length - 1;
  return (
    <section className="s soft"><div className="wrap">
      <p className="eyebrow dark">Démonstration</p>
      <h2>Le parcours d’une location, étape par étape</h2>
      <p className="sub">Exemple illustratif : aucune réservation ni aucun paiement réel n’est simulé ici.</p>
      <div className="demo">
        <ol className="demo-dots" aria-label="Étapes">
          {STEPS.map(([, , lab], k) => (
            <li key={lab}><button type="button" className={k === i ? "on" : k < i ? "done" : ""} aria-current={k === i ? "step" : undefined} onClick={() => setI(k)}><span>{k + 1}</span><em>{lab}</em></button></li>
          ))}
        </ol>
        <div className="demo-card" role="status" aria-live="polite">
          <p className="demo-n">Étape {i + 1} sur {STEPS.length}</p>
          <h3>{STEPS[i][0]}</h3>
          <p>{STEPS[i][1]}</p>
          <div className="demo-bar"><i style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} /></div>
          <div className="cta-row">
            <button type="button" className="btn line sm" disabled={i === 0} onClick={() => setI(i - 1)}>Précédent</button>
            <button type="button" className="btn navy sm" disabled={i === last} onClick={() => setI(i + 1)}>Suivant</button>
          </div>
        </div>
      </div>
    </div></section>
  );
}
