import { Link } from 'react-router';
import {
  AlertCircle, BrainCircuit, Wrench, Wifi, ChevronRight, ArrowUpRight,
  Droplets, Zap, ShieldAlert, Sofa, CheckCircle2, Map, Activity, Clock,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';
import CampusNetwork from '@/react-app/components/CampusNetwork';
import { getStatusCounts, useComplaints } from '@/react-app/lib/complaints';
import { formatShortDate } from '@/react-app/lib/studentState';
import { WARDEN, useWardenLeaveRequests, useWardenStudents } from '@/react-app/lib/wardenState';

const categoryIcons: Record<string, typeof Wrench> = {
  Plumbing: Droplets,
  Electrical: Zap,
  Internet: Wifi,
  Furniture: Sofa,
  Security: ShieldAlert,
};

function getTopComplaintCategory(complaints: { category: string }[]) {
  const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

export default function WardenDashboard() {
  const { complaints } = useComplaints();
  const { leaveRequests } = useWardenLeaveRequests();
  const { students } = useWardenStudents();
  const counts = getStatusCounts(complaints);
  const activeComplaints = complaints.filter((complaint) => complaint.status !== 'Resolved');
  const criticalComplaints = complaints.filter((complaint) => complaint.priority === 'Critical' && complaint.status !== 'Resolved');
  const pendingLeave = leaveRequests.filter((request) => request.status === 'Pending');
  const approvedLeave = leaveRequests.filter((request) => request.status === 'Approved');
  const totalCapacity = students.reduce((sum, student) => sum + student.roomCapacity, 0);
  const occupiedBeds = students.reduce((sum, student) => sum + student.occupiedBeds, 0);
  const occupancyPercent = totalCapacity ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
  const roomsWithActiveComplaints = new Set(activeComplaints.map((complaint) => complaint.room)).size;
  const hostelHealth = Math.max(40, Math.min(100, 100 - counts.open * 6 - criticalComplaints.length * 10 - pendingLeave.length * 2));
  const topCategory = getTopComplaintCategory(complaints);

  const complaintQueue = [...activeComplaints]
    .sort((a, b) => {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const aiInsights = [
    topCategory
      ? { text: `Most reported issue category: ${topCategory[0]}`, severity: 'medium', metric: `${topCategory[1]} reports` }
      : { text: 'No complaint pattern detected yet', severity: 'info', metric: '0 reports' },
    criticalComplaints.length
      ? { text: `${criticalComplaints.length} critical complaint${criticalComplaints.length === 1 ? '' : 's'} need immediate review`, severity: 'critical', metric: `${criticalComplaints.length}` }
      : { text: 'No critical complaints are active', severity: 'info', metric: 'Clear' },
    pendingLeave.length
      ? { text: `${pendingLeave.length} leave request${pendingLeave.length === 1 ? '' : 's'} waiting for approval`, severity: 'high', metric: `${pendingLeave.length} pending` }
      : { text: 'Leave approval queue is clear', severity: 'info', metric: '0 pending' },
    { text: `${roomsWithActiveComplaints} room${roomsWithActiveComplaints === 1 ? '' : 's'} currently have active complaint markers`, severity: 'info', metric: `${roomsWithActiveComplaints} rooms` },
    { text: `Current roster occupancy is ${occupancyPercent}%`, severity: occupancyPercent > 90 ? 'high' : 'info', metric: `${occupancyPercent}%` },
  ];

  const activityFeed = [
    ...complaints.slice(0, 3).map((complaint) => ({
      text: `Complaint ${complaint.id} is ${complaint.status}`,
      sub: `${complaint.student} - Room ${complaint.room} - ${complaint.category}`,
      icon: complaint.status === 'Resolved' ? CheckCircle2 : AlertCircle,
      urgent: complaint.priority === 'Critical' && complaint.status !== 'Resolved',
    })),
    ...leaveRequests.slice(0, 3).map((request) => ({
      text: `Leave ${request.id} is ${request.status}`,
      sub: `${request.student} - ${formatShortDate(request.fromDate)} to ${formatShortDate(request.toDate)}`,
      icon: request.status === 'Approved' ? CheckCircle2 : Clock,
      urgent: false,
    })),
  ].slice(0, 6);

  const summaryStats = [
    [String(students.length), 'Students'],
    [String(counts.total), 'Total complaints'],
    [String(counts.open), 'Open complaints'],
    [String(counts.resolved), 'Resolved complaints'],
    [String(pendingLeave.length), 'Pending leave'],
    [String(approvedLeave.length), 'Approved leave'],
    [`${occupancyPercent}%`, 'Occupancy'],
    [String(roomsWithActiveComplaints), 'Rooms flagged'],
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter relative">
      <HostelBlueprint className="blueprint-decor w-[420px] h-[300px] right-0 top-32 hidden lg:block" />

      <PortalNav portal="Warden Portal" userName={WARDEN.name} userMeta={`${WARDEN.hostel} - ${WARDEN.block}`} avatar={WARDEN.avatar} homeHref="/warden/dashboard" dark
        links={[{ label: 'Operations Map', href: '/warden/room' }, { label: 'Complaints', href: '/warden/complaints' }, { label: 'Students', href: '/warden/students' }]} />

      <section className="gradient-mesh-hero relative">
        <div className="glow-orb w-[500px] h-[500px] bg-[#1B4F72]/30 -top-32 -left-32" />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
                <p className="text-[#4CC9F0] text-xs uppercase tracking-widest font-bold">Hostel Control Center - Live</p>
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-2">{WARDEN.name}</h1>
              <p className="text-[#D1DEE6] font-medium">{WARDEN.hostel} - {WARDEN.block} - {students.length} students</p>
              <p className="text-sm text-[#4CC9F0] mt-3 font-medium">{criticalComplaints.length} critical alerts - {activeComplaints.length} active complaints - {occupancyPercent}% occupancy</p>
            </div>
            <div className="bg-white/8 border border-white/12 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-xs text-[#D1DEE6] uppercase tracking-widest font-bold mb-2">Hostel Health</p>
              <p className="text-5xl font-bold text-[#F8FAFC]">{hostelHealth}<span className="text-xl text-[#D1DEE6] font-medium">/100</span></p>
              <p className="text-xs text-[#4CC9F0] mt-2 font-semibold">Based on active complaints, critical alerts, and pending leave workload</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
            {summaryStats.slice(0, 4).map(([v, l]) => (
              <div key={l}><p className="text-2xl font-bold text-[#F8FAFC]">{v}</p><p className="text-xs text-[#D1DEE6] mt-1 uppercase tracking-wider font-medium">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.slice(4).map(([v, l]) => (
            <div key={l} className="surface-panel rounded-xl p-5 border border-[#071B34]/6">
              <p className="text-xs text-[#374151] uppercase tracking-widest font-semibold">{l}</p>
              <p className="text-2xl font-bold text-[#071B34] mt-1">{v}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Link to="/warden/room" className="lg:col-span-2 surface-panel rounded-2xl p-6 elevate-hover flex items-center justify-between group border border-[#4CC9F0]/15">
            <div>
              <div className="flex items-center gap-2 mb-2"><Map className="w-5 h-5 text-[#1B4F72]" /><p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold">Block Operations Map</p></div>
              <h2 className="text-lg font-bold text-[#071B34]">View full Block B floor plan</h2>
              <p className="text-sm text-[#374151] mt-1">{roomsWithActiveComplaints} rooms flagged - {criticalComplaints.length} high-priority alerts - {occupancyPercent}% roster occupancy</p>
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
              {complaintQueue.length ? complaintQueue.map((c) => {
                const CatIcon = categoryIcons[c.category] || Wrench;
                return (
                  <div key={c.id} className={`px-5 py-4 flex items-center gap-4 group ${c.priority === 'Critical' ? 'bg-[#FFD6D6]/30' : ''}`}>
                    <CatIcon className="w-4 h-4 text-[#1B4F72] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#071B34]">{c.title}</p>
                      <p className="text-xs text-[#374151] font-medium mt-0.5">{c.student} - Room {c.room} - {c.status}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase ${c.priority === 'High' || c.priority === 'Critical' ? 'text-[#1B4F72]' : 'text-[#374151]'}`}>{c.priority}</span>
                    <Link to="/warden/complaints" className="text-[#1B4F72] hover:text-[#4CC9F0] opacity-70 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4" /></Link>
                  </div>
                );
              }) : (
                <div className="px-5 py-8 text-sm text-[#374151]">No active complaints in the queue.</div>
              )}
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
                    <p className="text-xs text-[#374151] font-medium mt-0.5">{a.sub}</p>
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
