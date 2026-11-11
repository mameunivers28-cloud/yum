"use client";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";


export default function SpecialForm() {
  const [f, setF] = useState({
    full_name: "", phone: "", email: "", city: "Dakar", start_date: "", end_date: "",
    vehicle_type: "", make: "", model: "", daily_budget: "", transmission: "", seats: "",
    preferences: "", pickup_place: "", return_place: "", notes: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");
  const [minDate, setMinDate] = useState("");
  useEffect(() => { setMinDate(new Date().toISOString().slice(0, 10)); }, []);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    if (f.end_date < f.start_date) { setErr("La date de retour doit suivre la date de départ."); return; }
    setState("sending");
    const { error } = await supabase.from("special_requests").insert({
      full_name: f.full_name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      city: f.city.trim() || "Dakar",
      start_date: f.start_date,
      end_date: f.end_date,
      vehicle_type: f.vehicle_type || null,
      make: f.make.trim() || null,
      model: f.model.trim() || null,
      daily_budget: f.daily_budget ? Number(f.daily_budget) : null,
      transmission: f.transmission || null,
      seats: f.seats ? Number(f.seats) : null,
      preferences: f.preferences.trim() || null,
      pickup_place: f.pickup_place.trim() || null,
      return_place: f.return_place.trim() || null,
      notes: f.notes.trim() || null,
    });
    if (error) { setErr("Envoi impossible pour le moment. Réessayez dans un instant."); console.error(error); setState("error"); return; }
    setState("ok");
  }

  if (state === "ok") {
    return (
      <div className="formcard ok" role="status">
        <h2>Demande reçue</h2>
        <p>Merci {f.full_name.split(" ")[0]}. Nous cherchons le véhicule qui correspond et nous vous contactons au {f.phone} avec des offres.</p>
        <p><b>Vous ne payez rien maintenant.</b></p>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={submit}>
      <h3 className="fsec"><span>1</span>Vos coordonnées</h3>
      <div className="fgrid">
        <label>Nom complet<input required autoComplete="name" value={f.full_name} onChange={set("full_name")} /></label>
        <label>Téléphone / WhatsApp<input required type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
      </div>
      <label>Courriel<input required type="email" autoComplete="email" value={f.email} onChange={set("email")} /></label>
      <h3 className="fsec"><span>2</span>Vos dates</h3>
      <div className="fgrid">
        <label>Date de départ<input type="date" required min={minDate} value={f.start_date} onChange={set("start_date")} /></label>
        <label>Date de retour<input type="date" required min={f.start_date || minDate} value={f.end_date} onChange={set("end_date")} /></label>
      </div>
      <h3 className="fsec"><span>3</span>Le véhicule recherché</h3>
      <div className="fgrid">
        <label>Type de véhicule
          <select value={f.vehicle_type} onChange={set("vehicle_type")}>
            <option value="">Peu importe</option><option>Citadine</option><option>Berline</option><option>SUV</option><option>4x4</option><option>Minibus</option>
          </select>
        </label>
        <label>Boîte
          <select value={f.transmission} onChange={set("transmission")}>
            <option value="">Peu importe</option><option>Automatique</option><option>Manuelle</option>
          </select>
        </label>
      </div>
      <div className="fgrid">
        <label>Marque souhaitée <small>(facultatif)</small><input value={f.make} onChange={set("make")} /></label>
        <label>Modèle souhaité <small>(facultatif)</small><input value={f.model} onChange={set("model")} /></label>
      </div>
      <div className="fgrid">
        <label>Budget par jour (FCFA)<input type="number" inputMode="numeric" min={0} value={f.daily_budget} onChange={set("daily_budget")} /></label>
        <label>Nombre de places<input type="number" inputMode="numeric" min={1} max={20} value={f.seats} onChange={set("seats")} /></label>
      </div>
      <label>Préférences <small>(climatisation, siège bébé, chauffeur…)</small><textarea rows={3} value={f.preferences} onChange={set("preferences")} /></label>
      <h3 className="fsec"><span>4</span>Remise et retour</h3>
      <div className="fgrid">
        <label>Lieu de remise<input placeholder="Aéroport AIBD, hôtel…" value={f.pickup_place} onChange={set("pickup_place")} /></label>
        <label>Lieu de retour<input value={f.return_place} onChange={set("return_place")} /></label>
      </div>
      <h3 className="fsec"><span>5</span>Précisions</h3>
      <label>Autres précisions <small>(facultatif)</small><textarea rows={3} value={f.notes} onChange={set("notes")} /></label>
      {err && <p className="err" role="alert">{err}</p>}
      <p className="est">Vous ne payez rien maintenant. Nous vous proposons des offres après vérification.</p>
      <button className="btn gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Envoyer ma demande"}</button>
    </form>
  );
}
