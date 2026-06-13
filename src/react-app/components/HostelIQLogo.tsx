interface HostelIQLogoProps {
  size?: number;
  className?: string;
}

/** Custom HostelIQ brand mark — dormitory block with blueprint window grid */
export function HostelIQLogo({ size = 20, className = '' }: HostelIQLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="11" width="15" height="17" rx="1" fill="#0A2342" stroke="#4CC9F0" strokeWidth="1.4" />
      <path d="M4 11L11.5 5.5L19 11" stroke="#4CC9F0" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <rect x="19" y="17" width="9" height="11" rx="1" fill="none" stroke="#4CC9F0" strokeWidth="1.2" />
      <path d="M19 17L23.5 13.5L28 17" stroke="#4CC9F0" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      {[13, 18, 23].map((y) =>
        [7, 12].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" stroke="#4CC9F0" strokeWidth="0.7" fill="none" opacity="0.85" />
        )),
      )}
      <rect x="9.5" y="23" width="4" height="5" stroke="#4CC9F0" strokeWidth="1" fill="none" />
      <line x1="11.5" y1="23" x2="11.5" y2="28" stroke="#4CC9F0" strokeWidth="0.8" opacity="0.6" />
      <rect x="21.5" y="21" width="2" height="2" stroke="#4CC9F0" strokeWidth="0.6" fill="none" opacity="0.7" />
      <rect x="21.5" y="25" width="2" height="2" stroke="#4CC9F0" strokeWidth="0.6" fill="none" opacity="0.7" />
    </svg>
  );
}

interface HostelIQLogoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Logo inside the standard navy rounded container */
export function HostelIQLogoMark({ size = 'md', className = '' }: HostelIQLogoMarkProps) {
  const config = {
    sm: { box: 'w-9 h-9 rounded-lg', icon: 18 },
    md: { box: 'w-9 h-9 rounded-lg', icon: 20 },
    lg: { box: 'w-16 h-16 rounded-2xl', icon: 32 },
  }[size];
  return (
    <div className={`${config.box} bg-[#0A2342] border border-[#4CC9F0]/20 flex items-center justify-center shrink-0 shadow-sm ${className}`}>
      <HostelIQLogo size={config.icon} />
    </div>
  );
}

export default HostelIQLogo;
