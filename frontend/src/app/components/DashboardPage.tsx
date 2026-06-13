import { Users, Brain, MessageSquare, CheckCircle, Plus, ArrowRight, Clock } from "lucide-react";
import type { Prospect, Page, ProspectStatus } from "../types";

interface Props {
  prospects: Prospect[];
  onNavigate: (p: Page) => void;
  onAddProspect: () => void;
}

const STATUS_META: Record<ProspectStatus, { label: string; color: string; bg: string }> = {
  new:        { label: "Nouveau",       color: "#8895A7", bg: "rgba(136,149,167,0.1)" },
  analyzing:  { label: "Analyse IA...",  color: "#00D4FF", bg: "rgba(0,212,255,0.1)"   },
  analyzed:   { label: "Analysé",       color: "#00D4FF", bg: "rgba(0,212,255,0.1)"   },
  generating: { label: "Génération...",  color: "#7C6AF7", bg: "rgba(124,106,247,0.1)" },
  draft:      { label: "Message prêt", color: "#FFB800", bg: "rgba(255,184,0,0.1)"   },
  validated:  { label: "Validé",        color: "#00FFA3", bg: "rgba(0,255,163,0.1)"   },
  sent:       { label: "Envoyé",        color: "#00FFA3", bg: "rgba(0,255,163,0.08)"  },
  rejected:   { label: "Rejeté",        color: "#FF4D6A", bg: "rgba(255,77,106,0.08)" },
  archived:   { label: "Archivé",       color: "#3D4E6B", bg: "rgba(61,78,107,0.12)"  },
};

function scoreColor(s: number) {
  return s >= 85 ? "#00FFA3" : s >= 70 ? "#00D4FF" : s >= 55 ? "#FFB800" : "#FF4D6A";
}

function FunnelStep({ label, count, color, total, onClick }: { label: string; count: number; color: string; total: number; onClick?: () => void }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#8895A7" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#4A5568", fontFamily: "'JetBrains Mono', monospace" }}>{pct.toFixed(0)}%</span>
          <span style={{ fontSize: 15, color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", minWidth: 28, textAlign: "right" }}>{count}</span>
        </div>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export function DashboardPage({ prospects, onNavigate, onAddProspect }: Props) {
  const total      = prospects.length;
  const analyzed   = prospects.filter(p => !["new","analyzing"].includes(p.status)).length;
  const drafted    = prospects.filter(p => ["draft","validated","sent"].includes(p.status)).length;
  const validated  = prospects.filter(p => ["validated","sent"].includes(p.status)).length;
  const sent       = prospects.filter(p => p.status === "sent").length;
  const newCount   = prospects.filter(p => p.status === "new").length;
  const draftCount = prospects.filter(p => p.status === "draft").length;
  const convRate   = total > 0 ? ((sent / total) * 100).toFixed(1) : "0.0";
  const analyzeRate = total > 0 ? ((analyzed / total) * 100).toFixed(0) : "0";

  const recent = [...prospects]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 30px" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#E8EDF5", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#4A5568", fontSize: 13, margin: "4px 0 0" }}>Vue d'ensemble de votre pipeline de prospection IA</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onAddProspect} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
            <Plus size={13} /> Ajouter
          </button>
          <button onClick={() => onNavigate("prospects")} style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 14px rgba(0,212,255,0.2)" }}>
            <Users size={13} /> Voir les prospects
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total prospects",    value: total,     color: "#E8EDF5", sub: `+${newCount} nouveaux`,       icon: <Users size={14} /> },
          { label: "Analysés par IA",    value: analyzed,  color: "#00D4FF", sub: `${analyzeRate}% du total`,    icon: <Brain size={14} /> },
          { label: "À valider",          value: draftCount, color: "#FFB800", sub: "Messages en attente",        icon: <MessageSquare size={14} /> },
          { label: "Envoyés (manuel)",   value: sent,      color: "#00FFA3", sub: `${convRate}% conversion`,     icon: <CheckCircle size={14} /> },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#4A5568" }}>{kpi.label}</div>
              <div style={{ color: kpi.color, opacity: 0.6 }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: 26, color: kpi.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: "#3D4E6B", marginTop: 6 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#6B7A99", fontWeight: 500, marginBottom: 16 }}>Entonnoir de conversion</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FunnelStep label="Ajoutés"         count={total}     color="#8895A7" total={total} />
            <FunnelStep label="Analysés IA"     count={analyzed}  color="#00D4FF" total={total} onClick={() => onNavigate("prospects")} />
            <FunnelStep label="Message généré"  count={drafted}   color="#7C6AF7" total={total} onClick={() => onNavigate("messages")} />
            <FunnelStep label="Validé humain"   count={validated} color="#FFB800" total={total} onClick={() => onNavigate("messages")} />
            <FunnelStep label="Envoyé"          count={sent}      color="#00FFA3" total={total} />
          </div>
        </div>

        <div style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#6B7A99", fontWeight: 500, marginBottom: 16 }}>Flow recommandé</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { step: "01", label: "Ajouter un prospect",   sub: "Manuel ou import CSV",             color: "#8895A7", act: onAddProspect },
              { step: "02", label: "Analyser avec IA",      sub: "Score 0-100 + résumé + catégorie", color: "#00D4FF", act: () => onNavigate("prospects") },
              { step: "03", label: "Générer le message",    sub: "Ton configurable, email ou DM",    color: "#7C6AF7", act: () => onNavigate("prospects") },
              { step: "04", label: "Valider ou modifier",   sub: "Éditer, Approuver, Rejeter",       color: "#FFB800", act: () => onNavigate("messages") },
              { step: "05", label: "Envoyer manuellement",  sub: "Copiez le message validé",         color: "#00FFA3", act: undefined as (() => void) | undefined },
            ].map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: 12, paddingBottom: i < 4 ? 14 : 0, position: "relative" }}>
                {i < 4 && <div style={{ position: "absolute", left: 13, top: 26, width: 1, height: "calc(100% - 12px)", background: "rgba(255,255,255,0.04)" }} />}
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{s.step}</span>
                </div>
                <div style={{ flex: 1, cursor: s.act ? "pointer" : "default" }} onClick={s.act}>
                  <div style={{ fontSize: 12.5, color: "#D1D9E6", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}>{s.sub}</div>
                </div>
                {s.act && <ArrowRight size={12} style={{ color: "#2D3D5A", marginTop: 5, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "18px 20px", marginBottom: draftCount > 0 ? 16 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#6B7A99", fontWeight: 500 }}>Prospects récents</div>
          <button onClick={() => onNavigate("prospects")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#3D4E6B", fontSize: 11, cursor: "pointer", padding: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00D4FF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3D4E6B"; }}
          >Voir tout <ArrowRight size={11} /></button>
        </div>
        {recent.length === 0
          ? <div style={{ textAlign: "center", padding: "24px", color: "#3D4E6B", fontSize: 13 }}>Aucun prospect. Cliquez "Ajouter" pour commencer.</div>
          : recent.map((p, i) => {
              const meta = STATUS_META[p.status];
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < recent.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `hsl(${p.id.charCodeAt(1)*40+180},45%,18%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: `hsl(${p.id.charCodeAt(1)*40+180},75%,60%)`, border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "#D1D9E6", fontWeight: 500 }}>{p.name}</span>
                      {p.company && <span style={{ fontSize: 11, color: "#3D4E6B" }}>· {p.company}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}>{p.niche}</div>
                  </div>
                  {p.aiScore !== undefined && (
                    <div style={{ fontSize: 13, color: scoreColor(p.aiScore), fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", width: 28, textAlign: "right" }}>{p.aiScore}</div>
                  )}
                  <div style={{ background: meta.bg, borderRadius: 5, padding: "2px 8px", fontSize: 10.5, color: meta.color, whiteSpace: "nowrap" }}>{meta.label}</div>
                </div>
              );
            })}
      </div>

      {draftCount > 0 && (
        <div onClick={() => onNavigate("messages")} style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.18)", borderRadius: 10, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,184,0,0.09)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,184,0,0.06)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={14} style={{ color: "#FFB800" }} />
            <span style={{ fontSize: 13, color: "#FFB800", fontWeight: 500 }}>{draftCount} message{draftCount > 1 ? "s" : ""} en attente de validation</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#FFB800", opacity: 0.7 }}>Valider <ArrowRight size={12} /></div>
        </div>
      )}
    </div>
  );
}
