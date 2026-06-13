import { Link } from 'react-router';
import { BedDouble, ArrowLeft, BrainCircuit } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const blocks = [
  { name: 'Block A', total: 64, occupied: 58, maintenance: 2 },
  { name: 'Block B', total: 64, occupied: 56, maintenance: 3 },
  { name: 'Block C', total: 48, occupied: 42, maintenance: 1 },
];

export default function AdminRooms() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Admin Portal" userName="Dr. Rajesh Kumar" avatar="RK" homeHref="/admin/dashboard" dark />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#071B34]">Room Management</h1>
          <Link to="/student/room?view=admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4F72] hover:text-[#4CC9F0] bg-white px-4 py-2 rounded-lg border border-[#071B34]/10">
            Open Campus Operations Map
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div key={b.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center gap-2 mb-3"><BedDouble className="w-5 h-5 text-[#1B4F72]" /><h3 className="font-semibold">{b.name}</h3></div>
              <p className="text-2xl font-extrabold text-[#1B4F72]">{Math.round((b.occupied / b.total) * 100)}%</p>
              <p className="text-xs text-[#4A5568] font-medium mt-1">{b.occupied}/{b.total} occupied · {b.maintenance} maintenance</p>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${(b.occupied / b.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 bg-[#F5F7FA] rounded-xl p-4 border border-[#071B34]/10">
          <BrainCircuit className="w-5 h-5 text-[#1B4F72] shrink-0" />
          <p className="text-sm text-[#071B34]">AI Capacity Planning: Block B will reach 98% by August. Consider opening 6 rooms in Block A.</p>
        </div>
      </div>
    </div>
  );
}
