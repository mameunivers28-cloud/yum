import Link from "next/link";
import Shell from "./Shell";
import Ico from "./Ico";
import { WhatsAppButton } from "./WhatsApp";

export type Mk = {
  eyebrow: string; title: string; lead: string;
  points: [string, string, string][];
  steps?: [string, string][];
  note?: string;
  ctas: [string, string][];
  wa: string;
};

export default function MarketingPage({ m }: { m: Mk }) {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">{m.eyebrow}</p>
        <h1>{m.title}</h1>
        <p className="lead">{m.lead}</p>
        <div className="cta-row">
          {m.ctas.map(([h, l], i) => <Link key={h} className={i === 0 ? "btn gold" : "btn ghost"} href={h}>{l}</Link>)}
        </div>
      </div></section>
      <section className="s"><div className="wrap">
        <ul className="why">
          {m.points.map(([d, t, p]) => <li key={t}><Ico d={d} /><h3>{t}</h3><p>{p}</p></li>)}
        </ul>
      </div></section>
      {m.steps && (
        <section className="s soft"><div className="wrap">
          <h2>Comment ça se passe</h2>
          <ol className={`steps${m.steps.length === 4 ? " q" : ""}`}>{m.steps.map(([t, p]) => <li key={t}><b>{t}</b>{p}</li>)}</ol>
          {m.note && <p className="notice" style={{ marginTop: 22 }}>{m.note}</p>}
        </div></section>
      )}
      <section className="s"><div className="wrap"><div className="cta">
        <div><h2>Une question ?</h2><p>L’équipe YUM vous répond.</p></div>
        <WhatsAppButton message={m.wa} label="Écrire à YUM sur WhatsApp" />
      </div></div></section>
    </Shell>
  );
}
