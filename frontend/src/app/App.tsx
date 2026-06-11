import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { ProspectsPage } from "./components/ProspectsPage";
import { MessagesPage } from "./components/MessagesPage";
import { SettingsPage } from "./components/SettingsPage";
import { DesignSystemPage } from "./components/DesignSystemPage";
import { AddProspectModal } from "./components/AddProspectModal";
import type { Page, Prospect, MessageTone, MessageType, AISettings } from "./types";
import { MOCK_PROSPECTS, DEFAULT_AI_SETTINGS, AI_ANALYSIS_POOL, MESSAGE_TEMPLATES } from "./data";

function generateId() {
  return "p" + Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [prospects, setProspects] = useState<Prospect[]>(MOCK_PROSPECTS);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiOnline] = useState(true); // simulated

  const updateProspect = (id: string, patch: Partial<Prospect>) =>
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));

  const addProspect = (data: Omit<Prospect, "id" | "status" | "addedAt">) => {
    const newP: Prospect = { ...data, id: generateId(), status: "new", addedAt: new Date().toISOString(), notes: data.notes ?? "" };
    setProspects(prev => [newP, ...prev]);
    setShowAddModal(false);
  };

  const deleteProspect = (id: string) =>
    setProspects(prev => prev.filter(p => p.id !== id));

  const analyzeProspect = (id: string) => {
    updateProspect(id, { status: "analyzing" });
    const mock = AI_ANALYSIS_POOL[Math.floor(Math.random() * AI_ANALYSIS_POOL.length)];
    setTimeout(() => {
      updateProspect(id, { status: "analyzed", ...mock, aiAnalyzedAt: new Date().toISOString() });
    }, 1800);
  };

  const generateMessage = (id: string, tone: MessageTone, type: MessageType) => {
    const p = prospects.find(pr => pr.id === id);
    if (!p) return;
    updateProspect(id, { status: "generating", messageTone: tone, messageType: type });
    const template = MESSAGE_TEMPLATES[tone];
    const message = template
      .replace(/{name}/g, p.name.split(" ")[0])
      .replace(/{niche}/g, p.niche);
    setTimeout(() => {
      updateProspect(id, { status: "draft", generatedMessage: message, messageGeneratedAt: new Date().toISOString() });
    }, 1200);
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
              onSave={setAiSettings}
            />
          )}
          {page === "design-system" && <DesignSystemPage />}
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
