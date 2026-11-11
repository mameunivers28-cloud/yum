"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

const RSTAT = ["Nouvelle demande", "En cours de traitement", "Vérification de disponibilité", "Disponibilité confirmée", "Dossier client à compléter", "Proposition commerciale envoyée", "En attente de paiement", "Paiement à vérifier", "Réservation confirmée", "Location en cours", "Location terminée", "Annulée", "Refusée"];
const SSTAT = ["Nouvelle demande", "Recherche en cours", "Véhicule identifié", "Proposition envoyée", "En attente de réponse", "Convertie en réservation", "Clôturée", "Impossible à satisfaire"];
type Hist = { id: string; created_at: string; admin_email: string | null; entity: string; entity_id: string | null; detail: string };
const ENT: Record<string, string> = { rental_requests: "Location", special_requests: "Demande spéciale", partner_applications: "Partenaire", vehicles: "Véhicule", rental_payments: "Paiement" };

type Rental = { id: string; vehicle_id: string | null; full_name: string; phone: string; email: string; start_date: string; end_date: string; pickup_place: string; return_place: string | null; notes: string | null; status: string; created_at: string };
type Special = { id: string; full_name: string; phone: string; email: string; city: string | null; start_date: string; end_date: string; vehicle_type: string | null; make: string | null; model: string | null; daily_budget: number | null; transmission: string | null; seats: number | null; preferences: string | null; pickup_place: string | null; return_place: string | null; notes: string | null; status: string; created_at: string };
const VERIF = ["En attente de vérification", "En cours d’examen", "Informations complémentaires demandées", "Approuvé", "Refusé", "Suspendu"];
type Vehicle = { id: string; name: string; daily_price: number; owner_type: string; published: boolean; verification_status: string };

const PSTAT = ["Soumise", "En attente de vérification", "En cours d’examen", "Documents complémentaires demandés", "Approuvée", "Refusée", "Suspendue"];
type PApp = { id: string; status: string; full_name: string; phone: string; whatsapp: string | null; email: string; city: string | null; address_zone: string | null; vehicle_make: string; vehicle_model: string; vehicle_year: number | null; plate: string | null; category: string | null; transmission: string | null; fuel: string | null; engine: string | null; seats: number | null; has_ac: boolean | null; mileage_km: number | null; description: string | null; equipment: string[] | null; min_daily_price: number | null; availability_note: string | null; min_rental_days: number | null; special_conditions: string | null; delivery_possible: boolean | null; delivery_zones: string | null; documents: { kind: string; path: string; name: string }[]; vehicle_id: string | null; created_at: string };
type PAdm = { notes: string | null; commission_pct: number | null; final_daily_price: number | null };
const DOCLABEL: Record<string, string> = { photo_ext: "Photo extérieure", photo_int: "Photo intérieure", photo_dash: "Tableau de bord", doc_vehicle: "Document véhicule", id: "Identité", ownership: "Propriété / autorisation" };

type Block = { rental_id?: string | null; id: string; vehicle_id: string; start_date: string; end_date: string; kind: string };
const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d: string) => new Date(d).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const wa = (p: string) => "https://wa.me/" + p.replace(/\D/g, "");

const PAYSTAT = ["Paiement attendu", "Paiement déclaré", "Paiement à vérifier", "Paiement validé", "Paiement refusé", "Remboursement à traiter", "Remboursement effectué"];
const KINDS = ["Loyer", "Dépôt de garantie", "Frais de livraison"];
const DOCST = ["Non vérifié", "Documents reçus", "Vérifié", "Refusé"];
type Pay = { id: string; rental_id: string; kind: string; amount: number; status: string; note: string | null };
type RAdm = { rental_id: string; final_total: number | null; delivery_fee: number | null; yum_commission: number | null; owner_share: number | null; client_docs_status: string; notes: string | null };
const dbMsg = (m: string) =>
  m.includes("PAYMENT_NOT_VALIDATED") ? "Confirmation impossible : aucun paiement de loyer n’est validé pour cette demande."
  : m.includes("DATES_CONFLICT") ? "Confirmation impossible : ces dates chevauchent une réservation confirmée ou une période bloquée."
  : m.includes("NO_VEHICLE") ? "Confirmation impossible : cette demande n’est liée à aucun véhicule."
  : m.includes("BAD_DATES") ? "Confirmation impossible : les dates sont incohérentes."
  : "";
const NOPE = "Modification non enregistrée : ce compte n’a pas les droits d’administration (ou la ligne n’existe plus). Connectez-vous avec le compte administrateur.";

function FinPanel({ r, open, toggle, adm, pays, onSave, onAdd, onStatus }: { r: { id: string }; open: boolean; toggle: () => void; adm?: RAdm; pays: Pay[]; onSave: (id: string, f: FormData) => void; onAdd: (id: string, f: FormData) => void; onStatus: (p: Pay, s: string) => void }) {
  return (
    <>
      <button className="linkbtn" onClick={toggle}>{open ? "Masquer paiements et dossier" : `Paiements et dossier client (${pays.length})`}</button>
      {open && (
        <div className="adm-detail">
          <form className="fgrid" onSubmit={(e) => { e.preventDefault(); onSave(r.id, new FormData(e.currentTarget)); }}>
            <label>Total final (FCFA)<input name="final_total" type="number" defaultValue={adm?.final_total ?? ""} /></label>
            <label>Frais de livraison<input name="delivery_fee" type="number" defaultValue={adm?.delivery_fee ?? ""} /></label>
            <label>Commission YUM<input name="yum_commission" type="number" defaultValue={adm?.yum_commission ?? ""} /></label>
            <label>Part du propriétaire<input name="owner_share" type="number" defaultValue={adm?.owner_share ?? ""} /></label>
            <label>Documents du client<select name="docs" defaultValue={adm?.client_docs_status ?? "Non vérifié"}>{DOCST.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="full">Notes internes<textarea name="notes" rows={2} defaultValue={adm?.notes ?? ""} /></label>
            <button className="btn line" type="submit">Enregistrer</button>
          </form>
          <p><b>Paiements</b></p>
          {pays.length === 0 && <p><small>Aucun paiement enregistré.</small></p>}
          {pays.map((p) => (
            <div key={p.id} className="adm-head"><span>{p.kind} · {p.amount.toLocaleString("fr-FR")} FCFA{p.note ? ` · ${p.note}` : ""}</span>
              <select value={p.status} onChange={(e) => onStatus(p, e.target.value)} aria-label="Statut du paiement">{PAYSTAT.map((x) => <option key={x}>{x}</option>)}</select></div>
          ))}
          <form className="fgrid3" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; onAdd(r.id, new FormData(f)); f.reset(); }}>
            <label>Type<select name="kind">{KINDS.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Montant (FCFA)<input name="amount" type="number" required /></label>
            <label>Note<input name="note" /></label>
            <button className="btn line" type="submit">Ajouter un paiement attendu</button>
          </form>
        </div>
      )}
    </>
  );
}

export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<"dash" | "loc" | "run" | "spe" | "cli" | "veh" | "par" | "his">("dash");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [role, setRole] = useState<string>("");
  const [cq, setCq] = useState("");
  const [pays, setPays] = useState<Pay[]>([]);
  const [radm, setRadm] = useState<Record<string, RAdm>>({});
  const [openR, setOpenR] = useState<string | null>(null);
  const [hist, setHist] = useState<Hist[]>([]);
  const [today, setToday] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [apps, setApps] = useState<PApp[]>([]);
  const [sure, setSure] = useState<string | null>(null);
  const [padm, setPadm] = useState<Record<string, PAdm>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setEmail(data.session?.user.email ?? null); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshHist = useCallback(async () => {
    const hs = await supabase.from("admin_history").select("*").order("created_at", { ascending: false }).limit(100);
    if (!hs.error) setHist((hs.data ?? []) as Hist[]);
  }, []);

  const load = useCallback(async () => {
    const rl0 = await supabase.rpc("admin_role");
    const myRole = typeof rl0.data === "string" ? rl0.data : "";
    setRole(myRole);
    if (myRole === "Administrateur principal" || myRole === "Gestionnaire") {
      const [pp, ra] = await Promise.all([supabase.from("rental_payments").select("*").order("created_at"), supabase.from("rental_admin").select("*")]);
      if (!pp.error) setPays((pp.data ?? []) as Pay[]);
      if (!ra.error) setRadm(Object.fromEntries((ra.data ?? []).map((x: RAdm) => [x.rental_id, x])));
    }
    setMsg("");
    const [r, s, v] = await Promise.all([
      supabase.from("rental_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("special_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("id,name,daily_price,owner_type,published,verification_status").order("name"),
    ]);
    if (r.error || s.error || v.error) { setMsg("Accès refusé : ce compte n’est pas administrateur."); return; }
    const adm = await supabase.rpc("is_admin");
    if (adm.data !== true) { setMsg("Ce compte n’est pas administrateur : vous ne pouvez rien modifier. Déconnectez-vous et utilisez le compte administrateur."); }
    const hs = await supabase.from("admin_history").select("*").order("created_at", { ascending: false }).limit(100);
    if (!hs.error) setHist((hs.data ?? []) as Hist[]);
    const bl = await supabase.from("vehicle_availability").select("*").order("start_date");
    if (!bl.error) setBlocks((bl.data ?? []) as Block[]);
    const [pa, pm] = await Promise.all([
      supabase.from("partner_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_application_admin").select("*"),
    ]);
    if (!pa.error) setApps((pa.data ?? []) as PApp[]);
    if (!pm.error) setPadm(Object.fromEntries((pm.data ?? []).map((x: PAdm & { application_id: string }) => [x.application_id, x])));
    setRentals((r.data ?? []) as Rental[]); setSpecials((s.data ?? []) as Special[]); setVehicles((v.data ?? []) as Vehicle[]);
  }, []);

  useEffect(() => { if (email) load(); }, [email, load]);
  useEffect(() => { const t = new Date(); setToday(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`); }, []);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) setMsg("Courriel ou mot de passe incorrect.");
  }

  async function setStatus(table: "rental_requests" | "special_requests", id: string, status: string) {
    const { data, error } = await supabase.from(table).update({ status }).eq("id", id).select("id");
    if (error) { setMsg(dbMsg(error.message) || "Changement impossible."); return; }
    if (!data || data.length === 0) { setMsg(NOPE); return; }
    setMsg("");
    refreshHist();
    supabase.from("vehicle_availability").select("*").order("start_date").then((b) => { if (!b.error) setBlocks((b.data ?? []) as Block[]); });
    if (table === "rental_requests") setRentals((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    else setSpecials((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  async function setVerif(v: Vehicle, verification_status: string) {
    const { data, error } = await supabase.from("vehicles").update({ verification_status }).eq("id", v.id).select("id");
    if (error) { setMsg("Changement impossible."); return; }
    if (!data || data.length === 0) { setMsg(NOPE); return; }
    setMsg("");
    refreshHist();
    setVehicles((l) => l.map((x) => (x.id === v.id ? { ...x, verification_status } : x)));
  }

  async function togglePublish(v: Vehicle) {
    const { data, error } = await supabase.from("vehicles").update({ published: !v.published }).eq("id", v.id).select("id");
    if (error) { setMsg("Changement impossible."); return; }
    if (!data || data.length === 0) { setMsg(NOPE); return; }
    setMsg("");
    refreshHist();
    setVehicles((l) => l.map((x) => (x.id === v.id ? { ...x, published: !v.published } : x)));
  }

  async function setAppStatus(a: PApp, status: string) {
    const { data, error } = await supabase.from("partner_applications").update({ status }).eq("id", a.id).select("id");
    if (error) { setMsg("Changement impossible."); return; }
    if (!data || data.length === 0) { setMsg(NOPE); return; }
    refreshHist();
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

  const isMgr = role === "Administrateur principal" || role === "Gestionnaire";
  const isMain = role === "Administrateur principal";

  async function delApp(a: PApp) {
    const { data, error } = await supabase.from("partner_applications").delete().eq("id", a.id).select("id");
    setSure(null);
    if (error || !data || data.length === 0) { setMsg("Suppression refusée : réservée à l’Administrateur principal, et impossible si le dossier est déjà lié à un véhicule."); return; }
    setMsg("");
    const paths = (a.documents ?? []).map((d) => d.path);
    if (paths.length) await supabase.storage.from("partner-docs").remove(paths);
    setApps((l) => l.filter((x) => x.id !== a.id));
    refreshHist();
  }

  async function delSpecial(id: string) {
    const { data, error } = await supabase.from("special_requests").delete().eq("id", id).select("id");
    setSure(null);
    if (error || !data || data.length === 0) { setMsg("Suppression refusée : réservée à l’Administrateur principal."); return; }
    setMsg("");
    setSpecials((l) => l.filter((x) => x.id !== id));
    refreshHist();
  }

  async function saveRadm(rid: string, f: FormData) {
    const n = (k: string) => (f.get(k) ? Number(f.get(k)) : null);
    const row = { rental_id: rid, final_total: n("final_total"), delivery_fee: n("delivery_fee"), yum_commission: n("yum_commission"), owner_share: n("owner_share"), client_docs_status: String(f.get("docs") || "Non vérifié"), notes: String(f.get("notes") || "") || null, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from("rental_admin").upsert(row).select("*");
    if (error || !data || data.length === 0) { setMsg(NOPE); return; }
    setRadm((m) => ({ ...m, [rid]: data[0] as RAdm })); setMsg("");
  }

  async function addPay(rid: string, f: FormData) {
    const amount = Number(f.get("amount"));
    if (!amount || amount < 0) { setMsg("Montant invalide."); return; }
    const { data, error } = await supabase.from("rental_payments").insert({ rental_id: rid, kind: String(f.get("kind")), amount, note: String(f.get("note") || "") || null }).select("*");
    if (error || !data || data.length === 0) { setMsg(NOPE); return; }
    setPays((l) => [...l, ...(data as Pay[])]); setMsg("");
  }

  async function setPayStatus(p: Pay, status: string) {
    const { data, error } = await supabase.from("rental_payments").update({ status }).eq("id", p.id).select("id");
    if (error || !data || data.length === 0) { setMsg(NOPE); return; }
    setPays((l) => l.map((x) => (x.id === p.id ? { ...x, status } : x))); refreshHist(); setMsg("");
  }

  async function addBlock(v: Vehicle, f: FormData) {
    const start = String(f.get("start") || ""), end = String(f.get("end") || ""), kind = String(f.get("kind") || "Indisponible");
    if (!start || !end || end < start) { setMsg("Dates invalides : la fin doit suivre le début."); return; }
    const { data, error } = await supabase.from("vehicle_availability").insert({ vehicle_id: v.id, start_date: start, end_date: end, kind }).select("*");
    if (error) { setMsg(error.message.includes("va_no_overlap") ? "Cette période chevauche une période déjà bloquée pour ce véhicule." : "Ajout impossible."); return; }
    if (!data || data.length === 0) { setMsg(NOPE); return; }
    setMsg(""); setBlocks((l) => [...l, ...(data as Block[])].sort((a, b) => a.start_date.localeCompare(b.start_date)));
  }

  async function delBlock(b: Block) {
    const { data, error } = await supabase.from("vehicle_availability").delete().eq("id", b.id).select("id");
    if (error || !data || data.length === 0) { setMsg(NOPE); return; }
    setBlocks((l) => l.filter((x) => x.id !== b.id));
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
  const nr = (...st: string[]) => rentals.filter((r) => st.includes(r.status)).length;
  const rl = rentals.filter((r) => !filter || r.status === filter);
  const sl = specials.filter((r) => !filter || r.status === filter);
  const addDays = (d: string, n: number) => { const t = new Date(d + "T00:00:00"); t.setDate(t.getDate() + n); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`; };
  const soon = today ? addDays(today, 3) : "";
  const departures = today ? rentals.filter((r) => r.status === "Réservation confirmée" && r.start_date >= today && r.start_date <= soon) : [];
  const returns = today ? rentals.filter((r) => r.status === "Location en cours" && r.end_date >= today && r.end_date <= soon) : [];
  const late = today ? rentals.filter((r) => r.status === "Location en cours" && r.end_date < today) : [];
  // Clients : regroupés par courriel à partir des demandes réelles (aucune donnée supplémentaire).
  const clients = (() => {
    const m = new Map<string, { key: string; name: string; phone: string; email: string; rentals: number; specials: number; last: string }>();
    const add = (r: { full_name: string; phone: string; email: string; created_at: string }, k: "rentals" | "specials") => {
      const key = r.email.trim().toLowerCase();
      const c = m.get(key) ?? { key, name: r.full_name, phone: r.phone, email: r.email, rentals: 0, specials: 0, last: r.created_at };
      c[k] += 1;
      if (r.created_at > c.last) { c.last = r.created_at; c.name = r.full_name; c.phone = r.phone; }
      m.set(key, c);
    };
    rentals.forEach((r) => add(r, "rentals"));
    specials.forEach((r) => add(r, "specials"));
    return [...m.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
  })();
  const cl = clients.filter((c) => !cq.trim() || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(cq.trim().toLowerCase()));
  const running = rentals.filter((r) => r.status === "Réservation confirmée" || r.status === "Location en cours");

  return (
    <div className="adm">
      <header className="adm-top">
        <b className="logo" style={{ fontSize: 24 }}>YUM · Admin</b>
        <span className="adm-who">{email}{role ? ` · ${role}` : ""}</span>
        <button className="btn line" style={{ padding: "8px 14px" }} onClick={load}>Actualiser</button>
        <button className="btn line" style={{ padding: "8px 14px" }} onClick={() => supabase.auth.signOut()}>Quitter</button>
      </header>


      {msg && <p className="err" role="alert">{msg}</p>}

      <div className="cats" role="tablist">
        <button className="chip" aria-pressed={tab === "dash"} onClick={() => setTab("dash")}>Tableau de bord</button>
        <button className="chip" aria-pressed={tab === "loc"} onClick={() => setTab("loc")}>Locations ({rentals.length})</button>
        <button className="chip" aria-pressed={tab === "run"} onClick={() => setTab("run")}>Locations suivies ({running.length})</button>
        <button className="chip" aria-pressed={tab === "spe"} onClick={() => setTab("spe")}>Demandes spéciales ({specials.length})</button>
        <button className="chip" aria-pressed={tab === "cli"} onClick={() => setTab("cli")}>Clients ({clients.length})</button>
        <button className="chip" aria-pressed={tab === "veh"} onClick={() => setTab("veh")}>Véhicules ({vehicles.length})</button>
        {isMgr && <button className="chip" aria-pressed={tab === "par"} onClick={() => setTab("par")}>Partenaires ({apps.length})</button>}
        <button className="chip" aria-pressed={tab === "his"} onClick={() => setTab("his")}>Historique</button>
      </div>

      {(tab === "loc" || tab === "spe") && (
        <label className="adm-filter">Filtrer par statut
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous</option>{(tab === "loc" ? RSTAT : SSTAT).map((s) => <option key={s}>{s}</option>)}
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
                {[...new Set([r.status, ...RSTAT])].map((s) => <option key={s}>{s}</option>)}
              </select>
              {isMgr && <FinPanel r={r} open={openR === r.id} toggle={() => setOpenR(openR === r.id ? null : r.id)} adm={radm[r.id]} pays={pays.filter((p) => p.rental_id === r.id)} onSave={saveRadm} onAdd={addPay} onStatus={setPayStatus} />}
            </article>
          ))}
        </div>
      )}

      {tab === "dash" && (
        <>
          <div className="adm-sum">
            <div><b>{nr("Nouvelle demande")}</b>Nouvelles demandes</div>
            <div><b>{nr("En cours de traitement", "Vérification de disponibilité", "Disponibilité confirmée", "Dossier client à compléter", "Proposition commerciale envoyée")}</b>En traitement</div>
            <div><b>{nr("En attente de paiement", "Paiement à vérifier")}</b>Paiement en cours</div>
            {isMgr && <div><b>{pays.filter((p) => p.status === "Paiement à vérifier" || p.status === "Paiement déclaré").length}</b>Paiements à vérifier</div>}
            {isMgr && <div><b>{pays.filter((p) => p.status === "Remboursement à traiter").length}</b>Remboursements à traiter</div>}
            <div><b>{nr("Réservation confirmée")}</b>Confirmées</div>
            <div><b>{nr("Location en cours")}</b>En cours</div>
            <div><b>{specials.filter((x) => x.status === "Nouvelle demande").length}</b>Demandes spéciales</div>
            <div><b>{apps.filter((a) => ["Soumise", "En attente de vérification", "En cours d’examen", "Documents complémentaires demandés"].includes(a.status)).length}</b>Partenaires à examiner</div>
            <div><b>{vehicles.filter((v) => v.published).length} / {vehicles.length}</b>Véhicules publiés</div>
          </div>
          <h2 style={{ fontSize: 20 }}>Alertes</h2>
          <div className="adm-list">
            {late.length + departures.length + returns.length === 0 && <p>Aucune alerte.</p>}
            {late.map((r) => <p key={r.id} className="err">Retour en retard : {vName(r.vehicle_id)} — {r.full_name} (prévu le {fmtDate(r.end_date)})</p>)}
            {departures.map((r) => <p key={r.id}><b>Départ prochain</b> : {vName(r.vehicle_id)} — {r.full_name}, le {fmtDate(r.start_date)}</p>)}
            {returns.map((r) => <p key={r.id}><b>Retour prochain</b> : {vName(r.vehicle_id)} — {r.full_name}, le {fmtDate(r.end_date)}</p>)}
          </div>
        </>
      )}

      {tab === "run" && (
        <div className="adm-list">
          {running.length === 0 && <p>Aucune location confirmée ou en cours.</p>}
          {running.map((r) => (
            <article className="adm-card" key={r.id}>
              <div className="adm-head"><b>{vName(r.vehicle_id)}</b><small>{r.status}</small></div>
              <p><b>{r.full_name}</b> · <a href={wa(r.phone)} target="_blank" rel="noreferrer">{r.phone}</a></p>
              <p>Départ : {fmtDate(r.start_date)} · Retour : {fmtDate(r.end_date)}</p>
              <p>Remise : {r.pickup_place}{r.return_place && r.return_place !== r.pickup_place ? ` · Retour : ${r.return_place}` : ""}</p>
              <select value={r.status} onChange={(e) => setStatus("rental_requests", r.id, e.target.value)} aria-label="Statut">
                {[...new Set([r.status, ...RSTAT])].map((s) => <option key={s}>{s}</option>)}
              </select>
            </article>
          ))}
        </div>
      )}

      {tab === "cli" && (
        <>
          <label className="adm-filter">Rechercher un client
            <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder="Nom, courriel ou téléphone" />
          </label>
          <div className="adm-list">
            {cl.length === 0 && <p>Aucun client.</p>}
            {cl.map((c) => (
              <article className="adm-card" key={c.key}>
                <div className="adm-head"><b>{c.name}</b><small>Dernière demande : {fmtTime(c.last)}</small></div>
                <p><a href={wa(c.phone)} target="_blank" rel="noreferrer">{c.phone}</a> · <a href={`mailto:${c.email}`}>{c.email}</a></p>
                <p>{c.rentals} demande{c.rentals > 1 ? "s" : ""} de location · {c.specials} demande{c.specials > 1 ? "s" : ""} personnalisée{c.specials > 1 ? "s" : ""}</p>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "his" && (
        <div className="adm-list">
          {hist.length === 0 && <p>Aucune action enregistrée pour le moment.</p>}
          {hist.map((h) => <p key={h.id}><small>{fmtTime(h.created_at)} · {h.admin_email ?? "—"}</small><br /><b>{ENT[h.entity] ?? h.entity}</b> n° {h.entity_id ? h.entity_id.slice(0, 8).toUpperCase() : "—"} — {h.detail}</p>)}
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
                {[...new Set([r.status, ...SSTAT])].map((s) => <option key={s}>{s}</option>)}
              </select>
              {isMain && (sure === r.id
                ? <p className="adm-sure">Supprimer définitivement cette demande ? <button className="linkbtn danger" onClick={() => delSpecial(r.id)}>Oui, supprimer</button> <button className="linkbtn" onClick={() => setSure(null)}>Annuler</button></p>
                : <button className="linkbtn danger" onClick={() => setSure(r.id)}>Supprimer</button>)}
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
                {isMain && !a.vehicle_id && (sure === a.id
                  ? <p className="adm-sure">Supprimer définitivement ce dossier et ses documents ? <button className="linkbtn danger" onClick={() => delApp(a)}>Oui, supprimer</button> <button className="linkbtn" onClick={() => setSure(null)}>Annuler</button></p>
                  : <button className="linkbtn danger" onClick={() => setSure(a.id)}>Supprimer</button>)}
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
                <select disabled={!isMgr} aria-label={`Vérification de ${v.name}`} value={v.verification_status} onChange={(e) => setVerif(v, e.target.value)}>
                  {VERIF.map((x) => <option key={x}>{x}</option>)}
                </select>
                <button disabled={!isMgr} className={v.published ? "btn line" : "btn"} style={{ padding: "8px 14px" }} onClick={() => togglePublish(v)}>{v.published ? "Publié · masquer" : "Masqué · publier"}</button>
                {v.verification_status !== "Approuvé" && <small>Invisible au public tant que non approuvé.</small>}
              </div>
              <div className="adm-detail" style={{ gridColumn: "1 / -1" }}>
                <p><b>Disponibilités</b> <small>(une demande ne bloque rien ; seule une réservation confirmée ou un blocage protège les dates)</small></p>
                {blocks.filter((b) => b.vehicle_id === v.id).map((b) => (
                  <p key={b.id}>{b.kind} · du {fmtDate(b.start_date)} au {fmtDate(b.end_date)} {b.rental_id ? <small>(liée à une réservation confirmée)</small> : <button className="linkbtn" onClick={() => delBlock(b)}>Supprimer</button>}</p>
                ))}
                <form className="fgrid3" onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; addBlock(v, new FormData(form)); form.reset(); }}>
                  <label>Du<input name="start" type="date" required /></label>
                  <label>Au<input name="end" type="date" required /></label>
                  <label>Type<select name="kind"><option>Indisponible</option><option>Réservation confirmée</option><option>Maintenance</option></select></label>
                  <button className="btn line" type="submit">Bloquer ces dates</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
