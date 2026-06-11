import { useState } from "react";
import { Check, X, Copy, Edit3, MessageSquare, CheckCircle, Clock, SkipForward, AlertCircle } from "lucide-react";
import type { Prospect, ProspectStatus, MessageTone, MessageType } from "../types";

interface Props {
  prospects: Prospect[];
  onUpdate: (id: string, patch: Partial<Prospect>) => void;
}

type FilterTab = "all" | "draft" | "validated" | "sent" | "rejected";

const STATUS_META: Record<ProspectStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ size?: number }> }> = {
  new:        { label: "Nouveau",       color: "#8895A7", bg: "rgba(136,149,167,0.1)",  icon: Clock },
  analyzing:  { label: "Analyse…",     color: "#00D4FF", bg: "rgba(0,212,255,0.1)",    icon: Clock },
  analyzed:   { label: "Analysé",       color: "#00D4FF", bg: "rgba(0,212,255,0.1)",    icon: CheckCircle },
  generating: { label: "Génération…",  color: "#7C6AF7", bg: "rgba(124,106,247,0.1)",  icon: Clock },
  draft:      { label: "À valider",    color: "#FFB800", bg: "rgba(255,184,0,0.1)",    icon: Clock },
  validated:  { label: "Validé",        color: "#00FFA3", bg: "rgba(0,255,163,0.1)",    icon: CheckCircle },
  sent:       { label: "Envoyé",        color: "#00FFA3", bg: "rgba(0,255,163,0.08)",   icon: CheckCircle },
  rejected:   { label: "Rejeté",        color: "#FF4D6A", bg: "rgba(255,77,106,0.08)",  icon: X },
  archived:   { label: "Archivé",       color: "#3D4E6B", bg: "rgba(61,78,107,0.12)",   icon: SkipForward },
};

const TONE_LABELS: Record<MessageTone, string> = { professionnel: "Professionnel", amical: "Amical", direct: "Direct", chaleureux: "Chaleureux" };
const TYPE_LABELS: Record<MessageType, string> = { email: "Email", dm: "DM", linkedin: "LinkedIn" };

const TABS: { id: FilterTab; label: string; statuses: ProspectStatus[] }[] = [
  { id: "all",       label: "Tous",     statuses: ["draft","validated","sent","rejected"] },
  { id: "draft",     label: "À valider", statuses: ["draft"] },
  { id: "validated", label: "Validés",  statuses: ["validated"] },
  { id: "sent",      label: "Envoyés",  statuses: ["sent"] },
  { id: "rejected",  label: "Rejetés",  statuses: ["rejected"] },
];

export function MessagesPage({ prospects, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const relevantProspects = prospects.filter(p => ["draft","validated","sent","rejected"].includes(p.status));
  const activeStatuses = TABS.find(t => t.id === activeTab)!.statuses;
  const filtered = activeTab === "all" ? relevantProspects : relevantProspects.filter(p => activeStatuses.includes(p.status));

  const selected = prospects.find(p => p.id === selectedId) ?? filtered[0] ?? null;

  const counts: Record<FilterTab, number> = {
    all:       relevantProspects.length,
    draft:     relevantProspects.filter(p => p.status === "draft").length,
    validated: relevantProspects.filter(p => p.status === "validated").length,
    sent:      relevantProspects.filter(p => p.status === "sent").length,
    rejected:  relevantProspects.filter(p => p.status === "rejected").length,
  };

  const handleApprove = () => {
    if (selected) onUpdate(selected.id, { status: "validated", messageValidatedAt: new Date().toISOString() });
  };
  const handleReject = () => {
    if (selected) onUpdate(selected.id, { status: "rejected" });
  };
  const handleMarkSent = () => {
    if (selected) onUpdate(selected.id, { status: "sent" });
  };
  const handleCopy = () => {
    if (selected?.generatedMessage) {
      navigator.clipboard?.writeText(selected.generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  const handleSaveEdit = () => {
    if (selected) { onUpdate(selected.id, { generatedMessage: draft }); setEditing(false); }
  };
  const startEdit = () => { setDraft(selected?.generatedMessage ?? ""); setEditing(true); };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "22px 30px 16px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "#E8EDF5", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Messages</h1>
            <p style={{ color: "#4A5568", fontSize: 13, margin: "4px 0 0" }}>Validation humaine des messages générés par l'IA</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "À valider", value: counts.draft,     color: "#FFB800" },
              { label: "Validés",   value: counts.validated, color: "#00FFA3" },
              { label: "Envoyés",   value: counts.sent,      color: "#00D4FF" },
            ].map(s => (
              <div key={s.label} style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "7px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 16, color: s.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: "#3D4E6B", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left list */}
        <div style={{ width: 320, flexShrink: 0, background: "#0C1220", borderRight: "1px solid rgba(255,255,255,0.045)", display: "flex", flexDirection: "column" }}>

          {/* Filter tabs */}
          <div style={{ display: "flex", padding: "8px 10px", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0, flexWrap: "wrap" }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              const count = counts[tab.id];
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11.5, background: active ? "rgba(0,212,255,0.1)" : "transparent", color: active ? "#00D4FF" : "#4A5568", fontWeight: active ? 500 : 400 }}>
                  {tab.label}
                  {count > 0 && <span style={{ background: active ? "#00D4FF" : "rgba(255,255,255,0.06)", color: active ? "#0A0E17" : "#4A5568", borderRadius: 8, padding: "0 5px", fontSize: 10, fontWeight: 700 }}>{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Prospect list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "#3D4E6B", fontSize: 13 }}>
                {activeTab === "draft" ? "Aucun message à valider" : "Aucun message dans cette catégorie"}
              </div>
            )}
            {filtered.map(p => {
              const meta = STATUS_META[p.status];
              const StatusIcon = meta.icon;
              const isActive = (selectedId === p.id) || (!selectedId && filtered[0]?.id === p.id);
              return (
                <div key={p.id} onClick={() => { setSelectedId(p.id); setEditing(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer", borderLeft: `2px solid ${isActive ? "#00D4FF" : "transparent"}`, background: isActive ? "rgba(0,212,255,0.05)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "all 0.1s" }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `hsl(${p.id.charCodeAt(1)*40+180},45%,18%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 600, color: `hsl(${p.id.charCodeAt(1)*40+180},75%,60%)`, border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, color: "#D1D9E6", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, background: meta.bg, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
                        <StatusIcon size={9} style={{ color: meta.color }} />
                        <span style={{ fontSize: 10, color: meta.color, fontFamily: "'JetBrains Mono', monospace" }}>{meta.label}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "#3D4E6B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.messageTone && TONE_LABELS[p.messageTone]} · {p.messageType && TYPE_LABELS[p.messageType]}
                      {p.generatedMessage && ` · "${p.generatedMessage.split("\n")[0].slice(0,25)}…"`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right editor */}
        {selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Prospect header */}
            <div style={{ padding: "16px 26px", borderBottom: "1px solid rgba(255,255,255,0.045)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: `hsl(${selected.id.charCodeAt(1)*40+180},45%,18%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: `hsl(${selected.id.charCodeAt(1)*40+180},75%,60%)`, border: "1px solid rgba(255,255,255,0.08)" }}>
                  {selected.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontSize: 15, color: "#E8EDF5", fontWeight: 600 }}>{selected.name}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
                    {selected.company && <span style={{ fontSize: 11.5, color: "#4A5568" }}>{selected.company}</span>}
                    {selected.messageTone && <div style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.15)", borderRadius: 5, padding: "1px 7px", fontSize: 10.5, color: "#9B8FF5" }}>{TONE_LABELS[selected.messageTone]}</div>}
                    {selected.messageType && <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, padding: "1px 7px", fontSize: 10.5, color: "#6B7A99" }}>{TYPE_LABELS[selected.messageType]}</div>}
                    <div style={{ background: STATUS_META[selected.status].bg, borderRadius: 5, padding: "1px 7px", fontSize: 10.5, color: STATUS_META[selected.status].color }}>{STATUS_META[selected.status].label}</div>
                  </div>
                </div>
              </div>
              {!editing && (
                <button onClick={startEdit} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", color: "#8895A7", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "7px 13px", fontSize: 12.5, cursor: "pointer" }}>
                  <Edit3 size={13} /> Modifier
                </button>
              )}
            </div>

            {/* Message body */}
            <div style={{ flex: 1, padding: "20px 26px", overflowY: "auto" }}>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Message personnalisé</div>

              {editing ? (
                <>
                  <textarea value={draft} onChange={e => setDraft(e.target.value)}
                    style={{ width: "100%", minHeight: 240, background: "#0D1420", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 10, padding: "16px", color: "#E8EDF5", fontSize: 13.5, lineHeight: 1.75, resize: "vertical", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={handleSaveEdit} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,255,163,0.1)", color: "#00FFA3", border: "1px solid rgba(0,255,163,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}>
                      <Check size={13} /> Sauvegarder
                    </button>
                    <button onClick={() => setEditing(false)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: "#6B7A99", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}>
                      <X size={13} /> Annuler
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ background: "#0D1420", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "20px", fontSize: 13.5, color: "#B8C5D8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {selected.generatedMessage}
                </div>
              )}
            </div>

            {/* Action bar */}
            <div style={{ padding: "14px 26px", borderTop: "1px solid rgba(255,255,255,0.045)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: "#3D4E6B", flex: 1 }}>
                {selected.status === "validated" ? "✓ Message approuvé — prêt à être envoyé manuellement" :
                 selected.status === "sent"       ? "✓ Message marqué comme envoyé" :
                 selected.status === "rejected"   ? "Message rejeté — à régénérer si besoin" :
                 "Examinez le message ci-dessus et prenez une décision."}
              </div>
              <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "rgba(0,255,163,0.1)" : "rgba(255,255,255,0.04)", color: copied ? "#00FFA3" : "#8895A7", border: `1px solid ${copied ? "rgba(0,255,163,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "9px 14px", fontSize: 12.5, cursor: "pointer" }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copié !" : "Copier"}
              </button>
              {selected.status === "draft" && (
                <>
                  <button onClick={handleReject} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,77,106,0.08)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.2)", borderRadius: 9, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>
                    <X size={14} /> Rejeter
                  </button>
                  <button onClick={handleApprove} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #00FFA3 0%, #00CC82 100%)", color: "#0A0E17", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 14px rgba(0,255,163,0.2)" }}>
                    <Check size={14} /> Approuver
                  </button>
                </>
              )}
              {selected.status === "validated" && (
                <button onClick={handleMarkSent} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", border: "none", borderRadius: 9, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 14px rgba(0,212,255,0.2)" }}>
                  Marquer comme envoyé
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <MessageSquare size={32} style={{ color: "#2D3D5A", marginBottom: 12 }} />
              <div style={{ fontSize: 14, color: "#3D4E6B" }}>Sélectionnez un message à valider</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
