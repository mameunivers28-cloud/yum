"use client";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../../lib/supabase";

const fmt = (n: number) => n.toLocaleString("fr-FR");

export default function DemandeForm({ vehicleId, vehicleName, dailyPrice }: { vehicleId: string; vehicleName: string; dailyPrice: number }) {
  const [f, setF] = useState({ full_name: "", phone: "", email: "", start_date: "", end_date: "", pickup_place: "", return_place: "", notes: "" });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const [minDate, setMinDate] = useState("");
  useEffect(() => { setMinDate(new Date().toISOString().slice(0, 10)); }, []);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const days = f.start_date && f.end_date ? Math.max(0, Math.round((+new Date(f.end_date) - +new Date(f.start_date)) / 86400000)) + 1 : 0;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    if (f.end_date < f.start_date) { setErr("La date de retour doit suivre la date de départ."); return; }
    setState("sending");
    const { error } = await supabase.from("rental_requests").insert({
      vehicle_id: vehicleId,
      full_name: f.full_name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      start_date: f.start_date,
      end_date: f.end_date,
      pickup_place: f.pickup_place.trim(),
      return_place: f.return_place.trim() || f.pickup_place.trim(),
      notes: f.notes.trim() || null,
    });
    if (error) { setErr("Envoi impossible pour le moment. Réessayez dans un instant."); console.error(error); setState("error"); return; }
    setState("ok");
  }

  if (state === "ok") {
    return (
      <div className="formcard ok" role="status">
        <h2>Demande reçue</h2>
        <p>Merci {f.full_name.split(" ")[0]}. Nous vérifions la disponibilité de la <b>{vehicleName}</b> et nous vous répondons rapidement au {f.phone}.</p>
        <p><b>Vous ne payez rien maintenant.</b> Le paiement n’est demandé qu’après l’approbation de votre dossier.</p>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={submit}>
      <h2>Faire une demande</h2>
      <p className="sub" style={{ marginBottom: 14 }}>Aucun paiement maintenant. Nous confirmons la disponibilité avant tout.</p>
      <div className="fgrid">
        <label>Dates de départ<input type="date" required min={minDate} value={f.start_date} onChange={set("start_date")} /></label>
        <label>Date de retour<input type="date" required min={f.start_date || minDate} value={f.end_date} onChange={set("end_date")} /></label>
      </div>
      {days > 0 && <p className="est">{days} jour{days > 1 ? "s" : ""} × {fmt(dailyPrice)} FCFA = <b>{fmt(days * dailyPrice)} FCFA</b> <small>(estimation, à confirmer)</small></p>}
      <label>Nom complet<input required autoComplete="name" value={f.full_name} onChange={set("full_name")} /></label>
      <div className="fgrid">
        <label>Téléphone / WhatsApp<input required type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
        <label>Courriel<input required type="email" autoComplete="email" value={f.email} onChange={set("email")} /></label>
      </div>
      <label>Lieu de remise<input required placeholder="Aéroport AIBD, hôtel, adresse…" value={f.pickup_place} onChange={set("pickup_place")} /></label>
      <label>Lieu de retour <small>(facultatif, identique par défaut)</small><input value={f.return_place} onChange={set("return_place")} /></label>
      <label>Précisions <small>(facultatif)</small><textarea rows={3} value={f.notes} onChange={set("notes")} /></label>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Envoyer ma demande"}</button>
    </form>
  );
}
