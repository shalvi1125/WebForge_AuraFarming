// src/react-app/pages/student/Dashboard.tsx
import { Link } from 'react-router';
import {
  Building2, Home, AlertCircle, Calendar, IndianRupee,
  Users, BrainCircuit, ChevronRight, Bell, LogOut,
  CheckCircle2, Clock, XCircle, ArrowUpRight, Wifi,
  Wrench, Utensils, BedDouble, User, Megaphone, UserCheck,
} from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ── Mock Data ──────────────────────────────────────────────
const student = {
  name: 'Aryan Sharma',
  rollNo: 'CS21B047',
  room: '204',
  block: 'Block B',
  hostel: 'Tagore Hostel',
  avatar: 'AS',
};

const stats = [
  { label: 'Active Complaints', value: '2', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Pending Leave', value: '1', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Outstanding Fees', value: '₹4,500', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { label: 'Visitors This Month', value: '3', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

const complaints = [
  { id: 'CMP-041', title: 'Water leakage near washroom', status: 'In Progress', priority: 'High', date: '10 Jun', icon: Wrench },
  { id: 'CMP-038', title: 'Wi-Fi not working in room', status: 'Open', priority: 'Medium', date: '07 Jun', icon: Wifi },
  { id: 'CMP-031', title: 'Mess food quality issue', status: 'Resolved', priority: 'Low', date: '01 Jun', icon: Utensils },
];

const leaveRequests = [
  { id: 'LV-014', reason: 'Family function – Diwali holidays', from: '14 Jun', to: '17 Jun', status: 'Pending' },
  { id: 'LV-011', reason: 'Medical appointment', from: '02 Jun', to: '02 Jun', status: 'Approved' },
  { id: 'LV-008', reason: 'College fest at home campus', from: '20 May', to: '22 May', status: 'Rejected' },
];

const statusStyles: Record<string, string> = {
  Open: 'bg-rose-100 text-rose-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const priorityStyles: Record<string, string> = {
  High: 'bg-rose-50 text-rose-600 border border-rose-200',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
  Low: 'bg-green-50 text-green-600 border border-green-200',
};

const statusIcon = (s: string) => {
  if (s === 'Resolved' || s === 'Approved') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (s === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

const quickActions = [
  { label: 'File Complaint', icon: AlertCircle, href: '/student/complaints', gradient: 'from-rose-500 to-pink-500' },
  { label: 'Apply Leave', icon: Calendar, href: '/student/leave', gradient: 'from-amber-500 to-orange-500' },
  { label: 'View Fees', icon: IndianRupee, href: '/student/fees', gradient: 'from-indigo-500 to-blue-500' },
  { label: 'AI Assistant', icon: BrainCircuit, href: '/chat', gradient: 'from-cyan-500 to-blue-500' },
];

const recentActivity = [
  { text: 'Complaint CMP-041 moved to In Progress', time: '2h ago', icon: AlertCircle },
  { text: 'Leave LV-014 submitted for approval', time: '3d ago', icon: Calendar },
  { text: 'Visitor pass issued for Rahul Sharma', time: '5d ago', icon: UserCheck },
  { text: 'Mess fee reminder — ₹3,500 due 30 Jun', time: '1w ago', icon: IndianRupee },
];

const visitorRequests = [
  { name: 'Rahul Sharma', date: '14 Jun', status: 'Approved' },
  { name: 'Amit Patel', date: '16 Jun', status: 'Pending' },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 page-enter gradient-mesh">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-gray-900 text-sm">HostelIQ</p>
              <p className="text-xs text-indigo-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <Link to="/student/profile" className="flex items-center space-x-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {student.avatar}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-400">{student.rollNo}</p>
              </div>
            </Link>
            <Link to="/" className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-indigo-200 text-sm font-medium">{getGreeting()} 👋</p>
              <h1 className="text-2xl font-extrabold text-white">{student.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-indigo-100 text-sm">
                <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> Room {student.room}</span>
                <span className="text-indigo-300">·</span>
                <span>{student.block}</span>
                <span className="text-indigo-300">·</span>
                <span>{student.hostel}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/20">
              <BrainCircuit className="w-4 h-4 text-cyan-300" />
              <span>AI Insights Active</span>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                    <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left col (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Room Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-semibold text-gray-800">Room Information</h2>
                </div>
                <Link to="/student/room" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Room Number', value: '204' },
                  { label: 'Block', value: 'Block B' },
                  { label: 'Occupancy', value: '3 / 4' },
                  { label: 'Status', value: 'Occupied', highlight: true },
                ].map((r) => (
                  <div key={r.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">{r.label}</p>
                    <p className={`text-sm font-bold ${r.highlight ? 'text-green-600' : 'text-gray-800'}`}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium text-gray-600">Room Occupancy</span>
                  <span className="text-indigo-600 font-semibold">75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <h2 className="font-semibold text-gray-800">Recent Complaints</h2>
                </div>
                <Link to="/student/complaints" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {complaints.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.id} · {c.date}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[c.status]}`}>
                          {statusIcon(c.status)} {c.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h2 className="font-semibold text-gray-800">Leave Requests</h2>
                </div>
                <Link to="/student/leave" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {leaveRequests.map((l) => (
                  <div key={l.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{l.reason}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l.id} · {l.from} → {l.to}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyles[l.status]}`}>
                      {statusIcon(l.status)} {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col (1/3) */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link
                      key={a.label}
                      to={a.href}
                      className={`bg-gradient-to-br ${a.gradient} text-white rounded-xl p-4 flex flex-col items-center space-y-2 hover:opacity-90 hover:scale-[1.03] transition-all duration-150 shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-semibold text-center leading-tight">{a.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-5 flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold border-2 border-white/40">
                  {student.avatar}
                </div>
                <p className="text-white font-bold text-base">{student.name}</p>
                <p className="text-indigo-100 text-xs">{student.rollNo}</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Hostel', value: student.hostel },
                  { label: 'Room', value: `${student.room}, ${student.block}` },
                  { label: 'Year', value: '3rd Year · CSE' },
                  { label: 'Status', value: 'Active', green: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{row.label}</span>
                    <span className={`font-medium ${row.green ? 'text-green-600' : 'text-gray-700'}`}>{row.value}</span>
                  </div>
                ))}
                <Link
                  to="/student/profile"
                  className="mt-2 w-full flex items-center justify-center gap-2 border border-indigo-200 text-indigo-600 py-2 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  <User className="w-4 h-4" /> View Full Profile
                </Link>
              </div>
            </div>

            {/* AI Tip Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <p className="text-white font-semibold text-sm">AI Recommendations</p>
              </div>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Your Wi-Fi complaint has been open for 6 days. I've flagged it as high priority and notified the warden. Consider applying for leave before exam week for faster approval.
              </p>
              <Link
                to="/chat"
                className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors text-white text-xs px-3 py-2 rounded-xl font-medium"
              >
                <span>Ask AI Assistant</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visitor Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Visitor Requests</h2>
                <Link to="/visitor/request" className="text-xs text-indigo-600 font-medium">View all</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {visitorRequests.map((v) => (
                  <div key={v.name} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <Link to="/student/announcements" className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <p className="font-semibold text-gray-800 text-sm">Hostel Announcements</p>
              </div>
              <p className="text-xs text-gray-500">Curfew extended for fest week · Mess menu update · Fire drill 16 Jun</p>
              <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium mt-2">Read notices <ChevronRight className="w-3 h-3" /></span>
            </Link>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="px-5 py-3 flex items-start gap-3">
                      <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-700">{a.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
