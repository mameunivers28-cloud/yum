"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

export type Field = { k: string; label: string; type?: string; required?: boolean; area?: boolean; num?: boolean; half?: boolean; hint?: string };

export default function LeadForm({ table, fields, submit, okTitle, okText }: { table: string; fields: Field[]; submit: string; okTitle: string; okText: string }) {
  const [v, setV] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setState("sending");
    const row: Record<string, string | number | null> = {};
    for (const f of fields) {
      const t = (v[f.k] ?? "").trim();
      row[f.k] = t === "" ? null : f.num ? Number(t) : t;
    }
    const { error } = await supabase.from(table).insert(row);
    if (error) { setErr("Envoi impossible pour le moment. Réessayez dans un instant."); console.error(error); setState("error"); return; }
    setState("ok");
  }

  if (state === "ok") return <div className="formcard ok" role="status"><h2>{okTitle}</h2><p>{okText}</p></div>;

  return (
    <form className="formcard" onSubmit={onSubmit}>
      <div className="fgrid">
        {fields.map((f) => (
          <label key={f.k} className={f.half ? "" : "full"}>
            {f.label}{f.hint ? <small> {f.hint}</small> : null}
            {f.area
              ? <textarea rows={4} required={f.required} value={v[f.k] ?? ""} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
              : <input type={f.type ?? "text"} inputMode={f.num ? "numeric" : undefined} required={f.required} value={v[f.k] ?? ""} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />}
          </label>
        ))}
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : submit}</button>
    </form>
  );
}
