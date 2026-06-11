export function Logo({ size = 33 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: "linear-gradient(135deg, #00D4FF 0%, #0080BB 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 16px rgba(0,212,255,0.28)",
      flexShrink: 0,
    }}>
      <svg
        width={size * 0.48}
        height={size * 0.48}
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M3 10L7 5.5L11 9.5L15 4"
          stroke="#0A0E17"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="14" r="2.4" fill="#0A0E17" />
      </svg>
    </div>
  );
}
