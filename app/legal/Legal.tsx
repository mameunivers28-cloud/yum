import Shell from "../Shell";

export default function Legal({ title, intro, sections }: { title: string; intro: string; sections: string[] }) {
  return (
    <Shell>
      <section className="pagehead"><div className="wrap">
        <p className="eyebrow">Informations</p>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
      </div></section>
      <section className="s"><div className="wrap" style={{ maxWidth: 760 }}>
        {sections.map((s) => (
          <div className="own" key={s} style={{ marginTop: 14 }}><h2 style={{ fontSize: 22 }}>{s}</h2><p>À venir.</p></div>
        ))}
      </div></section>
    </Shell>
  );
}
