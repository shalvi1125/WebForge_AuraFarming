import { Link } from 'react-router';
import { AlertCircle, ArrowLeft, BrainCircuit, CheckCircle2, Clock } from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import {
  type ComplaintPriority,
  type ComplaintStatus,
  type HostelComplaint,
  getStatusCounts,
  useComplaints,
} from '@/react-app/lib/complaints';

const STATUS_OPTIONS: ComplaintStatus[] = ['Open', 'In Progress', 'Resolved'];
const PRIORITY_OPTIONS: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const priorityStyles: Record<ComplaintPriority, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
  Critical: 'bg-red-100 text-red-700',
};

function suggestedAssignee(category: string) {
  if (category === 'Plumbing') return 'Rajan Kumar';
  if (category === 'Electrical') return 'Electrical Team';
  if (category === 'Internet') return 'IT Support';
  if (category === 'Hygiene') return 'Mess Supervisor';
  if (category === 'Security') return 'Security Dept.';
  return 'Maintenance Team';
}

export default function WardenComplaints() {
  const { complaints, updateComplaint } = useComplaints();
  const counts = getStatusCounts(complaints);

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Warden Portal" userName="Dr. Priya Mehta" avatar="PM" homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/warden/room' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-[#071B34]">Complaints Queue</h1>
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: 'Open', v: String(counts.open), c: 'text-rose-600' },
            { l: 'In Progress', v: String(counts.inProgress), c: 'text-amber-600' },
            { l: 'Resolved Today', v: String(counts.resolved), c: 'text-green-600' },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"><p className="text-xs text-[#374151]">{s.l}</p><p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p></div>
          ))}
        </div>
        <div className="space-y-3">
          {complaints.map((c: HostelComplaint) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#071B34]">{c.title}</p>
                  <p className="text-xs text-[#374151] mt-1">{c.id} Â· {c.student} Â· Room {c.room}</p>
                  <p className="text-xs text-[#1B4F72] mt-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3" />{c.category} Â· {c.assignedTo}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>
                  <span className="text-xs text-[#374151] flex items-center gap-1">
                    {c.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3" /> : c.status === 'Open' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <select
                  value={c.status}
                  onChange={(e) => updateComplaint(c.id, { status: e.target.value as ComplaintStatus })}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-[#374151] bg-white"
                  aria-label={`Status for ${c.id}`}
                >
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select
                  value={c.priority}
                  onChange={(e) => updateComplaint(c.id, { priority: e.target.value as ComplaintPriority })}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-[#374151] bg-white"
                  aria-label={`Priority for ${c.id}`}
                >
                  {PRIORITY_OPTIONS.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
                <button
                  onClick={() => updateComplaint(c.id, { assignedTo: suggestedAssignee(c.category), status: c.status === 'Open' ? 'In Progress' : c.status })}
                  className="text-xs bg-[#071B34] text-white px-3 py-1.5 rounded-lg font-medium"
                >
                  Assign
                </button>
                <button
                  onClick={() => updateComplaint(c.id, { status: 'Resolved' })}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-[#374151]"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
