"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Car } from "../cars";
import CarCard from "../CarCard";

export default function Catalogue({ cars }: { cars: Car[] }) {
  const sp = useSearchParams();
  const [cat, setCat] = useState(sp.get("categorie") ?? "");
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [trans, setTrans] = useState("");
  const [seats, setSeats] = useState("");
  const [sort, setSort] = useState("prix-asc");
  const [open, setOpen] = useState(false);
  const du = sp.get("du"), au = sp.get("au");

  const cats = useMemo(() => Array.from(new Set(cars.map((c) => c.c))), [cars]);
  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.m))).sort(), [cars]);
  const list = useMemo(() => {
    const l = cars.filter((c) =>
      (!cat || c.c === cat) && (!brand || c.m === brand) && (!budget || c.p <= Number(budget)) &&
      (!trans || c.t === trans) && (!seats || c.s >= Number(seats)));
    l.sort((a, b) => sort === "prix-desc" ? b.p - a.p : sort === "annee" ? b.y - a.y : a.p - b.p);
    return l;
  }, [cars, cat, brand, budget, trans, seats, sort]);
  const active = [cat, brand, budget, trans, seats].filter(Boolean).length;
  const reset = () => { setCat(""); setBrand(""); setBudget(""); setTrans(""); setSeats(""); };

  return (
    <section className="s"><div className="wrap">
      {(du || au) && <p className="notice">Vos dates : {du ?? "…"} → {au ?? "…"}. La disponibilité exacte vous sera confirmée par notre équipe après votre demande.</p>}
      <button className="btn line filt-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>Filtres{active ? ` (${active})` : ""}</button>
      <div className={"filters" + (open ? " open" : "")} role="search" aria-label="Filtrer les véhicules">
        <label>Catégorie<select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">Toutes</option>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Marque<select value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">Toutes</option>{brands.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label>Budget par jour<select value={budget} onChange={(e) => setBudget(e.target.value)}><option value="">Tous</option><option value="25000">Jusqu’à 25 000 FCFA</option><option value="40000">Jusqu’à 40 000 FCFA</option><option value="60000">Jusqu’à 60 000 FCFA</option><option value="100000">Jusqu’à 100 000 FCFA</option></select></label>
        <label>Boîte<select value={trans} onChange={(e) => setTrans(e.target.value)}><option value="">Toutes</option><option>Automatique</option><option>Manuelle</option></select></label>
        <label>Places min.<select value={seats} onChange={(e) => setSeats(e.target.value)}><option value="">Indifférent</option><option value="4">4+</option><option value="5">5+</option><option value="7">7+</option></select></label>
        <label>Trier par<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="annee">Plus récents</option></select></label>
      </div>
      <div className="resbar" role="status">
        <b>{list.length} véhicule{list.length > 1 ? "s" : ""}</b>
        {active > 0 && <button className="linkbtn" onClick={reset}>Réinitialiser les filtres</button>}
      </div>
      {list.length === 0 ? (
        <div className="empty"><h3>Aucun véhicule ne correspond</h3><p>Modifiez vos filtres, ou décrivez votre besoin : YUM peut rechercher le véhicule pour vous dans sa flotte et auprès de ses partenaires.</p><Link className="btn navy" href="/demande-speciale">Faire une demande personnalisée</Link></div>
      ) : (
        <div className="grid">{list.map((c) => <CarCard key={c.id} c={c} />)}</div>
      )}
    </div></section>
  );
}
