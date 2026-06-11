// Design System — Prospect Pro
// Catalogue visuel complet : tokens, typographie, composants, icônes
import { useState } from "react";
import { NetworkIcon, NetworkBadge } from "./NetworkBadge";
import type { NetworkId } from "../types";
import {
  Home, Search, MessageSquare, Settings, Send, SkipForward, Edit3,
  CheckCircle, Clock, AlertCircle, Star, Eye, Trash2, Plus, X, Check,
  ChevronDown, ChevronRight, Bell, Shield, Zap, User, Save, Filter,
  BarChart2, TrendingUp, Users, Wifi, WifiOff, LogOut, Download,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  "Fond principal": [
    { name: "surface-0",  hex: "#080C16", label: "App background deepest" },
    { name: "surface-1",  hex: "#0F1117", label: "Page background" },
    { name: "surface-2",  hex: "#161B27", label: "Card" },
    { name: "surface-3",  hex: "#1C2333", label: "Input / popover" },
    { name: "sidebar-bg", hex: "#090D18", label: "Sidebar" },
    { name: "panel-bg",   hex: "#0C1220", label: "Left panels" },
  ],
  "Bordures": [
    { name: "border-1", hex: "#131E30",               label: "Sidebar divider" },
    { name: "border-2", hex: "rgba(255,255,255,0.07)", label: "Default border" },
    { name: "border-3", hex: "rgba(255,255,255,0.05)", label: "Subtle border" },
    { name: "border-4", hex: "rgba(255,255,255,0.04)", label: "Ultra subtle" },
  ],
  "Texte": [
    { name: "text-primary",   hex: "#E8EDF5", label: "Titles / primary" },
    { name: "text-secondary", hex: "#C8D4E8", label: "Body" },
    { name: "text-muted",     hex: "#8895A7", label: "Muted" },
    { name: "text-faint",     hex: "#6B7A99", label: "Faint" },
    { name: "text-ghost",     hex: "#4A5568", label: "Ghost" },
    { name: "text-disabled",  hex: "#3D4E6B", label: "Disabled / empty" },
    { name: "text-deep",      hex: "#2D3D5A", label: "Deep muted" },
    { name: "text-darkest",   hex: "#1E2D45", label: "Section labels" },
  ],
  "Accent primaire — Cyan": [
    { name: "cyan",          hex: "#00D4FF", label: "Primary action" },
    { name: "cyan-dim",      hex: "rgba(0,212,255,0.12)", label: "Subtle bg" },
    { name: "cyan-hover",    hex: "rgba(0,212,255,0.09)", label: "Nav active" },
    { name: "cyan-dark",     hex: "#0094CC", label: "Gradient end" },
  ],
  "Statuts": [
    { name: "success",  hex: "#00FFA3", label: "Connected / Sent" },
    { name: "error",    hex: "#FF4D6A", label: "Error / Danger" },
    { name: "warning",  hex: "#FFB800", label: "Pending / Warning" },
    { name: "ai",       hex: "#7C6AF7", label: "IA / Purple" },
  ],
  "Réseaux": [
    { name: "instagram", hex: "#E1306C",  label: "Instagram" },
    { name: "tiktok",    hex: "#69C9D0",  label: "TikTok" },
    { name: "linkedin",  hex: "#0A66C2",  label: "LinkedIn" },
    { name: "twitter",   hex: "#E7E9EA",  label: "X / Twitter" },
    { name: "youtube",   hex: "#FF0000",  label: "YouTube" },
  ],
};

const TYPOGRAPHY = [
  { name: "Display",     size: "24px / 20px",  weight: "600",  font: "Inter",          sample: "Prospect Pro — Enterprise" },
  { name: "Title",       size: "19–20px",       weight: "600",  font: "Inter",          sample: "Messages & Envoi" },
  { name: "Heading",     size: "15px",          weight: "600",  font: "Inter",          sample: "Léa Fontaine" },
  { name: "Body",        size: "13–13.5px",     weight: "400",  font: "Inter",          sample: "J'ai vu ton profil sur la niche Finance…" },
  { name: "Label",       size: "12–12.5px",     weight: "500",  font: "Inter",          sample: "Tout sélectionner (4)" },
  { name: "Small",       size: "11–11.5px",     weight: "400",  font: "Inter",          sample: "Paramètre de compte" },
  { name: "Caption",     size: "10–10.5px",     weight: "400",  font: "Inter",          sample: "En attente · 2 min" },
  { name: "Mono large",  size: "16px",          weight: "600",  font: "JetBrains Mono", sample: "94" },
  { name: "Mono body",   size: "12–13px",       weight: "400",  font: "JetBrains Mono", sample: "@alexandre_l" },
  { name: "Mono label",  size: "9–11px",        weight: "400",  font: "JetBrains Mono", sample: "NAVIGATION" },
];

const RADII = [
  { name: "xs",   px: 5,  label: "Status badges" },
  { name: "sm",   px: 6,  label: "Tags / chips" },
  { name: "md",   px: 7,  label: "Inputs / buttons sm" },
  { name: "lg",   px: 9,  label: "Buttons / cards" },
  { name: "xl",   px: 12, label: "Section cards" },
  { name: "2xl",  px: 14, label: "Modals" },
  { name: "full", px: 50, label: "Avatars / dots" },
];

const SHADOWS = [
  { name: "glow-cyan",    css: "0 0 16px rgba(0,212,255,0.28)",   label: "Logo / primary CTA" },
  { name: "glow-cyan-lg", css: "0 0 18px rgba(0,212,255,0.25)",   label: "Send button" },
  { name: "glow-green",   css: "0 0 5px #00FFA3",                  label: "Connected dot" },
  { name: "modal",        css: "0 24px 60px rgba(0,0,0,0.5)",      label: "Modal backdrop" },
  { name: "card",         css: "0 4px 20px rgba(0,0,0,0.25)",      label: "Elevated card" },
];

const SPACING = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 40, 48];

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────
function DSSection({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <div style={{
        fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
      }}>{title}</div>
      {children}
    </section>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px", ...style }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Colour Swatch
// ─────────────────────────────────────────────────────────────────────────────
function Swatch({ hex, name, label }: { hex: string; name: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const isLight = hex.startsWith("rgba(255") || hex === "#E7E9EA" || hex === "#E8EDF5" || hex === "#C8D4E8";
  return (
    <div onClick={copy} style={{ cursor: "pointer", userSelect: "none" }}>
      <div style={{
        width: "100%", height: 54, borderRadius: 9,
        background: hex,
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 7,
        transition: "transform 0.1s",
        boxShadow: copied ? `0 0 0 2px #00D4FF` : "none",
      }}>
        {copied && (
          <span style={{ fontSize: 10, color: isLight ? "#0A0E17" : "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
            ✓ copié
          </span>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: "#C8D4E8", fontWeight: 500 }}>{name}</div>
      <div style={{ fontSize: 9.5, color: "#4A5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{hex}</div>
      <div style={{ fontSize: 9.5, color: "#3D4E6B", marginTop: 1 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Button specimens
// ─────────────────────────────────────────────────────────────────────────────
function ButtonSpec({ label, style, icon }: { label: string; style: React.CSSProperties; icon?: React.ReactNode }) {
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 7, border: "none",
      cursor: "pointer", fontFamily: "'Inter', sans-serif", ...style,
    }}>
      {icon}{label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge specimen
// ─────────────────────────────────────────────────────────────────────────────
function BadgeSpec({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg, borderRadius: 5, padding: "3px 8px",
      fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace",
    }}>
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  "Couleurs", "Typographie", "Espacements", "Rayons & Ombres",
  "Boutons", "Badges & Statuts", "Inputs & Formulaires",
  "Cartes statistiques", "Réseaux", "Icônes", "Navigation"
];

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("Couleurs");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: "#0F1117" }}>

      {/* ── Sticky sidebar nav ── */}
      <div style={{
        width: 180, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.045)",
        padding: "20px 10px", overflowY: "auto",
        background: "#0C1220",
      }}>
        <div style={{ fontSize: 9, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 10px", marginBottom: 10 }}>
          Design System
        </div>
        {SECTIONS.map(s => {
          const active = activeSection === s;
          return (
            <button key={s} onClick={() => scrollTo(s)} style={{
              width: "100%", display: "block", textAlign: "left",
              padding: "7px 10px", borderRadius: 6, border: "none",
              background: active ? "rgba(0,212,255,0.09)" : "transparent",
              color: active ? "#00D4FF" : "#4A5870", fontSize: 12, cursor: "pointer",
              marginBottom: 1, position: "relative",
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#8895A7"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#4A5870"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
            >
              {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 14, borderRadius: "0 2px 2px 0", background: "#00D4FF" }} />}
              {s}
            </button>
          );
        })}

        {/* Meta */}
        <div style={{ marginTop: 24, padding: "0 10px" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />
          <div style={{ fontSize: 10, color: "#3D4E6B", lineHeight: 1.6 }}>
            Prospect Pro<br />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1E2D45" }}>v1.0 — 2026</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: "linear-gradient(135deg, #00D4FF 0%, #0080BB 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(0,212,255,0.28)",
            }}>
              <svg width={20} height={20} viewBox="0 0 18 18" fill="none">
                <path d="M3 10L7 5.5L11 9.5L15 4" stroke="#0A0E17" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="15" cy="14" r="2.4" fill="#0A0E17" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 22, color: "#E8EDF5", fontWeight: 700, letterSpacing: "-0.02em" }}>Design System</div>
              <div style={{ fontSize: 12, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>Prospect Pro — Enterprise</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Catalogue complet des tokens visuels, composants réutilisables et conventions de style.
            Référence unique pour la reproduction fidèle en React / CustomTkinter / Tauri.
          </p>
          {/* Quick stats */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {[
              { v: "24", l: "Composants" },
              { v: "40+", l: "Tokens couleur" },
              { v: "5", l: "Réseaux" },
              { v: "5", l: "Pages" },
            ].map(s => (
              <div key={s.l} style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "8px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 16, color: "#00D4FF", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.v}</div>
                <div style={{ fontSize: 10.5, color: "#3D4E6B", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            1. COULEURS
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="01 — Couleurs" id="Couleurs">
          {Object.entries(COLORS).map(([group, swatches]) => (
            <div key={group} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 12, fontWeight: 500 }}>{group}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
                {swatches.map(s => <Swatch key={s.name} {...s} />)}
              </div>
            </div>
          ))}
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            2. TYPOGRAPHIE
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="02 — Typographie" id="Typographie">
          <Card>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", width: 90 }}>NOM</div>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", width: 80 }}>TAILLE</div>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", width: 60 }}>POIDS</div>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", width: 110 }}>POLICE</div>
              <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>EXEMPLE</div>
            </div>
            {TYPOGRAPHY.map((t, i) => (
              <div key={t.name} style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px 0", borderBottom: i < TYPOGRAPHY.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div style={{ fontSize: 11, color: "#6B7A99", width: 90, flexShrink: 0 }}>{t.name}</div>
                <div style={{ fontSize: 10.5, color: "#4A5568", fontFamily: "'JetBrains Mono', monospace", width: 80, flexShrink: 0 }}>{t.size}</div>
                <div style={{ fontSize: 10.5, color: "#4A5568", fontFamily: "'JetBrains Mono', monospace", width: 60, flexShrink: 0 }}>{t.weight}</div>
                <div style={{ fontSize: 10.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", width: 110, flexShrink: 0 }}>{t.font}</div>
                <div style={{
                  flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  fontFamily: t.font === "JetBrains Mono" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                  fontSize: t.size.split("–")[0].replace("px","") + "px",
                  fontWeight: t.weight,
                  color: "#D1D9E6",
                }}>
                  {t.sample}
                </div>
              </div>
            ))}
          </Card>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            3. ESPACEMENTS
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="03 — Espacements" id="Espacements">
          <Card>
            <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 16 }}>Multiples de 2px — base unit : 2px</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {SPACING.map(px => (
                <div key={px} style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: 48, marginBottom: 6 }}>
                    <div style={{ width: Math.min(px, 40), height: px, background: "rgba(0,212,255,0.2)", borderRadius: 2, border: "1px solid rgba(0,212,255,0.3)" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#00D4FF", fontFamily: "'JetBrains Mono', monospace" }}>{px}px</div>
                </div>
              ))}
            </div>
          </Card>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            4. RAYONS & OMBRES
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="04 — Rayons & Ombres" id="Rayons & Ombres">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Border Radius</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {RADII.map(r => (
                  <div key={r.name} style={{ textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: r.px, marginBottom: 8 }} />
                    <div style={{ fontSize: 10.5, color: "#00D4FF", fontFamily: "'JetBrains Mono', monospace" }}>r-{r.name}</div>
                    <div style={{ fontSize: 9.5, color: "#3D4E6B" }}>{r.px}px</div>
                    <div style={{ fontSize: 9, color: "#2D3D5A", marginTop: 1 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Ombres & Glows</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SHADOWS.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#161B27", boxShadow: s.css, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11.5, color: "#D1D9E6", fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 9.5, color: "#2D3D5A", marginTop: 2 }}>{s.css}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            5. BOUTONS
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="05 — Boutons" id="Boutons">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 16, fontWeight: 500 }}>Variantes primaires</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ButtonSpec label="Envoyer" icon={<Send size={13} />} style={{ background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 600, boxShadow: "0 0 18px rgba(0,212,255,0.25)" }} />
                <ButtonSpec label="Sauvegarder" icon={<Save size={13} />} style={{ background: "linear-gradient(135deg, #00D4FF 0%, #0094CC 100%)", color: "#0A0E17", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600 }} />
                <ButtonSpec label="Ajouter" icon={<Plus size={13} />} style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 500 }} />
                <ButtonSpec label="Scraper Instagram" style={{ background: "rgba(225,48,108,0.1)", color: "#E1306C", border: "1px solid rgba(225,48,108,0.2)", borderRadius: 7, padding: "7px 14px", fontSize: 12 }} />
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 16, fontWeight: 500 }}>Variantes secondaires</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ButtonSpec label="Modifier" icon={<Edit3 size={13} />} style={{ background: "rgba(255,255,255,0.04)", color: "#8895A7", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "7px 13px", fontSize: 12.5 }} />
                <ButtonSpec label="Skip" icon={<SkipForward size={13} />} style={{ background: "rgba(74,85,104,0.15)", color: "#6B7A99", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 500 }} />
                <ButtonSpec label="Supprimer" style={{ background: "rgba(255,77,106,0.1)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.2)", borderRadius: 7, padding: "6px 14px", fontSize: 12.5 }} />
                <ButtonSpec label="Annuler" icon={<X size={13} />} style={{ background: "transparent", color: "#6B7A99", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 14px", fontSize: 12.5 }} />
              </div>
            </Card>
            <Card style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 16, fontWeight: 500 }}>Boutons icon-only / petits</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: <Eye size={13} />, label: "Voir",       color: "#00D4FF", bg: "rgba(0,212,255,0.08)" },
                  { icon: <Star size={13} />, label: "Favori",    color: "#FFB800", bg: "rgba(255,184,0,0.08)" },
                  { icon: <Trash2 size={13} />, label: "Supprimer", color: "#FF4D6A", bg: "rgba(255,77,106,0.08)" },
                  { icon: <Plus size={13} />, label: "File",       color: "#00FFA3", bg: "rgba(0,255,163,0.08)" },
                  { icon: <Download size={13} />, label: "Export", color: "#8895A7", bg: "rgba(255,255,255,0.05)" },
                ].map(b => (
                  <button key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, background: b.bg, color: b.color, border: `1px solid ${b.color}22`, borderRadius: 7, padding: "5px 10px", fontSize: 11.5, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                    {b.icon}{b.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            6. BADGES & STATUTS
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="06 — Badges & Statuts" id="Badges & Statuts">
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <BadgeSpec label="En attente" color="#FFB800" bg="rgba(255,184,0,0.08)" />
              <BadgeSpec label="Envoyé"     color="#00FFA3" bg="rgba(0,255,163,0.08)" />
              <BadgeSpec label="Ignoré"     color="#3D4E6B" bg="rgba(74,85,104,0.15)" />
              <BadgeSpec label="Erreur"     color="#FF4D6A" bg="rgba(255,77,106,0.1)" />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.15)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#7C6AF7" }}>✨ Message IA</div>
              <div style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 7, padding: "4px 12px", color: "#00D4FF", fontSize: 12.5, fontWeight: 600 }}>Enterprise</div>
            </div>
            <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 12, fontWeight: 500 }}>Indicateurs de connexion</div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { label: "Connecté",     color: "#00FFA3", glow: true },
                { label: "Déconnecté",   color: "#2D3D5A", glow: false },
                { label: "Erreur",       color: "#FF4D6A", glow: false },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, boxShadow: s.glow ? `0 0 5px ${s.color}` : "none" }} />
                  <span style={{ fontSize: 12, color: "#8895A7" }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 10, fontWeight: 500 }}>Score prospect</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[94, 87, 78, 65, 45].map(score => {
                  const color = score >= 90 ? "#00FFA3" : score >= 75 ? "#00D4FF" : score >= 60 ? "#FFB800" : "#FF4D6A";
                  return (
                    <div key={score} style={{ background: `${color}15`, border: `1px solid ${color}33`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {score}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            7. INPUTS & FORMULAIRES
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="07 — Inputs & Formulaires" id="Inputs & Formulaires">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Text inputs</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "#4A5568", marginBottom: 5 }}>Repos</div>
                  <input readOnly placeholder="Rechercher un prospect..." style={{ width: "100%", background: "#0C1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 14px", color: "#6B7A99", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: "#4A5568", marginBottom: 5 }}>Focus</div>
                  <input readOnly defaultValue="@alexandre_l" style={{ width: "100%", background: "#0C1420", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 8, padding: "9px 14px", color: "#E8EDF5", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: "#4A5568", marginBottom: 5 }}>Désactivé</div>
                  <input readOnly disabled placeholder="Non disponible" style={{ width: "100%", background: "#090D18", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "9px 14px", color: "#2D3D5A", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Select, Textarea, Toggle</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <select style={{ width: "100%", background: "#0C1420", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#E8EDF5", fontSize: 13, outline: "none", fontFamily: "'Inter', sans-serif" }}>
                  <option>Professionnel</option>
                  <option>Amical &amp; décontracté</option>
                </select>
                <textarea readOnly rows={3} defaultValue="Salut Hugo 🎯&#10;Impressionnant ce que tu construis !" style={{ width: "100%", background: "#0D1420", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", color: "#B8C5D8", fontSize: 13, lineHeight: 1.75, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#D1D9E6" }}>Passer le week-end</span>
                  <div style={{ width: 42, height: 22, borderRadius: 11, background: "#00D4FF", position: "relative", cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: 23, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#D1D9E6" }}>Retry automatique</span>
                  <div style={{ width: 42, height: 22, borderRadius: 11, background: "#1E2D45", position: "relative", cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
                  </div>
                </div>
              </div>
            </Card>
            <Card style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Checkbox & Radio</div>
              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "#00D4FF", width: 14, height: 14 }} />
                  <span style={{ fontSize: 12.5, color: "#D1D9E6" }}>Coché</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: "#00D4FF", width: 14, height: 14 }} />
                  <span style={{ fontSize: 12.5, color: "#D1D9E6" }}>Non coché</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="number" defaultValue={50} min={1} max={200} style={{ width: 70, background: "#0C1420", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 10px", color: "#E8EDF5", fontSize: 13, outline: "none", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }} />
                  <span style={{ fontSize: 11.5, color: "#4A5568" }}>messages / jour</span>
                </label>
              </div>
            </Card>
          </div>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            8. CARTES STATISTIQUES
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="08 — Cartes statistiques" id="Cartes statistiques">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Prospects scrapés",   value: "2,847", delta: "+12.4%", color: "#00D4FF",  data: [40,55,45,70,65,80,75,90] },
              { label: "Messages envoyés",     value: "1,293", delta: "+8.1%",  color: "#00FFA3",  data: [30,40,50,45,60,55,70,65] },
              { label: "Taux de réponse",      value: "24.7%", delta: "+2.3%",  color: "#7C6AF7",  data: [20,22,18,25,24,28,26,29] },
              { label: "Taux de conversion",   value: "6.2%",  delta: "+0.8%",  color: "#FFB800",  data: [4,5,6,5,7,6,8,7] },
            ].map(card => {
              const max = Math.max(...card.data);
              const min = Math.min(...card.data);
              const pts = card.data.map((v, i) =>
                `${(i / (card.data.length - 1)) * 72},${24 - ((v - min) / (max - min || 1)) * 20}`
              ).join(" ");
              return (
                <div key={card.label} style={{ background: "#111926", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 12 }}>{card.label}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 22, color: "#E8EDF5", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{card.value}</div>
                      <div style={{ fontSize: 11, color: card.color, marginTop: 5, fontFamily: "'JetBrains Mono', monospace" }}>{card.delta}</div>
                    </div>
                    <svg width={72} height={28} style={{ opacity: 0.8 }}>
                      <polyline points={pts} fill="none" stroke={card.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            9. RÉSEAUX
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="09 — Réseaux sociaux" id="Réseaux">
          <div style={{ display: "flex", gap: 12 }}>
            {(["instagram","tiktok","linkedin","twitter","youtube"] as NetworkId[]).map(id => {
              const colors: Record<string, { c: string; bg: string; label: string }> = {
                instagram: { c: "#E1306C", bg: "rgba(225,48,108,0.12)", label: "Instagram" },
                tiktok:    { c: "#69C9D0", bg: "rgba(105,201,208,0.12)", label: "TikTok" },
                linkedin:  { c: "#0A66C2", bg: "rgba(10,102,194,0.12)",  label: "LinkedIn" },
                twitter:   { c: "#E7E9EA", bg: "rgba(231,233,234,0.1)",  label: "X / Twitter" },
                youtube:   { c: "#FF0000", bg: "rgba(255,0,0,0.1)",      label: "YouTube" },
              };
              const n = colors[id];
              return (
                <div key={id} style={{ textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: n.bg, border: `1px solid ${n.c}28`, display: "flex", alignItems: "center", justifyContent: "center", color: n.c, marginBottom: 8 }}>
                    <NetworkIcon id={id} size={22} />
                  </div>
                  <NetworkBadge id={id} size="sm" />
                  <div style={{ fontSize: 9.5, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{n.c}</div>
                </div>
              );
            })}
          </div>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            10. ICÔNES
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="10 — Icônes (lucide-react)" id="Icônes">
          <Card>
            <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 14 }}>Bibliothèque : <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00D4FF" }}>lucide-react</span> — taille par défaut 14px, stroke-width 1.5</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
              {[
                { icon: <Home size={16} />,          name: "Home" },
                { icon: <Search size={16} />,        name: "Search" },
                { icon: <MessageSquare size={16} />, name: "MessageSquare" },
                { icon: <Settings size={16} />,      name: "Settings" },
                { icon: <Send size={16} />,          name: "Send" },
                { icon: <SkipForward size={16} />,   name: "SkipForward" },
                { icon: <Edit3 size={16} />,         name: "Edit3" },
                { icon: <CheckCircle size={16} />,   name: "CheckCircle" },
                { icon: <Clock size={16} />,         name: "Clock" },
                { icon: <AlertCircle size={16} />,   name: "AlertCircle" },
                { icon: <Star size={16} />,          name: "Star" },
                { icon: <Eye size={16} />,           name: "Eye" },
                { icon: <Trash2 size={16} />,        name: "Trash2" },
                { icon: <Plus size={16} />,          name: "Plus" },
                { icon: <X size={16} />,             name: "X" },
                { icon: <Check size={16} />,         name: "Check" },
                { icon: <ChevronDown size={16} />,   name: "ChevronDown" },
                { icon: <ChevronRight size={16} />,  name: "ChevronRight" },
                { icon: <Bell size={16} />,          name: "Bell" },
                { icon: <Shield size={16} />,        name: "Shield" },
                { icon: <Zap size={16} />,           name: "Zap" },
                { icon: <User size={16} />,          name: "User" },
                { icon: <Save size={16} />,          name: "Save" },
                { icon: <Filter size={16} />,        name: "Filter" },
                { icon: <BarChart2 size={16} />,     name: "BarChart2" },
                { icon: <TrendingUp size={16} />,    name: "TrendingUp" },
                { icon: <Users size={16} />,         name: "Users" },
                { icon: <Wifi size={16} />,          name: "Wifi" },
                { icon: <WifiOff size={16} />,       name: "WifiOff" },
                { icon: <LogOut size={16} />,        name: "LogOut" },
                { icon: <Download size={16} />,      name: "Download" },
              ].map(ic => (
                <div key={ic.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8895A7" }}>
                    {ic.icon}
                  </div>
                  <div style={{ fontSize: 9, color: "#3D4E6B", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>{ic.name}</div>
                </div>
              ))}
            </div>
          </Card>
        </DSSection>

        {/* ═══════════════════════════════════════════════════════════
            11. NAVIGATION
        ════════════════════════════════════════════════════════════ */}
        <DSSection title="11 — Navigation & Layout" id="Navigation">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Nav item — actif</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "Accueil",          icon: <Home size={14} />,          active: false },
                  { label: "Récupération",     icon: <Search size={14} />,        active: true  },
                  { label: "Messages & Envoi", icon: <MessageSquare size={14} />, active: false, badge: 3 },
                  { label: "Paramètres",       icon: <Settings size={14} />,      active: false },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
                    borderRadius: 7, background: item.active ? "rgba(0,212,255,0.09)" : "transparent",
                    color: item.active ? "#00D4FF" : "#4A5870", position: "relative",
                  }}>
                    {item.active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, borderRadius: "0 2px 2px 0", background: "#00D4FF" }} />}
                    {item.icon}
                    <span style={{ fontSize: 12.5, fontWeight: item.active ? 500 : 400, flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <div style={{ background: "#00D4FF", color: "#0A0E17", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{item.badge}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Structure layout global</div>
              <div style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ color: "#00D4FF" }}>App (100vw × 100vh)</div>
                <div style={{ paddingLeft: 14, color: "#6B7A99" }}>├─ Sidebar (220px)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>│  ├─ Logo (70px)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>│  ├─ Nav (auto)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>│  ├─ Networks (flex:1)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>│  └─ UserFooter (56px)</div>
                <div style={{ paddingLeft: 14, color: "#6B7A99" }}>└─ MainArea (flex:1)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>   ├─ Topbar (46px)</div>
                <div style={{ paddingLeft: 28, color: "#4A5568" }}>   └─ PageContent (flex:1)</div>
              </div>
            </Card>
            <Card style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, color: "#6B7A99", marginBottom: 14, fontWeight: 500 }}>Pages de l'application</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[
                  { id: "dashboard",  label: "Dashboard",    icon: <Home size={16} />,          desc: "KPIs + graphiques + raccourcis" },
                  { id: "prospects",  label: "Récupération", icon: <Search size={16} />,        desc: "Scraping + filtres + preview" },
                  { id: "messages",   label: "Messages",     icon: <MessageSquare size={16} />, desc: "File d'envoi + éditeur IA" },
                  { id: "settings",   label: "Paramètres",   icon: <Settings size={16} />,      desc: "5 onglets de config" },
                  { id: "design",     label: "Design System",icon: <BarChart2 size={16} />,     desc: "Tokens + composants" },
                ].map(p => (
                  <div key={p.id} style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 9, padding: "14px" }}>
                    <div style={{ color: "#00D4FF", marginBottom: 8 }}>{p.icon}</div>
                    <div style={{ fontSize: 12.5, color: "#D1D9E6", fontWeight: 500, marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 10.5, color: "#4A5568", lineHeight: 1.5 }}>{p.desc}</div>
                    <div style={{ marginTop: 8, fontSize: 9, color: "#2D3D5A", fontFamily: "'JetBrains Mono', monospace" }}>/{p.id}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </DSSection>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.045)", paddingTop: 24, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: "#2D3D5A" }}>Prospect Pro — Design System v1.0</div>
          <div style={{ fontSize: 10, color: "#1E2D45", fontFamily: "'JetBrains Mono', monospace" }}>React + TypeScript + Tailwind CSS + CustomTkinter-ready</div>
        </div>
      </div>
    </div>
  );
}
