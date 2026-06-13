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
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav portal="Admin Portal" portalColor="text-purple-600" userName="Dr. Rajesh Kumar" avatar="RK" homeHref="/admin/dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Room Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div key={b.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center gap-2 mb-3"><BedDouble className="w-5 h-5 text-indigo-600" /><h3 className="font-semibold">{b.name}</h3></div>
              <p className="text-2xl font-extrabold text-indigo-600">{Math.round((b.occupied / b.total) * 100)}%</p>
              <p className="text-xs text-gray-500 mt-1">{b.occupied}/{b.total} occupied · {b.maintenance} maintenance</p>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${(b.occupied / b.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-sm text-indigo-700">AI Capacity Planning: Block B will reach 98% by August. Consider opening 6 rooms in Block A.</p>
        </div>
      </div>
    </div>
  );
}
