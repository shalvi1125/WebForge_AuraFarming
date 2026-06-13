import { Link } from 'react-router';
import {
  AlertCircle, Calendar, IndianRupee, BrainCircuit, ChevronRight,
  ArrowUpRight, Wifi, Wrench, Utensils, User, Megaphone, UserCheck, Map, Activity,
} from 'lucide-react';
import PortalNav from '@/react-app/components/PortalNav';
import HostelBlueprint from '@/react-app/components/HostelBlueprint';
import { useComplaints } from '@/react-app/lib/complaints';
import {
  formatShortDate,
  getFeeSummary,
  useAnnouncements,
  useFees,
  useLeaveRequests,
  useStudentProfile,
} from '@/react-app/lib/studentState';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const student = { name: 'Aryan Sharma', rollNo: 'CS21B047', room: '204', block: 'Block B', hostel: 'Tagore Hostel', avatar: 'AS' };

const complaints = [
  { id: 'CMP-041', title: 'Water leakage near washroom', status: 'In Progress', priority: 'High', date: '10 Jun', icon: Wrench },
  { id: 'CMP-038', title: 'Wi-Fi not working in room', status: 'Open', priority: 'Medium', date: '07 Jun', icon: Wifi },
  { id: 'CMP-031', title: 'Mess food quality issue', status: 'Resolved', priority: 'Low', date: '01 Jun', icon: Utensils },
];

const leaveRequests = [
  { id: 'LV-014', reason: 'Family function – summer break', from: '14 Jun', to: '17 Jun', status: 'Pending' },
  { id: 'LV-011', reason: 'Medical appointment', from: '02 Jun', to: '02 Jun', status: 'Approved' },
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

const aiInsights = [
  { text: 'Most recurring issue in your wing: Wi-Fi connectivity', type: 'pattern' },
  { text: 'Room 206 has a critical alert nearby — corridor west wing', type: 'alert' },
  { text: 'Apply for leave before 12 Jun for faster warden approval', type: 'tip' },
];

const statusStyles: Record<string, string> = {
  Open: 'text-[#1B4F72] font-semibold', 'In Progress': 'text-[#0A2342] font-semibold', Resolved: 'text-[#374151]',
  Pending: 'text-[#1B4F72] font-semibold', Approved: 'text-[#1B4F72] font-semibold', Rejected: 'text-[#374151]', Cancelled: 'text-[#374151]',
};

export default function StudentDashboard() {
  const { profile } = useStudentProfile();
  const { complaints: allComplaints } = useComplaints();
  const { leaveRequests: allLeaveRequests } = useLeaveRequests();
  const { payments } = useFees();
  const { announcements } = useAnnouncements();
  const { outstanding } = getFeeSummary(payments);
  const student = { name: profile.name, rollNo: profile.rollNo, room: profile.room, block: profile.block, hostel: profile.hostel, avatar: profile.avatar };
  const roomCapacity = Math.max(1, profile.roomCapacity || 4);
  const occupiedBeds = Math.min(roomCapacity, Math.max(0, profile.occupiedBeds || 3));
  const occupancyPercent = Math.round((occupiedBeds / roomCapacity) * 100);
  const complaints = allComplaints
    .filter((complaint) => complaint.student === profile.name || complaint.room === profile.room || complaint.roomId === profile.room)
    .map((complaint) => ({
      id: complaint.id,
      title: complaint.title,
      status: complaint.status,
      priority: complaint.priority,
      date: complaint.date,
      icon: complaint.category === 'Internet' ? Wifi : complaint.category === 'Hygiene' ? Utensils : Wrench,
    }));
  const activeComplaintCount = complaints.filter((complaint) => complaint.status !== 'Resolved').length;
  const leaveRequests = allLeaveRequests.slice(0, 3).map((leave) => ({
    id: leave.id,
    reason: leave.reason,
    from: formatShortDate(leave.fromDate),
    to: formatShortDate(leave.toDate),
    status: leave.status,
  }));
  const pendingLeaveCount = allLeaveRequests.filter((leave) => leave.status === 'Pending').length;
  const latestPayment = payments.find((payment) => payment.status === 'paid');
  const latestAnnouncement = announcements[0];
  const recentActivity = [
    ...complaints.slice(0, 2).map((complaint) => ({ text: `Complaint ${complaint.id} is ${complaint.status}`, time: complaint.date, icon: AlertCircle })),
    ...allLeaveRequests.slice(0, 1).map((leave) => ({ text: `Leave ${leave.id} is ${leave.status}`, time: formatShortDate(leave.appliedOn), icon: Calendar })),
    ...(latestPayment ? [{ text: `Fee payment ${latestPayment.id} recorded`, time: latestPayment.paidOn || latestPayment.date, icon: IndianRupee }] : []),
    ...(latestAnnouncement ? [{ text: `Notice: ${latestAnnouncement.title}`, time: latestAnnouncement.date, icon: Megaphone }] : []),
  ].slice(0, 4);
  const aiInsights = [
    activeComplaintCount
      ? { text: `${activeComplaintCount} active complaint${activeComplaintCount > 1 ? 's' : ''} in your room profile`, type: 'pattern' }
      : { text: 'No active complaints in your student record', type: 'pattern' },
    outstanding
      ? { text: `Outstanding fees: Rs. ${outstanding.toLocaleString()}`, type: 'alert' }
      : { text: 'Your fee balance is currently clear', type: 'tip' },
    pendingLeaveCount
      ? { text: `${pendingLeaveCount} leave request${pendingLeaveCount > 1 ? 's' : ''} awaiting review`, type: 'tip' }
      : { text: 'No leave request is pending review', type: 'tip' },
  ];
  const summaryStats = [
    [String(activeComplaintCount), 'Active complaints', '#F8FAFC'],
    [String(pendingLeaveCount), 'Pending leave', '#4CC9F0'],
    [`Rs. ${outstanding.toLocaleString()}`, 'Outstanding fees', '#F8FAFC'],
    [String(announcements.length), 'Announcements', '#F8FAFC'],
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] page-enter relative">
      <HostelBlueprint className="blueprint-decor w-96 h-72 -left-10 top-48 hidden xl:block" />

      <PortalNav portal="Student Portal" userName={student.name} userMeta={student.rollNo} avatar={student.avatar} homeHref="/student/dashboard"
        links={[{ label: 'Complaints', href: '/student/complaints' }, { label: 'Leave', href: '/student/leave' }, { label: 'Room Map', href: '/student/room' }]} />

      <section className="gradient-mesh-hero relative">
        <div className="glow-orb w-[400px] h-[400px] bg-[#4CC9F0]/15 -top-20 right-0" />
        <div className="gradient-mesh-content max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#4CC9F0] live-indicator" />
                <p className="text-[#4CC9F0] text-sm font-medium">{getGreeting()}</p>
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-[#F8FAFC] tracking-tight mb-2">{student.name}</h1>
              <p className="text-[#D1DEE6] font-medium">{student.hostel} · Room {student.room} · {student.block}</p>
            </div>
            <div className="bg-white/8 border border-white/12 rounded-xl px-5 py-4 backdrop-blur-sm">
              <p className="text-xs text-[#D1DEE6] uppercase tracking-widest font-semibold mb-1">Today's Status</p>
              <p className="text-sm text-[#F8FAFC] font-medium">{activeComplaintCount} active issues · {pendingLeaveCount} leave pending</p>
              <p className="text-xs text-[#4CC9F0] mt-1">Curfew 10 PM · Mess closes 9 PM</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mt-8 pt-8 border-t border-white/10">
            {summaryStats.map(([v, l, c]) => (
              <div key={l}><p className="text-2xl font-bold" style={{ color: c }}>{v}</p><p className="text-xs text-[#D1DEE6] mt-1 uppercase tracking-wider font-medium">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-6 relative z-10 pb-16 space-y-10">

        {/* Operations Map CTA — signature feature */}
        <section className="surface-panel rounded-2xl p-6 lg:p-8 border border-[#4CC9F0]/20 elevate-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CC9F0]/5 rounded-bl-full" />
          <div className="grid lg:grid-cols-3 gap-6 items-center relative">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-5 h-5 text-[#1B4F72]" />
                <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold">Smart Hostel Operations Map</p>
              </div>
              <h2 className="text-xl font-bold text-[#071B34] mb-2">Explore your floor in real time</h2>
              <p className="text-sm text-[#374151] leading-relaxed">Interactive floor plan with pastel status colors, heatmaps, and room intelligence. See nearby alerts for Room 206 and 205.</p>
            </div>
            <Link to="/student/room" className="inline-flex items-center justify-center gap-2 bg-[#071B34] text-[#F8FAFC] px-6 py-3.5 rounded-xl font-semibold hover:bg-[#0A2342] transition-colors">
              Open Operations Map <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Overview */}
          <section className="lg:col-span-2 surface-panel rounded-2xl p-6 lg:p-8">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-3">Your Space</p>
            <h2 className="text-2xl font-bold text-[#071B34] mb-2">Room {student.room}</h2>
            <p className="text-sm text-[#374151] font-medium mb-6">{student.block} · {student.hostel} · {occupiedBeds} of {roomCapacity} beds occupied</p>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2"><span className="text-[#374151] font-medium">Occupancy</span><span className="text-[#071B34] font-bold">{occupancyPercent}%</span></div>
              <div className="h-2 bg-[#071B34]/8 rounded-full"><div className="h-full bg-[#4CC9F0] rounded-full" style={{ width: `${occupancyPercent}%` }} /></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[[`Room ${student.room}`, 'Assigned'], [student.block, 'Location'], [`${occupiedBeds} / ${roomCapacity}`, 'Beds'], [activeComplaintCount ? 'Attention' : 'Active', 'Status']].map(([v, l]) => (
                <div key={l} className="bg-[#F5F7FA] rounded-lg p-4 border border-[#071B34]/6">
                  <p className="text-[10px] text-[#374151] uppercase tracking-wider font-semibold mb-1">{l}</p>
                  <p className="text-sm font-bold text-[#071B34]">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights */}
          <section className="surface-panel-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-[#4CC9F0]" />
              <p className="text-xs text-[#4CC9F0] uppercase tracking-widest font-bold">AI Insights</p>
            </div>
            <div className="space-y-4">
              {aiInsights.map((ins, i) => (
                <div key={i} className="pb-3 border-b border-white/8 last:border-0">
                  <p className="text-sm text-[#F8FAFC] leading-relaxed font-medium">{ins.text}</p>
                </div>
              ))}
            </div>
            <Link to="/chat" className="inline-flex items-center gap-1 text-sm text-[#4CC9F0] font-semibold mt-4 hover:text-[#67E8F9]">Ask AI <ArrowUpRight className="w-3.5 h-3.5" /></Link>
          </section>
        </div>

        {/* Activity + Complaints row */}
        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Recent Activity</p>
            <div className="space-y-0 border-l-2 border-[#071B34]/10 ml-2">
              {recentActivity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="relative pl-6 pb-5 last:pb-0">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4CC9F0]" />
                    <div className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-[#1B4F72] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#071B34]">{a.text}</p>
                        <p className="text-xs text-[#374151] mt-0.5 font-medium">{a.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-4">
              <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold">Open Complaints</p>
              <Link to="/student/complaints" className="text-sm text-[#1B4F72] font-semibold hover:text-[#4CC9F0]">View all</Link>
            </div>
            <div className="divide-y divide-[#071B34]/8 surface-panel rounded-xl overflow-hidden">
              {complaints.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                    <Icon className="w-4 h-4 text-[#1B4F72] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#071B34]">{c.title}</p>
                      <p className="text-xs text-[#374151] font-medium mt-0.5">{c.id} · {c.priority}</p>
                    </div>
                    <span className={`text-xs ${statusStyles[c.status]}`}>{c.status}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Leave + Visitors */}
        <div className="grid lg:grid-cols-5 gap-6">
          <section className="lg:col-span-3 surface-panel rounded-xl p-6">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4">Leave Requests</p>
            {leaveRequests.map((l) => (
              <div key={l.id} className="py-3 border-b border-[#071B34]/6 last:border-0 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-[#071B34]">{l.reason}</p>
                  <p className="text-xs text-[#374151] font-medium">{l.from} → {l.to}</p>
                </div>
                <span className={`text-xs ${statusStyles[l.status]}`}>{l.status}</span>
              </div>
            ))}
            <Link to="/student/leave" className="text-sm text-[#1B4F72] font-semibold mt-3 inline-flex items-center gap-1 hover:text-[#4CC9F0]">Apply for leave <ChevronRight className="w-3.5 h-3.5" /></Link>
          </section>
          <section className="lg:col-span-2 surface-panel rounded-xl p-6">
            <p className="text-xs text-[#1B4F72] uppercase tracking-widest font-bold mb-4">Visitors</p>
            {visitorRequests.map((v) => (
              <div key={v.name} className="py-3 border-b border-[#071B34]/6 last:border-0 flex justify-between">
                <div><p className="text-sm font-semibold text-[#071B34]">{v.name}</p><p className="text-xs text-[#374151]">{v.date}</p></div>
                <span className="text-xs text-[#1B4F72] font-bold">{v.status}</span>
              </div>
            ))}
          </section>
        </div>

        <section className="flex flex-wrap gap-3">
          {[
            { label: 'Operations Map', href: '/student/room', icon: Map },
            { label: 'Complaints', href: '/student/complaints', icon: AlertCircle },
            { label: 'Leave', href: '/student/leave', icon: Calendar },
            { label: 'Fees', href: '/student/fees', icon: IndianRupee },
            { label: 'Announcements', href: '/student/announcements', icon: Megaphone },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071B34] text-[#F8FAFC] rounded-lg text-sm font-semibold hover:bg-[#0A2342] transition-colors">
                <Icon className="w-4 h-4" />{a.label}
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
