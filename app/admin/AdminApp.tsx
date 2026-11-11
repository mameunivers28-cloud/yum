"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

const STATUTS = ["Demande reçue", "En vérification", "Approuvée", "Refusée", "Payée", "Terminée"];

type Rental = { id: string; vehicle_id: string | null; full_name: string; phone: string; email: string; start_date: string; end_date: string; pickup_place: string; return_place: string | null; notes: string | null; status: string; created_at: string };
type Special = { id: string; full_name: string; phone: string; email: string; city: string | null; start_date: string; end_date: string; vehicle_type: string | null; make: string | null; model: string | null; daily_budget: number | null; transmission: string | null; seats: number | null; preferences: string | null; pickup_place: string | null; return_place: string | null; notes: string | null; status: string; created_at: string };
const VERIF = ["En attente de vérification", "En cours d’examen", "Informations complémentaires demandées", "Approuvé", "Refusé", "Suspendu"];
type Vehicle = { id: string; name: string; daily_price: number; owner_type: string; published: boolean; verification_status: string };

const PSTAT = ["Soumise", "En attente de vérification", "En cours d’examen", "Documents complémentaires demandés", "Approuvée", "Refusée", "Suspendue"];
type PApp = { id: string; status: string; full_name: string; phone: string; whatsapp: string | null; email: string; city: string | null; address_zone: string | null; vehicle_make: string; vehicle_model: string; vehicle_year: number | null; plate: string | null; category: string | null; transmission: string | null; fuel: string | null; engine: string | null; seats: number | null; has_ac: boolean | null; mileage_km: number | null; description: string | null; equipment: string[] | null; min_daily_price: number | null; availability_note: string | null; min_rental_days: number | null; special_conditions: string | null; delivery_possible: boolean | null; delivery_zones: string | null; documents: { kind: string; path: string; name: string }[]; vehicle_id: string | null; created_at: string };
type PAdm = { notes: string | null; commission_pct: number | null; final_daily_price: number | null };
const DOCLABEL: Record<string, string> = { photo_ext: "Photo extérieure", photo_int: "Photo intérieure", photo_dash: "Tableau de bord", doc_vehicle: "Document véhicule", id: "Identité", ownership: "Propriété / autorisation" };

const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d: string) => new Date(d).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const wa = (p: string) => "https://wa.me/" + p.replace(/\D/g, "");

export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<"loc" | "spe" | "veh" | "par">("loc");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [apps, setApps] = useState<PApp[]>([]);
  const [padm, setPadm] = useState<Record<string, PAdm>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setEmail(data.session?.user.email ?? null); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setMsg("");
    const [r, s, v] = await Promise.all([
      supabase.from("rental_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("special_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("id,name,daily_price,owner_type,published,verification_status").order("name"),
    ]);
    if (r.error || s.error || v.error) { setMsg("Accès refusé : ce compte n’est pas administrateur."); return; }
    const [pa, pm] = await Promise.all([
      supabase.from("partner_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_application_admin").select("*"),
    ]);
    if (!pa.error) setApps((pa.data ?? []) as PApp[]);
    if (!pm.error) setPadm(Object.fromEntries((pm.data ?? []).map((x: PAdm & { application_id: string }) => [x.application_id, x])));
    setRentals((r.data ?? []) as Rental[]); setSpecials((s.data ?? []) as Special[]); setVehicles((v.data ?? []) as Vehicle[]);
  }, []);

  useEffect(() => { if (email) load(); }, [email, load]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) setMsg("Courriel ou mot de passe incorrect.");
  }

  async function setStatus(table: "rental_requests" | "special_requests", id: string, status: string) {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) { setMsg("Changement impossible."); return; }
    if (table === "rental_requests") setRentals((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    else setSpecials((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  async function setVerif(v: Vehicle, verification_status: string) {
    const { error } = await supabase.from("vehicles").update({ verification_status }).eq("id", v.id);
    if (error) { setMsg("Changement impossible."); return; }
    setVehicles((l) => l.map((x) => (x.id === v.id ? { ...x, verification_status } : x)));
  }

  async function togglePublish(v: Vehicle) {
    const { error } = await supabase.from("vehicles").update({ published: !v.published }).eq("id", v.id);
    if (error) { setMsg("Changement impossible."); return; }
    setVehicles((l) => l.map((x) => (x.id === v.id ? { ...x, published: !v.published } : x)));
  }

  async function setAppStatus(a: PApp, status: string) {
    const { error } = await supabase.from("partner_applications").update({ status }).eq("id", a.id);
    if (error) { setMsg("Changement impossible."); return; }
    setApps((l) => l.map((x) => (x.id === a.id ? { ...x, status } : x)));
  }

  async function saveAdm(a: PApp, v: PAdm) {
    const { error } = await supabase.from("partner_application_admin").upsert({ application_id: a.id, ...v, updated_at: new Date().toISOString() });
    if (error) { setMsg("Enregistrement impossible."); return; }
    setPadm((m) => ({ ...m, [a.id]: v })); setMsg("");
  }

  async function openDoc(path: string) {
    const { data, error } = await supabase.storage.from("partner-docs").createSignedUrl(path, 120);
    if (error || !data) { setMsg("Document inaccessible."); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function createVehicle(a: PApp) {
    const price = padm[a.id]?.final_daily_price;
    if (!price) { setMsg("Renseignez d’abord le prix journalier final proposé aux clients."); return; }
    const id = crypto.randomUUID();
    const { error } = await supabase.from("vehicles").insert({
      id, name: `${a.vehicle_make} ${a.vehicle_model}`, make: a.vehicle_make, year: a.vehicle_year, category: a.category ?? "Berline", transmission: a.transmission ?? "Automatique",
      seats: a.seats ?? 5, daily_price: price, owner_type: "Partenaire", published: false, verification_status: "En attente de vérification",
    });
    if (error) { setMsg("Création du véhicule impossible : " + error.message); return; }
    const u = await supabase.from("partner_applications").update({ vehicle_id: id }).eq("id", a.id);
    if (u.error) { setMsg("Véhicule créé, mais le lien avec le dossier a échoué."); }
    setApps((l) => l.map((x) => (x.id === a.id ? { ...x, vehicle_id: id } : x)));
    setMsg("Véhicule créé (masqué, en attente de vérification). Complétez-le puis publiez-le depuis l’onglet Véhicules.");
    load();
  }

  if (!ready) return <p style={{ padding: 24 }}>Chargement…</p>;

  if (!email) {
    return (
      <div className="adm-login">
        <form className="formcard" onSubmit={login}>
          <h1 className="dt" style={{ fontSize: 28 }}>Administration YUM</h1>
          <label>Courriel<input name="email" type="email" required autoComplete="username" /></label>
          <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>
          {msg && <p className="err" role="alert">{msg}</p>}
          <button className="btn" type="submit">Se connecter</button>
        </form>
      </div>
    );
  }

  const vName = (id: string | null) => vehicles.find((v) => v.id === id)?.name ?? "Véhicule";
  const count = (st: string) => rentals.filter((r) => r.status === st).length + specials.filter((r) => r.status === st).length;
  const rl = rentals.filter((r) => !filter || r.status === filter);
  const sl = specials.filter((r) => !filter || r.status === filter);

  return (
    <div className="adm">
      <header className="adm-top">
        <b className="logo" style={{ fontSize: 24 }}>YUM · Admin</b>
        <span className="adm-who">{email}</span>
        <button className="btn line" style={{ padding: "8px 14px" }} onClick={load}>Actualiser</button>
        <button className="btn line" style={{ padding: "8px 14px" }} onClick={() => supabase.auth.signOut()}>Quitter</button>
      </header>

      <div className="adm-sum">
        <div><b>{count("Demande reçue")}</b>Nouvelles</div>
        <div><b>{count("En vérification")}</b>En vérification</div>
        <div><b>{count("Approuvée")}</b>Approuvées</div>
        <div><b>{count("Payée")}</b>Payées</div>
      </div>

      {msg && <p className="err" role="alert">{msg}</p>}

      <div className="cats" role="tablist">
        <button className="chip" aria-pressed={tab === "loc"} onClick={() => setTab("loc")}>Locations ({rentals.length})</button>
        <button className="chip" aria-pressed={tab === "spe"} onClick={() => setTab("spe")}>Demandes spéciales ({specials.length})</button>
        <button className="chip" aria-pressed={tab === "veh"} onClick={() => setTab("veh")}>Véhicules ({vehicles.length})</button>
        <button className="chip" aria-pressed={tab === "par"} onClick={() => setTab("par")}>Partenaires ({apps.length})</button>
      </div>

      {(tab === "loc" || tab === "spe") && (
        <label className="adm-filter">Filtrer par statut
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous</option>{STATUTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      )}

      {tab === "loc" && (
        <div className="adm-list">
          {rl.length === 0 && <p>Aucune demande.</p>}
          {rl.map((r) => (
            <article className="adm-card" key={r.id}>
              <div className="adm-head"><b>{vName(r.vehicle_id)}</b><small>{fmtTime(r.created_at)}</small></div>
              <p><b>{r.full_name}</b> · <a href={wa(r.phone)} target="_blank" rel="noreferrer">{r.phone}</a> · <a href={`mailto:${r.email}`}>{r.email}</a></p>
              <p>Du {fmtDate(r.start_date)} au {fmtDate(r.end_date)}</p>
              <p>Remise : {r.pickup_place}{r.return_place && r.return_place !== r.pickup_place ? ` · Retour : ${r.return_place}` : ""}</p>
              {r.notes && <p className="adm-note">{r.notes}</p>}
              <select value={r.status} onChange={(e) => setStatus("rental_requests", r.id, e.target.value)} aria-label="Statut">
                {[...new Set([r.status, ...STATUTS])].map((s) => <option key={s}>{s}</option>)}
              </select>
            </article>
          ))}
        </div>
      )}

      {tab === "spe" && (
        <div className="adm-list">
          {sl.length === 0 && <p>Aucune demande.</p>}
          {sl.map((r) => (
            <article className="adm-card" key={r.id}>
              <div className="adm-head"><b>{[r.vehicle_type, r.make, r.model].filter(Boolean).join(" ") || "Demande spéciale"}</b><small>{fmtTime(r.created_at)}</small></div>
              <p><b>{r.full_name}</b> · <a href={wa(r.phone)} target="_blank" rel="noreferrer">{r.phone}</a> · <a href={`mailto:${r.email}`}>{r.email}</a></p>
              <p>Du {fmtDate(r.start_date)} au {fmtDate(r.end_date)}{r.city ? ` · ${r.city}` : ""}</p>
              <p>{[r.transmission, r.seats ? `${r.seats} places` : null, r.daily_budget ? `budget ${r.daily_budget.toLocaleString("fr-FR")} FCFA/jour` : null].filter(Boolean).join(" · ")}</p>
              {(r.pickup_place || r.return_place) && <p>Remise : {r.pickup_place ?? "—"} · Retour : {r.return_place ?? "—"}</p>}
              {r.preferences && <p className="adm-note">{r.preferences}</p>}
              {r.notes && <p className="adm-note">{r.notes}</p>}
              <select value={r.status} onChange={(e) => setStatus("special_requests", r.id, e.target.value)} aria-label="Statut">
                {[...new Set([r.status, ...STATUTS])].map((s) => <option key={s}>{s}</option>)}
              </select>
            </article>
          ))}
        </div>
      )}

      {tab === "par" && (
        <div className="adm-list">
          {apps.length === 0 && <p>Aucun dossier partenaire.</p>}
          {apps.map((a) => {
            const adm = padm[a.id] ?? { notes: null, commission_pct: null, final_daily_price: null };
            return (
              <article className="adm-card" key={a.id}>
                <div className="adm-head"><b>{a.vehicle_make} {a.vehicle_model} {a.vehicle_year ?? ""}</b><small>{fmtTime(a.created_at)} · n° {a.id.slice(0, 8).toUpperCase()}</small></div>
                <p><b>{a.full_name}</b> · <a href={wa(a.whatsapp || a.phone)} target="_blank" rel="noreferrer">{a.phone}</a> · <a href={`mailto:${a.email}`}>{a.email}</a>{a.city ? ` · ${a.city}` : ""}</p>
                <select value={a.status} onChange={(e) => setAppStatus(a, e.target.value)} aria-label="Statut du dossier">
                  {[...new Set([a.status, ...PSTAT])].map((x) => <option key={x}>{x}</option>)}
                </select>
                <button className="linkbtn" onClick={() => setOpen(open === a.id ? null : a.id)}>{open === a.id ? "Masquer le détail" : "Voir le détail"}</button>
                {open === a.id && (
                  <div className="adm-detail">
                    <p>{[a.category, a.transmission, a.fuel, a.engine, a.seats ? `${a.seats} places` : null, a.has_ac === null ? null : a.has_ac ? "climatisé" : "sans clim", a.mileage_km ? `${a.mileage_km.toLocaleString("fr-FR")} km` : null].filter(Boolean).join(" · ")}</p>
                    {a.plate && <p>Immatriculation : {a.plate}</p>}
                    {a.equipment && a.equipment.length > 0 && <p>Équipements : {a.equipment.join(", ")}</p>}
                    {a.description && <p className="adm-note">{a.description}</p>}
                    <p>Prix minimum du propriétaire (interne) : <b>{a.min_daily_price ? a.min_daily_price.toLocaleString("fr-FR") + " FCFA/jour" : "—"}</b>{a.min_rental_days ? ` · durée min. ${a.min_rental_days} j` : ""}</p>
                    {a.availability_note && <p>Disponibilité : {a.availability_note}</p>}
                    <p>Livraison : {a.delivery_possible ? `oui${a.delivery_zones ? ` (${a.delivery_zones})` : ""}` : "non"}</p>
                    {a.special_conditions && <p className="adm-note">{a.special_conditions}</p>}
                    <p><b>Documents</b></p>
                    <div className="cats">{a.documents.map((d) => <button key={d.path} className="chip" onClick={() => openDoc(d.path)}>{DOCLABEL[d.kind] ?? d.kind} · {d.name}</button>)}</div>
                    <form className="fgrid" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); saveAdm(a, { notes: String(f.get("notes") || "") || null, commission_pct: f.get("commission") ? Number(f.get("commission")) : null, final_daily_price: f.get("price") ? Number(f.get("price")) : null }); }}>
                      <label>Commission YUM (%)<input name="commission" type="number" step="0.1" defaultValue={adm.commission_pct ?? ""} /></label>
                      <label>Prix journalier final (FCFA)<input name="price" type="number" defaultValue={adm.final_daily_price ?? ""} /></label>
                      <label className="full">Notes internes<textarea name="notes" rows={2} defaultValue={adm.notes ?? ""} /></label>
                      <button className="btn line" type="submit">Enregistrer</button>
                    </form>
                    {a.vehicle_id ? <p><small>Véhicule déjà créé depuis ce dossier.</small></p> : a.status === "Approuvée" ? <button className="btn" onClick={() => createVehicle(a)}>Créer le véhicule (masqué)</button> : <small>Approuvez le dossier pour créer le véhicule.</small>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === "veh" && (
        <div className="adm-list">
          {vehicles.map((v) => (
            <article className="adm-card adm-veh" key={v.id}>
              <div><b>{v.name}</b><br /><small>{v.owner_type} · {v.daily_price.toLocaleString("fr-FR")} FCFA/jour</small></div>
              <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
                <select aria-label={`Vérification de ${v.name}`} value={v.verification_status} onChange={(e) => setVerif(v, e.target.value)}>
                  {VERIF.map((x) => <option key={x}>{x}</option>)}
                </select>
                <button className={v.published ? "btn line" : "btn"} style={{ padding: "8px 14px" }} onClick={() => togglePublish(v)}>{v.published ? "Publié · masquer" : "Masqué · publier"}</button>
                {v.verification_status !== "Approuvé" && <small>Invisible au public tant que non approuvé.</small>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
