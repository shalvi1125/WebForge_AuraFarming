/** Decorative architectural blueprint — low opacity, non-interactive */
export default function HostelBlueprint({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="40" y="30" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <rect x="130" y="30" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <rect x="220" y="30" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <rect x="40" y="110" width="120" height="40" stroke="currentColor" strokeWidth="0.6" opacity="0.1" strokeDasharray="4 3" />
      <rect x="180" y="110" width="120" height="40" stroke="currentColor" strokeWidth="0.6" opacity="0.1" strokeDasharray="4 3" />
      <rect x="40" y="170" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <rect x="130" y="170" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <rect x="220" y="170" width="80" height="60" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="310" y1="30" x2="310" y2="230" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <line x1="30" y1="100" x2="370" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <circle cx="320" cy="50" r="12" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <text x="42" y="22" fill="currentColor" fontSize="7" opacity="0.12" fontFamily="monospace">BLOCK A</text>
      <text x="42" y="162" fill="currentColor" fontSize="7" opacity="0.12" fontFamily="monospace">BLOCK B</text>
    </svg>
  );
}
