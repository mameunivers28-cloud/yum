import { FAQ } from "./faqData";

export default function Faq() {
  return (
    <section className="s soft" id="faq"><div className="wrap">
      <p className="eyebrow dark">Questions fréquentes</p>
      <h2>FAQ</h2>
      <div className="faq">
        {FAQ.map((g) => (
          <div key={g.cat}>
            <h3>{g.cat}</h3>
            {g.items.map((it) => (
              <details key={it.q}><summary>{it.q}</summary><p>{it.a}</p></details>
            ))}
          </div>
        ))}
      </div>
    </div></section>
  );
}
