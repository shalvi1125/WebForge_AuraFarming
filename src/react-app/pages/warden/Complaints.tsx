import { Link } from 'react-router';
import { AlertCircle, ArrowLeft, BrainCircuit, CheckCircle2, Clock } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const queue = [
  { id: 'CMP-041', title: 'Water leakage near bathroom sink', student: 'Aryan Sharma', room: '204', priority: 'High', status: 'In Progress', ai: 'Plumbing · 97% confidence' },
  { id: 'CMP-040', title: 'Power socket not working', student: 'Rohit Verma', room: '211', priority: 'High', status: 'Open', ai: 'Electrical · 92% confidence' },
  { id: 'CMP-039', title: 'Wi-Fi outage in west wing', student: 'Sneha Patil', room: '208', priority: 'Medium', status: 'Open', ai: 'Internet · 95% confidence' },
];

export default function WardenComplaints() {
  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav portal="Warden Portal" portalColor="text-emerald-600" userName="Dr. Priya Mehta" avatar="PM" homeHref="/warden/dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Complaints Queue</h1>
        <div className="grid grid-cols-3 gap-4">
          {[{ l: 'Open', v: '8', c: 'text-rose-600' }, { l: 'In Progress', v: '4', c: 'text-amber-600' }, { l: 'Resolved Today', v: '3', c: 'text-green-600' }].map((s) => (
            <div key={s.l} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">{s.l}</p><p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p></div>
          ))}
        </div>
        <div className="space-y-3">
          {queue.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.id} · {c.student} · Room {c.room}</p>
                  <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3" />{c.ai}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{c.priority}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">{c.status === 'Open' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{c.status}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium">Assign</button>
                <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-600">Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
