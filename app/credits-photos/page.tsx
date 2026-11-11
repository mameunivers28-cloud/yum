import Shell from "../Shell";

export const metadata = { title: "Crédits photos — YUM" };

const CREDITS = [
  ["Photo d’accueil (corniche de Dakar) — temporaire", "Issiaga_Photography", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "https://commons.wikimedia.org/wiki/File:Beautiful_sunset_dakar_corniche.jpg"],
  ["Toyota Yaris", "Tokumeigakarinoaoshima", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "https://commons.wikimedia.org/wiki/File:Toyota_YARiS_1.5_G_2WD%E3%83%BBCVT_(5BA-MXPA10-AHXGB)_front.jpg"],
  ["Toyota Corolla", "Mateusmatsuda", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "https://commons.wikimedia.org/wiki/File:Toyota_Corolla_sedan_E210_hydrid.jpg"],
  ["Hyundai Tucson", "Alexander Migl", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/", "https://commons.wikimedia.org/wiki/File:Hyundai_Tucson_(NX4)_1X7A0424.jpg"],
  ["Toyota Land Cruiser", "Calreyn88", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "https://commons.wikimedia.org/wiki/File:2020_Toyota_Land_Cruiser_VX-S_5.7_V8.jpg"],
  ["Kia Picanto", "Harvey Bold", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/", "https://commons.wikimedia.org/wiki/File:2021_KIA_Picanto_1_DPi_-_998cc_1.0_(66PS)_Petrol_-_Blue_Breeze_-_03-2024,_Front.jpg"],
  ["Peugeot 508", "Guillaume Vachey", "CC0 (domaine public)", "https://creativecommons.org/publicdomain/zero/1.0/", "https://commons.wikimedia.org/wiki/File:Peugeot_508_II_(45834176524).jpg"],
];

export default function Page() {
  return (
    <Shell>
      <section className="s"><div className="wrap" style={{ maxWidth: 720 }}>
        <h1 className="dt">Crédits photos</h1>
        <p className="sub">Les photos des véhicules sont fournies à titre d’illustration et proviennent de Wikimedia Commons, sous licences libres. Elles seront remplacées par les photos de nos propres véhicules.</p>
        <ul className="credits">
          {CREDITS.map(([v, a, l, lu, src]) => (
            <li key={v}>
              <b>{v}</b> — photo de {a}, <a href={lu} target="_blank" rel="noreferrer">{l}</a>, <a href={src} target="_blank" rel="noreferrer">source</a>
            </li>
          ))}
        </ul>
      </div></section>
    </Shell>
  );
}
