import { useState } from "react";
import { X, Check } from "lucide-react";
import type { Prospect } from "../types";

interface Props {
  onClose: () => void;
  onAdd: (p: Omit<Prospect, "id" | "status" | "addedAt">) => void;
}

export function AddProspectModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({ name: "", company: "", role: "", email: "", linkedin: "", niche: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patch = (k: keyof typeof form, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => { const c = {...e}; delete c[k]; return c; }); };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.niche.trim()) errs.niche = "La niche est requise";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ name: form.name.trim(), company: form.company || undefined, role: form.role || undefined, email: form.email || undefined, linkedin: form.linkedin || undefined, niche: form.niche.trim(), notes: form.notes });
  };

  const inputStyle = (err?: string): React.CSSProperties => ({ width: "100%", background: "#0C1420", border: `1px solid ${err ? "rgba(255,77,106,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "9px 12px", color: "#E8EDF5", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
      <div style={{ background: "#131925", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, width: 520, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <div>
            <div style={{ fontSize: 16, color: "#E8EDF5", fontWeight: 600 }}>Ajouter un prospect</div>
            <div style={{ fontSize: 12, color: "#4A5568", marginTop: 3 }}>Saisie manuelle — les champs marqués * sont obligatoires</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5568", padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Nom complet *</label>
              <input value={form.name} onChange={e => patch("name", e.target.value)} placeholder="Léa Fontaine" style={inputStyle(errors.name)} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { if(!errors.name) e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
              {errors.name && <div style={{ fontSize: 11, color: "#FF4D6A", marginTop: 3 }}>{errors.name}</div>}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Niche / Secteur *</label>
              <input value={form.niche} onChange={e => patch("niche", e.target.value)} placeholder="Finance personnelle" style={inputStyle(errors.niche)} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { if(!errors.niche) e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
              {errors.niche && <div style={{ fontSize: 11, color: "#FF4D6A", marginTop: 3 }}>{errors.niche}</div>}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Entreprise</label>
              <input value={form.company} onChange={e => patch("company", e.target.value)} placeholder="Investissements LF" style={inputStyle()} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Rôle</label>
              <input value={form.role} onChange={e => patch("role", e.target.value)} placeholder="Fondatrice" style={inputStyle()} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Email</label>
              <input value={form.email} onChange={e => patch("email", e.target.value)} placeholder="contact@example.com" style={inputStyle()} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>LinkedIn</label>
              <input value={form.linkedin} onChange={e => patch("linkedin", e.target.value)} placeholder="linkedin.com/in/…" style={inputStyle()} onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#6B7A99", display: "block", marginBottom: 5 }}>Notes</label>
            <textarea value={form.notes} onChange={e => patch("notes", e.target.value)} placeholder="Contexte, observations, source…" rows={3}
              style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor="rgba(0,212,255,0.3)"; }} onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "14px 24px 20px" }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "#8895A7", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "11px", fontSize: 13.5, cursor: "pointer" }}>Annuler</button>
          <button onClick={handleSubmit} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", border: "none", borderRadius: 9, padding: "11px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 16px rgba(0,212,255,0.25)" }}>
            <Check size={15} /> Ajouter le prospect
          </button>
        </div>
      </div>
    </div>
  );
}
