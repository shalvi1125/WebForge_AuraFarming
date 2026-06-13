// src/react-app/pages/warden/Dashboard.tsx
import { Link } from 'react-router';
import {
  Building2, Users, AlertCircle, Calendar, BrainCircuit,
  BedDouble, Wrench, Wifi, Droplets, Zap, ShieldAlert, Sofa,
  ChevronRight, Bell, LogOut, CheckCircle2, Clock, ArrowUpRight,
  TrendingUp, Activity, DoorOpen,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
type Priority = 'High' | 'Medium' | 'Low';
type Status   = 'Open' | 'In Progress' | 'Resolved';

interface QueueComplaint {
  id: string;
  title: string;
  student: string;
  room: string;
  category: string;
  priority: Priority;
  status: Status;
  time: string;
}

// ── Mock Data ─────────────────────────────────────────────
const warden = {
  name: 'Dr. Priya Mehta',
  hostel: 'Tagore Hostel',
  block: 'Block B',
  totalStudents: 128,
  avatar: 'PM',
};

const stats = [
  { label: 'Total Students',       value: '128',  sub: '+3 this month',  icon: Users,       color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100' },
  { label: 'Active Complaints',    value: '14',   sub: '3 high priority', icon: AlertCircle, color: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-100' },
  { label: 'Pending Leave',        value: '6',    sub: '2 require action',icon: Calendar,    color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100' },
  { label: 'Occupancy Rate',       value: '87%',  sub: '112 / 128 rooms', icon: BedDouble,   color: 'text-cyan-600',   bg: 'bg-cyan-50',    border: 'border-cyan-100' },
];

const complaintQueue: QueueComplaint[] = [
  { id: 'CMP-041', title: 'Water leakage near bathroom sink', student: 'Aryan Sharma',   room: '204', category: 'Plumbing',   priority: 'High',   status: 'In Progress', time: '2h ago' },
  { id: 'CMP-040', title: 'Power socket not working',         student: 'Rohit Verma',    room: '211', category: 'Electrical', priority: 'High',   status: 'Open',        time: '3h ago' },
  { id: 'CMP-039', title: 'Wi-Fi outage in west wing',        student: 'Sneha Patil',    room: '208', category: 'Internet',   priority: 'Medium', status: 'Open',        time: '5h ago' },
  { id: 'CMP-037', title: 'Broken window latch',              student: 'Karan Joshi',    room: '215', category: 'Furniture',  priority: 'Low',    status: 'Open',        time: '8h ago' },
  { id: 'CMP-036', title: 'Washroom cleaning not done',       student: 'Priya Singh',    room: '202', category: 'Hygiene',    priority: 'Medium', status: 'In Progress', time: '10h ago' },
];

const highPriorityAlerts = complaintQueue.filter(c => c.priority === 'High');

const occupancy = [
  { label: 'Occupied',    value: 112, total: 128, color: 'bg-indigo-500',  text: 'text-indigo-600' },
  { label: 'Vacant',      value: 10,  total: 128, color: 'bg-cyan-400',    text: 'text-cyan-600' },
  { label: 'Maintenance', value: 6,   total: 128, color: 'bg-amber-400',   text: 'text-amber-600' },
];

const activityFeed = [
  { icon: CheckCircle2, color: 'text-green-500',  bg: 'bg-green-50',  text: 'Complaint CMP-031 resolved',              sub: 'Mess food quality · 2h ago' },
  { icon: CheckCircle2, color: 'text-blue-500',   bg: 'bg-blue-50',   text: 'Leave request LV-014 approved',           sub: 'Aryan Sharma · 3h ago' },
  { icon: DoorOpen,     color: 'text-purple-500', bg: 'bg-purple-50', text: 'Visitor request submitted for Room 204',  sub: 'Ramesh Sharma · 4h ago' },
  { icon: AlertCircle,  color: 'text-rose-500',   bg: 'bg-rose-50',   text: 'New high-priority complaint filed',       sub: 'Rohit Verma · Room 211 · 3h ago' },
  { icon: Users,        color: 'text-indigo-500', bg: 'bg-indigo-50', text: '3 new students checked in',               sub: 'Block B · Today' },
  { icon: TrendingUp,   color: 'text-cyan-500',   bg: 'bg-cyan-50',   text: 'Monthly occupancy report generated',      sub: 'Admin · Yesterday' },
];

const aiInsights = [
  { text: 'Block B has unusually high plumbing complaints this week.',            severity: 'high',   icon: Droplets },
  { text: 'Internet complaints increased by 22% compared to last week.',          severity: 'medium', icon: Wifi },
  { text: 'Room occupancy expected to reach 95% next month based on trends.',     severity: 'info',   icon: TrendingUp },
  { text: '4 students have not paid fees. Automated reminders sent.',             severity: 'medium', icon: Activity },
  { text: 'Electrical issues peak on weekends — consider proactive maintenance.', severity: 'info',   icon: Zap },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  Plumbing:   Droplets,
  Electrical: Zap,
  Hygiene:    Wrench,
  Furniture:  Sofa,
  Security:   ShieldAlert,
  Internet:   Wifi,
};

const categoryColors: Record<string, string> = {
  Plumbing:   'bg-blue-100 text-blue-700',
  Electrical: 'bg-yellow-100 text-yellow-700',
  Hygiene:    'bg-green-100 text-green-700',
  Furniture:  'bg-orange-100 text-orange-700',
  Security:   'bg-red-100 text-red-700',
  Internet:   'bg-purple-100 text-purple-700',
};

const priorityStyles: Record<Priority, string> = {
  High:   'bg-rose-50 text-rose-600 border border-rose-200',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
  Low:    'bg-green-50 text-green-600 border border-green-200',
};

const statusStyles: Record<Status, string> = {
  Open:          'bg-rose-100 text-rose-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved:      'bg-green-100 text-green-700',
};

const aiSeverityStyles: Record<string, string> = {
  high:   'border-l-rose-500 bg-rose-50',
  medium: 'border-l-amber-500 bg-amber-50',
  info:   'border-l-indigo-400 bg-indigo-50',
};

const aiTextStyles: Record<string, string> = {
  high:   'text-rose-700',
  medium: 'text-amber-700',
  info:   'text-indigo-700',
};

export default function WardenDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-gray-900 text-sm">HostelIQ</p>
              <p className="text-xs text-indigo-500">Warden Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {warden.avatar}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-sm font-semibold text-gray-800">{warden.name}</p>
                <p className="text-xs text-gray-400">Warden · {warden.block}</p>
              </div>
            </div>
            <Link to="/" className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Home">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
              <h1 className="text-2xl font-extrabold text-white">{warden.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-indigo-100 text-sm">
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{warden.hostel}</span>
                <span className="text-indigo-300">·</span>
                <span>{warden.block}</span>
                <span className="text-indigo-300">·</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{warden.totalStudents} Students</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/warden/complaints"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <AlertCircle className="w-4 h-4" /> Manage Complaints
              </Link>
              <Link to="/warden/students"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Users className="w-4 h-4" /> View Students
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                    <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
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

          {/* Left / Main col (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* High Priority Alerts */}
            {highPriorityAlerts.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 flex items-center gap-2 border-b border-rose-200 bg-rose-100/60">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <p className="text-sm font-semibold text-rose-700">High Priority Alerts</p>
                  <span className="ml-auto bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{highPriorityAlerts.length}</span>
                </div>
                <div className="divide-y divide-rose-100">
                  {highPriorityAlerts.map(c => {
                    const CatIcon = categoryIcons[c.category] || Wrench;
                    return (
                      <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColors[c.category] || 'bg-gray-100 text-gray-500'}`}>
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.student} · Room {c.room} · {c.time}</p>
                        </div>
                        <Link to="/warden/complaints"
                          className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                          Act <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complaint Queue */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <h2 className="font-semibold text-gray-800">Complaint Queue</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{complaintQueue.length}</span>
                </div>
                <Link to="/warden/complaints" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
                  Manage all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {complaintQueue.map(c => {
                  const CatIcon = categoryIcons[c.category] || Wrench;
                  return (
                    <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${categoryColors[c.category] || 'bg-gray-100 text-gray-500'}`}>
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                          <span>{c.student}</span>
                          <span>·</span>
                          <span>Room {c.room}</span>
                          <span>·</span>
                          <span>{c.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[c.priority]}`}>{c.priority}</span>
                        <span className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[c.status]}`}>{c.status}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Occupancy Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-cyan-500" />
                <h2 className="font-semibold text-gray-800">Occupancy Overview</h2>
                <span className="ml-auto text-xs text-gray-400">Total: 128 rooms</span>
              </div>
              <div className="p-6 space-y-5">
                {occupancy.map(o => (
                  <div key={o.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{o.label}</span>
                      <span className={`font-bold ${o.text}`}>{o.value} <span className="text-gray-400 font-normal text-xs">/ {o.total}</span></span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${o.color} transition-all duration-700`}
                        style={{ width: `${Math.round((o.value / o.total) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round((o.value / o.total) * 100)}% of total capacity</p>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {occupancy.map(o => (
                    <div key={o.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className={`text-2xl font-extrabold ${o.text}`}>{o.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{o.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right col (1/3) */}
          <div className="space-y-6">

            {/* Quick Nav */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Quick Navigation</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: 'Student List',    icon: Users,       href: '/warden/students',   grad: 'from-indigo-500 to-blue-500' },
                  { label: 'All Complaints',  icon: AlertCircle, href: '/warden/complaints', grad: 'from-rose-500 to-pink-500' },
                  { label: 'Leave Requests',  icon: Calendar,    href: '/warden/leave',      grad: 'from-amber-500 to-orange-500' },
                  { label: 'AI Assistant',    icon: BrainCircuit,href: '/chat',              grad: 'from-cyan-500 to-blue-500' },
                ].map(n => {
                  const Icon = n.icon;
                  return (
                    <Link key={n.label} to={n.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-9 h-9 bg-gradient-to-br ${n.grad} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{n.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-indigo-400 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                <h2 className="font-semibold text-gray-800">AI Insights</h2>
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Live</span>
              </div>
              <div className="p-4 space-y-2.5">
                {aiInsights.map((ins, i) => {
                  const Icon = ins.icon;
                  return (
                    <div key={i} className={`border-l-4 rounded-r-xl px-3 py-2.5 ${aiSeverityStyles[ins.severity]}`}>
                      <div className="flex items-start gap-2">
                        <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${aiTextStyles[ins.severity]}`} />
                        <p className={`text-xs leading-relaxed font-medium ${aiTextStyles[ins.severity]}`}>{ins.text}</p>
                      </div>
                    </div>
                  );
                })}
                <Link to="/chat"
                  className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs px-3 py-2.5 rounded-xl font-semibold mt-1 hover:from-indigo-700 hover:to-blue-700 transition-all">
                  <span>Ask AI Assistant</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="p-4 space-y-3">
                {activityFeed.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 ${a.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-3.5 h-3.5 ${a.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 leading-snug">{a.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.sub}</p>
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
