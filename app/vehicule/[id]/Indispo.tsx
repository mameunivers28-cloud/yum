"use client";
import { useEffect, useState } from "react";

type P = { start_date: string; end_date: string };
const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default function Indispo({ periods }: { periods: P[] }) {
  const [list, setList] = useState<P[]>([]);
  useEffect(() => {
    const t = new Date(); const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    setList(periods.filter((p) => p.end_date >= today));
  }, [periods]);
  if (list.length === 0) return null;
  return (
    <div className="cond">
      <h3>Périodes déjà réservées ou indisponibles</h3>
      <ul>{list.map((p, i) => <li key={i}>Du {fmt(p.start_date)} au {fmt(p.end_date)}</li>)}</ul>
      <p className="notice">Les autres dates ne sont pas garanties : YUM confirme toujours la disponibilité.</p>
    </div>
  );
}
