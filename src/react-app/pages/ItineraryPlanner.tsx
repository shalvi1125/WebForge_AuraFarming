import { useState } from 'react';
import { Link } from 'react-router';
import {
  Calendar, Clock, CheckCircle2, XCircle, BrainCircuit, ChevronRight,
  ArrowLeft, Plus, FileText, BarChart3, User, Shield,
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

const statusStyles: Record<LeaveStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
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

  const stats = {
    total: leaveHistory.length,
    approved: leaveHistory.filter((l) => l.status === 'Approved').length,
    pending: leaveHistory.filter((l) => l.status === 'Pending').length,
    daysUsed: 7,
    daysRemaining: 18,
  };

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Leave Management"
        userName="Aryan Sharma"
        userMeta="CS21B047"
        avatar="AS"
        homeHref="/student/dashboard"
        links={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Room', href: '/student/room' },
          { label: 'Complaints', href: '/student/complaints' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Leave Management</h1>
            <p className="text-gray-500 text-sm mt-1">Apply, track, and manage hostel leave requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-indigo-200 transition-shadow"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Days Used', value: stats.daysUsed, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Days Remaining', value: stats.daysRemaining, icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-6 animate-fade-up">
            <h2 className="font-semibold text-gray-800 mb-4">New Leave Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">From Date</label>
                <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">To Date</label>
                <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-gray-500 font-medium">Reason</label>
                <input type="text" placeholder="Purpose of leave" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">Submit Application</button>
              <button onClick={() => setShowForm(false)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
            </div>
            <div className="mt-4 flex items-start gap-2 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-700">AI Tip: Your selected dates overlap with exam week. Consider applying 3 days earlier for faster approval.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Leave History</h2>
              <span className="text-xs text-gray-400">{leaveHistory.length} requests</span>
            </div>
            <div className="divide-y divide-gray-50">
              {leaveHistory.map((l) => (
                <div key={l.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{l.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">{l.id} · Applied {l.appliedOn} · {l.days} day{l.days > 1 ? 's' : ''}</p>
                      <p className="text-xs text-gray-500 mt-1">{l.from} → {l.to}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyles[l.status]}`}>{l.status}</span>
                  </div>
                  {l.status === 'Pending' && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                      </div>
                      <span className="text-xs text-gray-400">Awaiting warden approval</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> June 2025
              </h2>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <div key={d} className="text-xs text-gray-400 font-medium py-1">{d}</div>
                ))}
                {calendarDays.map(({ day, onLeave, pending }) => (
                  <div
                    key={day}
                    className={`text-xs py-2 rounded-lg font-medium ${
                      onLeave && pending ? 'bg-amber-100 text-amber-700' :
                      onLeave ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Approval Workflow
              </h2>
              <div className="space-y-3">
                {[
                  { step: 'Application Submitted', done: true, user: 'You' },
                  { step: 'Warden Review', done: false, active: true, user: 'Dr. Priya Mehta' },
                  { step: 'Security Notified', done: false, user: 'Gate Office' },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      s.done ? 'bg-green-100 text-green-700' : s.active ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {s.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.step}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><User className="w-3 h-3" />{s.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/chat" className="block bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <p className="text-white font-semibold text-sm">AI Leave Guidance</p>
              </div>
              <p className="text-indigo-200 text-xs">Ask about leave policies, document requirements, and approval timelines.</p>
              <span className="inline-flex items-center gap-1 text-cyan-300 text-xs font-medium mt-2">
                Open AI Assistant <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
