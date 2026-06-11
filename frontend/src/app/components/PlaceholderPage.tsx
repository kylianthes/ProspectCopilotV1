import { Construction } from "lucide-react";

interface Props { title: string; description: string; }

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div style={{ padding: "28px 32px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "#E8EDF5", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>{title}</h1>
        <p style={{ color: "#4A5568", fontSize: 13, margin: "4px 0 0" }}>{description}</p>
      </div>
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 14,
        background: "#131925", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
      }}>
        <Construction size={32} style={{ color: "#2D3D5A" }} />
        <div style={{ color: "#3D4E6B", fontSize: 13.5 }}>Cette section est en développement</div>
      </div>
    </div>
  );
}
