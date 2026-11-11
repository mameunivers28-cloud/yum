import { supabase } from "../lib/supabase";

export type Car = { id: string; n: string; m: string; y: number; c: string; t: string; s: number; p: number; o: "YUM" | "Partenaire"; img: string };

type Row = {
  id: string; name: string; make: string | null; year: number | null; category: string; transmission: string;
  seats: number; daily_price: number; owner_type: "YUM" | "Partenaire"; photo_url: string | null;
};

export async function getCars(): Promise<Car[]> {
  const { data } = await supabase
    .from("vehicles")
    .select("id,name,make,year,category,transmission,seats,daily_price,owner_type,photo_url")
    .eq("published", true)
    .order("daily_price");
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id, n: r.name, m: r.make ?? r.name.split(" ")[0], y: r.year ?? 0, c: r.category, t: r.transmission,
    s: r.seats, p: r.daily_price, o: r.owner_type, img: r.photo_url ?? "",
  }));
}
