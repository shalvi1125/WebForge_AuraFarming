import { Link } from 'react-router';
import {
  AlertCircle, BrainCircuit, Wrench, Wifi, ChevronRight, ArrowUpRight,
  Droplets, Zap, ShieldAlert, Sofa, CheckCircle2, DoorOpen, Map, Activity,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';
import CampusNetwork from '@/react-app/components/CampusNetwork';

const warden = { name: 'Dr. Priya Mehta', hostel: 'Tagore Hostel', block: 'Block B', totalStudents: 128, avatar: 'PM' };

const complaintQueue = [
  { id: 'CMP-041', title: 'Water leakage near bathroom sink', student: 'Aryan Sharma', room: '204', category: 'Plumbing', priority: 'High', status: 'In Progress', time: '2h ago' },
  { id: 'CMP-040', title: 'Power socket not working', student: 'Rohit Verma', room: '211', category: 'Electrical', priority: 'High', status: 'Open', time: '3h ago' },
  { id: 'CMP-039', title: 'Wi-Fi outage in west wing', student: 'Sneha Patil', room: '208', category: 'Internet', priority: 'Medium', status: 'Open', time: '5h ago' },
  { id: 'CMP-038', title: 'Broken window latch', student: 'Vikash M.', room: '206', category: 'Furniture', priority: 'Critical', status: 'Open', time: '6h ago' },
];

const activityFeed = [
  { text: 'Complaint CMP-031 resolved', sub: 'Mess food quality · 2h ago', icon: CheckCircle2 },
  { text: 'Leave request LV-014 approved', sub: 'Aryan Sharma · 3h ago', icon: CheckCircle2 },
  { text: 'Visitor request for Room 204', sub: 'Ramesh Sharma · 4h ago', icon: DoorOpen },
  { text: 'Critical alert — Room 206 electrical', sub: 'Immediate action required', icon: AlertCircle, urgent: true },
];

const aiInsights = [
  { text: 'Complaint surge predicted in Block B — plumbing up 40% this week', severity: 'high', metric: '+40%' },
  { text: 'Most recurring issue: Wi-Fi connectivity (8 reports)', severity: 'medium', metric: '8 reports' },
  { text: 'Critical room R206 requires attention within 24 hours', severity: 'critical', metric: 'R206' },
  { text: 'Maintenance workload increasing — 6 rooms in queue', severity: 'info', metric: '6 rooms' },
  { text: 'Occupancy expected to reach 96% by August', severity: 'info', metric: '96%' },
];

const categoryIcons: Record<string, typeof Wrench> = { Plumbing: Droplets, Electrical: Zap, Internet: Wifi, Furniture: Sofa, Security: ShieldAlert };

export default function WardenDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter relative">
      <HostelBlueprint className="blueprint-decor w-[420px] h-[300px] right-0 top-32 hidden lg:block" />

      <PortalNav portal="Warden Portal" userName={warden.name} userMeta={`${warden.hostel} · ${warden.block}`} avatar={warden.avatar} homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/student/room?view=warden' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />

      <section className="gradient-mesh-hero relative">
        <div className="glow-orb w-[500px] h-[500px] bg-[#1B4F72]/30 -top-32 -left-32" />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
                <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-bold">Hostel Control Center · Live</p>
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-2">{warden.name}</h1>
              <p className="text-[#C5D0D8] font-medium">{warden.hostel} · {warden.block} · {warden.totalStudents} students</p>
              <p className="text-sm text-[#4CC9F0] mt-3 font-medium">1 critical alert · 14 active complaints · 87% occupancy</p>
            </div>
            <div className="bg-white/8 border border-white/12 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-xs text-[#C5D0D8] uppercase tracking-widest font-bold mb-2">Hostel Health</p>
              <p className="text-5xl font-bold text-[#F8FAFC]">88<span className="text-xl text-[#C5D0D8] font-medium">/100</span></p>
              <p className="text-xs text-[#4CC9F0] mt-2 font-semibold">↓ 3 pts from last week (Wi-Fi complaints)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
            {[['128', 'Students'], ['14', 'Active complaints'], ['6', 'Pending leave'], ['87%', 'Occupancy']].map(([v, l]) => (
              <div key={l}><p className="text-2xl font-bold text-[#F8FAFC]">{v}</p><p className="text-xs text-[#C5D0D8] mt-1 uppercase tracking-wider font-medium">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Operations Map link */}
          <Link to="/student/room?view=warden" className="lg:col-span-2 surface-panel rounded-2xl p-6 elevate-hover flex items-center justify-between group border border-[#4CC9F0]/15">
            <div>
              <div className="flex items-center gap-2 mb-2"><Map className="w-5 h-5 text-[#1B4F72]" /><p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold">Block Operations Map</p></div>
              <h2 className="text-lg font-bold text-[#071B34]">View full Block B floor plan</h2>
              <p className="text-sm text-[#4A5568] mt-1">Complaint heatmap · Priority alerts · Room intelligence</p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#1B4F72] group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="surface-panel rounded-2xl p-5">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3">Campus Network</p>
            <CampusNetwork className="h-28" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-1">Live Queue</p>
                <h2 className="text-xl font-bold text-[#071B34]">Complaint stream</h2>
              </div>
              <Link to="/warden/complaints" className="text-sm text-[#1B4F72] font-semibold hover:text-[#4CC9F0] flex items-center gap-1">Full queue <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="surface-panel rounded-xl divide-y divide-[#071B34]/6">
              {complaintQueue.map((c) => {
                const CatIcon = categoryIcons[c.category] || Wrench;
                return (
                  <div key={c.id} className={`px-5 py-4 flex items-center gap-4 group ${c.priority === 'Critical' ? 'bg-[#FFD6D6]/30' : ''}`}>
                    <CatIcon className="w-4 h-4 text-[#1B4F72] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#071B34]">{c.title}</p>
                      <p className="text-xs text-[#4A5568] font-medium mt-0.5">{c.student} · Room {c.room} · {c.time}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase ${c.priority === 'High' || c.priority === 'Critical' ? 'text-[#1B4F72]' : 'text-[#4A5568]'}`}>{c.priority}</span>
                    <Link to="/warden/complaints" className="text-[#1B4F72] hover:text-[#4CC9F0] opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4" /></Link>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4">AI Intelligence</p>
            <div className="surface-panel-dark rounded-2xl p-5 space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className={`pb-3 border-b border-white/8 last:border-0 ${insight.severity === 'critical' ? 'alert-slide' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-[#F8FAFC] font-medium leading-snug">{insight.text}</p>
                    <span className="text-[10px] text-[#4CC9F0] font-bold shrink-0 bg-white/8 px-2 py-0.5 rounded">{insight.metric}</span>
                  </div>
                </div>
              ))}
              <Link to="/chat" className="inline-flex items-center gap-2 text-sm text-[#4CC9F0] font-semibold mt-2 hover:text-[#67E8F9]"><BrainCircuit className="w-4 h-4" /> Ask AI</Link>
            </div>
          </section>
        </div>

        <section>
          <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Live Activity</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {activityFeed.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className={`surface-panel rounded-xl p-4 flex items-start gap-3 ${a.urgent ? 'border border-[#FFB3C1]/50' : ''}`}>
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${a.urgent ? 'text-[#1B4F72]' : 'text-[#4CC9F0]'}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#071B34]">{a.text}</p>
                    <p className="text-xs text-[#4A5568] font-medium mt-0.5">{a.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
