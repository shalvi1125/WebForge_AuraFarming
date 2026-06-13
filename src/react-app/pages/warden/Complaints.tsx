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
import { WARDEN } from '@/react-app/lib/wardenState';

const STATUS_OPTIONS: ComplaintStatus[] = ['Open', 'In Progress', 'Resolved'];
const PRIORITY_OPTIONS: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const ASSIGNEE_OPTIONS = ['Unassigned', 'Rajan Kumar', 'Electrical Team', 'IT Support', 'Mess Supervisor', 'Security Dept.', 'Maintenance Team', 'Emergency Maintenance'];

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
  if (category === 'Furniture') return 'Maintenance Team';
  return 'Maintenance Team';
}

function statusIcon(status: ComplaintStatus) {
  if (status === 'Resolved') return <CheckCircle2 className="w-3 h-3" />;
  if (status === 'Open') return <AlertCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
}

export default function WardenComplaints() {
  const { complaints, updateComplaint } = useComplaints();
  const counts = getStatusCounts(complaints);

  function assignComplaint(complaint: HostelComplaint, assignedTo: string) {
    updateComplaint(complaint.id, {
      assignedTo,
      status: assignedTo === 'Unassigned' ? complaint.status : complaint.status === 'Open' ? 'In Progress' : complaint.status,
    });
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Warden Portal" userName={WARDEN.name} avatar={WARDEN.avatar} homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/warden/room' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link to="/warden/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1B4F72] font-medium"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-[#071B34]">Complaints Queue</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Total', v: String(counts.total), c: 'text-[#1B4F72]' },
            { l: 'Open', v: String(counts.open), c: 'text-rose-600' },
            { l: 'In Progress', v: String(counts.inProgress), c: 'text-amber-600' },
            { l: 'Resolved', v: String(counts.resolved), c: 'text-green-600' },
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
                  <p className="text-xs text-[#374151] mt-1">{c.id} - {c.student} - Room {c.room} - {c.date}</p>
                  <p className="text-xs text-[#374151] mt-2 max-w-2xl">{c.description}</p>
                  <p className="text-xs text-[#1B4F72] mt-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3" />{c.category} - {c.assignedTo}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>
                  <span className="text-xs text-[#374151] flex items-center gap-1">
                    {statusIcon(c.status)}
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
                <select
                  value={c.assignedTo}
                  onChange={(e) => assignComplaint(c, e.target.value)}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-[#374151] bg-white"
                  aria-label={`Assignee for ${c.id}`}
                >
                  {ASSIGNEE_OPTIONS.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
                </select>
                <button
                  onClick={() => assignComplaint(c, suggestedAssignee(c.category))}
                  className="text-xs bg-[#071B34] text-white px-3 py-1.5 rounded-lg font-medium"
                >
                  Auto Assign
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
