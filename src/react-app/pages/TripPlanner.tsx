import { Link } from 'react-router';
import {
  Users, BrainCircuit, Activity, BedDouble, Map, ChevronRight,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';
import CampusNetwork from '@/react-app/components/CampusNetwork';

const hostelBreakdown = [
  { name: 'Tagore Hostel', occupancy: 87, students: 128, complaints: 14, revenue: '₹18.2L', trend: 'up' },
  { name: 'Nehru Hostel', occupancy: 94, students: 156, complaints: 8, revenue: '₹22.1L', trend: 'stable' },
  { name: 'Vivekananda Hostel', occupancy: 78, students: 112, complaints: 21, revenue: '₹15.8L', trend: 'alert' },
  { name: 'Sarojini Hostel', occupancy: 96, students: 144, complaints: 5, revenue: '₹20.4L', trend: 'up' },
];

const complaintTrend = [42, 38, 45, 32, 28, 24, 18];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const aiInsights = [
  { title: 'Complaint Surge — Block B', desc: 'Plumbing complaints up 40% in Tagore Hostel. Pre-schedule monsoon maintenance for July.', metric: '+40%', severity: 'high' },
  { title: 'Occupancy Forecast', desc: 'Campus occupancy expected to reach 96% by August. Vivekananda at capacity risk.', metric: '96%', severity: 'info' },
  { title: 'Most Recurring Issue', desc: 'Wi-Fi connectivity leads complaint categories across 3 hostels this semester.', metric: 'Wi-Fi', severity: 'medium' },
  { title: 'Critical Room Alert', desc: 'Room R206 (Block B) requires immediate attention — electrical short circuit reported.', metric: 'R206', severity: 'critical' },
  { title: 'Maintenance Workload', desc: 'Maintenance queue growing — 6 rooms across campus. Workload increasing week-over-week.', metric: '6 rooms', severity: 'medium' },
  { title: 'Fee Recovery', desc: '₹4.2L outstanding across 38 students. AI suggests targeted reminders before 30 Jun.', metric: '₹4.2L', severity: 'info' },
];

export default function AdminDashboard() {
  const maxTrend = Math.max(...complaintTrend);

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter relative">
      <HostelBlueprint className="blueprint-decor w-[500px] h-[360px] -right-16 top-24 hidden xl:block" />

      <PortalNav portal="Admin Portal" userName="Dr. Rajesh Kumar" userMeta="Campus Administrator" avatar="RK" homeHref="/admin/dashboard" dark
        links={[{ label: 'Campus Map', href: '/student/room?view=admin' }, { label: 'Rooms', href: '/admin/rooms' }, { label: 'Reports', href: '/admin/reports' }]} />

      <section className="gradient-mesh-hero relative">
        <div className="glow-orb w-[600px] h-[600px] bg-[#4CC9F0]/10 top-0 right-0" />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
            <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-bold">Executive Overview · Live Analytics</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-3">Campus Hostel Analytics</h1>
          <p className="text-[#C5D0D8] max-w-2xl font-medium">Real-time visibility across 12 hostels — occupancy, revenue, complaints, and AI-powered capacity planning.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 mt-8 pt-8 border-t border-white/10">
            {[['12', 'Hostels'], ['4,820', 'Students'], ['91%', 'Occupancy'], ['₹2.4Cr', 'Revenue']].map(([v, l]) => (
              <div key={l}><p className="text-3xl font-bold text-[#F8FAFC]">{v}</p><p className="text-xs text-[#C5D0D8] mt-2 uppercase tracking-wider font-medium">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">

        <div className="grid lg:grid-cols-3 gap-6">
          <Link to="/student/room?view=admin" className="lg:col-span-2 surface-panel rounded-2xl p-6 elevate-hover flex items-center justify-between group border border-[#4CC9F0]/15">
            <div>
              <div className="flex items-center gap-2 mb-2"><Map className="w-5 h-5 text-[#1B4F72]" /><p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold">Campus Operations Map</p></div>
              <h2 className="text-lg font-bold text-[#071B34]">Full hostel visibility across all blocks</h2>
              <p className="text-sm text-[#4A5568] mt-1">Cross-block analytics · Occupancy & complaint heatmaps · AI forecasting</p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#1B4F72] group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="surface-panel rounded-2xl p-5">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3">Campus Network</p>
            <CampusNetwork className="h-28" />
            <p className="text-[10px] text-[#4A5568] mt-2 font-medium">Students · Rooms · Complaints · Visitors · Maintenance</p>
          </div>
        </div>

        <section className="surface-panel rounded-2xl overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-[#071B34]/8">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-1">Campus Overview</p>
            <h2 className="text-xl font-bold text-[#071B34]">Hostel performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-[#4A5568] uppercase tracking-wider font-bold border-b border-[#071B34]/8">
                <th className="px-6 py-3">Hostel</th><th className="px-6 py-3">Occupancy</th><th className="px-6 py-3">Students</th><th className="px-6 py-3">Complaints</th><th className="px-6 py-3">Revenue</th>
              </tr></thead>
              <tbody>
                {hostelBreakdown.map((h) => (
                  <tr key={h.name} className="border-b border-[#071B34]/6 hover:bg-[#F5F7FA]/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#071B34]">{h.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-[#071B34]/8 rounded-full"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${h.occupancy}%` }} /></div>
                        <span className="text-[#4A5568] font-semibold">{h.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4A5568] font-medium">{h.students}</td>
                    <td className="px-6 py-4"><span className={`font-semibold ${h.complaints > 15 ? 'text-[#1B4F72]' : 'text-[#4A5568]'}`}>{h.complaints}</span></td>
                    <td className="px-6 py-4 font-semibold text-[#071B34]">{h.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid lg:grid-cols-5 gap-6">
          <section className="lg:col-span-3 surface-panel rounded-2xl p-6 lg:p-8">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-1">Complaint Trends</p>
            <h2 className="text-lg font-bold text-[#071B34] mb-1">Resolution improving — 57% YoY reduction</h2>
            <div className="flex items-end gap-2 h-40 mt-6">
              {complaintTrend.map((v, i) => (
                <div key={months[i]} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-[#4A5568] font-bold">{v}</span>
                  <div className="w-full bg-[#1B4F72] rounded-t hover:bg-[#4CC9F0] transition-colors" style={{ height: `${(v / maxTrend) * 100}%`, minHeight: '8px' }} />
                  <span className="text-xs text-[#4A5568] font-semibold">{months[i]}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="lg:col-span-2 surface-panel-dark rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs text-[#4CC9F0] uppercase tracking-widest font-bold mb-3">Revenue Overview</p>
              <p className="text-4xl font-bold text-[#F8FAFC]">₹2.4Cr</p>
              <p className="text-[#C5D0D8] text-sm font-medium mt-1">94% collection rate</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/8">
              <p className="text-xs text-[#C5D0D8] font-medium mb-1">Outstanding</p>
              <p className="text-2xl font-bold text-[#F8FAFC]">₹4.2L</p>
            </div>
          </section>
        </div>

        <section>
          <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> AI Forecasting & Intelligence</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.title} className={`surface-panel rounded-xl p-5 elevate-hover ${insight.severity === 'critical' ? 'border border-[#FFB3C1]/40' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4 text-[#1B4F72] shrink-0" />
                  <span className="text-[10px] font-bold text-[#1B4F72] bg-[#071B34]/5 px-2 py-0.5 rounded">{insight.metric}</span>
                </div>
                <h3 className="font-bold text-[#071B34] text-sm mb-1">{insight.title}</h3>
                <p className="text-xs text-[#4A5568] leading-relaxed font-medium">{insight.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {[
            { label: 'Campus Map', href: '/student/room?view=admin', icon: Map },
            { label: 'Room Management', href: '/admin/rooms', icon: BedDouble },
            { label: 'Student Records', href: '/admin/students', icon: Users },
            { label: 'Reports', href: '/admin/reports', icon: Activity },
            { label: 'AI Assistant', href: '/chat', icon: BrainCircuit },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#071B34] text-[#F8FAFC] rounded-lg text-sm font-semibold hover:bg-[#0A2342] transition-colors">
                <Icon className="w-4 h-4" />{a.label}
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
