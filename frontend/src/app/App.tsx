import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { ProspectsPage } from "./components/ProspectsPage";
import { MessagesPage } from "./components/MessagesPage";
import { SettingsPage } from "./components/SettingsPage";
import { AddProspectModal } from "./components/AddProspectModal";
import type { Page, Prospect, MessageTone, MessageType, AISettings } from "./types";
import { DEFAULT_AI_SETTINGS } from "./data";

const API_BASE_URL = "http://127.0.0.1:8000";
const SETTINGS_STORAGE_KEY = "prospect-copilot-settings";

interface ApiProspect {
  id: number;
  name: string;
  company?: string | null;
  bio: string;
  source?: string | null;
  score?: number | null;
  summary?: string | null;
  category?: string | null;
  dm_message?: string | null;
  email_message?: string | null;
  status: Prospect["status"];
  created_at: string;
}

function fromApiProspect(p: ApiProspect): Prospect {
  return {
    id: String(p.id),
    name: p.name,
    company: p.company ?? undefined,
    niche: p.source || p.category || "Non classe",
    notes: p.bio,
    status: p.status,
    addedAt: p.created_at,
    aiScore: p.score !== null && p.score !== undefined ? p.score * 10 : undefined,
    aiSummary: p.summary ?? undefined,
    aiCategory: p.category ?? undefined,
    generatedMessage: p.email_message || p.dm_message || undefined,
    messageType: p.email_message ? "email" : p.dm_message ? "dm" : undefined,
  };
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_AI_SETTINGS;
    try {
      return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_AI_SETTINGS;
    }
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiOnline, setAiOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProspects = async () => {
    const response = await fetch(`${API_BASE_URL}/prospects`);
    if (!response.ok) throw new Error("Unable to load prospects");
    const data: ApiProspect[] = await response.json();
    setProspects(data.map(fromApiProspect));
  };

  useEffect(() => {
    loadProspects().catch(() => setErrorMessage("Impossible de charger les prospects. Vérifiez que le backend est lancé."));

    const checkAiHealth = () => {
      const params = new URLSearchParams({ model: aiSettings.model });
      fetch(`${API_BASE_URL}/ai/health?${params.toString()}`)
        .then(response => response.json())
        .then(data => setAiOnline(Boolean(data.online && data.model_available)))
        .catch(() => setAiOnline(false));
    };

    checkAiHealth();
    const interval = window.setInterval(checkAiHealth, 10000);
    return () => window.clearInterval(interval);
  }, [aiSettings.model]);

  const saveSettings = (settings: AISettings) => {
    setAiSettings(settings);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };

  const updateProspect = async (id: string, patch: Partial<Prospect>) => {
    const previousProspects = prospects;
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));

    const currentProspect = prospects.find(p => p.id === id);
    const payload: Record<string, unknown> = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.company !== undefined) payload.company = patch.company;
    if (patch.notes !== undefined) payload.bio = patch.notes;
    if (patch.niche !== undefined) payload.source = patch.niche;
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.aiScore !== undefined) payload.score = Math.round(patch.aiScore / 10);
    if (patch.aiSummary !== undefined) payload.summary = patch.aiSummary;
    if (patch.aiCategory !== undefined) payload.category = patch.aiCategory;
    if (patch.generatedMessage !== undefined) {
      const messageType = patch.messageType ?? currentProspect?.messageType;
      if (messageType === "dm") payload.dm_message = patch.generatedMessage;
      else payload.email_message = patch.generatedMessage;
    }

    if (Object.keys(payload).length === 0) return;
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const updated: ApiProspect = await response.json();
        setProspects(prev => prev.map(p => p.id === id ? fromApiProspect(updated) : p));
        setErrorMessage(null);
        return;
      }
      setErrorMessage("Impossible de sauvegarder les modifications du prospect.");
      setProspects(previousProspects);
      await loadProspects().catch(() => undefined);
    } catch {
      setErrorMessage("Impossible de contacter le backend pour sauvegarder le prospect.");
      setProspects(previousProspects);
      await loadProspects().catch(() => undefined);
    }
  };

  const addProspect = async (data: Omit<Prospect, "id" | "status" | "addedAt">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          bio: data.notes?.trim() || data.niche,
          source: data.niche,
        }),
      });
      if (response.ok) {
        const created: ApiProspect = await response.json();
        setProspects(prev => [fromApiProspect(created), ...prev]);
        setErrorMessage(null);
        setShowAddModal(false);
      } else {
        setErrorMessage("Impossible de créer le prospect. Vérifiez les champs obligatoires.");
      }
    } catch {
      setErrorMessage("Impossible de contacter le backend pour créer le prospect.");
    }
  };

  const deleteProspect = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProspects(prev => prev.filter(p => p.id !== id));
        setErrorMessage(null);
      } else {
        setErrorMessage("Impossible de supprimer le prospect.");
      }
    } catch {
      setErrorMessage("Impossible de contacter le backend pour supprimer le prospect.");
    }
  };

  const importCsv = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/import-csv`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await loadProspects();
        setErrorMessage(null);
      } else {
        const detail = await response.json().catch(() => null);
        setErrorMessage(`Import CSV impossible: ${detail?.detail ?? "format invalide"}`);
      }
    } catch {
      setErrorMessage("Impossible de contacter le backend pour importer le CSV.");
    }
  };

  const analyzeProspect = async (id: string) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status: "analyzing" } : p));
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: aiSettings.model }),
      });
      if (!response.ok) throw new Error("Unable to analyze prospect");
      const analyzed: ApiProspect = await response.json();
      setProspects(prev => prev.map(p => p.id === id ? fromApiProspect(analyzed) : p));
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Analyse IA impossible. Vérifiez qu'Ollama est lancé et que le modèle sélectionné existe.");
      setAiOnline(false);
      setProspects(prev => prev.map(p => p.id === id ? { ...p, status: "new" } : p));
    }
  };

  const generateMessage = async (id: string, tone: MessageTone, type: MessageType) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status: "generating", messageTone: tone, messageType: type } : p));
    try {
      const response = await fetch(`${API_BASE_URL}/prospects/${id}/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: aiSettings.model, tone }),
      });
      if (!response.ok) throw new Error("Unable to generate message");
      const generated: ApiProspect = await response.json();
      const mapped = fromApiProspect(generated);
      setProspects(prev => prev.map(p => p.id === id ? {
        ...mapped,
        generatedMessage: type === "dm" ? generated.dm_message ?? undefined : generated.email_message ?? undefined,
        messageType: type,
        messageTone: tone,
      } : p));
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Génération du message impossible. Vérifiez qu'Ollama est lancé et que le modèle sélectionné existe.");
      setAiOnline(false);
      setProspects(prev => prev.map(p => p.id === id ? { ...p, status: "analyzed" } : p));
    }
  };

  const draftCount = prospects.filter(p => p.status === "draft").length;
  const newCount = prospects.filter(p => p.status === "new").length;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#0F1420", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", color: "#E8EDF5" }}>
      <Sidebar
        page={page}
        onNavigate={setPage}
        draftCount={draftCount}
        newCount={newCount}
        totalCount={prospects.length}
        aiOnline={aiOnline}
        userName={aiSettings.userName}
        aiModel={aiSettings.model}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 46, borderBottom: "1px solid rgba(255,255,255,0.045)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", flexShrink: 0, background: "rgba(8,12,22,0.9)", backdropFilter: "blur(12px)" }}>
          <div />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#1E2D45", letterSpacing: "0.05em" }}>
            prospect-copilot / {page}
          </div>
          <div />
        </div>
        {errorMessage && (
          <div style={{ minHeight: 38, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "8px 22px", background: "rgba(255,77,106,0.09)", borderBottom: "1px solid rgba(255,77,106,0.16)", color: "#FFB3C0", fontSize: 12.5, flexShrink: 0 }}>
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "#FFB3C0", padding: "4px 9px", fontSize: 11.5, cursor: "pointer" }}>Fermer</button>
          </div>
        )}

        {/* Page */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {page === "dashboard" && (
            <DashboardPage
              prospects={prospects}
              onNavigate={setPage}
              onAddProspect={() => setShowAddModal(true)}
            />
          )}
          {page === "prospects" && (
            <ProspectsPage
              prospects={prospects}
              onUpdate={updateProspect}
              onAdd={() => setShowAddModal(true)}
              onDelete={deleteProspect}
              onAnalyze={analyzeProspect}
              onGenerate={generateMessage}
              onImportCsv={importCsv}
              defaultTone={aiSettings.defaultTone}
              defaultMessageType={aiSettings.defaultMessageType}
            />
          )}
          {page === "messages" && (
            <MessagesPage
              prospects={prospects}
              onUpdate={updateProspect}
            />
          )}
          {page === "settings" && (
            <SettingsPage
              settings={aiSettings}
              onSave={saveSettings}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddProspectModal
          onClose={() => setShowAddModal(false)}
          onAdd={addProspect}
        />
      )}
    </div>
  );
}
