"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { waLink } from "../../lib/config";
import { NEXT_RENTAL, NEXT_SPECIAL, NEXT_PARTNER, FRISE, friseIndex } from "../../lib/statuts";

type Rental = { id: string; vehicle_id: string | null; start_date: string; end_date: string; pickup_place: string | null; status: string | null; created_at: string };
type Special = { id: string; start_date: string; end_date: string; vehicle_type: string | null; make: string | null; model: string | null; status: string | null; created_at: string };

type App = { id: string; vehicle_make: string; vehicle_model: string; status: string; created_at: string };
const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

function Suite({ text, wa }: { text: string; wa: string }) {
  return (
    <div className="next-step">
      <p><b>Et ensuite ?</b> {text}</p>
      <a className="linkbtn" href={wa} target="_blank" rel="noreferrer">Écrire à YUM à propos de ce dossier →</a>
    </div>
  );
}

function Frise({ status }: { status: string }) {
  const { step, issue } = friseIndex(status);
  return (
    <ol className="frise" aria-label="Progression du dossier">
      {FRISE.map((l, i) => {
        const cls = i < step ? "done" : i === step ? (issue === "ko" ? "ko" : issue === "wait" ? "wait" : issue === "ok" ? "done" : "on") : "";
        return <li key={l} className={cls}><span>{i + 1}</span><em>{i === 2 && issue === "ok" ? "Approuvé" : i === 2 && issue === "ko" ? status : l}</em></li>;
      })}
    </ol>
  );
}

export default function Espace() {
  const [state, setState] = useState<"load" | "out" | "in">("load");
  const [email, setEmail] = useState("");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (!u) { setState("out"); return; }
      setEmail(u.email ?? ""); setState("in");
      const [r, s] = await Promise.all([
        supabase.from("rental_requests").select("id,vehicle_id,start_date,end_date,pickup_place,status,created_at").eq("user_id", u.id).order("created_at", { ascending: false }),
        supabase.from("special_requests").select("id,start_date,end_date,vehicle_type,make,model,status,created_at").eq("user_id", u.id).order("created_at", { ascending: false }),
      ]);
      const { data: pa } = await supabase.from("partner_applications").select("id,vehicle_make,vehicle_model,status,created_at").eq("user_id", u.id).order("created_at", { ascending: false });
      setApps((pa ?? []) as App[]);
      const rl = (r.data ?? []) as Rental[];
      setRentals(rl); setSpecials((s.data ?? []) as Special[]);
      const ids = Array.from(new Set(rl.map((x) => x.vehicle_id).filter(Boolean))) as string[];
      if (ids.length) {
        const { data: v } = await supabase.from("vehicles").select("id,name").in("id", ids);
        setNames(Object.fromEntries((v ?? []).map((x: { id: string; name: string }) => [x.id, x.name])));
      }
    });
  }, []);

  async function out() { await supabase.auth.signOut(); setState("out"); }

  if (state === "load") return <p>Chargement…</p>;
  if (state === "out") return (
    <div className="empty"><h3>Vous n’êtes pas connecté</h3><p>Connectez-vous pour voir vos demandes.</p><Link className="btn navy" href="/connexion">Se connecter</Link></div>
  );

  return (
    <>
      <div className="resbar"><span>Connecté : <b>{email}</b></span><button className="linkbtn" onClick={out}>Se déconnecter</button></div>
      <h2 style={{ fontSize: 24 }}>Demandes de location</h2>
      <div className="adm-list" style={{ marginBottom: 32 }}>
        {rentals.length === 0 && <p>Aucune demande pour le moment. <Link href="/vehicules" style={{ color: "var(--gold)", fontWeight: 700 }}>Voir les véhicules</Link></p>}
        {rentals.map((x) => (
          <div className="adm-card" key={x.id}>
            <div className="adm-head"><b>{(x.vehicle_id && names[x.vehicle_id]) || "Véhicule"}</b><span className="tag" style={{ position: "static" }}>{x.status ?? "Nouvelle demande"}</span></div>
            <p>Demande n° {x.id.slice(0, 8).toUpperCase()} · du {fmt(x.start_date)} au {fmt(x.end_date)}{x.pickup_place ? ` · remise : ${x.pickup_place}` : ""}</p>
            <Suite text={NEXT_RENTAL[x.status ?? "Nouvelle demande"] ?? "L’équipe YUM suit votre demande."} wa={waLink(`Bonjour YUM Afrique, je vous écris à propos de ma demande n° ${x.id.slice(0, 8).toUpperCase()} (${(x.vehicle_id && names[x.vehicle_id]) || "véhicule"}, du ${x.start_date} au ${x.end_date}). Statut affiché : ${x.status ?? "Nouvelle demande"}.`)} />
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 24 }}>Demandes personnalisées</h2>
      <div className="adm-list">
        {specials.length === 0 && <p>Aucune demande personnalisée. <Link href="/demande-speciale" style={{ color: "var(--gold)", fontWeight: 700 }}>En faire une</Link></p>}
        {specials.map((x) => (
          <div className="adm-card" key={x.id}>
            <div className="adm-head"><b>{[x.make, x.model].filter(Boolean).join(" ") || x.vehicle_type || "Véhicule au choix"}</b><span className="tag" style={{ position: "static" }}>{x.status ?? "Nouvelle demande"}</span></div>
            <p>Demande n° {x.id.slice(0, 8).toUpperCase()} · du {fmt(x.start_date)} au {fmt(x.end_date)}</p>
            <Suite text={NEXT_SPECIAL[x.status ?? "Nouvelle demande"] ?? "L’équipe YUM suit votre demande."} wa={waLink(`Bonjour YUM Afrique, je vous écris à propos de ma demande personnalisée n° ${x.id.slice(0, 8).toUpperCase()}. Statut affiché : ${x.status ?? "Nouvelle demande"}.`)} />
          </div>
        ))}
      </div>
      {apps.length > 0 && <>
        <h2 style={{ fontSize: 24, marginTop: 32 }}>Mes dossiers partenaire</h2>
        <div className="adm-list">
          {apps.map((x) => (
            <div className="adm-card" key={x.id}>
              <div className="adm-head"><b>{x.vehicle_make} {x.vehicle_model}</b><span className="tag" style={{ position: "static" }}>{x.status}</span></div>
              <p>Dossier n° {x.id.slice(0, 8).toUpperCase()}</p>
              <Frise status={x.status} />
              <Suite text={NEXT_PARTNER[x.status] ?? "L’équipe YUM suit votre dossier."} wa={waLink(`Bonjour YUM Afrique, je vous écris à propos de mon dossier partenaire n° ${x.id.slice(0, 8).toUpperCase()}. Statut affiché : ${x.status}.`)} />
            </div>
          ))}
        </div>
      </>}
      <p className="notice" style={{ marginTop: 28 }}>Seules les demandes envoyées pendant que vous étiez connecté apparaissent ici.</p>
    </>
  );
}
