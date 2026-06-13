import { Link } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, Clock, BrainCircuit } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const requests = [
  { id: 'LV-014', student: 'Aryan Sharma', room: '204', reason: 'Family function', from: '14 Jun', to: '17 Jun', status: 'Pending' },
  { id: 'LV-013', student: 'Sneha Patil', room: '208', reason: 'Medical appointment', from: '15 Jun', to: '15 Jun', status: 'Pending' },
  { id: 'LV-012', student: 'Karan Joshi', room: '215', reason: 'Home visit', from: '12 Jun', to: '14 Jun', status: 'Approved' },
];

export default function WardenLeave() {
  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav portal="Warden Portal" portalColor="text-emerald-600" userName="Dr. Priya Mehta" avatar="PM" homeHref="/warden/dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Leave Approvals</h1>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
          <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-sm text-indigo-700">AI recommends approving LV-012 and reviewing LV-014 — 3 overlapping requests may affect Block B occupancy.</p>
        </div>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800">{r.student} · Room {r.room}</p>
                  <p className="text-sm text-gray-600 mt-1">{r.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.id} · {r.from} → {r.to}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {r.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{r.status}
                </span>
              </div>
              {r.status === 'Pending' && (
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-1 text-xs bg-green-600 text-white px-4 py-2 rounded-lg font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                  <button className="flex items-center gap-1 text-xs bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg font-medium"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
