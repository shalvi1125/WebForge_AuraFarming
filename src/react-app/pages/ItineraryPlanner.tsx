import { useState } from 'react';
import { Link } from 'react-router';
import {
  Calendar, Clock, CheckCircle2, XCircle, BrainCircuit, ChevronRight,
  Plus, User,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

interface LeaveRequest {
  id: string;
  reason: string;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
  appliedOn: string;
  warden: string;
}

const leaveHistory: LeaveRequest[] = [
  { id: 'LV-014', reason: 'Family function — summer break', from: '14 Jun', to: '17 Jun', days: 4, status: 'Pending', appliedOn: '10 Jun', warden: 'Dr. Priya Mehta' },
  { id: 'LV-011', reason: 'Medical appointment', from: '02 Jun', to: '02 Jun', days: 1, status: 'Approved', appliedOn: '01 Jun', warden: 'Dr. Priya Mehta' },
  { id: 'LV-008', reason: 'College fest at home campus', from: '20 May', to: '22 May', days: 3, status: 'Rejected', appliedOn: '18 May', warden: 'Dr. Priya Mehta' },
  { id: 'LV-005', reason: 'Personal work at hometown', from: '05 May', to: '07 May', days: 3, status: 'Approved', appliedOn: '03 May', warden: 'Dr. Priya Mehta' },
];

const statusColor: Record<LeaveStatus, string> = {
  Pending: 'text-[#4CC9F0]', Approved: 'text-[#67E8F9]', Rejected: 'text-[#4A5568]',
};

const calendarDays = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const onLeave = [14, 15, 16, 17].includes(day);
  const pending = [14, 15, 16, 17].includes(day);
  return { day, onLeave, pending };
});

export default function LeaveManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reason: '', from: '', to: '' });

  const pending = leaveHistory.filter((l) => l.status === 'Pending').length;
  const approved = leaveHistory.filter((l) => l.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter">
      <PortalNav portal="Leave Management" userName="Aryan Sharma" userMeta="CS21B047" avatar="AS" homeHref="/student/dashboard"
        links={[{ label: 'Dashboard', href: '/student/dashboard' }, { label: 'Room', href: '/student/room' }, { label: 'Complaints', href: '/student/complaints' }]} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div>
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-3">Workflow</p>
            <h1 className="text-4xl lg:text-5xl font-semibold text-[#071B34] tracking-tight">Leave Management</h1>
            <p className="text-[#4A5568] mt-4">Apply, track, and manage hostel leave requests.</p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div><p className="text-2xl font-semibold text-[#071B34]">7</p><p className="text-xs text-[#4A5568] uppercase tracking-wider mt-1">Days used</p></div>
            <div><p className="text-2xl font-semibold text-[#4CC9F0]">18</p><p className="text-xs text-[#4A5568] uppercase tracking-wider mt-1">Remaining</p></div>
            <div><p className="text-2xl font-semibold text-[#071B34]">{pending}</p><p className="text-xs text-[#4A5568] uppercase tracking-wider mt-1">Pending</p></div>
            <div><p className="text-2xl font-semibold text-[#071B34]">{approved}</p><p className="text-xs text-[#4A5568] uppercase tracking-wider mt-1">Approved</p></div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-[#071B34] text-[#F8FAFC] px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#0A2342] transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        </header>

        {showForm && (
          <section className="surface-panel rounded-2xl p-8 lg:p-10 mb-20 animate-fade-up">
            <h2 className="text-xl font-semibold text-[#071B34] mb-8">New Leave Application</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-[#4A5568] uppercase tracking-wider">From Date</label>
                <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full mt-2 border border-[#071B34]/10 rounded-lg px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none" />
              </div>
              <div>
                <label className="text-xs text-[#4A5568] uppercase tracking-wider">To Date</label>
                <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full mt-2 border border-[#071B34]/10 rounded-lg px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none" />
              </div>
              <div>
                <label className="text-xs text-[#4A5568] uppercase tracking-wider">Reason</label>
                <input type="text" placeholder="Purpose of leave" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full mt-2 border border-[#071B34]/10 rounded-lg px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-[#4CC9F0]/30 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <button className="bg-[#071B34] text-[#F8FAFC] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0A2342]">Submit Application</button>
              <button onClick={() => setShowForm(false)} className="text-[#4A5568] text-sm hover:text-[#071B34]">Cancel</button>
            </div>
            <div className="mt-6 flex items-start gap-3 p-4 bg-[#071B34]/5 rounded-lg">
              <BrainCircuit className="w-4 h-4 text-[#1B4F72] shrink-0 mt-0.5" />
              <p className="text-xs text-[#4A5568]">AI Tip: Your selected dates overlap with exam week. Consider applying 3 days earlier for faster approval.</p>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Timeline — not table */}
          <div className="lg:col-span-2">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-8">Request Timeline</p>
            <div className="space-y-0">
              {leaveHistory.map((l, i) => (
                <div key={l.id} className="flex gap-8 pb-12 relative">
                  {i < leaveHistory.length - 1 && <div className="absolute left-[11px] top-8 bottom-0 w-px bg-[#071B34]/10" />}
                  <div className={`w-6 h-6 rounded-full shrink-0 mt-1 flex items-center justify-center ${l.status === 'Approved' ? 'bg-[#1B4F72]' : l.status === 'Rejected' ? 'bg-[#4A5568]/30' : 'bg-[#4CC9F0]/30 ring-2 ring-[#4CC9F0]'}`}>
                    {l.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-[#F8FAFC]" />}
                    {l.status === 'Rejected' && <XCircle className="w-3 h-3 text-[#4A5568]" />}
                    {l.status === 'Pending' && <Clock className="w-3 h-3 text-[#1B4F72]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-[#071B34]">{l.reason}</p>
                        <p className="text-sm text-[#4A5568] mt-2">{l.id} · Applied {l.appliedOn} · {l.days} day{l.days > 1 ? 's' : ''}</p>
                        <p className="text-sm text-[#4A5568] mt-1">{l.from} → {l.to}</p>
                      </div>
                      <span className={`text-xs font-medium uppercase tracking-wider shrink-0 ${statusColor[l.status]}`}>{l.status}</span>
                    </div>
                    {l.status === 'Pending' && (
                      <div className="mt-6">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex-1 h-1 bg-[#071B34]/5 rounded-full"><div className="h-full w-1/2 bg-[#4CC9F0] rounded-full" /></div>
                          <span className="text-xs text-[#4A5568]">Warden review</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-16">
            {/* Calendar */}
            <div>
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">June 2025</p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <div key={d} className="text-xs text-[#4A5568] font-medium py-2">{d}</div>
                ))}
                {calendarDays.map(({ day, onLeave, pending }) => (
                  <div key={day} className={`text-xs py-2.5 rounded-lg font-medium ${onLeave && pending ? 'bg-[#4CC9F0]/20 text-[#1B4F72]' : onLeave ? 'bg-[#1B4F72]/10 text-[#071B34]' : 'text-[#4A5568] hover:bg-white'}`}>{day}</div>
                ))}
              </div>
            </div>

            {/* Approval flow */}
            <div>
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest mb-6">Approval Flow</p>
              <div className="space-y-0">
                {[
                  { step: 'Application Submitted', done: true, user: 'You' },
                  { step: 'Warden Review', done: false, active: true, user: 'Dr. Priya Mehta' },
                  { step: 'Security Notified', done: false, user: 'Gate Office' },
                ].map((s, i, arr) => (
                  <div key={s.step} className="flex gap-4 pb-8 relative">
                    {i < arr.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#071B34]/10" />}
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs ${s.done ? 'bg-[#1B4F72] text-[#F8FAFC]' : s.active ? 'ring-2 ring-[#4CC9F0] bg-white text-[#1B4F72]' : 'bg-[#071B34]/5 text-[#4A5568]'}`}>
                      {s.done ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#071B34]">{s.step}</p>
                      <p className="text-xs text-[#4A5568] flex items-center gap-1 mt-1"><User className="w-3 h-3" />{s.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/chat" className="block surface-panel-dark rounded-2xl p-8 elevate-hover">
              <BrainCircuit className="w-5 h-5 text-[#4CC9F0] mb-3" />
              <p className="font-semibold text-[#F8FAFC] text-sm mb-2">AI Leave Guidance</p>
              <p className="text-[#4A5568] text-xs">Ask about policies, documents, and approval timelines.</p>
              <span className="inline-flex items-center gap-1 text-[#4CC9F0] text-xs mt-4">Open AI Assistant <ChevronRight className="w-3.5 h-3.5" /></span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
