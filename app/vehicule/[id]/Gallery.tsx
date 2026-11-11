"use client";
import { useEffect, useState } from "react";

export default function Gallery({ photos, alt, tag, tagClass }: { photos: string[]; alt: string; tag: string; tagClass: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const n = photos.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  if (n === 0) return (
    <div className="gal"><div className="pic big"><span className={tagClass}>{tag}</span><svg viewBox="0 0 120 50" aria-hidden="true"><use href="#car" /></svg></div></div>
  );

  return (
    <div className="gal">
      <button className="gal-main" onClick={() => setOpen(true)} aria-label="Agrandir la photo">
        <span className={tagClass}>{tag}</span>
        <img src={photos[i]} alt={`${alt}, photo ${i + 1} sur ${n}`} />
      </button>
      {n > 1 && (
        <div className="gal-thumbs">
          {photos.map((p, k) => <button key={p + k} aria-current={k === i} aria-label={`Photo ${k + 1}`} onClick={() => setI(k)}><img src={p} alt="" loading="lazy" /></button>)}
        </div>
      )}
      {open && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photos du véhicule" onClick={() => setOpen(false)}>
          <img src={photos[i]} alt={alt} onClick={(e) => e.stopPropagation()} />
          <button className="x" aria-label="Fermer" onClick={() => setOpen(false)}>×</button>
          {n > 1 && <>
            <button className="pv" aria-label="Photo précédente" onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>
            <button className="nx" aria-label="Photo suivante" onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>
            <span className="cnt">{i + 1} / {n}</span>
          </>}
        </div>
      )}
    </div>
  );
}
