import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Shell from "../../Shell";
import DemandeForm from "./DemandeForm";

type Vehicle = {
  id: string; name: string; year: number | null; category: string; transmission: string;
  engine: string | null; seats: number; has_ac: boolean | null; daily_price: number;
  owner_type: "YUM" | "Partenaire"; city: string | null; equipment: string[] | null; photo_url: string | null;
};

const fmt = (n: number) => n.toLocaleString("fr-FR");

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase
    .from("vehicles")
    .select("id,name,year,category,transmission,engine,seats,has_ac,daily_price,owner_type,city,equipment,photo_url")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (!data) notFound();
  const v = data as Vehicle;

  return (
    <section className="s"><div className="wrap">
      <p className="back"><Link href="/vehicules">← Retour aux véhicules</Link></p>
      <div className="detail">
        <div>
          <div className="pic big">
            <span className={v.owner_type === "YUM" ? "tag" : "tag p"}>{v.owner_type === "YUM" ? "Flotte YUM" : "Partenaire"}</span>
            {v.photo_url ? <img src={v.photo_url} alt={v.name} /> : <svg viewBox="0 0 120 50" aria-hidden="true"><use href="#car" /></svg>}
          </div>
          <p className="eyebrow dark">{v.owner_type === "YUM" ? "Flotte YUM" : "Véhicule partenaire"}</p>
          <h1 className="dt">{v.name}</h1>
          <div className="price big">{fmt(v.daily_price)} <small>FCFA / jour</small></div>
          <ul className="specs">
            {v.year ? <li><b>Année</b>{v.year}</li> : null}
            <li><b>Catégorie</b>{v.category}</li>
            <li><b>Boîte</b>{v.transmission}</li>
            <li><b>Places</b>{v.seats}</li>
            {v.engine ? <li><b>Motorisation</b>{v.engine}</li> : null}
            <li><b>Climatisation</b>{v.has_ac === false ? "Non" : "Oui"}</li>
            <li><b>Ville</b>{v.city ?? "Dakar"}</li>
          </ul>
          {v.equipment && v.equipment.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, marginTop: 22 }}>Équipements</h2>
              <ul className="equip">{v.equipment.map((e) => <li key={e}>{e}</li>)}</ul>
            </>
          )}
        </div>
        <aside id="demande" className="book">
          <p className="notice">Réservation soumise à confirmation : vous ne payez qu’après approbation de votre dossier.</p>
          <DemandeForm vehicleId={v.id} vehicleName={v.name} dailyPrice={v.daily_price} />
        </aside>
      </div>
    </div></section>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Shell>
      <Suspense fallback={<p style={{ padding: 24 }}>Chargement…</p>}>
        <Detail params={params} />
      </Suspense>
    </Shell>
  );
}
