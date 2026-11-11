import Link from "next/link";
import type { Car } from "./cars";

const fmt = (n: number) => n.toLocaleString("fr-FR");

export default function CarCard({ c }: { c: Car }) {
  return (
    <article className="car">
      <div className="pic">
        <span className={c.o === "YUM" ? "tag" : "tag p"}>{c.o === "YUM" ? "Flotte YUM" : "Partenaire"}</span>
        {c.img ? <img src={c.img} alt={c.n} loading="lazy" /> : <svg viewBox="0 0 120 50" aria-hidden="true"><use href="#car" /></svg>}
      </div>
      <div className="body">
        <small className="brand">{c.m} {c.y ? `· ${c.y}` : ""}</small>
        <h3>{c.n}</h3>
        <ul className="meta"><li>{c.c}</li><li>{c.t}</li><li>{c.s} places</li></ul>
        <div className="row">
          <div className="price">{fmt(c.p)} <small>FCFA / jour</small></div>
          <Link className="btn navy sm" href={`/vehicule/${c.id}`}>Voir le véhicule</Link>
        </div>
      </div>
    </article>
  );
}
