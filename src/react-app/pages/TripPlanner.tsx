import { Link } from 'react-router';
import {
  Building2, Users, BedDouble, IndianRupee, AlertCircle, BarChart3,
  BrainCircuit, TrendingUp, TrendingDown, ChevronRight, ArrowUpRight,
  PieChart, Activity, Shield, Calendar, Home,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';

const campusStats = [
  { label: 'Total Hostels', value: '12', change: '+2', up: true, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Students Housed', value: '4,820', change: '+124', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Occupancy Rate', value: '91%', change: '+3%', up: true, icon: BedDouble, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Fee Collection', value: '₹2.4Cr', change: '94%', up: true, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const hostelBreakdown = [
  { name: 'Tagore Hostel', occupancy: 87, students: 128, complaints: 14, revenue: '₹18.2L' },
  { name: 'Nehru Hostel', occupancy: 94, students: 156, complaints: 8, revenue: '₹22.1L' },
  { name: 'Vivekananda Hostel', occupancy: 78, students: 112, complaints: 21, revenue: '₹15.8L' },
  { name: 'Sarojini Hostel', occupancy: 96, students: 144, complaints: 5, revenue: '₹20.4L' },
];

const complaintTrend = [42, 38, 45, 32, 28, 24, 18];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const aiInsights = [
  { title: 'Capacity Forecast', desc: 'Block B will reach 98% occupancy by August. Consider reallocating 12 rooms from Block A.', tag: 'Planning', color: 'bg-indigo-50 text-indigo-700' },
  { title: 'Complaint Pattern', desc: 'Plumbing complaints spike 40% during monsoon. Pre-schedule maintenance for July.', tag: 'Maintenance', color: 'bg-amber-50 text-amber-700' },
  { title: 'Fee Recovery', desc: '₹4.2L outstanding across 38 students. AI suggests targeted reminders to 12 high-risk accounts.', tag: 'Finance', color: 'bg-emerald-50 text-emerald-700' },
];

export default function AdminDashboard() {
  const maxTrend = Math.max(...complaintTrend);

  return (
    <div className="min-h-screen bg-gray-50 page-enter">
      <PortalNav
        portal="Admin Portal"
        portalColor="text-purple-600"
        userName="Dr. Rajesh Kumar"
        userMeta="Campus Administrator"
        avatar="RK"
        homeHref="/admin/dashboard"
        links={[
          { label: 'Overview', href: '/admin/dashboard' },
          { label: 'Rooms', href: '/admin/rooms' },
          { label: 'Students', href: '/admin/students' },
          { label: 'Reports', href: '/admin/reports' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-50 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-300 text-sm font-medium mb-1">Executive Overview</p>
              <h1 className="text-3xl font-extrabold text-white">Campus Hostel Analytics</h1>
              <p className="text-indigo-200 mt-2 max-w-xl">Real-time visibility across all hostels — occupancy, revenue, complaints, and AI-powered capacity planning.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
              <BrainCircuit className="w-6 h-6 text-cyan-300" />
              <div>
                <p className="text-white font-semibold text-sm">Hostel Health Score</p>
                <p className="text-2xl font-extrabold text-white">92<span className="text-lg text-indigo-200">/100</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {campusStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                    <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {s.up ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                      <span className="text-xs text-green-600 font-medium">{s.change}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Complaint Analytics</h2>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">↓ 57% YoY</span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {complaintTrend.map((v, i) => (
                <div key={months[i]} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(v / maxTrend) * 100}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs text-gray-400">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-800">Student Distribution</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Boys Hostels', pct: 58, color: 'bg-indigo-500' },
                { label: 'Girls Hostels', pct: 38, color: 'bg-blue-500' },
                { label: 'International', pct: 4, color: 'bg-cyan-500' },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{d.label}</span>
                    <span className="font-semibold text-gray-800">{d.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full transition-all duration-700`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-800">Hostel Performance</h2>
            </div>
            <Link to="/admin/rooms" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
              Manage rooms <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Hostel</th>
                  <th className="px-6 py-3">Occupancy</th>
                  <th className="px-6 py-3">Students</th>
                  <th className="px-6 py-3">Open Complaints</th>
                  <th className="px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hostelBreakdown.map((h) => (
                  <tr key={h.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{h.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${h.occupancy}%` }} />
                        </div>
                        <span className="text-gray-600">{h.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{h.students}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.complaints > 15 ? 'bg-rose-50 text-rose-700' : 'bg-green-50 text-green-700'}`}>
                        {h.complaints}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{h.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div key={insight.title} className="glass-card rounded-2xl p-5 shadow-sm card-hover border border-indigo-100/50">
              <div className="flex items-start justify-between mb-3">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${insight.color}`}>{insight.tag}</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{insight.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Room Management', icon: BedDouble, href: '/admin/rooms', gradient: 'from-indigo-500 to-blue-500' },
            { label: 'Student Records', icon: Users, href: '/admin/students', gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Reports', icon: Activity, href: '/admin/reports', gradient: 'from-cyan-500 to-indigo-500' },
            { label: 'AI Assistant', icon: BrainCircuit, href: '/chat', gradient: 'from-indigo-600 to-purple-600' },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className={`bg-gradient-to-br ${a.gradient} text-white rounded-2xl p-5 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform shadow-md`}>
                <Icon className="w-7 h-7" />
                <span className="text-sm font-semibold text-center">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
