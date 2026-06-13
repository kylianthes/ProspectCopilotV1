import { useState } from "react";
import { Cpu, Save, Check, RefreshCw, AlertTriangle } from "lucide-react";
import type { AISettings, MessageTone, MessageType } from "../types";

interface Props {
  settings: AISettings;
  onSave: (s: AISettings) => void;
}

type Tab = "ia";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "ia",         label: "Moteur IA",  icon: Cpu },


];

const API_BASE_URL = "http://127.0.0.1:8000";

const MODELS = ["qwen2.5:1.5b", "qwen2.5:7b", "llama3:latest", "llama3.1:8b", "llama3.2:3b", "mistral:7b", "phi3:mini", "gemma2:9b"];
const TONES: { value: MessageTone; label: string; desc: string }[] = [
  { value: "professionnel", label: "Professionnel", desc: "Formel, B2B, respectueux" },
  { value: "amical",        label: "Amical",        desc: "Décontracté, accessible" },
  { value: "direct",        label: "Direct",        desc: "Court, orienté action" },
  { value: "chaleureux",    label: "Chaleureux",    desc: "Personnel, empathique" },
];
const MSG_TYPES: { value: MessageType; label: string }[] = [
  { value: "email",    label: "Email" },
  { value: "dm",       label: "DM" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
      <div style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function Row({ label, description, right, divider = true }: { label: string; description?: string; right: React.ReactNode; divider?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: divider ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
      <div>
        <div style={{ fontSize: 13, color: "#D1D9E6", fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 11.5, color: "#4A5568", marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 20 }}>{right}</div>
    </div>
  );
}


export function SettingsPage({ settings, onSave }: Props) {
  const [tab, setTab] = useState<Tab>("ia");
  const [local, setLocal] = useState<AISettings>(settings);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle");

  const patch = (p: Partial<AISettings>) => setLocal(prev => ({ ...prev, ...p }));

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testConnection = async () => {
    setTestStatus("testing");
    try {
      const params = new URLSearchParams({ model: local.model });
      const response = await fetch(`${API_BASE_URL}/ai/health?${params.toString()}`);
      const data = await response.json();
      setTestStatus(response.ok && data.online && data.model_available ? "ok" : "fail");
    } catch {
      setTestStatus("fail");
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* Left tab nav */}
      <div style={{ width: 200, flexShrink: 0, background: "#0C1220", borderRight: "1px solid rgba(255,255,255,0.045)", padding: "24px 10px" }}>
        <div style={{ fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 10px", marginBottom: 10 }}>Paramètres</div>
        {TABS.map(t => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, border: "none", cursor: "pointer", background: active ? "rgba(0,212,255,0.09)" : "transparent", color: active ? "#00D4FF" : "#4A5870", fontSize: 12.5, textAlign: "left", marginBottom: 1, fontWeight: active ? 500 : 400, position: "relative" }}
              onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.color = "#8895A7"; } }}
              onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#4A5870"; } }}
            >
              {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 16, borderRadius: "0 2px 2px 0", background: "#00D4FF" }} />}
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid rgba(255,255,255,0.045)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "#E8EDF5", fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>{TABS.find(t=>t.id===tab)?.label}</h1>
            <p style={{ color: "#4A5568", fontSize: 12.5, margin: "3px 0 0" }}>Configurez Prospect Copilot</p>
          </div>
          <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 7, background: saved ? "rgba(0,255,163,0.12)" : "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: saved ? "#00FFA3" : "#0A0E17", border: saved ? "1px solid rgba(0,255,163,0.25)" : "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {saved ? <Check size={14} /> : <Save size={14} />} {saved ? "Sauvegardé" : "Sauvegarder"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* -- IA TAB -- */}
          {tab === "ia" && (
            <>
              <Section title="Profil utilisateur">
                <Row label="Nom utilisateur" description="Nom affiché dans les paramètres locaux" right={
                  <input value={local.userName} onChange={e => patch({ userName: e.target.value })}
                    placeholder="Votre nom"
                    style={{ width: 220, background: "#0C1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 12px", color: "#E8EDF5", fontSize: 12.5, outline: "none" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(0,212,255,0.3)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                } divider={false} />
              </Section>

              <Section title="Connexion Ollama">
                <Row label="Endpoint Ollama" description="Serveur local utilisé par Prospect Copilot" right={
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ width: 220, background: "#0C1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 12px", color: "#6B7A99", fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace" }}>http://127.0.0.1:11434</span>
                    <button onClick={testConnection} style={{ display: "flex", alignItems: "center", gap: 5, background: testStatus === "ok" ? "rgba(0,255,163,0.1)" : testStatus === "fail" ? "rgba(255,77,106,0.1)" : "rgba(255,255,255,0.05)", color: testStatus === "ok" ? "#00FFA3" : testStatus === "fail" ? "#FF4D6A" : "#6B7A99", border: `1px solid ${testStatus === "ok" ? "rgba(0,255,163,0.2)" : testStatus === "fail" ? "rgba(255,77,106,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 7, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
                      {testStatus === "testing" ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : testStatus === "ok" ? <Check size={12} /> : testStatus === "fail" ? <AlertTriangle size={12} /> : null}
                      {testStatus === "idle" ? "Tester" : testStatus === "testing" ? "Test..." : testStatus === "ok" ? "Connecté" : "Erreur"}
                    </button>
                    <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
                  </div>
                } />
                <Row label="Modèle" description="Modèle Ollama à utiliser pour l'analyse et la génération" right={
                  <select value={local.model} onChange={e => patch({ model: e.target.value })}
                    style={{ width: 200, background: "#0C1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 12px", color: "#E8EDF5", fontSize: 12.5, outline: "none", fontFamily: "'JetBrains Mono', monospace" }}>
                    {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                } divider={false} />
              </Section>

              <Section title="Defaults de génération">
                <Row label="Ton par défaut" description="Ton utilisé si non spécifié manuellement" right={
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {TONES.map(t => (
                      <button key={t.value} onClick={() => patch({ defaultTone: t.value })}
                        style={{ padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, background: local.defaultTone === t.value ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)", color: local.defaultTone === t.value ? "#00D4FF" : "#4A5568", fontWeight: local.defaultTone === t.value ? 500 : 400 }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                } />
                <Row label="Type de message par défaut" right={
                  <div style={{ display: "flex", gap: 6 }}>
                    {MSG_TYPES.map(t => (
                      <button key={t.value} onClick={() => patch({ defaultMessageType: t.value })}
                        style={{ padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, background: local.defaultMessageType === t.value ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)", color: local.defaultMessageType === t.value ? "#00D4FF" : "#4A5568" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                } divider={false} />
              </Section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
