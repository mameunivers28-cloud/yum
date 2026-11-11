"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

const STATUTS = ["Demande reçue", "En vérification", "Approuvée", "Refusée", "Payée", "Terminée"];

type Rental = { id: string; vehicle_id: string | null; full_name: string; phone: string; email: string; start_date: string; end_date: string; pickup_place: string; return_place: string | null; notes: string | null; status: string; created_at: string };
type Special = { id: string; full_name: string; phone: string; email: string; city: string | null; start_date: string; end_date: string; vehicle_type: string | null; make: string | null; model: string | null; daily_budget: number | null; transmission: string | null; seats: number | null; preferences: string | null; pickup_place: string | null; return_place: string | null; notes: string | null; status: string; created_at: string };
type Vehicle = { id: string; name: string; daily_price: number; owner_type: string; published: boolean };

const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d: string) => new Date(d).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const wa = (p: string) => "https://wa.me/" + p.replace(/\D/g, "");

export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<"loc" | "spe" | "veh">("loc");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
      supabase.from("vehicles").select("id,name,daily_price,owner_type,published").order("name"),
    ]);
    if (r.error || s.error || v.error) { setMsg("Accès refusé : ce compte n’est pas administrateur."); return; }
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

  async function togglePublish(v: Vehicle) {
    const { error } = await supabase.from("vehicles").update({ published: !v.published }).eq("id", v.id);
    if (error) { setMsg("Changement impossible."); return; }
    setVehicles((l) => l.map((x) => (x.id === v.id ? { ...x, published: !v.published } : x)));
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
      </div>

      {tab !== "veh" && (
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

      {tab === "veh" && (
        <div className="adm-list">
          {vehicles.map((v) => (
            <article className="adm-card adm-veh" key={v.id}>
              <div><b>{v.name}</b><br /><small>{v.owner_type} · {v.daily_price.toLocaleString("fr-FR")} FCFA/jour</small></div>
              <button className={v.published ? "btn line" : "btn"} style={{ padding: "8px 14px" }} onClick={() => togglePublish(v)}>{v.published ? "Publié · masquer" : "Masqué · publier"}</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
