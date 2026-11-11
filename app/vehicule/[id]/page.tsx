import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { SITE_URL } from "../../../lib/config";
import Shell from "../../Shell";
import { WhatsAppButton } from "../../WhatsApp";
import DemandeForm from "./DemandeForm";
import Gallery from "./Gallery";
import Indispo from "./Indispo";

type Vehicle = {
  id: string; name: string; make: string | null; year: number | null; category: string; transmission: string;
  engine: string | null; seats: number; has_ac: boolean | null; daily_price: number;
  owner_type: "YUM" | "Partenaire"; city: string | null; equipment: string[] | null; photo_url: string | null;
  fuel: string | null; description: string | null; mileage_km: number | null; photos: string[] | null;
  mileage_policy: string | null; fuel_policy: string | null; rental_conditions: string | null; return_conditions: string | null;
  deposit_amount: number | null; delivery_fee: number | null; availability_note: string | null;
};

const fmt = (n: number) => n.toLocaleString("fr-FR");
const COLS = "id,name,make,year,category,transmission,engine,seats,has_ac,daily_price,owner_type,city,equipment,photo_url,fuel,description,mileage_km,photos,mileage_policy,fuel_policy,rental_conditions,return_conditions,deposit_amount,delivery_fee,availability_note";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase.from("vehicles").select("name,year,category,city").eq("id", id).eq("published", true).maybeSingle();
  if (!data) return { title: "Véhicule — YUM" };
  const d = data as { name: string; year: number | null; category: string; city: string | null };
  return {
    title: `Location ${d.name}${d.year ? " " + d.year : ""} à ${d.city ?? "Dakar"} — YUM`,
    description: `Louez ${d.name} (${d.category}) à ${d.city ?? "Dakar"} avec YUM. Envoyez votre demande : disponibilité et conditions confirmées par YUM.`,
    alternates: { canonical: `/vehicule/${id}` },
  };
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase.from("vehicles").select(COLS).eq("id", id).eq("published", true).maybeSingle();
  if (!data) notFound();
  const v = data as unknown as Vehicle;
  const { data: av } = await supabase.from("vehicle_availability").select("start_date,end_date").eq("vehicle_id", id).order("start_date");
  const photos = (v.photos && v.photos.length ? v.photos : v.photo_url ? [v.photo_url] : []);
  const url = `${SITE_URL}/vehicule/${v.id}`;
  const wa = `Bonjour YUM Afrique, je souhaite obtenir des informations sur le véhicule suivant :\n\nVéhicule : ${v.name}\nAnnée : ${v.year ?? "non précisée"}\nPrix journalier : ${fmt(v.daily_price)} FCFA\nLien : ${url}\n\nJe souhaite connaître sa disponibilité et les conditions de location.`;
  const conds: [string, string | null][] = [
    ["Conditions de location", v.rental_conditions], ["Kilométrage", v.mileage_policy], ["Carburant", v.fuel_policy],
    ["Restitution", v.return_conditions], ["Disponibilité indicative", v.availability_note],
  ];
  const shown = conds.filter(([, t]) => t && t.trim());

  return (
    <section className="s"><div className="wrap">
      <p className="back"><Link href="/vehicules">← Retour aux véhicules</Link></p>
      <div className="detail">
        <div>
          <Gallery photos={photos} alt={v.name} tag={v.owner_type === "YUM" ? "Flotte YUM" : "Partenaire"} tagClass={v.owner_type === "YUM" ? "tag" : "tag p"} />
          <p className="owner-note">{v.owner_type === "YUM" ? "Véhicule de la flotte YUM." : "Véhicule proposé par un propriétaire partenaire, vérifié par YUM avant publication."}</p>
          <p className="eyebrow dark">{v.make ?? ""}{v.make && v.year ? " · " : ""}{v.year ?? ""}</p>
          <h1 className="dt">{v.name}</h1>
          <div className="price big">{fmt(v.daily_price)} <small>FCFA / jour</small></div>
          <p className="notice">Le prix journalier n’est pas le montant total définitif : le prix final et la disponibilité sont confirmés par YUM.</p>
          <ul className="specs">
            {v.year ? <li><b>Année</b>{v.year}</li> : null}
            <li><b>Catégorie</b>{v.category}</li>
            <li><b>Boîte</b>{v.transmission}</li>
            <li><b>Places</b>{v.seats}</li>
            <li><b>Carburant</b>{v.fuel ?? "Non renseigné"}</li>
            {v.engine ? <li><b>Motorisation</b>{v.engine}</li> : null}
            {v.mileage_km != null ? <li><b>Kilométrage</b>{fmt(v.mileage_km)} km</li> : null}
            <li><b>Climatisation</b>{v.has_ac === null ? "Non renseigné" : v.has_ac ? "Oui" : "Non"}</li>
            <li><b>Zone</b>{v.city ?? "Dakar"}</li>
            {v.deposit_amount ? <li><b>Dépôt de garantie</b>{fmt(v.deposit_amount)} FCFA</li> : null}
            {v.delivery_fee ? <li><b>Frais de livraison</b>{fmt(v.delivery_fee)} FCFA</li> : null}
          </ul>
          <Indispo periods={(av ?? []) as { start_date: string; end_date: string }[]} />
          {v.description && v.description.trim() && (<><h2 style={{ fontSize: 22, marginTop: 24 }}>Description</h2><p className="desc">{v.description}</p></>)}
          {v.equipment && v.equipment.length > 0 && (<><h2 style={{ fontSize: 22, marginTop: 22 }}>Équipements et options</h2><ul className="equip">{v.equipment.map((e) => <li key={e}>{e}</li>)}</ul></>)}
          {shown.length > 0 && (<><h2 style={{ fontSize: 22, marginTop: 22 }}>Conditions</h2><div className="cond">{shown.map(([t, x]) => <div key={t}><b>{t}</b><p>{x}</p></div>)}</div></>)}
          <h2 style={{ fontSize: 22, marginTop: 22 }}>Comment réserver</h2>
          <ol className="steps mini">
            <li><b>Envoyez votre demande</b>Dates et lieu de remise.</li>
            <li><b>YUM vérifie</b>Disponibilité et dossier.</li>
            <li><b>Conditions finales</b>Communiquées par YUM.</li>
            <li><b>Confirmation</b>Après validation du paiement.</li>
          </ol>
          <div className="cta-row">
            <a className="btn gold" href="#demande">Demander ce véhicule</a>
            <WhatsAppButton message={wa} />
            <Link className="btn line" href="/vehicules">Découvrir les autres véhicules</Link>
          </div>
        </div>
        <aside id="demande" className="book">
          <p className="notice">Réservation soumise à confirmation : vous ne payez qu’après approbation de votre dossier.</p>
          <DemandeForm vehicleId={v.id} vehicleName={v.name} year={v.year} dailyPrice={v.daily_price} deposit={v.deposit_amount} deliveryFee={v.delivery_fee} />
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
