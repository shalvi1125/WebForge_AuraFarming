import { useState } from 'react';
import { Link } from 'react-router';
import {
  Building2, BedDouble, Wrench, Users, BrainCircuit, ChevronRight,
  Sparkles, Home, AlertCircle, CheckCircle2, ArrowLeft, Filter,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

type RoomStatus = 'occupied' | 'vacant' | 'maintenance' | 'reserved';

interface Room {
  id: string;
  number: string;
  floor: number;
  status: RoomStatus;
  occupants: number;
  capacity: number;
  block: string;
}

const rooms: Room[] = [
  { id: '201', number: '201', floor: 2, status: 'occupied', occupants: 3, capacity: 4, block: 'B' },
  { id: '202', number: '202', floor: 2, status: 'occupied', occupants: 4, capacity: 4, block: 'B' },
  { id: '203', number: '203', floor: 2, status: 'vacant', occupants: 0, capacity: 4, block: 'B' },
  { id: '204', number: '204', floor: 2, status: 'occupied', occupants: 3, capacity: 4, block: 'B' },
  { id: '205', number: '205', floor: 2, status: 'maintenance', occupants: 0, capacity: 4, block: 'B' },
  { id: '206', number: '206', floor: 2, status: 'reserved', occupants: 0, capacity: 4, block: 'B' },
  { id: '207', number: '207', floor: 2, status: 'occupied', occupants: 2, capacity: 4, block: 'B' },
  { id: '208', number: '208', floor: 2, status: 'vacant', occupants: 0, capacity: 4, block: 'B' },
  { id: '301', number: '301', floor: 3, status: 'occupied', occupants: 4, capacity: 4, block: 'B' },
  { id: '302', number: '302', floor: 3, status: 'occupied', occupants: 3, capacity: 4, block: 'B' },
  { id: '303', number: '303', floor: 3, status: 'vacant', occupants: 0, capacity: 4, block: 'B' },
  { id: '304', number: '304', floor: 3, status: 'occupied', occupants: 4, capacity: 4, block: 'B' },
];

const statusStyles: Record<RoomStatus, { bg: string; border: string; label: string; dot: string }> = {
  occupied: { bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'Occupied', dot: 'bg-indigo-500' },
  vacant: { bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Vacant', dot: 'bg-emerald-500' },
  maintenance: { bg: 'bg-amber-50', border: 'border-amber-200', label: 'Maintenance', dot: 'bg-amber-500' },
  reserved: { bg: 'bg-cyan-50', border: 'border-cyan-200', label: 'Reserved', dot: 'bg-cyan-500' },
};

const heatmapData = [
  [0.9, 0.85, 0.4, 0.75, 0.2, 0.5, 0.65, 0.3],
  [0.95, 0.8, 0.35, 0.9, 0.7, 0.55, 0.45, 0.6],
];

export default function RoomAllocation() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[3]);
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');

  const filtered = rooms.filter((r) => {
    if (floorFilter !== 'all' && r.floor !== floorFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    vacant: rooms.filter((r) => r.status === 'vacant').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Smart Room Allocation"
        userName="Aryan Sharma"
        userMeta="Room 204 · Block B"
        avatar="AS"
        homeHref="/student/dashboard"
        links={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Complaints', href: '/student/complaints' },
          { label: 'Leave', href: '/student/leave' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Smart Room Allocation</h1>
            <p className="text-gray-500 text-sm mt-1">Tagore Hostel · Block B — interactive floor map with AI recommendations</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Allocation Engine Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Rooms', value: stats.total, icon: Building2, color: 'text-gray-700', bg: 'bg-gray-50' },
            { label: 'Occupied', value: stats.occupied, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Vacant', value: stats.vacant, icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Maintenance', value: stats.maintenance, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-600" /> Floor Plan — Block B
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={floorFilter}
                    onChange={(e) => setFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="all">All Floors</option>
                    <option value={2}>Floor 2</option>
                    <option value={3}>Floor 3</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as RoomStatus | 'all')}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="occupied">Occupied</option>
                    <option value="vacant">Vacant</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {filtered.map((room) => {
                  const style = statusStyles[room.status];
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${style.bg} ${style.border} ${
                        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-lg' : 'hover:scale-102 card-hover'
                      }`}
                    >
                      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${style.dot}`} />
                      <p className="text-lg font-bold text-gray-800">{room.number}</p>
                      <p className="text-xs text-gray-500 mt-0.5">F{room.floor}</p>
                      <p className="text-xs font-medium mt-1 text-gray-600">{room.occupants}/{room.capacity}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                {Object.entries(statusStyles).map(([key, style]) => (
                  <div key={key} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                    {style.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" /> Occupancy Heatmap
              </h2>
              <div className="space-y-2">
                {['Floor 2', 'Floor 3'].map((floor, fi) => (
                  <div key={floor} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-14">{floor}</span>
                    <div className="flex-1 flex gap-1">
                      {heatmapData[fi].map((v, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded-md transition-all hover:scale-110"
                          style={{
                            background: `rgba(99, 102, 241, ${0.15 + v * 0.75})`,
                          }}
                          title={`${Math.round(v * 100)}% occupancy`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Darker cells indicate higher occupancy. AI uses this for allocation decisions.</p>
            </div>
          </div>

          <div className="space-y-4">
            {selectedRoom && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4">
                  <p className="text-indigo-200 text-xs">Selected Room</p>
                  <h3 className="text-2xl font-extrabold text-white">Room {selectedRoom.number}</h3>
                  <p className="text-indigo-200 text-sm">Block {selectedRoom.block} · Floor {selectedRoom.floor}</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Status', value: statusStyles[selectedRoom.status].label },
                      { label: 'Capacity', value: `${selectedRoom.capacity} beds` },
                      { label: 'Occupants', value: `${selectedRoom.occupants}` },
                      { label: 'Available', value: `${selectedRoom.capacity - selectedRoom.occupants} beds` },
                    ].map((r) => (
                      <div key={r.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">{r.label}</p>
                        <p className="text-sm font-bold text-gray-800">{r.value}</p>
                      </div>
                    ))}
                  </div>
                  {selectedRoom.id === '204' && (
                    <div className="flex items-start gap-2 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-700">This is your assigned room. Occupancy at 75% — 1 bed available.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <p className="text-white font-semibold text-sm">AI Room Recommendations</p>
              </div>
              <div className="space-y-2">
                {[
                  { room: '203', reason: 'Best match — same floor, compatible preferences, 4 beds available' },
                  { room: '208', reason: 'Quiet wing, near common area, 100% vacancy' },
                ].map((rec) => (
                  <button
                    key={rec.room}
                    onClick={() => setSelectedRoom(rooms.find((r) => r.number === rec.room) || null)}
                    className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors border border-white/10"
                  >
                    <p className="text-white text-sm font-medium">Room {rec.room}</p>
                    <p className="text-indigo-200 text-xs mt-0.5">{rec.reason}</p>
                  </button>
                ))}
              </div>
              <Link to="/chat" className="flex items-center justify-between text-cyan-300 text-xs font-medium hover:text-white transition-colors">
                <span>Ask AI about room change</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Room 205 — Maintenance</p>
                <p className="text-xs text-amber-700 mt-0.5">Plumbing repair in progress. Expected completion: 16 Jun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
