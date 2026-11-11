"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Data = {
  full_name: string; phone: string; whatsapp: string; email: string; city: string; address_zone: string;
  vehicle_make: string; vehicle_model: string; vehicle_year: string; plate: string; category: string; transmission: string; fuel: string; engine: string; seats: string; has_ac: string; mileage_km: string; description: string; equipment: string;
  min_daily_price: string; availability_note: string; min_rental_days: string; special_conditions: string; delivery_possible: string; delivery_zones: string;
};
const EMPTY: Data = { full_name: "", phone: "", whatsapp: "", email: "", city: "Dakar", address_zone: "", vehicle_make: "", vehicle_model: "", vehicle_year: "", plate: "", category: "Berline", transmission: "Automatique", fuel: "Essence", engine: "", seats: "5", has_ac: "oui", mileage_km: "", description: "", equipment: "", min_daily_price: "", availability_note: "", min_rental_days: "", special_conditions: "", delivery_possible: "non", delivery_zones: "" };

const DOCS: { k: string; label: string; need: boolean }[] = [
  { k: "photo_ext", label: "Photos extérieures", need: true },
  { k: "photo_int", label: "Photos intérieures", need: true },
  { k: "photo_dash", label: "Photo du tableau de bord", need: true },
  { k: "doc_vehicle", label: "Documents du véhicule", need: true },
  { k: "id", label: "Justificatif d’identité", need: true },
  { k: "ownership", label: "Justificatif de propriété ou autorisation de mise en location", need: true },
];
const MAX = 5 * 1024 * 1024;
const OK = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const STEPS = ["Vous", "Véhicule", "Conditions", "Documents", "Confirmation"];
const KEY = "yum-partner-draft";

export default function Wizard() {
  const [uid, setUid] = useState<string | null | undefined>(undefined);
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(EMPTY);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [ack, setAck] = useState(false);
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [pro, setPro] = useState(false);
  const [company, setCompany] = useState("");
  const [fleet, setFleet] = useState("");

  useEffect(() => {
    try { if (new URLSearchParams(window.location.search).get("profil") === "pro") setPro(true); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUid(data.session?.user.id ?? null);
      if (data.session?.user.email) setD((p) => ({ ...p, email: p.email || data.session!.user.email! }));
    });
    try { const s = localStorage.getItem(KEY); if (s) setD((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* brouillon indisponible */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* ignore */ } }, [d]);

  const set = (k: keyof Data) => (e: { target: { value: string } }) => setD((p) => ({ ...p, [k]: e.target.value }));

  if (uid === undefined) return <p>Chargement…</p>;
  if (uid === null) return (
    <div className="formcard">
      <h2>Connectez-vous pour continuer</h2>
      <p>Un compte permet d’envoyer vos documents en sécurité et de suivre l’avancement de votre dossier.</p>
      <Link className="btn gold" href="/connexion?next=/devenir-partenaire">Se connecter ou créer un compte</Link>
    </div>
  );
  if (done) return (
    <div className="formcard ok" role="status">
      <h2>Demande reçue</h2>
      <p>Merci d’avoir choisi YUM Afrique. Votre demande de partenariat a bien été reçue. Notre équipe examinera les informations et les documents transmis avant de vous contacter. La soumission de votre véhicule ne garantit pas sa publication sur la plateforme.</p>
      <Link className="btn navy" href="/mon-espace">Suivre mon dossier</Link>
    </div>
  );

  function validate(s: number): string {
    if (s === 0) { if (!d.full_name.trim() || !d.phone.trim() || !d.email.trim() || !d.city.trim()) return "Renseignez votre nom, téléphone, courriel et ville."; if (pro && !company.trim()) return "Indiquez le nom de votre entreprise."; }
    if (s === 1) {
      if (!d.vehicle_make.trim() || !d.vehicle_model.trim() || !d.plate.trim()) return "Renseignez la marque, le modèle et l’immatriculation.";
      const y = Number(d.vehicle_year); if (!y || y < 1990 || y > 2100) return "Indiquez une année valide.";
      const n = Number(d.seats); if (!n || n < 1 || n > 20) return "Indiquez un nombre de places valide.";
    }
    if (s === 2) { const p = Number(d.min_daily_price); if (!p || p < 1000) return "Indiquez le prix journalier minimum souhaité (en FCFA)."; }
    if (s === 3) { for (const x of DOCS) if (x.need && !(files[x.k]?.length)) return `Il manque : ${x.label}.`; }
    return "";
  }
  const next = () => { const m = validate(step); setErr(m); if (!m) setStep(step + 1); };

  function addFiles(k: string, list: FileList | null) {
    if (!list) return;
    const out: File[] = [...(files[k] ?? [])];
    for (const f of Array.from(list)) {
      if (!OK.includes(f.type)) { setErr(`« ${f.name} » : format non accepté (JPG, PNG, WebP ou PDF).`); return; }
      if (f.size > MAX) { setErr(`« ${f.name} » dépasse 5 Mo.`); return; }
      out.push(f);
    }
    setErr(""); setFiles({ ...files, [k]: out.slice(0, 8) });
  }

  async function submit() {
    for (let s = 0; s < 4; s++) { const m = validate(s); if (m) { setErr(m); setStep(s); return; } }
    if (!ack || !terms) { setErr("Confirmez l’exactitude des informations et acceptez les conditions de soumission."); return; }
    setBusy(true); setErr("");
    const id = crypto.randomUUID();
    const docs: { kind: string; path: string; name: string }[] = [];
    try {
      for (const x of DOCS) {
        let n = 0;
        for (const f of files[x.k] ?? []) {
          const ext = (f.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
          const path = `${uid}/${id}/${x.k}-${++n}.${ext}`;
          const { error } = await supabase.storage.from("partner-docs").upload(path, f, { contentType: f.type, upsert: false });
          if (error) throw error;
          docs.push({ kind: x.k, path, name: f.name });
        }
      }
      const { error } = await supabase.from("partner_applications").insert({
        id, status: "Soumise", accepted_terms: true,
        full_name: d.full_name.trim(), phone: d.phone.trim(), whatsapp: d.whatsapp.trim() || null, email: d.email.trim(), city: d.city.trim(), address_zone: d.address_zone.trim() || null,
        vehicle_make: d.vehicle_make.trim(), vehicle_model: d.vehicle_model.trim(), vehicle_year: Number(d.vehicle_year), plate: d.plate.trim(), category: d.category, transmission: d.transmission, fuel: d.fuel, engine: d.engine.trim() || null,
        seats: Number(d.seats), has_ac: d.has_ac === "oui", mileage_km: d.mileage_km ? Number(d.mileage_km) : null, description: ((pro ? `[Professionnel] Entreprise : ${company.trim()}${fleet.trim() ? ` · Flotte : ${fleet.trim()} véhicule(s)` : ""}. Ce dossier concerne un seul véhicule.` : "") + (pro && d.description.trim() ? "\n" : "") + d.description.trim()) || null,
        equipment: d.equipment.split(",").map((s) => s.trim()).filter(Boolean),
        min_daily_price: Number(d.min_daily_price), availability_note: d.availability_note.trim() || null, min_rental_days: d.min_rental_days ? Number(d.min_rental_days) : null,
        special_conditions: d.special_conditions.trim() || null, delivery_possible: d.delivery_possible === "oui", delivery_zones: d.delivery_zones.trim() || null,
        documents: docs,
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      setBusy(false);
      setErr("Votre demande n’a pas pu être enregistrée. Rien n’a été envoyé : vérifiez votre connexion et réessayez.");
      return;
    }
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setBusy(false); setDone(true);
  }

  const row = (l: string, v: string) => v ? <><dt>{l}</dt><dd>{v}</dd></> : null;

  return (
    <div className="formcard">
      <ol className="wsteps" aria-label="Étapes">{STEPS.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={i < step ? "done" : ""}><span>{i + 1}</span>{s}</li>)}</ol>

      {step === 0 && (<>
        <h2>Vos informations</h2>
        <fieldset className="profil"><legend>Vous êtes</legend>
          <label className="chk"><input type="radio" name="profil" checked={!pro} onChange={() => setPro(false)} /> Un particulier</label>
          <label className="chk"><input type="radio" name="profil" checked={pro} onChange={() => setPro(true)} /> Une agence ou une entreprise</label>
        </fieldset>
        {pro && <p className="notice">Un dossier correspond à un véhicule. Vous pouvez soumettre un dossier par véhicule : chacun est examiné séparément avant toute publication.</p>}
        <div className="fgrid">
          {pro && <>
            <label>Nom de l’entreprise<input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" /></label>
            <label>Véhicules dans votre flotte <small>(facultatif)</small><input type="number" inputMode="numeric" value={fleet} onChange={(e) => setFleet(e.target.value)} /></label>
          </>}
          <label className="full">Nom complet<input required value={d.full_name} onChange={set("full_name")} autoComplete="name" /></label>
          <label>Téléphone<input type="tel" value={d.phone} onChange={set("phone")} autoComplete="tel" /></label>
          <label>WhatsApp <small>(si différent)</small><input type="tel" value={d.whatsapp} onChange={set("whatsapp")} /></label>
          <label className="full">Courriel<input type="email" value={d.email} onChange={set("email")} autoComplete="email" /></label>
          <label>Ville de résidence<input value={d.city} onChange={set("city")} /></label>
          <label>Adresse ou zone <small>(facultatif)</small><input value={d.address_zone} onChange={set("address_zone")} /></label>
        </div>
      </>)}

      {step === 1 && (<>
        <h2>Votre véhicule</h2>
        <div className="fgrid">
          <label>Marque<input value={d.vehicle_make} onChange={set("vehicle_make")} /></label>
          <label>Modèle<input value={d.vehicle_model} onChange={set("vehicle_model")} /></label>
          <label>Année<input type="number" inputMode="numeric" value={d.vehicle_year} onChange={set("vehicle_year")} /></label>
          <label>Immatriculation<input value={d.plate} onChange={set("plate")} /></label>
          <label>Catégorie<select value={d.category} onChange={set("category")}><option>Citadine</option><option>Berline</option><option>SUV</option><option>4x4</option><option>Minibus</option></select></label>
          <label>Transmission<select value={d.transmission} onChange={set("transmission")}><option>Automatique</option><option>Manuelle</option></select></label>
          <label>Carburant<select value={d.fuel} onChange={set("fuel")}><option>Essence</option><option>Diesel</option><option>Hybride</option><option>Électrique</option></select></label>
          <label>Motorisation <small>(facultatif)</small><input value={d.engine} onChange={set("engine")} /></label>
          <label>Places<input type="number" inputMode="numeric" value={d.seats} onChange={set("seats")} /></label>
          <label>Climatisation<select value={d.has_ac} onChange={set("has_ac")}><option value="oui">Oui</option><option value="non">Non</option></select></label>
          <label>Kilométrage <small>(facultatif)</small><input type="number" inputMode="numeric" value={d.mileage_km} onChange={set("mileage_km")} /></label>
          <label className="full">Équipements <small>(séparés par des virgules)</small><input value={d.equipment} onChange={set("equipment")} /></label>
          <label className="full">Description <small>(facultatif)</small><textarea rows={3} value={d.description} onChange={set("description")} /></label>
        </div>
      </>)}

      {step === 2 && (<>
        <h2>Informations commerciales</h2>
        <p className="notice">Le prix minimum souhaité reste une information interne : YUM décide du prix proposé aux clients et des modalités commerciales avec vous.</p>
        <div className="fgrid">
          <label>Prix journalier minimum souhaité (FCFA)<input type="number" inputMode="numeric" value={d.min_daily_price} onChange={set("min_daily_price")} /></label>
          <label>Durée minimale de location <small>(jours, facultatif)</small><input type="number" inputMode="numeric" value={d.min_rental_days} onChange={set("min_rental_days")} /></label>
          <label className="full">Disponibilité du véhicule<textarea rows={2} value={d.availability_note} onChange={set("availability_note")} placeholder="Périodes disponibles, jours d’indisponibilité…" /></label>
          <label>Livraison possible<select value={d.delivery_possible} onChange={set("delivery_possible")}><option value="non">Non</option><option value="oui">Oui</option></select></label>
          <label>Zones de livraison<input value={d.delivery_zones} onChange={set("delivery_zones")} /></label>
          <label className="full">Conditions particulières <small>(facultatif)</small><textarea rows={2} value={d.special_conditions} onChange={set("special_conditions")} /></label>
        </div>
      </>)}

      {step === 3 && (<>
        <h2>Documents et photos</h2>
        <p className="notice">Formats : JPG, PNG, WebP ou PDF, 5 Mo maximum par fichier. Vos documents sont stockés de façon privée : ils ne sont jamais publics et ne sont visibles que par l’équipe YUM.</p>
        {DOCS.map((x) => (
          <label key={x.k}>{x.label}{x.need ? "" : " (facultatif)"}
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => { addFiles(x.k, e.target.files); e.target.value = ""; }} />
            {(files[x.k]?.length ?? 0) > 0 && <small>{files[x.k].map((f) => f.name).join(", ")} <button type="button" className="linkbtn" onClick={() => setFiles({ ...files, [x.k]: [] })}>Retirer</button></small>}
          </label>
        ))}
      </>)}

      {step === 4 && (<>
        <h2>Vérifiez et confirmez</h2>
        <dl className="recap">
          {row("Nom", d.full_name)}{row("Téléphone", d.phone)}{row("Courriel", d.email)}{row("Ville", d.city)}
          {row("Véhicule", `${d.vehicle_make} ${d.vehicle_model} ${d.vehicle_year}`)}{row("Immatriculation", d.plate)}{row("Catégorie", `${d.category} · ${d.transmission} · ${d.fuel}`)}
          {row("Prix minimum souhaité", d.min_daily_price ? `${Number(d.min_daily_price).toLocaleString("fr-FR")} FCFA / jour` : "")}
          {row("Livraison", d.delivery_possible === "oui" ? `Oui ${d.delivery_zones}` : "Non")}
          {row("Fichiers", `${Object.values(files).reduce((a, l) => a + l.length, 0)} fichier(s)`)}
        </dl>
        <p><button type="button" className="linkbtn" onClick={() => setStep(0)}>Corriger mes informations</button></p>
        <label className="chk"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> Je confirme que les renseignements fournis sont exacts.</label>
        <label className="chk"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> J’accepte les conditions de soumission : la soumission ne garantit pas la publication, et YUM peut demander des documents complémentaires.</label>
      </>)}

      {err && <p className="err" role="alert">{err}</p>}
      <div className="wnav">
        {step > 0 && <button type="button" className="btn line" onClick={() => { setErr(""); setStep(step - 1); }} disabled={busy}>Retour</button>}
        {step < 4 ? <button type="button" className="btn gold" onClick={next}>Continuer</button> : <button type="button" className="btn gold" onClick={submit} disabled={busy}>{busy ? "Envoi des documents…" : "Envoyer ma demande"}</button>}
      </div>
    </div>
  );
}
