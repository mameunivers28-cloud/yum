import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import Accueil, { type Car } from "./Accueil";

type Row = {
  id: string; name: string; year: number | null; category: string; transmission: string;
  seats: number; daily_price: number; owner_type: "YUM" | "Partenaire"; photo_url: string | null;
};

async function Vehicules() {
  const { data } = await supabase
    .from("vehicles")
    .select("id,name,year,category,transmission,seats,daily_price,owner_type,photo_url")
    .eq("published", true)
    .order("daily_price");

  const cars: Car[] = ((data ?? []) as Row[]).map((r) => ({
    id: r.id, n: r.name, y: r.year ?? 0, c: r.category, t: r.transmission,
    s: r.seats, p: r.daily_price, o: r.owner_type, img: r.photo_url ?? "",
  }));

  return <Accueil cars={cars} />;
}

export default function Page() {
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Chargement…</p>}>
      <Vehicules />
    </Suspense>
  );
}
