import { useState } from "react";
import { Plus, Search, Brain, MessageSquare, Check, X, Copy, Edit3, ChevronDown, Loader, Star, Trash2, Archive, Upload } from "lucide-react";
import type { Prospect, ProspectStatus, MessageTone, MessageType } from "../types";

interface Props {
  prospects: Prospect[];
  onUpdate: (id: string, patch: Partial<Prospect>) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
  onGenerate: (id: string, tone: MessageTone, type: MessageType) => void;
  onImportCsv: (file: File) => void;
}

const STATUS_META: Record<ProspectStatus, { label: string; color: string; bg: string }> = {
  new:        { label: "Nouveau",       color: "#8895A7", bg: "rgba(136,149,167,0.1)" },
  analyzing:  { label: "Analyse IA…",  color: "#00D4FF", bg: "rgba(0,212,255,0.1)"   },
  analyzed:   { label: "Analysé",       color: "#00D4FF", bg: "rgba(0,212,255,0.1)"   },
  generating: { label: "Génération…",  color: "#7C6AF7", bg: "rgba(124,106,247,0.1)" },
  draft:      { label: "Message prêt", color: "#FFB800", bg: "rgba(255,184,0,0.1)"   },
  validated:  { label: "Validé",        color: "#00FFA3", bg: "rgba(0,255,163,0.1)"   },
  sent:       { label: "Envoyé",        color: "#00FFA3", bg: "rgba(0,255,163,0.08)"  },
  rejected:   { label: "Rejeté",        color: "#FF4D6A", bg: "rgba(255,77,106,0.08)" },
  archived:   { label: "Archivé",       color: "#3D4E6B", bg: "rgba(61,78,107,0.12)"  },
};

const TONES: { value: MessageTone; label: string }[] = [
  { value: "professionnel", label: "Professionnel" },
  { value: "amical",        label: "Amical" },
  { value: "direct",        label: "Direct" },
  { value: "chaleureux",    label: "Chaleureux" },
];

const MSG_TYPES: { value: MessageType; label: string }[] = [
  { value: "email",    label: "Email" },
  { value: "dm",       label: "DM" },
];

function scoreColor(s: number) {
  return s >= 85 ? "#00FFA3" : s >= 70 ? "#00D4FF" : s >= 55 ? "#FFB800" : "#FF4D6A";
}

function ScoreRing({ score }: { score: number }) {
  const r = 26; const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
      <svg width={70} height={70} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
        <circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8.5, color: "#3D4E6B", marginTop: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

type PanelTab = "analyse" | "message" | "notes";

export function ProspectsPage({ prospects, onUpdate, onAdd, onDelete, onAnalyze, onGenerate, onImportCsv }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(prospects[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProspectStatus | "all">("all");
  const [filterNiche, setFilterNiche] = useState("all");
  const [panelTab, setPanelTab] = useState<PanelTab>("analyse");
  const [tone, setTone] = useState<MessageTone>("professionnel");
  const [msgType, setMsgType] = useState<MessageType>("email");
  const [editingMsg, setEditingMsg] = useState(false);
  const [msgDraft, setMsgDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [notesText, setNotesText] = useState("");

  const niches = ["all", ...Array.from(new Set(prospects.map(p => p.niche)))];

  const filtered = prospects.filter(p => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterNiche !== "all" && p.niche !== filterNiche) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.company?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = prospects.find(p => p.id === selectedId) ?? null;

  const handleSelectProspect = (p: Prospect) => {
    setSelectedId(p.id);
    setNotesText(p.notes ?? "");
    setEditingMsg(false);
    setPanelTab("analyse");
  };

  const handleCopy = () => {
    if (selected?.generatedMessage) {
      navigator.clipboard?.writeText(selected.generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleApprove = () => {
    if (selected) onUpdate(selected.id, { status: "validated", messageValidatedAt: new Date().toISOString() });
  };

  const handleReject = () => {
    if (selected) onUpdate(selected.id, { status: "rejected" });
  };

  const handleSaveEdit = () => {
    if (selected) { onUpdate(selected.id, { generatedMessage: msgDraft }); setEditingMsg(false); }
  };

  const handleSaveNotes = () => {
    if (selected) onUpdate(selected.id, { notes: notesText });
  };

  const startEdit = () => {
    setMsgDraft(selected?.generatedMessage ?? "");
    setEditingMsg(true);
  };

  const handleGenerate = () => {
    if (selected) { onGenerate(selected.id, tone, msgType); setPanelTab("message"); }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── LEFT LIST ── */}
      <div style={{ width: 300, flexShrink: 0, background: "#0C1220", borderRight: "1px solid rgba(255,255,255,0.045)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "#E8EDF5", fontWeight: 600 }}>Prospects <span style={{ color: "#3D4E6B", fontWeight: 400 }}>({filtered.length})</span></span>
            <div style={{ display: "flex", gap: 6 }}>
              <button title="Import CSV" style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.04)", color: "#6B7A99", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "5px 9px", fontSize: 11, cursor: "pointer" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <Upload size={11} /> CSV
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: "none" }}
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (file) onImportCsv(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              </button>
              <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 6, padding: "5px 9px", fontSize: 11, cursor: "pointer" }}>
                <Plus size={11} /> Ajouter
              </button>
            </div>
          </div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 8 }}>
            <Search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#3D4E6B" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
              style={{ width: "100%", background: "#0A0F1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 7, padding: "7px 10px 7px 27px", color: "#E8EDF5", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.3)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; }}
            />
          </div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(["all","new","analyzed","draft","validated","sent","rejected"] as (ProspectStatus|"all")[]).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer", background: filterStatus === s ? (s === "all" ? "rgba(0,212,255,0.12)" : STATUS_META[s as ProspectStatus]?.bg ?? "rgba(0,212,255,0.12)") : "transparent", color: filterStatus === s ? (s === "all" ? "#00D4FF" : STATUS_META[s as ProspectStatus]?.color ?? "#00D4FF") : "#3D4E6B" }}>
                {s === "all" ? "Tous" : STATUS_META[s as ProspectStatus].label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "#3D4E6B", fontSize: 13 }}>Aucun prospect trouvé</div>
          )}
          {filtered.map(p => {
            const meta = STATUS_META[p.status];
            const active = selectedId === p.id;
            return (
              <div key={p.id} onClick={() => handleSelectProspect(p)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer", borderLeft: `2px solid ${active ? "#00D4FF" : "transparent"}`, background: active ? "rgba(0,212,255,0.05)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "all 0.1s" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `hsl(${p.id.charCodeAt(1)*40+180},45%,18%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: `hsl(${p.id.charCodeAt(1)*40+180},75%,60%)`, border: "1px solid rgba(255,255,255,0.06)" }}>
                  {p.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "#D1D9E6", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#4A5568", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{p.company ? `${p.company} · ` : ""}{p.niche}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  {p.aiScore !== undefined && (
                    <span style={{ fontSize: 12, color: scoreColor(p.aiScore), fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{p.aiScore}</span>
                  )}
                  <div style={{ background: meta.bg, borderRadius: 4, padding: "1px 6px", fontSize: 9.5, color: meta.color, whiteSpace: "nowrap" }}>{meta.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT DETAIL PANEL ── */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Prospect header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.045)", flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: `hsl(${selected.id.charCodeAt(1)*40+180},45%,18%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: `hsl(${selected.id.charCodeAt(1)*40+180},75%,60%)`, border: "1px solid rgba(255,255,255,0.08)" }}>
                {selected.name.split(" ").map(n => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{ fontSize: 16, color: "#E8EDF5", fontWeight: 600 }}>{selected.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  {selected.role && <span style={{ fontSize: 12, color: "#6B7A99" }}>{selected.role}</span>}
                  {selected.company && <span style={{ fontSize: 12, color: "#4A5568" }}>@ {selected.company}</span>}
                  <div style={{ background: STATUS_META[selected.status].bg, borderRadius: 5, padding: "2px 8px", fontSize: 10.5, color: STATUS_META[selected.status].color }}>{STATUS_META[selected.status].label}</div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 5 }}>
                  {selected.email && <span style={{ fontSize: 11, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace" }}>{selected.email}</span>}
                  {selected.niche && <span style={{ fontSize: 11, color: "#4A5568" }}>{selected.niche}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onUpdate(selected.id, { status: "archived" })} title="Archiver" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#4A5568", display: "flex", alignItems: "center" }}>
                <Archive size={13} />
              </button>
              <button onClick={() => onDelete(selected.id)} title="Supprimer" style={{ background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.15)", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#FF4D6A", display: "flex", alignItems: "center" }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.045)", flexShrink: 0, padding: "0 24px" }}>
            {([
              { id: "analyse" as PanelTab, label: "Analyse IA" },
              { id: "message" as PanelTab, label: "Message" },
              { id: "notes"   as PanelTab, label: "Notes" },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setPanelTab(tab.id)}
                style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: panelTab === tab.id ? "#00D4FF" : "#4A5568", borderBottom: `2px solid ${panelTab === tab.id ? "#00D4FF" : "transparent"}`, fontWeight: panelTab === tab.id ? 500 : 400, marginBottom: -1 }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>

            {/* ── ANALYSE TAB ── */}
            {panelTab === "analyse" && (
              <div>
                {(selected.status === "new") && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Brain size={24} style={{ color: "#00D4FF", opacity: 0.6 }} />
                    </div>
                    <div style={{ fontSize: 14, color: "#8895A7", marginBottom: 6 }}>Prospect non analysé</div>
                    <div style={{ fontSize: 12, color: "#4A5568", marginBottom: 24, lineHeight: 1.6 }}>L'IA va calculer un score de pertinence,<br />générer un résumé et catégoriser ce prospect.</div>
                    <button onClick={() => onAnalyze(selected.id)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", border: "none", borderRadius: 9, padding: "11px 24px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
                      <Brain size={16} /> Analyser avec IA
                    </button>
                  </div>
                )}

                {selected.status === "analyzing" && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <Loader size={28} style={{ color: "#00D4FF", animation: "spin 1s linear infinite" }} />
                    </div>
                    <div style={{ fontSize: 14, color: "#00D4FF" }}>Analyse en cours…</div>
                    <div style={{ fontSize: 12, color: "#4A5568", marginTop: 6 }}>L'IA analyse le profil de {selected.name}</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {selected.status === "generating" && (
                  <div>
                    {/* Show analysis results */}
                    {selected.aiScore !== undefined && (
                      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                        <ScoreRing score={selected.aiScore} />
                        <div>
                          <div style={{ fontSize: 11, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Score de pertinence</div>
                          {selected.aiCategory && <div style={{ fontSize: 12.5, color: "#00D4FF", fontWeight: 500, marginBottom: 8 }}>{selected.aiCategory}</div>}
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {selected.aiTags?.map(tag => (
                              <span key={tag} style={{ fontSize: 10.5, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 4, padding: "2px 8px", color: "#00D4FF" }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Loader size={24} style={{ color: "#7C6AF7", animation: "spin 1s linear infinite" }} />
                      <div style={{ fontSize: 13, color: "#7C6AF7", marginTop: 10 }}>Génération du message en cours…</div>
                    </div>
                  </div>
                )}

                {!["new","analyzing","generating"].includes(selected.status) && selected.aiScore !== undefined && (
                  <div>
                    {/* Score + category */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                      <ScoreRing score={selected.aiScore} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Score de pertinence</div>
                        {selected.aiCategory && (
                          <div style={{ display: "inline-block", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.18)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#00D4FF", marginBottom: 10 }}>{selected.aiCategory}</div>
                        )}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {selected.aiTags?.map(tag => (
                            <span key={tag} style={{ fontSize: 10.5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: "2px 8px", color: "#6B7A99" }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {selected.aiSummary && (
                      <div style={{ background: "#0D1420", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                        <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Résumé IA</div>
                        <p style={{ fontSize: 13, color: "#B8C5D8", lineHeight: 1.7, margin: 0 }}>{selected.aiSummary}</p>
                      </div>
                    )}

                    {/* Generate message CTA — shown if no message yet */}
                    {!["draft","validated","sent","rejected"].includes(selected.status) && (
                      <div style={{ background: "rgba(124,106,247,0.06)", border: "1px solid rgba(124,106,247,0.15)", borderRadius: 10, padding: "16px" }}>
                        <div style={{ fontSize: 11.5, color: "#9B8FF5", fontWeight: 500, marginBottom: 12 }}>Générer un message personnalisé</div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                          {TONES.map(t => (
                            <button key={t.value} onClick={() => setTone(t.value)}
                              style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11.5, background: tone === t.value ? "rgba(124,106,247,0.2)" : "rgba(255,255,255,0.04)", color: tone === t.value ? "#9B8FF5" : "#4A5568", fontWeight: tone === t.value ? 500 : 400 }}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                          {MSG_TYPES.map(t => (
                            <button key={t.value} onClick={() => setMsgType(t.value)}
                              style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11.5, background: msgType === t.value ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)", color: msgType === t.value ? "#00D4FF" : "#4A5568" }}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <button onClick={handleGenerate}
                          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #7C6AF7 0%, #5A4FCC 100%)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          <MessageSquare size={14} /> Générer le message
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── MESSAGE TAB ── */}
            {panelTab === "message" && (
              <div>
                {!selected.generatedMessage && !["draft","validated","sent","rejected"].includes(selected.status) && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <MessageSquare size={28} style={{ color: "#3D4E6B", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, color: "#6B7A99", marginBottom: 6 }}>Aucun message généré</div>
                    <div style={{ fontSize: 12, color: "#4A5568", marginBottom: selected.aiScore !== undefined ? 20 : 0, lineHeight: 1.6 }}>
                      {selected.aiScore !== undefined ? "Configurez le ton et générez un message depuis l'onglet Analyse." : "Analysez d'abord le prospect avec l'IA."}
                    </div>
                    {selected.aiScore !== undefined && (
                      <div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
                          {TONES.map(t => (
                            <button key={t.value} onClick={() => setTone(t.value)}
                              style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11.5, background: tone === t.value ? "rgba(124,106,247,0.2)" : "rgba(255,255,255,0.04)", color: tone === t.value ? "#9B8FF5" : "#4A5568" }}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
                          {MSG_TYPES.map(t => (
                            <button key={t.value} onClick={() => setMsgType(t.value)}
                              style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11.5, background: msgType === t.value ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)", color: msgType === t.value ? "#00D4FF" : "#4A5568" }}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <button onClick={handleGenerate}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #7C6AF7 0%, #5A4FCC 100%)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          <MessageSquare size={14} /> Générer le message
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selected.generatedMessage && (
                  <div>
                    {/* Meta row */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
                      <div style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.18)", borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#9B8FF5" }}>✨ Message IA</div>
                      {selected.messageTone && <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#6B7A99" }}>{TONES.find(t=>t.value===selected.messageTone)?.label}</div>}
                      {selected.messageType && <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#6B7A99" }}>{MSG_TYPES.find(t=>t.value===selected.messageType)?.label}</div>}
                      <div style={{ flex: 1 }} />
                      <div style={{ background: STATUS_META[selected.status].bg, borderRadius: 5, padding: "2px 8px", fontSize: 10.5, color: STATUS_META[selected.status].color }}>{STATUS_META[selected.status].label}</div>
                    </div>

                    {/* Message body */}
                    {editingMsg ? (
                      <>
                        <textarea value={msgDraft} onChange={e => setMsgDraft(e.target.value)}
                          style={{ width: "100%", minHeight: 220, background: "#0D1420", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 10, padding: "16px", color: "#E8EDF5", fontSize: 13.5, lineHeight: 1.75, resize: "vertical", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button onClick={handleSaveEdit} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,255,163,0.1)", color: "#00FFA3", border: "1px solid rgba(0,255,163,0.2)", borderRadius: 7, padding: "7px 14px", fontSize: 12.5, cursor: "pointer" }}>
                            <Check size={13} /> Sauvegarder
                          </button>
                          <button onClick={() => setEditingMsg(false)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: "#6B7A99", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 14px", fontSize: 12.5, cursor: "pointer" }}>
                            <X size={13} /> Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ background: "#0D1420", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", fontSize: 13.5, color: "#B8C5D8", lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                        {selected.generatedMessage}
                      </div>
                    )}

                    {/* Actions */}
                    {!editingMsg && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button onClick={startEdit} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", color: "#8895A7", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}>
                          <Edit3 size={13} /> Modifier
                        </button>
                        <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "rgba(0,255,163,0.1)" : "rgba(255,255,255,0.04)", color: copied ? "#00FFA3" : "#8895A7", border: `1px solid ${copied ? "rgba(0,255,163,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}>
                          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copié !" : "Copier"}
                        </button>
                        {selected.status === "draft" && (
                          <>
                            <button onClick={handleApprove} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,255,163,0.1)", color: "#00FFA3", border: "1px solid rgba(0,255,163,0.2)", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                              <Check size={13} /> Approuver
                            </button>
                            <button onClick={handleReject} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,77,106,0.08)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, cursor: "pointer" }}>
                              <X size={13} /> Rejeter
                            </button>
                          </>
                        )}
                        {selected.status === "validated" && (
                          <button onClick={() => onUpdate(selected.id, { status: "sent" })} style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 14px rgba(0,212,255,0.2)" }}>
                            Marquer comme envoyé
                          </button>
                        )}
                        {/* Re-generate */}
                        <div style={{ flex: 1 }} />
                        <button onClick={handleGenerate} title="Régénérer" style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(124,106,247,0.08)", color: "#9B8FF5", border: "1px solid rgba(124,106,247,0.15)", borderRadius: 8, padding: "8px 12px", fontSize: 11.5, cursor: "pointer" }}>
                          ↺ Régénérer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── NOTES TAB ── */}
            {panelTab === "notes" && (
              <div>
                <div style={{ fontSize: 11, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Notes</div>
                <textarea value={notesText} onChange={e => setNotesText(e.target.value)} placeholder="Ajoutez vos notes sur ce prospect…"
                  style={{ width: "100%", minHeight: 160, background: "#0D1420", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px", color: "#D1D9E6", fontSize: 13, lineHeight: 1.75, resize: "vertical", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.25)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; handleSaveNotes(); }}
                />
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#3D4E6B" }}>Sauvegardé automatiquement à la perte de focus.</span>
                  <button onClick={handleSaveNotes} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.18)", borderRadius: 7, padding: "5px 12px", fontSize: 11.5, cursor: "pointer" }}>
                    <Check size={12} /> Sauvegarder
                  </button>
                </div>

                {/* Prospect info grid */}
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 11, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Informations</div>
                  <div style={{ background: "#0D1420", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                    {[
                      { label: "Nom",       value: selected.name },
                      { label: "Entreprise",value: selected.company },
                      { label: "Rôle",      value: selected.role },
                      { label: "Email",     value: selected.email },
                      { label: "Niche",     value: selected.niche },
                      { label: "Ajouté le", value: new Date(selected.addedAt).toLocaleDateString("fr-FR") },
                    ].filter(row => row.value).map((row, i, arr) => (
                      <div key={row.label} style={{ display: "flex", padding: "10px 14px", borderBottom: i < arr.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ fontSize: 11.5, color: "#4A5568", width: 90, flexShrink: 0 }}>{row.label}</span>
                        <span style={{ fontSize: 11.5, color: "#C8D4E8", fontFamily: row.label === "Email" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#2D3D5A" }}>
          <div style={{ textAlign: "center" }}>
            <Users size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 14, color: "#3D4E6B" }}>Sélectionnez un prospect</div>
          </div>
        </div>
      )}
    </div>
  );
}
