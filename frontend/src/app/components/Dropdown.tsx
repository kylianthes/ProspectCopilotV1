import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  divider?: boolean;
}

interface DropdownProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  prefix?: string;
  width?: number;
  align?: "left" | "right";
}

export function Dropdown<T extends string>({ options, value, onChange, prefix, width = 180, align = "left" }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: open ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 8, padding: "7px 12px", cursor: "pointer",
          color: open ? "#00D4FF" : "#8895A7", fontSize: 12.5, transition: "all 0.12s",
          whiteSpace: "nowrap",
        }}
      >
        {selected?.icon && <span style={{ color: selected.color ?? "inherit" }}>{selected.icon}</span>}
        <span style={{ color: open ? "#00D4FF" : "#C8D4E8" }}>
          {prefix && <span style={{ color: "#4A5568" }}>{prefix} </span>}
          {selected?.label}
        </span>
        <ChevronDown size={13} style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)",
          [align === "right" ? "right" : "left"]: 0,
          width, background: "#131E30",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10, padding: "5px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.04)",
          zIndex: 100,
        }}>
          {options.map((opt, i) => (
            <div key={opt.value}>
              {opt.divider && i > 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />}
              <button
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                  background: value === opt.value ? "rgba(0,212,255,0.08)" : "transparent",
                  color: value === opt.value ? "#00D4FF" : (opt.color ?? "#A0AEC0"),
                  fontSize: 12.5, textAlign: "left", transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (value !== opt.value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (value !== opt.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {opt.icon && <span style={{ color: opt.color ?? "inherit", opacity: 0.8 }}>{opt.icon}</span>}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {value === opt.value && <Check size={12} style={{ color: "#00D4FF" }} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple action menu (no selected state)
interface ActionMenuProps {
  trigger: React.ReactNode;
  items: { label: string; icon?: React.ReactNode; color?: string; onClick: () => void; divider?: boolean; danger?: boolean }[];
  align?: "left" | "right";
  width?: number;
}

export function ActionMenu({ trigger, items, align = "left", width = 200 }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer" }}>{trigger}</div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)",
          [align === "right" ? "right" : "left"]: 0,
          width, background: "#131E30",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10, padding: "5px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          zIndex: 200,
        }}>
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && i > 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />}
              <button
                onClick={() => { item.onClick(); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                  background: "transparent",
                  color: item.danger ? "#FF4D6A" : (item.color ?? "#A0AEC0"),
                  fontSize: 12.5, textAlign: "left", transition: "background 0.1s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = item.danger ? "rgba(255,77,106,0.08)" : "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
