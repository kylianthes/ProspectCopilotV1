import type { NetworkId } from "../types";
import { getNetwork } from "../data";

// Inline SVG icons for each network — no external icon lib needed
export function NetworkIcon({ id, size = 14 }: { id: NetworkId; size?: number }) {
  switch (id) {
    case "instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      );
    case "twitter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/>
        </svg>
      );
  }
}

export function NetworkBadge({ id, size = "sm" }: { id: NetworkId; size?: "sm" | "md" }) {
  const net = getNetwork(id);
  const pad = size === "sm" ? "3px 8px" : "4px 10px";
  const fontSize = size === "sm" ? 11 : 12.5;
  const iconSize = size === "sm" ? 11 : 13;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: net.bgColor, color: net.color,
      borderRadius: 6, padding: pad, fontSize,
      fontWeight: 500, whiteSpace: "nowrap",
    }}>
      <NetworkIcon id={id} size={iconSize} />
      {net.label}
    </span>
  );
}
