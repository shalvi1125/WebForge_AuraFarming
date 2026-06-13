import { useMemo } from 'react';

const NODES = [
  { id: 'students', label: 'Students', x: 20, y: 50, count: 128 },
  { id: 'rooms', label: 'Rooms', x: 50, y: 30, count: 48 },
  { id: 'complaints', label: 'Complaints', x: 80, y: 55, count: 14 },
  { id: 'visitors', label: 'Visitors', x: 35, y: 75, count: 8 },
  { id: 'maintenance', label: 'Maintenance', x: 65, y: 70, count: 6 },
];

const EDGES: [string, string][] = [
  ['students', 'rooms'],
  ['students', 'complaints'],
  ['rooms', 'complaints'],
  ['rooms', 'maintenance'],
  ['students', 'visitors'],
  ['complaints', 'maintenance'],
];

export default function CampusNetwork({ className = '' }: { className?: string }) {
  const nodeMap = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 90" className="w-full h-full" aria-hidden>
        {EDGES.map(([a, b], i) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="#4CC9F0" strokeWidth="0.3" opacity="0.25"
              className="network-line"
            />
          );
        })}
        {NODES.map((n) => (
          <g key={n.id} className="network-node">
            <circle cx={n.x} cy={n.y} r="4" fill="#1B4F72" opacity="0.7" />
            <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="#4CC9F0" strokeWidth="0.4" opacity="0.4" className="network-pulse" />
            <text x={n.x} y={n.y + 12} textAnchor="middle" fill="#4A5568" fontSize="3.5" fontWeight="500">{n.label}</text>
            <text x={n.x} y={n.y + 1.5} textAnchor="middle" fill="#F8FAFC" fontSize="3" fontWeight="600">{n.count}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
