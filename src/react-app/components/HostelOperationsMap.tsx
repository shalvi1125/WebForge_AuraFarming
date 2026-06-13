import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  BrainCircuit, ChevronRight, AlertCircle, Users, Wrench,
  UserCheck, Filter, Layers, TrendingUp,
} from 'lucide-react';

export type RoomStatus =
  | 'normal'
  | 'complaint_progress'
  | 'pending_complaint'
  | 'critical'
  | 'maintenance'
  | 'vacant';

export type MapView = 'student' | 'warden' | 'admin';
export type HeatmapMode = 'occupancy' | 'complaint' | 'maintenance' | 'none';

export interface RoomIntel {
  id: string;
  number: string;
  block: 'A' | 'B';
  floor: number;
  status: RoomStatus;
  occupants: string[];
  capacity: number;
  complaints: { title: string; severity: 'Low' | 'Medium' | 'High' | 'Critical' }[];
  assignedStaff: string | null;
  visitorActivity: string;
  maintenanceStatus: string;
  aiRecommendation: string;
  occupancy: number;
  complaintScore: number;
  maintenanceScore: number;
  colSpan?: number;
  rowSpan?: number;
  isCommon?: boolean;
  isStairs?: boolean;
  isHallway?: boolean;
  label?: string;
}

export const STATUS_COLORS: Record<RoomStatus, string> = {
  normal: '#D8F3DC',
  complaint_progress: '#FFF3BF',
  pending_complaint: '#FFD6D6',
  critical: '#FFB3C1',
  maintenance: '#D6F0FF',
  vacant: '#E9ECEF',
};

export const STATUS_LABELS: Record<RoomStatus, string> = {
  normal: 'Normal',
  complaint_progress: 'Complaint In Progress',
  pending_complaint: 'Pending Complaint',
  critical: 'Critical Issue',
  maintenance: 'Maintenance',
  vacant: 'Vacant',
};

const ALL_ROOMS: RoomIntel[] = [
  { id: '101', number: '101', block: 'A', floor: 1, status: 'normal', occupants: ['Ravi K.', 'Suresh M.', 'Amit D.'], capacity: 3, complaints: [], assignedStaff: null, visitorActivity: '2 visitors this week', maintenanceStatus: 'None', aiRecommendation: 'Stable occupancy. No action needed.', occupancy: 1, complaintScore: 0.1, maintenanceScore: 0.05, colSpan: 1, rowSpan: 1 },
  { id: '102', number: '102', block: 'A', floor: 1, status: 'vacant', occupants: [], capacity: 3, complaints: [], assignedStaff: null, visitorActivity: 'None', maintenanceStatus: 'Ready for allocation', aiRecommendation: 'Ideal for new intake — quiet wing.', occupancy: 0, complaintScore: 0, maintenanceScore: 0, colSpan: 1, rowSpan: 1 },
  { id: '103', number: '103', block: 'A', floor: 1, status: 'complaint_progress', occupants: ['Neha S.', 'Priya L.'], capacity: 3, complaints: [{ title: 'AC not cooling', severity: 'Medium' }], assignedStaff: 'Rajan Kumar', visitorActivity: '1 visitor pending', maintenanceStatus: 'AC repair scheduled', aiRecommendation: 'Monitor AC repair — ETA 2 days.', occupancy: 0.67, complaintScore: 0.55, maintenanceScore: 0.6, colSpan: 1, rowSpan: 2 },
  { id: '104', number: '104', block: 'A', floor: 1, status: 'normal', occupants: ['Karan J.', 'Vikram P.', 'Rohit A.'], capacity: 3, complaints: [], assignedStaff: null, visitorActivity: 'None recent', maintenanceStatus: 'None', aiRecommendation: 'High compatibility score for group housing.', occupancy: 1, complaintScore: 0.15, maintenanceScore: 0.1, colSpan: 1, rowSpan: 1 },
  { id: '105', number: '105', block: 'A', floor: 1, status: 'pending_complaint', occupants: ['Sneha P.', 'Anjali R.'], capacity: 3, complaints: [{ title: 'Wi-Fi weak signal', severity: 'Low' }], assignedStaff: 'IT Support', visitorActivity: 'None', maintenanceStatus: 'Router check queued', aiRecommendation: 'Wi-Fi complaint likely network-wide — check wing router.', occupancy: 0.67, complaintScore: 0.4, maintenanceScore: 0.35, colSpan: 1, rowSpan: 1 },
  { id: '106', number: '106', block: 'A', floor: 1, status: 'maintenance', occupants: [], capacity: 3, complaints: [], assignedStaff: 'Plumbing Team', visitorActivity: 'Blocked', maintenanceStatus: 'Pipe replacement — 3 days left', aiRecommendation: 'Do not allocate until maintenance clears.', occupancy: 0, complaintScore: 0, maintenanceScore: 0.9, colSpan: 2, rowSpan: 1 },
  { id: '201', number: '201', block: 'B', floor: 2, status: 'normal', occupants: ['Aryan S.', 'Dev P.', 'Rahul K.'], capacity: 4, complaints: [], assignedStaff: null, visitorActivity: '1 approved visitor Sat', maintenanceStatus: 'None', aiRecommendation: 'Your room — stable, 75% occupancy.', occupancy: 0.75, complaintScore: 0.2, maintenanceScore: 0.1, colSpan: 1, rowSpan: 1 },
  { id: '202', number: '202', block: 'B', floor: 2, status: 'normal', occupants: ['Rohit V.', 'Manish T.', 'Arun B.', 'Kiran S.'], capacity: 4, complaints: [], assignedStaff: null, visitorActivity: 'None', maintenanceStatus: 'None', aiRecommendation: 'Full occupancy — no vacancies.', occupancy: 1, complaintScore: 0.1, maintenanceScore: 0.05, colSpan: 1, rowSpan: 1 },
  { id: '203', number: '203', block: 'B', floor: 2, status: 'vacant', occupants: [], capacity: 4, complaints: [], assignedStaff: null, visitorActivity: 'None', maintenanceStatus: 'Ready', aiRecommendation: 'Best match for room change — same floor, quiet.', occupancy: 0, complaintScore: 0, maintenanceScore: 0, colSpan: 1, rowSpan: 1 },
  { id: '204', number: '204', block: 'B', floor: 2, status: 'complaint_progress', occupants: ['Aryan Sharma', 'Dev Patel', 'Rahul K.'], capacity: 4, complaints: [{ title: 'Water leakage near sink', severity: 'High' }], assignedStaff: 'Rajan Kumar (Plumbing)', visitorActivity: 'Ramesh Sharma — Sat 2PM', maintenanceStatus: 'Plumbing repair in progress', aiRecommendation: 'High priority — escalate if not resolved by 16 Jun.', occupancy: 0.75, complaintScore: 0.75, maintenanceScore: 0.7, colSpan: 1, rowSpan: 2 },
  { id: '205', number: '205', block: 'B', floor: 2, status: 'maintenance', occupants: [], capacity: 4, complaints: [], assignedStaff: 'Plumbing Team', visitorActivity: 'Blocked', maintenanceStatus: 'Pipe repair — completion 16 Jun', aiRecommendation: 'Avoid allocation until 17 Jun.', occupancy: 0, complaintScore: 0, maintenanceScore: 0.95, colSpan: 1, rowSpan: 1 },
  { id: '206', number: '206', block: 'B', floor: 2, status: 'critical', occupants: ['Vikash M.', 'Sahil R.'], capacity: 4, complaints: [{ title: 'Electrical short circuit', severity: 'Critical' }, { title: 'Broken window latch', severity: 'High' }], assignedStaff: 'Emergency Electrical', visitorActivity: 'Restricted', maintenanceStatus: 'Critical — immediate attention', aiRecommendation: 'CRITICAL: Relocate occupants if not fixed within 24h.', occupancy: 0.5, complaintScore: 0.95, maintenanceScore: 0.85, colSpan: 1, rowSpan: 1 },
  { id: '207', number: '207', block: 'B', floor: 2, status: 'normal', occupants: ['Tarun G.', 'Nikhil S.'], capacity: 4, complaints: [], assignedStaff: null, visitorActivity: 'None', maintenanceStatus: 'None', aiRecommendation: '2 beds available — good for mid-semester allocation.', occupancy: 0.5, complaintScore: 0.1, maintenanceScore: 0.05, colSpan: 1, rowSpan: 1 },
  { id: '208', number: '208', block: 'B', floor: 2, status: 'vacant', occupants: [], capacity: 4, complaints: [], assignedStaff: null, visitorActivity: 'None', maintenanceStatus: 'Ready', aiRecommendation: '100% vacancy — near common area, popular choice.', occupancy: 0, complaintScore: 0, maintenanceScore: 0, colSpan: 1, rowSpan: 1 },
];

interface HostelOperationsMapProps {
  view?: MapView;
  studentRoomId?: string;
  className?: string;
}

export default function HostelOperationsMap({ view = 'student', studentRoomId = '204', className = '' }: HostelOperationsMapProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomIntel | null>(
    ALL_ROOMS.find((r) => r.id === studentRoomId) || ALL_ROOMS[0]
  );
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('none');
  const [blockFilter, setBlockFilter] = useState<'all' | 'A' | 'B'>('all');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');

  const visibleRooms = useMemo(() => {
    let rooms = ALL_ROOMS;
    if (view === 'student') {
      rooms = rooms.filter((r) => r.block === 'B' && r.floor === 2);
    } else if (view === 'warden') {
      rooms = rooms.filter((r) => r.block === 'B');
    }
    if (blockFilter !== 'all') rooms = rooms.filter((r) => r.block === blockFilter);
    if (floorFilter !== 'all') rooms = rooms.filter((r) => r.floor === floorFilter);
    return rooms;
  }, [view, blockFilter, floorFilter]);

  const getHeatOverlay = (room: RoomIntel): string | undefined => {
    if (heatmapMode === 'none') return undefined;
    let intensity = 0;
    if (heatmapMode === 'occupancy') intensity = room.occupancy;
    if (heatmapMode === 'complaint') intensity = room.complaintScore;
    if (heatmapMode === 'maintenance') intensity = room.maintenanceScore;
    return `rgba(27, 79, 114, ${0.08 + intensity * 0.35})`;
  };

  const priorityAlerts = ALL_ROOMS.filter((r) => r.status === 'critical' || r.status === 'pending_complaint').slice(0, 3);

  const renderBlock = (block: 'A' | 'B', floor: number) => {
    const blockRooms = visibleRooms.filter((r) => r.block === block && r.floor === floor);
    if (blockRooms.length === 0) return null;

    const gridPlacement: Record<string, { col: string; row: string }> = block === 'B' && floor === 2 ? {
      '201': { col: '1', row: '1' },
      '202': { col: '2', row: '1' },
      '203': { col: '4', row: '1' },
      '204': { col: '1', row: '2 / 4' },
      '205': { col: '2', row: '2' },
      '206': { col: '3', row: '2' },
      '207': { col: '4', row: '2' },
      '208': { col: '2 / 4', row: '3' },
    } : {
      '101': { col: '1', row: '1' },
      '102': { col: '2', row: '1' },
      '103': { col: '3', row: '1 / 3' },
      '104': { col: '4', row: '1' },
      '105': { col: '1', row: '3' },
      '106': { col: '2 / 4', row: '3' },
    };

    return (
      <div key={`${block}-${floor}`} className="relative">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-4 h-4 text-[#1B4F72]" />
          <h3 className="text-sm font-semibold text-[#071B34]">Block {block} · Floor {floor}</h3>
        </div>
        <div
          className="relative rounded-xl border-2 border-[#071B34]/8 bg-[#FAFBFC] p-4 lg:p-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(64px, 1fr)) 28px',
            gridTemplateRows: block === 'B' ? '72px 72px 72px 48px' : '72px 28px 72px',
            gap: '10px',
          }}
        >
          <div className="col-span-5 text-center py-0.5" style={{ gridColumn: '1 / -1', gridRow: '1' }}>
            <span className="text-[10px] uppercase tracking-widest text-[#4A5568] font-semibold">North Corridor</span>
          </div>

          {blockRooms.map((room) => {
            const placement = gridPlacement[room.id];
            if (!placement) return null;
            const isSelected = selectedRoom?.id === room.id;
            const baseColor = STATUS_COLORS[room.status];
            const heat = getHeatOverlay(room);
            const isUserRoom = room.id === studentRoomId && view === 'student';

            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                style={{
                  gridColumn: placement.col,
                  gridRow: placement.row,
                  backgroundColor: baseColor,
                  boxShadow: heat ? `inset 0 0 0 100px ${heat}` : undefined,
                }}
                className={`room-cell relative rounded-lg border border-[#071B34]/12 flex flex-col items-center justify-center p-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:saturate-[1.1] ${
                  isSelected ? 'ring-2 ring-[#1B4F72] ring-offset-2 shadow-lg z-10' : ''
                } ${room.status === 'critical' ? 'status-pulse-critical' : ''} ${isUserRoom ? 'ring-1 ring-[#4CC9F0]' : ''}`}
              >
                <span className="text-sm font-bold text-[#071B34]">R{room.number}</span>
                <span className="text-[10px] text-[#4A5568] font-semibold">{room.occupants.length}/{room.capacity}</span>
                {room.complaints.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1B4F72]/50 status-pulse" />}
                {isUserRoom && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#1B4F72] text-white px-2 py-0.5 rounded-full font-semibold">You</span>}
              </button>
            );
          })}

          <div className="flex items-center justify-center bg-[#E9ECEF] rounded-md border border-dashed border-[#071B34]/15"
            style={{ gridColumn: '5', gridRow: block === 'B' ? '2 / 4' : '1 / 3' }}>
            <span className="text-[9px] text-[#4A5568] font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>STAIRS</span>
          </div>

          {block === 'B' && (
            <div className="flex items-center justify-center bg-[#071B34]/6 rounded-lg border border-[#071B34]/10"
              style={{ gridColumn: '2 / 5', gridRow: '4' }}>
              <span className="text-xs text-[#4A5568] font-semibold">Common Area · Washroom Wing</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-[#4A5568]" />
          {view === 'admin' && (
            <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value as 'all' | 'A' | 'B')}
              className="text-sm border border-[#071B34]/12 rounded-lg px-3 py-2 bg-white text-[#071B34] font-medium">
              <option value="all">All Blocks</option><option value="A">Block A</option><option value="B">Block B</option>
            </select>
          )}
          <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-sm border border-[#071B34]/12 rounded-lg px-3 py-2 bg-white text-[#071B34] font-medium">
            <option value="all">All Floors</option><option value={1}>Floor 1</option><option value={2}>Floor 2</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['none', 'occupancy', 'complaint', 'maintenance'] as HeatmapMode[]).map((mode) => (
            <button key={mode} onClick={() => setHeatmapMode(mode)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                heatmapMode === mode ? 'bg-[#071B34] text-white' : 'bg-white text-[#4A5568] border border-[#071B34]/10 hover:border-[#4CC9F0]/40'
              }`}>
              {mode === 'none' ? 'Status View' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Heatmap`}
            </button>
          ))}
        </div>
      </div>

      {/* Priority alerts — warden/admin */}
      {(view === 'warden' || view === 'admin') && priorityAlerts.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {priorityAlerts.map((r) => (
            <button key={r.id} onClick={() => setSelectedRoom(r)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD6D6] border border-[#FFB3C1]/50 text-sm font-medium text-[#071B34] hover:shadow-md transition-all alert-slide">
              <AlertCircle className="w-4 h-4" />
              Room {r.number} — {r.complaints[0]?.title || 'Attention required'}
            </button>
          ))}
        </div>
      )}

      {/* Floor plans */}
      <div className={`grid gap-8 ${view === 'admin' ? 'lg:grid-cols-2' : ''}`}>
        {(view === 'admin' || (view === 'warden' && blockFilter !== 'B')) && renderBlock('A', 1)}
        {(view !== 'student' || blockFilter !== 'A') && renderBlock('B', 2)}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#071B34]/8">
        {(Object.keys(STATUS_COLORS) as RoomStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-2 text-xs text-[#4A5568] font-medium">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: STATUS_COLORS[s] }} />
            {STATUS_LABELS[s]}
          </div>
        ))}
      </div>

      {/* Room Intelligence Panel */}
      {selectedRoom && (
        <div className="mt-8 surface-panel rounded-2xl overflow-hidden border border-[#071B34]/8">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[#071B34]/8" style={{ backgroundColor: STATUS_COLORS[selectedRoom.status] }}>
              <p className="text-xs uppercase tracking-widest text-[#4A5568] font-semibold mb-2">Room Intelligence</p>
              <h3 className="text-3xl font-bold text-[#071B34]">Room {selectedRoom.number}</h3>
              <p className="text-sm text-[#4A5568] font-medium mt-2">Block {selectedRoom.block} · Floor {selectedRoom.floor} · {STATUS_LABELS[selectedRoom.status]}</p>
              {view === 'student' && selectedRoom.id === studentRoomId && (
                <p className="mt-4 text-sm font-medium text-[#1B4F72] bg-white/60 rounded-lg px-3 py-2 inline-block">This is your assigned room</p>
              )}
            </div>
            <div className="lg:col-span-3 p-6 lg:p-8 grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4A5568] font-semibold mb-2 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Occupants</p>
                <p className="text-sm font-medium text-[#071B34]">{selectedRoom.occupants.length ? selectedRoom.occupants.join(', ') : 'Vacant'}</p>
                <p className="text-xs text-[#4A5568] mt-1">{selectedRoom.occupants.length}/{selectedRoom.capacity} beds</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4A5568] font-semibold mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Active Complaints</p>
                {selectedRoom.complaints.length ? selectedRoom.complaints.map((c, i) => (
                  <p key={i} className="text-sm font-medium text-[#071B34]">{c.title} <span className="text-[#1B4F72]">({c.severity})</span></p>
                )) : <p className="text-sm text-[#4A5568]">None</p>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4A5568] font-semibold mb-2 flex items-center gap-1"><Wrench className="w-3.5 h-3.5" /> Assigned Staff</p>
                <p className="text-sm font-medium text-[#071B34]">{selectedRoom.assignedStaff || '—'}</p>
                <p className="text-xs text-[#4A5568] mt-1">{selectedRoom.maintenanceStatus}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4A5568] font-semibold mb-2 flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Visitor Activity</p>
                <p className="text-sm font-medium text-[#071B34]">{selectedRoom.visitorActivity}</p>
              </div>
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#071B34]/5 border border-[#071B34]/8">
                <p className="text-xs uppercase tracking-widest text-[#1B4F72] font-semibold mb-2 flex items-center gap-1"><BrainCircuit className="w-3.5 h-3.5" /> AI Recommendation</p>
                <p className="text-sm text-[#071B34] leading-relaxed">{selectedRoom.aiRecommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin analytics strip */}
      {view === 'admin' && (
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Campus Occupancy', value: '91%', sub: 'Expected 96% by August', icon: TrendingUp },
            { label: 'Active Complaints', value: '14', sub: 'Wi-Fi most recurring', icon: AlertCircle },
            { label: 'Maintenance Queue', value: '6 rooms', sub: 'Workload increasing', icon: Wrench },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="surface-panel rounded-xl p-4 flex items-start gap-3 elevate-hover">
                <Icon className="w-5 h-5 text-[#1B4F72] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#4A5568] font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-[#071B34]">{stat.value}</p>
                  <p className="text-xs text-[#4A5568] mt-0.5">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'student' && (
        <div className="mt-4">
          <Link to="/chat" className="inline-flex items-center gap-1 text-sm font-medium text-[#1B4F72] hover:text-[#4CC9F0]">
            Ask AI about room change <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
