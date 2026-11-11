"use client";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../../lib/supabase";
import { waLink } from "../../../lib/config";

const fmt = (n: number) => n.toLocaleString("fr-FR");
const PLACES = ["Aéroport international Blaise-Diagne", "Mon adresse à Dakar", "Mon hôtel", "Autre lieu (à convenir avec YUM)"];

// Nombre de jours de 24 h entamés entre deux instants (calcul en UTC : pas d'erreur d'heure d'été).
function countDays(d1: string, t1: string, d2: string, t2: string) {
  if (!d1 || !d2) return 0;
  const [y1, m1, j1] = d1.split("-").map(Number); const [h1, n1] = (t1 || "10:00").split(":").map(Number);
  const [y2, m2, j2] = d2.split("-").map(Number); const [h2, n2] = (t2 || "10:00").split(":").map(Number);
  const ms = Date.UTC(y2, m2 - 1, j2, h2, n2) - Date.UTC(y1, m1 - 1, j1, h1, n1);
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / 86400000));
}

type Props = { vehicleId: string; vehicleName: string; year: number | null; dailyPrice: number; deposit: number | null; deliveryFee: number | null };

export default function DemandeForm({ vehicleId, vehicleName, year, dailyPrice, deposit, deliveryFee }: Props) {
  const [f, setF] = useState({ full_name: "", phone: "", email: "", start_date: "", start_time: "10:00", end_date: "", end_time: "10:00", pickup: PLACES[0], pickup_detail: "", ret: PLACES[0], ret_detail: "", notes: "" });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const [minDate, setMinDate] = useState("");
  const [ref, setRef] = useState("");
  useEffect(() => { setMinDate(new Date().toISOString().slice(0, 10)); }, []);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const days = countDays(f.start_date, f.start_time, f.end_date, f.end_time);
  const rent = days * dailyPrice;
  const place = (p: string, d: string) => (p.startsWith("Mon ") || p.startsWith("Autre") ? `${p}${d.trim() ? " : " + d.trim() : ""}` : p);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    if (days === 0) { setErr("La date et l’heure de retour doivent suivre celles du départ."); return; }
    if (f.pickup.startsWith("Mon ") || f.pickup.startsWith("Autre")) { if (!f.pickup_detail.trim()) { setErr("Précisez le lieu de remise (adresse, hôtel…)."); return; } }
    setState("sending");
    const id = crypto.randomUUID();
    const { error } = await supabase.from("rental_requests").insert({
      id,
      vehicle_id: vehicleId,
      full_name: f.full_name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      start_date: f.start_date,
      end_date: f.end_date,
      start_time: f.start_time,
      end_time: f.end_time,
      pickup_place: place(f.pickup, f.pickup_detail),
      return_place: place(f.ret, f.ret_detail),
      est_total: rent,
      notes: f.notes.trim() || null,
    });
    if (error && String(error.message).includes("VEHICLE_UNAVAILABLE")) { setErr("Ce véhicule est indisponible sur au moins une de ces dates. Aucune demande n’a été envoyée : choisissez d’autres dates ou demandez-nous une alternative sur WhatsApp."); setState("error"); return; }
    if (error) { setErr("Votre demande n’a pas pu être enregistrée. Aucune demande n’a été envoyée : réessayez dans un instant."); console.error(error); setState("error"); return; }
    setRef(id.slice(0, 8).toUpperCase());
    setState("ok");
  }

  if (state === "ok") {
    const msg = `Bonjour YUM Afrique, je viens d’envoyer une demande (n° ${ref}).\n\nNom : ${f.full_name}\nVéhicule : ${vehicleName}${year ? " " + year : ""}\nDu ${f.start_date} ${f.start_time} au ${f.end_date} ${f.end_time}\nRécupération : ${place(f.pickup, f.pickup_detail)}\nRestitution : ${place(f.ret, f.ret_detail)}\n\nMerci de me confirmer la disponibilité.`;
    return (
      <div className="formcard ok" role="status">
        <h2>Demande transmise</h2>
        <p>Votre demande <b>n° {ref}</b> a bien été transmise à YUM Afrique. Notre équipe vérifiera la disponibilité du véhicule et vous contactera pour confirmer les modalités de votre location.</p>
        <p><b>Cette demande ne constitue pas encore une réservation confirmée.</b> Vous ne payez rien maintenant.</p>
        <a className="btn wa" href={waLink(msg)} target="_blank" rel="noreferrer">Poursuivre sur WhatsApp</a>
        <small>WhatsApp sert à échanger avec l’équipe, il ne confirme pas la réservation.</small>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={submit}>
      <h2>Demander ce véhicule</h2>
      <p className="sub" style={{ margin: 0 }}>Aucun paiement maintenant. La disponibilité est confirmée par YUM.</p>
      <div className="fgrid3"><label>Date de départ<input type="date" required min={minDate} value={f.start_date} onChange={set("start_date")} /></label><label>Heure<input type="time" required value={f.start_time} onChange={set("start_time")} /></label></div>
      <div className="fgrid3"><label>Date de retour<input type="date" required min={f.start_date || minDate} value={f.end_date} onChange={set("end_date")} /></label><label>Heure<input type="time" required value={f.end_time} onChange={set("end_time")} /></label></div>
      {days > 0 && (
        <div className="est" aria-live="polite">
          <dl>
            <dt>Tarif journalier</dt><dd>{fmt(dailyPrice)} FCFA</dd>
            <dt>Nombre de jours</dt><dd>{days}</dd>
            <dt>Estimation de location</dt><dd>{fmt(rent)} FCFA</dd>
            {deliveryFee != null && deliveryFee > 0 && <><dt>Frais de livraison</dt><dd>{fmt(deliveryFee)} FCFA</dd></>}
            {deposit != null && deposit > 0 && <><span className="sep" /><dt>Dépôt de garantie (à part)</dt><dd>{fmt(deposit)} FCFA</dd></>}
          </dl>
          <span className="note">Estimation indicative par tranche de 24 h. Le prix final et la disponibilité restent soumis à confirmation par YUM.</span>
        </div>
      )}
      <label>Nom complet<input required autoComplete="name" value={f.full_name} onChange={set("full_name")} /></label>
      <label>Téléphone / WhatsApp<input required type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
      <label>Courriel<input required type="email" autoComplete="email" value={f.email} onChange={set("email")} /></label>
      <label>Lieu de récupération<select value={f.pickup} onChange={set("pickup")}>{PLACES.map((p) => <option key={p}>{p}</option>)}</select></label>
      {(f.pickup.startsWith("Mon ") || f.pickup.startsWith("Autre")) && <label>Précisez le lieu<input required value={f.pickup_detail} onChange={set("pickup_detail")} /></label>}
      <label>Lieu de restitution<select value={f.ret} onChange={set("ret")}>{PLACES.map((p) => <option key={p}>{p}</option>)}</select></label>
      {(f.ret.startsWith("Mon ") || f.ret.startsWith("Autre")) && <label>Précisez le lieu<input value={f.ret_detail} onChange={set("ret_detail")} /></label>}
      <small style={{ color: "#5b6572" }}>La livraison et la récupération sont à confirmer par YUM selon le véhicule et la zone.</small>
      <label>Informations complémentaires <small>(facultatif)</small><textarea rows={3} value={f.notes} onChange={set("notes")} /></label>
      <div className="recap" aria-live="polite">
        <b>Récapitulatif de votre demande</b>
        <ul>
          <li>Véhicule : {vehicleName}{year ? " " + year : ""}</li>
          <li>Départ : {f.start_date ? `${f.start_date} à ${f.start_time}` : "à renseigner"}</li>
          <li>Retour : {f.end_date ? `${f.end_date} à ${f.end_time}` : "à renseigner"}</li>
          <li>Récupération : {place(f.pickup, f.pickup_detail)}</li>
          <li>Restitution : {place(f.ret, f.ret_detail)}</li>
          <li>Contact : {f.phone || f.email ? [f.phone, f.email].filter(Boolean).join(" · ") : "à renseigner"}</li>
        </ul>
        <small>Cette demande sera examinée par YUM. Elle n’est pas une réservation confirmée.</small>
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Envoyer ma demande"}</button>
    </form>
  );
}
