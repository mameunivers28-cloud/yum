import { ImageResponse } from "next/og";

export const alt = "YUM Afrique — Location de véhicules à Dakar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0F2A6B", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="120" height="120" viewBox="0 0 48 48">
            <rect x="4" y="4" width="40" height="40" rx="10" fill="#2A5FE8" transform="rotate(45 24 24)" />
            <path d="M15 15l9 11 9-11M24 26v9" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="9" r="3" fill="#fff" />
          </svg>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: 6 }}>YUM</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 52, fontWeight: 700 }}>Votre mobilité commence ici.</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#9DBDFF" }}>Location de véhicules à Dakar, Sénégal</div>
      </div>
    ),
    size,
  );
}
