import { Home, Users, MessageSquare, Settings, Layers, Cpu } from "lucide-react";
import type { Page } from "../types";
import { Logo } from "./Logo";

const NAV = [
  { id: "dashboard"     as Page, label: "Dashboard",     icon: Home },
  { id: "prospects"     as Page, label: "Prospects",     icon: Users },
  { id: "messages"      as Page, label: "Messages",      icon: MessageSquare },
  { id: "settings"      as Page, label: "Paramètres",    icon: Settings },
  { id: "design-system" as Page, label: "Design System", icon: Layers },
];

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  draftCount: number;
  newCount: number;
  totalCount: number;
  aiOnline: boolean;
}

export function Sidebar({ page, onNavigate, draftCount, newCount, totalCount, aiOnline }: Props) {
  return (
    <div style={{ width: 220, minWidth: 220, background: "#090D18", borderRight: "1px solid #131E30", display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #131E30" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={32} />
          <div>
            <div style={{ color: "#E8EDF5", fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.01em" }}>Prospect Copilot</div>
            <div style={{ color: "#00D4FF", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", opacity: 0.7 }}>MVP · IA LOCALE</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 8px 6px" }}>
        <div style={{ fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>Navigation</div>
        {NAV.map(item => {
          const active = page === item.id;
          const Icon = item.icon;
          const badge = item.id === "messages" ? draftCount : item.id === "prospects" ? newCount : 0;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer", background: active ? "rgba(0,212,255,0.09)" : "transparent", color: active ? "#00D4FF" : "#4A5870", position: "relative", textAlign: "left", marginBottom: 1 }}
              onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.color = "#8895A7"; } }}
              onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#4A5870"; } }}
            >
              {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, borderRadius: "0 2px 2px 0", background: "#00D4FF" }} />}
              <Icon size={14} />
              <span style={{ fontSize: 12.5, fontWeight: active ? 500 : 400, flex: 1 }}>{item.label}</span>
              {badge > 0 && (
                <div style={{ background: item.id === "messages" ? "#FFB800" : "#00D4FF", color: "#0A0E17", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{badge}</div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick stats */}
      <div style={{ margin: "8px 12px", background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 9, padding: "10px 12px" }}>
        <div style={{ fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Prospects</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { v: totalCount, label: "Total",     color: "#E8EDF5" },
            { v: newCount,   label: "Nouveaux",  color: "#FFB800" },
            { v: draftCount, label: "À valider", color: "#00D4FF" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, color: s.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 9.5, color: "#3D4E6B", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* AI status */}
      <div style={{ margin: "0 12px 10px", background: "#0C1220", border: `1px solid ${aiOnline ? "rgba(0,255,163,0.12)" : "rgba(255,77,106,0.12)"}`, borderRadius: 9, padding: "10px 12px" }}>
        <div style={{ fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>Moteur IA</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Cpu size={12} style={{ color: aiOnline ? "#00FFA3" : "#FF4D6A", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: aiOnline ? "#00FFA3" : "#FF4D6A", fontWeight: 500 }}>{aiOnline ? "Ollama connecté" : "Ollama hors ligne"}</div>
            <div style={{ fontSize: 9.5, color: "#2D3D5A", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>llama3.1:8b</div>
          </div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: aiOnline ? "#00FFA3" : "#FF4D6A", boxShadow: aiOnline ? "0 0 5px #00FFA3" : "none", flexShrink: 0 }} />
        </div>
      </div>

      {/* User footer */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #131E30" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1C2A45", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, color: "#6B7A99", border: "1px solid #1E2D45", flexShrink: 0 }}>AL</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#C8D4E8", fontWeight: 500 }}>Alexandre L.</div>
            <div style={{ fontSize: 10, color: "#2D3D5A" }}>Prospect Copilot</div>
          </div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFA3", boxShadow: "0 0 5px #00FFA3" }} />
        </div>
      </div>
    </div>
  );
}
